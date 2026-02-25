'use client';

import { useMemo, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfile } from '@/lib/actions/profile';
import { updateUserProfileSchema, type UpdateUserProfileInput } from '@/lib/validations/profile';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import {
  GraduationCapIcon,
  TrendUpIcon,
} from '@phosphor-icons/react';

export default function ProfileSettingsForm({ defaultValues }: { defaultValues: UpdateUserProfileInput }) {
  const t = useTranslations('account.preferences');
  const [isPending, startTransition] = useTransition();
  const form = useForm<UpdateUserProfileInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(updateUserProfileSchema) as any,
    defaultValues,
  });

  const options = useMemo(() => ({
    experience: [
      { id: 'beginner', label: t('experience.beginner'), description: t('experience.beginnerDesc'), icon: GraduationCapIcon },
      { id: 'intermediate', label: t('experience.intermediate'), description: t('experience.intermediateDesc'), icon: TrendUpIcon },
    ],
    objectives: [
      { id: 'learning', label: t('objectives.learning') },
      { id: 'long-term-growth', label: t('objectives.longTermGrowth') },
      { id: 'diversification', label: t('objectives.diversification') },
      { id: 'trading', label: t('objectives.trading') },
      { id: 'defi', label: t('objectives.defi') },
    ],
    risk: [
      { id: 'low', label: t('risk.low'), color: 'emerald' },
      { id: 'medium', label: t('risk.medium'), color: 'amber' },
      { id: 'high', label: t('risk.high'), color: 'red' },
    ],
  }), [t]);

  const onSubmit = (values: UpdateUserProfileInput) => {
    startTransition(async () => {
      const res = await updateUserProfile(values);
      if (res.success) toast.success(t('updated'));
      else toast.error(res.error || t('updateFailed'));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Experience Level */}
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-base">{t('experienceLabel')}</FormLabel>
              <FormDescription className="text-slate-400">
                {t('experienceDescription')}
              </FormDescription>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(val) => { if (val !== field.value) field.onChange(val); }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3"
                >
                  {options.experience.map(opt => {
                    const Icon = opt.icon;
                    const isSelected = field.value === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                          ? 'border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                      >
                        <RadioGroupItem value={opt.id} id={`exp-${opt.id}`} className="sr-only" />
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-900'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`} />
                        </div>
                        <Label
                          htmlFor={`exp-${opt.id}`}
                          className={`flex-1 cursor-pointer ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          <span className="font-medium">{opt.label}</span>
                          <span className="block text-sm text-slate-400">{opt.description}</span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Investment Objectives */}
        <FormField
          control={form.control}
          name="investmentObjectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-base">{t('objectivesLabel')}</FormLabel>
              <FormDescription className="text-slate-400">{t('objectivesDescription')}</FormDescription>
              <FormControl>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {options.objectives.map(opt => {
                    const isChecked = (field.value || []).includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isChecked
                          ? 'border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        onClick={() => {
                          const current = field.value || [];
                          field.onChange(isChecked ? current.filter(v => v !== opt.id) : [...current, opt.id]);
                        }}
                      >
                        <Checkbox
                          id={`obj-${opt.id}`}
                          checked={isChecked}
                          className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-white data-[state=checked]:border-slate-900 dark:data-[state=checked]:border-white"
                        />
                        <Label
                          className={`cursor-pointer ${isChecked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          {opt.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Risk Tolerance */}
        <FormField
          control={form.control}
          name="riskTolerance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-base">{t('riskLabel')}</FormLabel>
              <FormDescription className="text-slate-400">
                {t('riskDescription')}
              </FormDescription>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(val) => { if (val !== field.value) field.onChange(val); }}
                  className="grid grid-cols-3 gap-3 mt-3"
                >
                  {options.risk.map(opt => {
                    const isSelected = field.value === opt.id;
                    const colorClasses = {
                      low: isSelected ? 'border-emerald-500 bg-emerald-500/10' : '',
                      medium: isSelected ? 'border-amber-500 bg-amber-500/10' : '',
                      high: isSelected ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : '',
                    };
                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                          ? colorClasses[opt.id as keyof typeof colorClasses]
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                      >
                        <RadioGroupItem value={opt.id} id={`risk-${opt.id}`} className="sr-only" />
                        <Label
                          htmlFor={`risk-${opt.id}`}
                          className={`cursor-pointer font-medium ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                        >
                          {opt.label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 shadow-sm"
          >
            {isPending ? t('saving') : t('savePreferences')}
          </Button>
        </div>
      </form>
    </Form>
  );
}