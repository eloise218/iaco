'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { dismissTip } from '@/lib/actions/profile';

export function ChallengeOnboardingTip() {
    const t = useTranslations('challenge.tips');
    const [visible, setVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!visible) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                bubbleRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.7, ease: 'power2.out' }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [visible]);

    const handleDismiss = () => {
        gsap.to(bubbleRef.current, {
            opacity: 0,
            y: 10,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                dismissTip('challenge');
                setVisible(false);
            },
        });
    };

    if (!visible) return null;

    return (
        <div ref={containerRef} className="pointer-events-none fixed inset-0 z-40">
            {/* Chat assistant bubble */}
            <div
                ref={bubbleRef}
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
                    {/* Arrow pointing down toward chat button */}
                    <div className="absolute -bottom-2 right-10 w-4 h-4 bg-slate-800 border-r border-b border-slate-700/50 rotate-45" />
                </div>
            </div>
        </div>
    );
}
