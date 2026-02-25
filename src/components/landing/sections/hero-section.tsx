'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheckIcon } from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const t = useTranslations('hero');

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.1 });

            tl.fromTo('.hero-badge', { opacity: 0, y: 15 }, {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power3.out',
            })
                .fromTo('.hero-headline', { opacity: 0, y: 25 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power3.out',
                }, '-=0.2')
                .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power3.out',
                }, '-=0.25')
                .fromTo('.hero-cta', { opacity: 0, y: 15 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                }, '-=0.2')
                .fromTo('.hero-trust', { opacity: 0, y: 10 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.25,
                    ease: 'power2.out',
                }, '-=0.2')
                .fromTo('.hero-mockup', { opacity: 0, x: 40, scale: 0.97 }, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                }, '-=0.4');
        }, sectionRef);

        return () => ctx.revert();
    }, []);


    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 -mt-12"
        >
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left - Content */}
                    <div className="text-left">
                        {/* Eyebrow Badge */}
                        <div className="hero-badge opacity-0 mb-6">
                            <Badge
                                variant="outline"
                                className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border-primary/30 bg-primary/5"
                            >
                                {t('badge')}
                            </Badge>
                        </div>

                        {/* Headline */}
                        <h1 className="hero-headline opacity-0 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                            {t('headline')}{' '}
                            <span className="text-primary">{t('headlineDays')}</span>.
                            <br />
                            <span className="text-muted-foreground text-3xl sm:text-4xl lg:text-5xl font-medium">{t('subheadline')}</span>
                        </h1>

                        {/* Subtitle - Darker text, medium weight */}
                        <p className="hero-subtitle opacity-0 text-lg md:text-xl text-foreground/70 font-medium leading-relaxed mb-8 max-w-xl">
                            {t('subtitle', { assistant: 'Iaco' })}
                        </p>

                        {/* CTA */}
                        <div className="hero-cta opacity-0 mb-4">
                            <Link href="/sign-up">
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                                >
                                    {t('cta')}
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Signal - Below button */}
                        <div className="hero-trust opacity-0 inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <ShieldCheckIcon className="w-5 h-5 text-emerald-500" weight="fill" />
                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t('trust')}</span>
                        </div>
                    </div>

                    {/* Right - Hero Image */}
                    <div className="hero-mockup opacity-0 relative flex justify-center lg:justify-end">
                        {/* Hero image with floating animation */}
                        <Image
                            src="/images/newhero.png"
                            alt="Iaco AI Assistant App"
                            width={500}
                            height={500}
                            className="animate-float"
                            priority
                        />

                        {/* Floating animation keyframes */}
                        <style jsx>{`
              @keyframes float {
                0%, 100% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-12px);
                }
              }
              :global(.animate-float) {
                animation: float 3.5s ease-in-out infinite;
              }
            `}</style>
                    </div>
                </div>
            </div>

        </section>
    );
}
