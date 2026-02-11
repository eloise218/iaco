"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const t = useTranslations('auth.signIn');

    const onGoogle = async () => {
        try {
            setLoading(true);
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const onEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                setError(result.error.message || t('genericError'));
                setLoading(false);
                return;
            }

            window.location.href = "/dashboard";
        } catch (e) {
            console.error(e);
            setError(t('genericError'));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh w-full grid place-items-center px-6 bg-gray-900">
            <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-2xl">
                <CardHeader className="space-y-3">
                    <div className="mx-auto h-16 w-16 relative mb-4">
                        <Image
                            src="/logo.png"
                            alt="IACO Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl text-center tracking-tight text-white">{t('title')}</CardTitle>
                    <CardDescription className="text-center text-gray-300">{t('subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Formulaire Email/Password */}
                    <form onSubmit={onEmailSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm text-gray-300">
                                {t('emailLabel')}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm text-gray-300">
                                    {t('passwordLabel')}
                                </Label>
                                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                                    {t('forgotPassword')}
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 text-center bg-red-400/10 p-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-primary text-primary-foreground shadow-[0_10px_20px_-10px_var(--color-primary)] hover:opacity-90 transition"
                            disabled={loading}
                        >
                            {loading ? t('loading') : t('submitEmail')}
                        </Button>
                    </form>

                    <div className="relative text-center">
                        <span className="px-3 text-xs text-gray-400 bg-gray-800 relative z-10">
                            {t('or')}
                        </span>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-600" />
                    </div>

                    {/* Bouton Google */}
                    <Button
                        onClick={onGoogle}
                        variant="outline"
                        className="w-full h-11 rounded-xl border-gray-600 text-white hover:bg-gray-700 transition"
                        disabled={loading}
                    >
                        {loading ? t('loading') : t('google')}
                    </Button>

                    <p className="text-sm text-gray-300 text-center">
                        {t('noAccount')}{" "}
                        <Link className="text-primary hover:underline" href="/sign-up">{t('signUp')}</Link>
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                        {t('termsNotice')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
