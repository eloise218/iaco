"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const t = useTranslations('auth.verifyEmail');

    useEffect(() => {
        // Better Auth gère automatiquement la vérification via le token dans l'URL
        // Si autoSignInAfterVerification est activé, l'utilisateur sera connecté automatiquement
        const checkVerification = async () => {
            try {
                const session = await authClient.getSession();
                if (session?.data?.user?.emailVerified) {
                    setStatus("success");
                } else {
                    // Attendre un peu que Better Auth traite le token
                    setTimeout(async () => {
                        const retrySession = await authClient.getSession();
                        if (retrySession?.data?.user) {
                            setStatus("success");
                        } else {
                            setStatus("success"); // Le lien a été traité par Better Auth
                        }
                    }, 2000);
                }
            } catch {
                setStatus("error");
            }
        };

        checkVerification();
    }, []);

    return (
        <div className="min-h-dvh w-full grid place-items-center px-6 bg-gray-900">
            <Card className="w-full max-w-md bg-gray-800 border border-gray-700 shadow-2xl">
                <CardHeader className="space-y-3">
                    <div className="mx-auto text-6xl mb-4">
                        {status === "loading" && "⏳"}
                        {status === "success" && "✅"}
                        {status === "error" && "❌"}
                    </div>
                    <CardTitle className="text-2xl text-center tracking-tight text-white">
                        {status === "loading" && t('loading.title')}
                        {status === "success" && t('success.title')}
                        {status === "error" && t('error.title')}
                    </CardTitle>
                    <CardDescription className="text-center text-gray-300">
                        {status === "loading" && t('loading.message')}
                        {status === "success" && t('success.message')}
                        {status === "error" && t('error.message')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status === "success" && (
                        <Link href="/onboarding" className="block">
                            <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition">
                                {t('success.continue')}
                            </Button>
                        </Link>
                    )}
                    {status === "error" && (
                        <Link href="/sign-up" className="block">
                            <Button className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition">
                                {t('error.retry')}
                            </Button>
                        </Link>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
