'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import {
    SparkleIcon,
    ChartLineIcon,
    TargetIcon,
    GearIcon,
    SignOutIcon,
    PlayIcon,
    FireIcon,
    BookOpenIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ChatBubbleWrapper } from '@/components/chat/chat-bubble-wrapper';
import { AlertsSection } from './alerts/alerts-section';
import { authClient } from '@/lib/auth-client';
import { OnboardingTips } from './onboarding-tips';

interface DashboardContentProps {
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    profile: {
        experienceLevel: string;
        objectives: string[];
    };
    challengeDay: number;
    challengeCompleted: boolean;
    challengeTitle: string;
    userXp: number;
    streak: number;
}

export function DashboardContent({ user, profile, challengeDay, challengeCompleted, challengeTitle, userXp, streak }: DashboardContentProps) {
    const router = useRouter();
    const t = useTranslations('dashboard');
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const xpBadgeRef = useRef<HTMLDivElement>(null);
    const streakBadgeRef = useRef<HTMLDivElement>(null);
    const [displayedXp, setDisplayedXp] = useState(0);
    const [displayedStreak, setDisplayedStreak] = useState(0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('greeting.morning');
        if (hour < 18) return t('greeting.afternoon');
        return t('greeting.evening');
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push('/');
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );

            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 40, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: 0.2,
                    ease: 'power3.out'
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // XP counter animation
    useEffect(() => {
        const prevXp = parseInt(localStorage.getItem('iaco-xp') || '0', 10);
        localStorage.setItem('iaco-xp', String(userXp));

        const hasGained = userXp > prevXp;
        const startValue = hasGained ? prevXp : userXp;

        if (hasGained) {
            // Count up animation
            const obj = { val: startValue };
            gsap.to(obj, {
                val: userXp,
                duration: 1.2,
                delay: 0.8,
                ease: 'power2.out',
                onUpdate: () => setDisplayedXp(Math.round(obj.val)),
            });

            // Pulse glow on the badge
            if (xpBadgeRef.current) {
                gsap.fromTo(
                    xpBadgeRef.current,
                    { scale: 1, boxShadow: '0 0 0px rgba(52, 211, 153, 0)' },
                    {
                        scale: 1.15,
                        boxShadow: '0 0 20px rgba(52, 211, 153, 0.6)',
                        duration: 0.4,
                        delay: 0.8,
                        yoyo: true,
                        repeat: 3,
                        ease: 'power2.inOut',
                    }
                );
            }
        } else {
            setDisplayedXp(userXp);
        }
    }, [userXp]);

    // Streak counter animation
    useEffect(() => {
        const prevStreak = parseInt(localStorage.getItem('iaco-streak') || '0', 10);
        localStorage.setItem('iaco-streak', String(streak));

        const hasIncreased = streak > prevStreak;

        if (hasIncreased && streak > 0) {
            const obj = { val: prevStreak };
            gsap.to(obj, {
                val: streak,
                duration: 0.8,
                delay: 1.2,
                ease: 'power2.out',
                onUpdate: () => setDisplayedStreak(Math.round(obj.val)),
            });

            if (streakBadgeRef.current) {
                gsap.fromTo(
                    streakBadgeRef.current,
                    { scale: 1, boxShadow: '0 0 0px rgba(249, 115, 22, 0)' },
                    {
                        scale: 1.15,
                        boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)',
                        duration: 0.4,
                        delay: 1.2,
                        yoyo: true,
                        repeat: 3,
                        ease: 'power2.inOut',
                    }
                );
            }
        } else {
            setDisplayedStreak(streak);
        }
    }, [streak]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
        >
            {/* Animated background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header ref={headerRef} className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl opacity-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative">
                                <Image
                                    src="/logo.png"
                                    alt="IACO Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xl font-bold text-white">IACO</span>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div ref={xpBadgeRef} className="flex items-center gap-1 px-2 py-1.5 sm:gap-1.5 sm:px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <SparkleIcon className="w-4 h-4 text-emerald-400" weight="fill" />
                                <span className="text-xs sm:text-sm font-semibold text-emerald-300">{displayedXp} XP</span>
                            </div>
                            <div ref={streakBadgeRef} className="flex items-center gap-1 px-2 py-1.5 sm:gap-1.5 sm:px-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                <FireIcon className="w-4 h-4 text-orange-400" weight="fill" />
                                {streak > 0 && (
                                    <span className="text-xs sm:text-sm font-semibold text-orange-300">{displayedStreak}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-0">
                                <Link href="/account">
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                        <GearIcon className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors p-2"
                                >
                                    <SignOutIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                {user.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full ring-2 ring-slate-700"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Welcome Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="hidden sm:flex items-center gap-2 mb-2">
                        <SparkleIcon className="w-5 h-5 text-amber-400" weight="fill" />
                        <span className="text-amber-400 text-sm font-medium">
                            {profile.experienceLevel === 'beginner'
                                ? t('experienceLevel.beginner')
                                : t('experienceLevel.intermediate')} {t('explorer')}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                        {getGreeting()}, {user.name.split(' ')[0]}! 👋
                    </h1>
                    <p className="hidden sm:block text-slate-400 text-lg">
                        {t('welcome')}
                    </p>
                </div>

                {/* Daily Challenge Hero */}
                <Link href="/challenge" className="block mb-8 sm:mb-10">
                    <div
                        ref={heroRef}
                        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-slate-900/80 to-blue-900/40 backdrop-blur-sm px-5 py-5 sm:px-8 sm:py-7 md:px-12 md:py-10 min-h-0 flex flex-col justify-between group cursor-pointer hover:border-purple-400/50 transition-all duration-500 opacity-0"
                    >
                        {/* Decorative background */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl" />
                            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl" />
                        </div>

                        {/* Top: Badge + Title */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-3 sm:mb-4">
                                <TargetIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                                <span className="text-purple-300 text-xs sm:text-sm font-medium">
                                    {t('dailyChallenge.title')}
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-1 sm:mb-2">
                                {challengeCompleted
                                    ? t('dailyChallenge.completed')
                                    : t('dailyChallenge.dayTitle', { day: challengeDay })}
                            </h2>
                            <p className="text-base sm:text-xl md:text-2xl text-slate-300 font-medium max-w-2xl">
                                {challengeTitle}
                            </p>
                        </div>

                        {/* Bottom: Metadata + CTA + Progress */}
                        <div className="relative z-10 mt-4 sm:mt-6">
                            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800/60">
                                    <BookOpenIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                                    <span className="text-xs sm:text-sm text-slate-300">{t('dailyChallenge.duration')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-500/10">
                                    <SparkleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" weight="fill" />
                                    <span className="text-xs sm:text-sm text-emerald-300">{t('dailyChallenge.xp')}</span>
                                </div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <div className={`inline-flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-base sm:text-lg ${challengeCompleted ? 'bg-emerald-600 text-white' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'} group-hover:scale-105 transition-transform duration-300`}>
                                    <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5" weight="fill" />
                                    <span>{t('dailyChallenge.cta')}</span>
                                </div>
                            </div>

                            <div className="max-w-md">
                                <div className="flex justify-between text-xs sm:text-sm text-slate-400 mb-1.5 sm:mb-2">
                                    <span>{challengeDay} / 14</span>
                                    <span>{Math.round((challengeDay / 14) * 100)}%</span>
                                </div>
                                <div className="h-1.5 sm:h-2 bg-slate-800/80 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${challengeCompleted ? 'bg-gradient-to-r from-emerald-500 to-green-400 w-full' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                                        style={challengeCompleted ? undefined : { width: `${Math.round((challengeDay / 14) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Price Alerts Section */}
                <div className="mb-6 sm:mb-8">
                    <AlertsSection />
                </div>

                {/* Educational Banner */}
                <div className="mt-4 sm:mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl sm:rounded-2xl border border-blue-500/20 p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500/20">
                            <ChartLineIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                                {t('educationalBanner.title')}
                            </h3>
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                {t('educationalBanner.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Chat Bubble */}
            <ChatBubbleWrapper />

            {/* First-time onboarding tips (day 1 only) */}
            {challengeDay === 1 && <OnboardingTips />}
        </div>
    );
}
