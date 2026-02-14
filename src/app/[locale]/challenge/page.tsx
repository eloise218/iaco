export const runtime = "nodejs";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import db from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

    // Get user's createdAt from database
    const userData = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: {
            createdAt: true,
        },
    });

    // Calculate which day the user is on (based on registration date)
    // OR use the ?day= parameter for testing
    let challengeDay: number;

    if (search.day) {
        // Debug mode: force a specific day via URL parameter
        challengeDay = parseInt(search.day, 10);
        if (isNaN(challengeDay) || challengeDay < 1) {
            challengeDay = 1;
        }
    } else {
        // Normal mode: calculate from createdAt
        const createdAt = userData?.createdAt ? new Date(userData.createdAt) : new Date();
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        challengeDay = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    }

    const totalDays = 14;
    const isCompleted = challengeDay > totalDays;
    const currentDay = isCompleted ? totalDays : challengeDay;

    // Get today's challenge content
    const todayChallenge = challengesData.find((c) => c.day === currentDay);
    const lang = locale === 'fr' ? 'fr' : 'en';

    return (
        <ChallengeContent
            challengeDay={currentDay}
            totalDays={totalDays}
            isCompleted={isCompleted}
            title={todayChallenge?.title[lang] || ''}
            content={todayChallenge?.content[lang] || ''}
        />
    );
}
