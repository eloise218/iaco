export const runtime = "nodejs";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import db from '@/db/drizzle';
import { challengeProgress, userProfiles } from '@/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { setRequestLocale } from 'next-intl/server';
import { ChallengeContent } from '@/components/challenge/challenge-content';
import challengesData from '../../../../public/data/daily-challenges.json';

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ day?: string }>;
};

export default async function ChallengePage({ params, searchParams }: Props) {
    const { locale } = await params;
    const search = await searchParams;
    setRequestLocale(locale);

    // Get session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect(`/${locale}/sign-in`);
    }

    // Calculate which day the user is on (based on actually opened days)
    // OR use the ?day= parameter for testing
    const totalDays = 14;
    let challengeDay: number;

    if (search.day) {
        // Debug mode: force a specific day via URL parameter
        challengeDay = parseInt(search.day, 10);
        if (isNaN(challengeDay) || challengeDay < 1) {
            challengeDay = 1;
        }
    } else {
        // Normal mode: calculate from opened days count
        const openedDays = await db.select({ count: count() })
            .from(challengeProgress)
            .where(eq(challengeProgress.userId, session.user.id));
        const openedCount = openedDays[0]?.count || 0;

        // Rate limit: max 1 new day per calendar day
        // Check if the user already opened a new day today
        const latestEntry = await db.select({ openedAt: challengeProgress.openedAt })
            .from(challengeProgress)
            .where(eq(challengeProgress.userId, session.user.id))
            .orderBy(desc(challengeProgress.day))
            .limit(1);

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const alreadyOpenedToday = latestEntry[0]?.openedAt && latestEntry[0].openedAt >= todayStart;

        if (alreadyOpenedToday) {
            // Already opened a day today → show that day (no advancement)
            challengeDay = openedCount; // show the last opened day, not count+1
        } else {
            // No day opened today → allow advancing to the next day
            challengeDay = openedCount + 1;
        }
    }

    const isCompleted = challengeDay > totalDays;
    const currentDay = isCompleted ? totalDays : Math.max(challengeDay, 1);

    // Record that the user opened this day (idempotent - no duplicate XP)
    // Only insert if this is a new day (not already opened today)
    if (!isCompleted) {
        await db.insert(challengeProgress)
            .values({ userId: session.user.id, day: currentDay })
            .onDuplicateKeyUpdate({ set: { openedAt: new Date() } });
    }

    // Get today's challenge content
    const todayChallenge = challengesData.find((c) => c.day === currentDay);
    const lang = locale === 'fr' ? 'fr' : 'en';

    // Check if user has seen the challenge onboarding tip
    const profile = await db.select({
        hasSeenChallengeTip: userProfiles.hasSeenChallengeTip,
        hasSeenFeedbackModal: userProfiles.hasSeenFeedbackModal,
    })
        .from(userProfiles)
        .where(eq(userProfiles.userId, session.user.id))
        .limit(1);
    const hasSeenChallengeTip = profile[0]?.hasSeenChallengeTip ?? false;
    const hasSeenFeedbackModal = profile[0]?.hasSeenFeedbackModal ?? false;

    return (
        <ChallengeContent
            challengeDay={currentDay}
            totalDays={totalDays}
            isCompleted={isCompleted}
            title={todayChallenge?.title[lang] || ''}
            content={todayChallenge?.content[lang] || ''}
            hasSeenChallengeTip={hasSeenChallengeTip}
            hasSeenFeedbackModal={hasSeenFeedbackModal}
        />
    );
}
