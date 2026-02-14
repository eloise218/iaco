'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
    ArrowLeft as ArrowLeftIcon,
    Trophy as TrophyIcon,
    BookOpen as BookOpenIcon,
    Target as TargetIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface ChallengeContentProps {
    challengeDay: number;
    totalDays: number;
    isCompleted: boolean;
    title: string;
    content: string;
}

export function ChallengeContent({
    challengeDay,
    totalDays,
    isCompleted,
    title,
    content,
}: ChallengeContentProps) {
    const t = useTranslations('challenge');
    const progressPercent = Math.round((challengeDay / totalDays) * 100);

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center">
                    <div className="mb-6 inline-flex p-5 rounded-full bg-emerald-500/20">
                        <TrophyIcon className="w-16 h-16 text-emerald-400" weight="fill" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        {t('completed.title')}
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">
                        {t('completed.message')}
                    </p>
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                            <span>{t('progress')}</span>
                            <span>100%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full w-full" />
                        </div>
                    </div>
                    <Link href="/dashboard">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl">
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            {t('backToDashboard')}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Fixed background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Back button */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {t('backToDashboard')}
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-purple-500/20">
                            <TargetIcon className="w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-purple-400 text-sm font-medium">
                            {t('dayLabel', { current: challengeDay, total: totalDays })}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {title}
                    </h1>
                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                            <span>{t('progress')}</span>
                            <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpenIcon className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-slate-400">{t('reading')}</span>
                    </div>
                    <div className="prose prose-invert prose-slate max-w-none text-slate-200 leading-relaxed text-base">
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-4">{children}</p>,
                                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-4">{children}</h3>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="ml-2">{children}</li>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Bottom navigation */}
                <div className="mt-8 flex justify-center">
                    <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            className="text-slate-400 hover:text-white"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            {t('backToDashboard')}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
