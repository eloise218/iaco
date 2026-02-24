import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import db from '@/db/drizzle';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { LandingNavbar } from '@/components/landing';
import { Footer } from '@/components/landing/footer';
import {
    HeroSection,
    YouHesitateSection,
    WhatYouGetSection,
    HowItWorksSection,
    WhoWeAreSection,
    IacoAssistantSection,
    RefundSection,
    SecuritySection,
    FinalCtaSection,
} from '@/components/landing/sections';
import { ChatBubbleWrapper } from '@/components/chat/chat-bubble-wrapper';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Redirect logged-in users who completed onboarding to dashboard
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user) {
        const profile = await db.select({ completedOnboarding: userProfiles.completedOnboarding })
            .from(userProfiles)
            .where(eq(userProfiles.userId, session.user.id))
            .limit(1);

        if (profile[0]?.completedOnboarding) {
            redirect(`/${locale}/dashboard`);
        } else {
            redirect(`/${locale}/onboarding`);
        }
    }

    return (
        <main className="min-h-screen overflow-x-hidden">
            <LandingNavbar />
            <HeroSection />
            <YouHesitateSection />
            <WhatYouGetSection />
            <HowItWorksSection />
            <WhoWeAreSection />
            <IacoAssistantSection />
            <RefundSection />
            <SecuritySection />
            <FinalCtaSection />
            <Footer />
            <ChatBubbleWrapper />
        </main>
    );
}
