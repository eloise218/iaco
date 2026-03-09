'use client';

import React, { useEffect, useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { binanceCredentialsSchema, type BinanceCredentialsInput } from '@/lib/validations/account';
import { saveBinanceCredentials, setBinanceActive, getBinanceStatus, deleteBinance } from '@/lib/actions/account';
import { CheckCircleIcon, XCircleIcon, WarningIcon } from '@phosphor-icons/react';

export default function BinanceKeysForm() {
  const t = useTranslations('account.binance');
  const [isPending, startTransition] = useTransition();
  const form = useForm<BinanceCredentialsInput>({ resolver: zodResolver(binanceCredentialsSchema) });
  const [connected, setConnected] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getBinanceStatus();
      if (res.success && res.data) {
        setConnected(res.data.connected);
        setActive(res.data.isActive);
      }
    })();
  }, []);

  const onSubmit = (values: BinanceCredentialsInput) => {
    startTransition(async () => {
      const res = await saveBinanceCredentials(values);
      if (res.success) {
        setConnected(true);
        setActive(true);
        form.reset({ apiKey: '', apiSecret: '' });
      } else toast.error(res.error || t('saveFailed'));
    });
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${connected
        ? active
          ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
          : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20'
        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50'
        }`}>
        {connected ? (
          active ? (
            <>
              <CheckCircleIcon className="w-6 h-6 text-emerald-400" weight="fill" />
              <div>
                <p className="text-white font-medium">{t('connectedTitle')}</p>
                <p className="text-sm text-emerald-400">{t('connectedDescription')}</p>
              </div>
            </>
          ) : (
            <>
              <WarningIcon className="w-6 h-6 text-amber-400" weight="fill" />
              <div>
                <p className="text-white font-medium">{t('pausedTitle')}</p>
                <p className="text-sm text-amber-400">{t('pausedDescription')}</p>
              </div>
            </>
          )
        ) : (
          <>
            <XCircleIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-slate-900 dark:text-slate-300 font-medium">{t('notConnectedTitle')}</p>
              <p className="text-slate-500">{t('notConnectedDescription')}</p>
            </div>
          </>
        )}
      </div>

      {/* API Keys Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-slate-300">{t('apiKey')}</Label>
            <Input
              id="apiKey"
              {...form.register('apiKey')}
              placeholder={t('apiKeyPlaceholder')}
              autoComplete="off"
              className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apiSecret" className="text-slate-300">{t('apiSecret')}</Label>
            <Input
              id="apiSecret"
              type="password"
              {...form.register('apiSecret')}
              placeholder={t('apiSecretPlaceholder')}
              autoComplete="off"
              className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500/50 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-sm"
          >
            {isPending ? t('saving') : connected ? t('updateKeys') : t('connect')}
          </Button>

          {connected && (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700/50"
                onClick={() => startTransition(async () => {
                  const res = await setBinanceActive(!active);
                  if (res.success) {
                    setActive(!active);
                  } else toast.error(res.error || t('failed'));
                })}
              >
                {active ? t('pause') : t('resume')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={() => startTransition(async () => {
                  const res = await deleteBinance();
                  if (res.success) {
                    setConnected(false);
                    setActive(false);
                  } else toast.error(res.error || t('failed'));
                })}
              >
                {t('remove')}
              </Button>
            </>
          )}
        </div>
      </form>

      {/* Info Note */}
      <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-300">{t('securityNote')}</strong> {t('securityDescription')}
        </p>
      </div>
    </div>
  );
}