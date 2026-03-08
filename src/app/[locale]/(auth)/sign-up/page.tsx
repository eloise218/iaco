"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const SIGNUP_STORAGE_KEY = "signup-form-draft";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const t = useTranslations('auth.signUp');
    const locale = useLocale();

    // Restaurer nom et email depuis sessionStorage au montage
    useEffect(() => {
        const saved = sessionStorage.getItem(SIGNUP_STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            if (data.name) setName(data.name);
            if (data.email) setEmail(data.email);
        }
    }, []);

    // Sauvegarder nom et email à chaque changement (pas les mots de passe)
    useEffect(() => {
        sessionStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify({ name, email }));
    }, [name, email]);

    const onGoogle = async () => {
        if (!agreedToTerms) return;
        try {
            setLoading(true);
            await authClient.signIn.social({
                provider: "google",
                callbackURL: `/${locale}/onboarding`,
            });
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const onEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!agreedToTerms) return;

        if (password !== confirmPassword) {
            setError(t('passwordMismatch'));
            return;
        }

        if (password.length < 8) {
            setError(t('passwordTooShort'));
            return;
        }

        try {
            setLoading(true);
            const result = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: `/${locale}/onboarding`,
            });

            if (result.error) {
                setError(result.error.message || t('genericError'));
                setLoading(false);
                return;
            }

            // Inscription réussie - afficher le message de vérification
            sessionStorage.removeItem(SIGNUP_STORAGE_KEY);
            setEmailSent(true);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setError(t('genericError'));
            setLoading(false);
        }
    };

    // Écran de confirmation après inscription
    if (emailSent) {
        return (
            <div className="min-h-dvh w-full grid place-items-center px-6 bg-gray-900">
                <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-2xl">
                    <CardHeader className="space-y-3">
                        <div className="mx-auto text-6xl mb-4">✉️</div>
                        <CardTitle className="text-2xl text-center tracking-tight text-white">
                            {t('verificationSent.title')}
                        </CardTitle>
                        <CardDescription className="text-center text-gray-300">
                            {t('verificationSent.message', { email })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-400 text-center">
                            {t('verificationSent.checkSpam')}
                        </p>
                        <Link href="/sign-in" className="block">
                            <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition">
                                {t('verificationSent.backToSignIn')}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                    <CardTitle className="text-2xl text-center tracking-tight text-white">
                        {t('title')}
                    </CardTitle>
                    <CardDescription className="text-center text-gray-300">
                        {t('subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Conditions d'utilisation */}
                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                            className="mt-1"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none cursor-pointer text-white"
                            >
                                {t('termsLabel')}
                            </Label>
                            <p className="text-xs text-gray-400">
                                {t('termsDescription')}{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                    {t('termsLink')}
                                </Link>{" "}
                                {t('and')}{" "}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    {t('privacyLink')}
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Bouton Google */}
                    <Button
                        onClick={onGoogle}
                        variant="outline"
                        className="w-full h-11 rounded-xl border-gray-600 text-white hover:bg-gray-700 transition"
                        disabled={loading || !agreedToTerms}
                    >
                        {loading ? t('loading') : t('google')}
                    </Button>

                    <div className="relative text-center">
                        <span className="px-3 text-xs text-gray-400 bg-gray-800 relative z-10">
                            {t('or')}
                        </span>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-600" />
                    </div>

                    {/* Formulaire Email/Password */}
                    <form onSubmit={onEmailSignUp} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm text-gray-300">
                                {t('nameLabel')}
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder={t('namePlaceholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                            />
                        </div>
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
                            <Label htmlFor="password" className="text-sm text-gray-300">
                                {t('passwordLabel')}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={t('passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm text-gray-300">
                                {t('confirmPasswordLabel')}
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder={t('confirmPasswordPlaceholder')}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
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
                            className={`w-full h-11 rounded-xl transition ${agreedToTerms
                                ? "bg-primary text-primary-foreground shadow-[0_10px_20px_-10px_var(--color-primary)] hover:opacity-90"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                }`}
                            disabled={loading || !agreedToTerms}
                        >
                            {loading ? t('loading') : t('submitEmail')}
                        </Button>
                    </form>

                    <p className="text-sm text-gray-300 text-center">
                        {t('hasAccount')}{" "}
                        <Link className="text-primary hover:underline" href="/sign-in">
                            {t('signIn')}
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
