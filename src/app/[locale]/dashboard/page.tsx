export const runtime = "nodejs";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import db from '@/db/drizzle';
import { userProfiles, users, challengeProgress } from '@/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { setRequestLocale } from 'next-intl/server';
import challengesData from '../../../../public/data/daily-challenges.json';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: Props) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Get session
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect(`/${locale}/sign-in`);
    }

    // Get user profile
    const profile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, session.user.id))
        .limit(1);

    // Get fresh user data (name might have changed)
    const userUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: {
            name: true,
            email: true,
            image: true,
        }
    });

    const userProfile = profile[0] || null;

    // If no profile or onboarding not complete, redirect
    if (!userProfile?.completedOnboarding) {
        redirect(`/${locale}/onboarding`);
    }

    // Normalisation : JSON -> string[]
    const objectives: string[] = Array.isArray(userProfile.investmentObjectives)
        ? userProfile.investmentObjectives.filter(
            (x): x is string => typeof x === "string"
            )
        : [];

    // Calculate challenge progress from actually opened days
    const openedDays = await db.select({ count: count() })
        .from(challengeProgress)
        .where(eq(challengeProgress.userId, session.user.id));
    const openedCount = openedDays[0]?.count || 0;

    // Fetch all entries for rate limit + streak calculation
    const allEntries = await db.select({ openedAt: challengeProgress.openedAt })
        .from(challengeProgress)
        .where(eq(challengeProgress.userId, session.user.id))
        .orderBy(desc(challengeProgress.openedAt));

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const alreadyOpenedToday = allEntries[0]?.openedAt && allEntries[0].openedAt >= todayStart;

    // Rate limit: same logic as challenge page
    const challengeDay = alreadyOpenedToday
        ? Math.min(openedCount, 14)
        : Math.min(openedCount + 1, 14);
    const challengeCompleted = openedCount >= 14;

    // Calculate streak: consecutive calendar days with an opened challenge
    const openedDates = [...new Set(
        allEntries
            .map(e => e.openedAt)
            .filter((d): d is Date => d !== null)
            .map(d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime())
    )].sort((a, b) => b - a);

    let streak = 0;
    if (openedDates.length > 0) {
        const todayMs = todayStart.getTime();
        const yesterdayMs = todayMs - 86400000;
        const mostRecent = openedDates[0];

        if (mostRecent === todayMs || mostRecent === yesterdayMs) {
            streak = 1;
            let expected = mostRecent - 86400000;
            for (let i = 1; i < openedDates.length; i++) {
                if (openedDates[i] === expected) {
                    streak++;
                    expected -= 86400000;
                } else {
                    break;
                }
            }
        }
    }

    // Get current challenge title for the hero block
    const currentDay = challengeCompleted ? 14 : challengeDay;
    const todayChallenge = challengesData.find((c: { day: number }) => c.day === currentDay);
    const lang = locale === 'fr' ? 'fr' : 'en';
    const challengeTitle = todayChallenge?.title[lang] || '';

    const userXp = openedCount * 20;

    return (
        <DashboardContent
            user={{
                id: session.user.id,
                name: userUser?.name || session.user.name || 'Crypto Explorer',
                email: userUser?.email || session.user.email,
                image: userUser?.image || session.user.image || undefined,
            }}
            profile={{
                experienceLevel: userProfile.experienceLevel,
                objectives,
            }}
            challengeDay={challengeDay}
            challengeCompleted={challengeCompleted}
            challengeTitle={challengeTitle}
            userXp={userXp}
            streak={streak}
            hasSeenDashboardTips={userProfile.hasSeenDashboardTips ?? false}
        />
    );
}
