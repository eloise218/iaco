'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'iaco-cookie-consent';
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function hasValidConsent(): boolean {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;
        const data = JSON.parse(stored);
        if (!data.accepted) return false;
        const consentTime = new Date(data.consentedAt).getTime();
        return Date.now() - consentTime < SIX_MONTHS_MS;
    } catch {
        return false;
    }
}

export function GoogleAnalytics() {
    const [consented, setConsented] = useState(false);

    useEffect(() => {
        if (hasValidConsent()) {
            setConsented(true);
        }

        const handleConsent = () => {
            if (hasValidConsent()) {
                setConsented(true);
            }
        };

        // Listen for consent changes (custom event from cookie-banner)
        window.addEventListener('cookie-consent-update', handleConsent);
        // Also listen for cross-tab storage changes
        window.addEventListener('storage', handleConsent);

        return () => {
            window.removeEventListener('cookie-consent-update', handleConsent);
            window.removeEventListener('storage', handleConsent);
        };
    }, []);

    if (!consented || !GA_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_ID}');
                `}
            </Script>
        </>
    );
}
