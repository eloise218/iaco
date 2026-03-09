'use client';

import { useTransition } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserDetails } from '@/lib/actions/account';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type FormValues = { name?: string; phone?: string };

export default function UserDetailsForm({
  defaultName,
  defaultEmail,
  defaultPhone
}: {
  defaultName: string;
  defaultEmail: string;
  defaultPhone?: string;
}) {
  const t = useTranslations('account.profile');
  const [isPending, startTransition] = useTransition();

  const schema = z.object({
    name: z.string().trim().min(2, t('nameMinLength')).max(100).optional(),
    phone: z.string().trim().regex(/^\+?[0-9\-() ]{7,20}$/i, t('phoneInvalid')).optional().or(z.literal('')),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName || '', phone: defaultPhone || '' },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const res = await updateUserDetails(values);
      if (!res.success) toast.error(res.error || t('updateFailed'));
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">{t('name')}</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder={t('namePlaceholder')}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">{t('email')}</Label>
          <Input
            id="email"
            value={defaultEmail}
            disabled
            className="bg-slate-800/30 border-slate-700 text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500">{t('emailReadonly')}</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-300">{t('phone')}</Label>
          <Input
            id="phone"
            {...form.register('phone')}
            placeholder={t('phonePlaceholder')}
            className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500/20"
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-400">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-sm"
        >
          {isPending ? t('saving') : t('saveChanges')}
        </Button>
      </div>
    </form>
  );
}