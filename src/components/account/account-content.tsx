'use client';

import React, { useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import {
    UserIcon,
    GearIcon,
    KeyIcon,
    ShieldCheckIcon,
    CaretLeftIcon,
    SparkleIcon,
    BellIcon,
    ScalesIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ChatBubbleWrapper } from '@/components/chat/chat-bubble-wrapper';
import UserDetailsForm from '@/components/account/user-details-form';
import ProfileSettingsForm from '@/components/account/profile-settings-form';
import BinanceKeysForm from '@/components/account/binance-keys-form';
import { PushPermission } from '@/components/push/push-permission';

interface AccountContentProps {
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
        phone?: string;
    };
    profile: {
        experienceLevel: 'beginner' | 'intermediate';
        investmentObjectives: string[];
        riskTolerance: 'low' | 'medium' | 'high';
    } | null;
}

export function AccountContent({ user, profile }: AccountContentProps) {
    const t = useTranslations('account');
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const sectionsRef = useRef<HTMLDivElement>(null);

    const navItems = [
        { id: 'profile', label: t('sections.profile'), icon: UserIcon },
        { id: 'preferences', label: t('sections.preferences'), icon: GearIcon },
        { id: 'notifications', label: t('sections.notifications'), icon: BellIcon },
        { id: 'binance', label: t('sections.binance'), icon: KeyIcon },
        { id: 'security', label: t('sections.security'), icon: ShieldCheckIcon },
        { id: 'legal', label: t('sections.legal'), icon: ScalesIcon },
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );

            gsap.fromTo(
                navRef.current?.children || [],
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: 0.08,
                    delay: 0.2,
                    ease: 'power2.out'
                }
            );

            gsap.fromTo(
                '.settings-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: 'back.out(1.1)'
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-slate-950"
        >
            {/* Solid background */}

            {/* Header */}
            <header ref={headerRef} className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Back Button */}
                        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                            <CaretLeftIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Dashboard</span>
                        </Link>

                        {/* User Info */}
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full ring-2 ring-slate-700"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                    <span className="text-white font-medium">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Side Navigation */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <SparkleIcon className="w-5 h-5 text-purple-400" weight="fill" />
                                <h1 className="text-xl font-bold text-white">{t('title')}</h1>
                            </div>
                            <nav ref={navRef} className="space-y-2">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group"
                                        >
                                            <Icon className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                                            <span className="font-medium">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <main ref={sectionsRef} className="flex-1 space-y-8">
                        {/* Profile Section */}
                        <section id="profile" className="settings-card scroll-mt-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/20">
                                        <UserIcon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{t('profile.title')}</h2>
                                        <p className="text-sm text-slate-400">{t('profile.description')}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <UserDetailsForm
                                        defaultName={user.name || ''}
                                        defaultEmail={user.email || ''}
                                        defaultPhone={user.phone || ''}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Preferences Section */}
                        <section id="preferences" className="settings-card scroll-mt-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/20">
                                        <GearIcon className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{t('preferences.title')}</h2>
                                        <p className="text-sm text-slate-400">{t('preferences.description')}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <ProfileSettingsForm
                                        defaultValues={{
                                            experienceLevel: profile?.experienceLevel || 'beginner',
                                            investmentObjectives: profile?.investmentObjectives || ['learning'],
                                            riskTolerance: profile?.riskTolerance || 'low',
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Notifications Section */}
                        <section id="notifications" className="settings-card scroll-mt-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-cyan-500/20">
                                        <BellIcon className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{t('notifications.title')}</h2>
                                        <p className="text-sm text-slate-400">{t('notifications.description')}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                        <div>
                                            <p className="font-medium text-white">{t('notifications.push')}</p>
                                            <p className="text-sm text-slate-400 mt-1">{t('notifications.pushDescription')}</p>
                                        </div>
                                        <PushPermission />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Binance Section */}
                        <section id="binance" className="settings-card scroll-mt-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-amber-500/20">
                                        <KeyIcon className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{t('binance.title')}</h2>
                                        <p className="text-sm text-slate-400">{t('binance.description')}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <BinanceKeysForm />
                                </div>
                            </div>
                        </section>

                        {/* Security Section */}
                        <section id="security" className="settings-card scroll-mt-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-500/20">
                                        <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{t('security.title')}</h2>
                                        <p className="text-sm text-slate-400">{t('security.description')}</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Auth Status */}
                                    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                                <ShieldCheckIcon className="w-5 h-5 text-emerald-400" weight="fill" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Google Authentication</p>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    You signed in with Google. Your account is secured with Google&apos;s authentication.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sign Out */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button
                                            variant="outline"
                                            className="border-slate-700 bg-slate-800/50 text-white hover:bg-slate-700/50 hover:text-white"
                                            onClick={async () => {
                                                const { authClient } = await import('@/lib/auth-client');
                                                await authClient.signOut();
                                                window.location.href = '/sign-in';
                                            }}
                                        >
                                            Sign Out
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            Delete Account
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Legal Section */}
                        <section id="legal" className="settings-card scroll-mt-24">
                            <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-800/50 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/20">
                                        <ScalesIcon className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{t('legal.title')}</h2>
                                        <p className="text-sm text-slate-400">{t('legal.description')}</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid gap-3">
                                        <Link
                                            href="/privacy"
                                            className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <span className="font-medium text-white">{t('legal.privacyPolicy')}</span>
                                            <CaretLeftIcon className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white transition-colors" />
                                        </Link>
                                        <Link
                                            href="/terms"
                                            className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <span className="font-medium text-white">{t('legal.termsOfService')}</span>
                                            <CaretLeftIcon className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white transition-colors" />
                                        </Link>
                                        <Link
                                            href="/cookies"
                                            className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <span className="font-medium text-white">{t('legal.cookiePolicy')}</span>
                                            <CaretLeftIcon className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white transition-colors" />
                                        </Link>
                                        <Link
                                            href="/disclaimer"
                                            className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:bg-slate-700/50 transition-colors group"
                                        >
                                            <span className="font-medium text-white">{t('legal.disclaimer')}</span>
                                            <CaretLeftIcon className="w-4 h-4 text-slate-400 rotate-180 group-hover:text-white transition-colors" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {/* Chat Bubble */}
            <ChatBubbleWrapper />
        </div>
    );
}
