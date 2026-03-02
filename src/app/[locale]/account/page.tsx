export const runtime = "nodejs";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import db from '@/db/drizzle';
import { userProfiles, users } from '@/db/schema';
import { AccountContent } from '@/components/account/account-content';
import { setRequestLocale } from 'next-intl/server';
import { logger } from '@/lib/logger';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
        redirect(`/${locale}/sign-in`);
    }

    let profile: {
        experienceLevel: 'beginner' | 'intermediate';
        investmentObjectives: string[];
        riskTolerance: 'low' | 'medium' | 'high';
    } | null = null;
    let isPremium = false;
    let premiumSince: string | null = null;

    try {
        const [profileRow] = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.userId, session.user.id))
            .limit(1);

        if (profileRow) {
            profile = {
                experienceLevel: (profileRow.experienceLevel as 'beginner' | 'intermediate') || 'beginner',
                investmentObjectives: Array.isArray(profileRow.investmentObjectives)
                    ? profileRow.investmentObjectives.filter((x): x is string => typeof x === 'string')
                    : ['learning'],
                riskTolerance: (profileRow.riskTolerance as 'low' | 'medium' | 'high') || 'low',
            };
        }

        const [userRow] = await db
            .select({
                isPremium: users.isPremium,
                premiumSince: users.premiumSince,
            })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        if (userRow) {
            isPremium = userRow.isPremium ?? false;
            premiumSince = userRow.premiumSince ? userRow.premiumSince.toISOString() : null;
        }
    } catch (error) {
        logger.error('account', 'Error fetching account data', error);
    }

    const user = {
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || undefined,
        phone: (session.user as { phone?: string })?.phone || '',
    };

    return (
        <AccountContent
            user={user}
            profile={profile}
            isPremium={isPremium}
            premiumSince={premiumSince}
            locale={locale}
        />
    );
}
