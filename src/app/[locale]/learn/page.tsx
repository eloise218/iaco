import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { VideoLearningContent } from '@/components/learn/video-learning-content';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function LearnPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <VideoLearningContent />
        </div>
    );
}
