'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { BellRingingIcon, XIcon } from '@phosphor-icons/react';

export function NotificationsPrompt() {
    const router = useRouter();
    const t = useTranslations('notificationsPrompt');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
            );

            gsap.fromTo(
                '.notif-icon',
                { opacity: 0, y: -20, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.2, ease: 'back.out(1.5)' }
            );

            gsap.fromTo(
                '.notif-content',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.3, ease: 'power2.out' }
            );

            gsap.fromTo(
                '.notif-point',
                { opacity: 0, x: -15 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, delay: 0.5, ease: 'power2.out' }
            );

            gsap.fromTo(
                '.notif-buttons',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.8, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleAccept = () => {
        gsap.to(containerRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                router.push('/challenge');
            },
        });
    };

    const handleDecline = () => {
        gsap.to(containerRef.current, {
            scale: 0.95,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                router.push('/challenge');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div ref={containerRef} className="w-full max-w-lg relative z-10 opacity-0">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl shadow-black/20 p-8 md:p-10">
                    {/* Bell icon */}
                    <div className="notif-icon flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                            <BellRingingIcon className="w-10 h-10 text-amber-400" weight="fill" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="notif-content text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
                            {t('title')}
                        </h1>
                        <p className="text-slate-400 text-lg mb-4">
                            {t('description')}
                        </p>
                    </div>

                    {/* Points */}
                    <div className="space-y-3 mb-6">
                        <div className="notif-point flex items-center gap-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <span className="text-lg">📚</span>
                            <span className="text-slate-300 font-medium">{t('point1')}</span>
                        </div>
                        <div className="notif-point flex items-center gap-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <span className="text-lg">📊</span>
                            <span className="text-slate-300 font-medium">{t('point2')}</span>
                        </div>
                        <div className="notif-point flex items-center gap-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <span className="text-lg">🚀</span>
                            <span className="text-slate-300 font-medium">{t('point3')}</span>
                        </div>
                    </div>

                    {/* Impact text */}
                    <div className="notif-content text-center mb-2">
                        <p className="text-white font-semibold text-lg">
                            {t('impact')}
                        </p>
                        <p className="text-slate-400 mt-2">
                            {t('question')}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="notif-buttons space-y-3 mt-8">
                        <button
                            onClick={handleAccept}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg hover:from-amber-400 hover:to-orange-400 transition-all duration-300 shadow-lg shadow-amber-500/20"
                        >
                            {t('accept')}
                        </button>
                        <button
                            onClick={handleDecline}
                            className="w-full py-3 rounded-2xl text-slate-400 hover:text-slate-300 font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                        >
                            <XIcon className="w-4 h-4" />
                            {t('decline')}
                        </button>
                    </div>

                    {/* Hint */}
                    <p className="text-center text-xs text-slate-500 mt-6">
                        {t('hint')}
                    </p>
                </div>
            </div>
        </div>
    );
}
