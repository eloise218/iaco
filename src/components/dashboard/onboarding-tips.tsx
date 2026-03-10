'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { dismissTip } from '@/lib/actions/profile';

export function OnboardingTips() {
    const t = useTranslations('dashboard.tips');
    const [visible, setVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                bubbleRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [visible]);

    const handleDismiss = () => {
        gsap.to(bubbleRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                dismissTip('dashboard');
                setVisible(false);
            },
        });
    };

    if (!visible) return null;

    return (
        <div ref={containerRef} className="pointer-events-none fixed inset-0 z-40">
            {/* XP / Streak bubble */}
            <div
                ref={bubbleRef}
                className="pointer-events-auto absolute top-20 right-16 sm:right-28 max-w-xs opacity-0"
            >
                <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl p-4 shadow-xl shadow-black/20">
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 right-24 sm:right-28 w-4 h-4 bg-slate-800 border-l border-t border-slate-700/50 rotate-45" />
                    <p className="text-sm text-slate-200 leading-relaxed mb-3">
                        {t('xpStreak')}
                    </p>
                    <button
                        onClick={handleDismiss}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                    >
                        {t('dismiss')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function AlertsOnboardingTip() {
    const t = useTranslations('dashboard.tips');
    const [visible, setVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                bubbleRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.7, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [visible]);

    const handleDismiss = () => {
        gsap.to(bubbleRef.current, {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                dismissTip('alerts');
                setVisible(false);
            },
        });
    };

    if (!visible) return null;

    return (
        <div ref={containerRef} className="mb-3">
            <div
                ref={bubbleRef}
                className="opacity-0"
            >
                <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl p-4 shadow-xl shadow-black/20">
                    <p className="text-sm text-slate-200 leading-relaxed mb-3">
                        {t('alerts')}
                    </p>
                    <button
                        onClick={handleDismiss}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                    >
                        {t('dismiss')}
                    </button>
                    {/* Arrow pointing down toward alerts section */}
                    <div className="absolute -bottom-2 left-16 w-4 h-4 bg-slate-800 border-r border-b border-slate-700/50 rotate-45" />
                </div>
            </div>
        </div>
    );
}
