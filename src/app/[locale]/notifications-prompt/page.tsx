import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { NotificationsPrompt } from '@/components/onboarding/notifications-prompt';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function NotificationsPromptPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect(`/${locale}/sign-in`);
    }

    return <NotificationsPrompt />;
}
