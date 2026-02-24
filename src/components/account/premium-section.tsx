'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircleIcon, CrownIcon } from '@phosphor-icons/react';

interface PremiumSectionProps {
    isPremium: boolean;
    premiumSince: string | null;
    locale: string;
}

export function PremiumSection({ isPremium, premiumSince, locale }: PremiumSectionProps) {
    const t = useTranslations('account.premium');
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleUpgrade = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    if (isPremium) {
        return (
            <div className="bg-slate-800/50 rounded-xl p-5 border border-emerald-700/50">
                <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-400" weight="fill" />
                    <div>
                        <p className="font-medium text-white">{t('active')}</p>
                        {premiumSince && (
                            <p className="text-sm text-slate-400">
                                {t('since', { date: new Date(premiumSince).toLocaleDateString(locale) })}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-purple-500/10 to-amber-500/10 rounded-xl p-6 border border-purple-700/30">
            <div className="flex items-center gap-3 mb-3">
                <CrownIcon className="w-6 h-6 text-amber-400" weight="fill" />
                <h3 className="text-lg font-semibold text-white">{t('upgradeTitle')}</h3>
            </div>
            <p className="text-sm text-slate-300 mb-5">{t('upgradeDescription')}</p>
            {error && (
                <p className="text-sm text-red-400 mb-3">{error}</p>
            )}
            <button
                onClick={handleUpgrade}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 transition-all duration-300 disabled:opacity-50"
            >
                {loading ? t('processing') : t('upgradeCta')}
            </button>
        </div>
    );
}
