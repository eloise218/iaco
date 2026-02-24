'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';

const STORAGE_KEY = 'iaco-dashboard-tips-seen';

export function OnboardingTips() {
    const t = useTranslations('dashboard.tips');
    const [visible, setVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const topBubbleRef = useRef<HTMLDivElement>(null);
    const bottomBubbleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setVisible(true);
            }
        } catch {
            // localStorage not available
        }
    }, []);

    useEffect(() => {
        if (!visible) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                topBubbleRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.5, ease: 'power2.out' }
            );
            gsap.fromTo(
                bottomBubbleRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.7, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [visible]);

    const handleDismiss = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                try {
                    localStorage.setItem(STORAGE_KEY, 'true');
                } catch {
                    // localStorage not available
                }
                setVisible(false);
            },
        });

        tl.to(bottomBubbleRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.3,
            ease: 'power2.in',
        });
        tl.to(
            topBubbleRef.current,
            {
                opacity: 0,
                y: -10,
                duration: 0.3,
                ease: 'power2.in',
            },
            '-=0.15'
        );
    };

    if (!visible) return null;

    return (
        <div ref={containerRef} className="pointer-events-none fixed inset-0 z-40">
            {/* Top bubble - XP / Streak */}
            <div
                ref={topBubbleRef}
                className="pointer-events-auto absolute top-20 right-32 sm:right-44 max-w-xs opacity-0"
            >
                <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl p-4 shadow-xl shadow-black/20">
                    {/* Arrow pointing up */}
                    <div className="absolute -top-2 right-16 w-4 h-4 bg-slate-800 border-l border-t border-slate-700/50 rotate-45" />
                    <p className="text-sm text-slate-200 leading-relaxed">
                        {t('xpStreak')}
                    </p>
                </div>
            </div>

            {/* Bottom bubble - Chat assistant */}
            <div
                ref={bottomBubbleRef}
                className="pointer-events-auto absolute bottom-24 right-4 sm:right-6 max-w-xs opacity-0"
            >
                <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl p-4 shadow-xl shadow-black/20">
                    <p className="text-sm text-slate-200 leading-relaxed mb-3">
                        {t('chatAssistant')}
                    </p>
                    <button
                        onClick={handleDismiss}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                    >
                        {t('dismiss')}
                    </button>
                    {/* Arrow pointing down */}
                    <div className="absolute -bottom-2 right-10 w-4 h-4 bg-slate-800 border-r border-b border-slate-700/50 rotate-45" />
                </div>
            </div>
        </div>
    );
}
