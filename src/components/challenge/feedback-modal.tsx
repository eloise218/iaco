'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { submitFeedback, dismissFeedbackModal } from '@/lib/actions/profile';

interface FeedbackModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
    const t = useTranslations('challenge.feedback');
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showThanks, setShowThanks] = useState(false);

    const handleSend = async () => {
        if (!message.trim() || isSubmitting) return;
        setIsSubmitting(true);

        await submitFeedback(message);
        setShowThanks(true);

        setTimeout(() => {
            onOpenChange(false);
            router.push('/dashboard');
        }, 1500);
    };

    const handleLater = async () => {
        await dismissFeedbackModal();
        onOpenChange(false);
        router.push('/dashboard');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md" showCloseButton={false}>
                <DialogTitle className="sr-only">Feedback</DialogTitle>

                {showThanks ? (
                    <div className="text-center py-8">
                        <p className="text-2xl mb-2">💜</p>
                        <p className="text-lg font-semibold text-white">{t('thanks')}</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <p className="text-sm text-slate-200 leading-relaxed">
                            {t('message')}
                        </p>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('placeholder')}
                            rows={4}
                            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 p-3 text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                        />

                        <button
                            onClick={handleSend}
                            disabled={!message.trim() || isSubmitting}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold hover:from-purple-400 hover:to-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? '...' : t('send')}
                        </button>

                        <button
                            onClick={handleLater}
                            className="w-full text-sm text-slate-500 hover:text-slate-400 transition-colors"
                        >
                            {t('later')}
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
