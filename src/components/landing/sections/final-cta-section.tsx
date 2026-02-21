'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { RocketIcon, ArrowRightIcon } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

export function FinalCtaSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations('finalCta');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.final-cta-content',
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="final-cta-content max-w-3xl mx-auto">
                    <div className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                            <RocketIcon className="w-8 h-8 text-primary" weight="fill" />
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            {t('title')}{' '}
                            <span className="text-primary">{t('titleHighlight')}</span>?
                        </h2>

                        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                            {t('subtitle')}
                        </p>

                        <Link href="/sign-up">
                            <Button
                                size="lg"
                                className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow group"
                            >
                                {t('cta')}
                                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <p className="mt-6 text-sm text-muted-foreground">
                            {t('assurance')}
                        </p>
                    </div>
                </div>
            </div>

        </section>
    );
}
