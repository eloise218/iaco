'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { saveCookieConsent, checkCookieConsent } from '@/lib/actions/cookie-consent';
import { useSession } from '@/lib/auth-client';

const STORAGE_KEY = 'iaco-cookie-consent';
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

interface ConsentData {
    consentedAt: string;
    accepted: boolean;
}

export function CookieBanner() {
    console.log('[CookieBanner] Component rendering');
    const t = useTranslations('cookieBanner');
    const { data: session } = useSession();
    const [visible, setVisible] = useState(false);
    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const check = async () => {
            console.log('[CookieBanner] check() called, session:', session);
            // 1. If authenticated, check DB first
            if (session?.user) {
                try {
                    const result = await checkCookieConsent();
                    if (result.success && result.data?.consented) {
                        return;
                    }
                } catch {
                    // Fall through to localStorage
                }
            }

            // 2. Check localStorage
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const data: ConsentData = JSON.parse(stored);
                    if (data.accepted) {
                        const consentTime = new Date(data.consentedAt).getTime();
                        if (Date.now() - consentTime < SIX_MONTHS_MS) {
                            // Valid localStorage consent - sync to DB if authenticated
                            if (session?.user) {
                                saveCookieConsent(data.consentedAt).catch(() => {});
                            }
                            return;
                        }
                        // Expired
                        localStorage.removeItem(STORAGE_KEY);
                    }
                }
            } catch {
                // localStorage not available
            }

            // 3. No valid consent -> show banner
            console.log('[CookieBanner] No valid consent found, showing banner');
            setVisible(true);
        };

        check();
    }, [session]);

    useEffect(() => {
        console.log('[CookieBanner] GSAP effect, visible:', visible, 'ref:', !!bannerRef.current);
        if (!visible || !bannerRef.current) return;

        gsap.fromTo(
            bannerRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.3, ease: 'power2.out' }
        );
    }, [visible]);

    const handleAccept = async () => {
        const now = new Date().toISOString();

        if (bannerRef.current) {
            gsap.to(bannerRef.current, {
                y: 100,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => setVisible(false),
            });
        }

        // Save to localStorage and notify GA4
        try {
            const data: ConsentData = { consentedAt: now, accepted: true };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            window.dispatchEvent(new Event('cookie-consent-update'));
        } catch {
            // localStorage not available
        }

        // If authenticated, also save to DB
        if (session?.user) {
            saveCookieConsent(now).catch(() => {});
        }
    };

    const handleDecline = () => {
        if (bannerRef.current) {
            gsap.to(bannerRef.current, {
                y: 100,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => setVisible(false),
            });
        }
    };

    if (!visible) return null;

    return (
        <div
            ref={bannerRef}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl opacity-0"
        >
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/20 backdrop-blur">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <p className="text-sm text-slate-200 leading-relaxed flex-1">
                        {t('message')}{' '}
                        <Link
                            href="/cookies"
                            className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                        >
                            {t('learnMore')}
                        </Link>
                    </p>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={handleDecline}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 transition-all duration-200"
                        >
                            {t('decline')}
                        </button>
                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                        >
                            {t('accept')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
