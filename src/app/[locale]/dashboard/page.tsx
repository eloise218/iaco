export const runtime = "nodejs";
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import db from '@/db/drizzle';
import { userProfiles, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DashboardContent } from '@/components/dashboard/dashboard-content';
import { setRequestLocale } from 'next-intl/server';

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
        />
    );
}
