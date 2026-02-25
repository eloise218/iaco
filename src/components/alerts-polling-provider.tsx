'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useAlertsPolling } from '@/hooks/use-alerts-polling';
import type { CryptoAlert } from '@/lib/types';

function AlertToast({ alert, t, id }: { alert: CryptoAlert; t: ReturnType<typeof useTranslations>; id: string | number }) {
    const isVolatility = alert.alertType === 'volatility';
    const isUp = !isVolatility && Number(alert.triggeredPrice) >= Number(alert.threshold);

    const accentBar = isVolatility
        ? 'bg-gradient-to-r from-purple-500 to-violet-400'
        : isUp ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-400';
    const iconBg = isVolatility ? 'bg-purple-500/15' : isUp ? 'bg-emerald-500/15' : 'bg-amber-500/15';
    const badgeClass = isVolatility ? 'bg-purple-500/15 text-purple-400' : isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400';

    return (
        <div className="w-[356px] rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden">
            {/* Top accent bar */}
            <div className={`h-1 w-full ${accentBar}`} />

            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                        <span className="text-lg">{isVolatility ? '📊' : isUp ? '📈' : '📉'}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-white">{alert.symbol}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
                                {isVolatility ? t('type.volatility') : t('type.price')}
                            </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-snug">
                            {t('triggered.notification', {
                                symbol: alert.symbol,
                                price: alert.triggeredPrice ?? 'N/A',
                            })}
                        </p>
                    </div>
                </div>

                {/* Dismiss button */}
                <button
                    onClick={() => toast.dismiss(id)}
                    className="mt-3 w-full py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
                >
                    {t('toast.dismiss')}
                </button>
            </div>
        </div>
    );
}

function AlertsPollingInner() {
    const t = useTranslations('dashboard.alerts');
    const { newlyTriggered, clearNewlyTriggered } = useAlertsPolling();

    useEffect(() => {
        if (newlyTriggered.length > 0) {
            newlyTriggered.forEach((alert) => {
                toast.custom(
                    (id) => <AlertToast alert={alert} t={t} id={id} />,
                    { duration: 12000 }
                );
            });
            clearNewlyTriggered();
        }
    }, [newlyTriggered, clearNewlyTriggered, t]);

    return null;
}

export function AlertsPollingProvider() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending || !session?.user) {
        return null;
    }

    return <AlertsPollingInner />;
}
