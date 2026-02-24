import { BackButton } from '@/components/ui/back-button';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function CookiePolicyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
                <BackButton label={locale === 'fr' ? 'Retour' : 'Back'} />

                <article className="prose prose-invert prose-sm max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:text-muted-foreground [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_ol]:text-muted-foreground [&_ol]:mb-4 [&_ol]:space-y-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:hover:underline [&_hr]:border-border [&_hr]:my-12">
                    {/* ========== FRENCH ========== */}
                    <h1>Politique de cookies</h1>

                    <p>
                        Notre site utilise des cookies afin d&apos;assurer son bon fonctionnement et de mesurer l&apos;audience.
                    </p>

                    <h2>Cookies strictement n&eacute;cessaires</h2>
                    <p>
                        Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas &ecirc;tre d&eacute;sactiv&eacute;s.
                    </p>

                    <h2>Cookies de mesure d&apos;audience</h2>
                    <p>
                        Nous utilisons des cookies de mesure d&apos;audience afin d&apos;analyser la fr&eacute;quentation du site et d&apos;am&eacute;liorer son contenu.
                    </p>
                    <p>
                        Ces cookies sont d&eacute;pos&eacute;s uniquement apr&egrave;s votre consentement.
                    </p>

                    <h2>Gestion des cookies</h2>
                    <p>
                        Lors de votre premi&egrave;re visite, un bandeau vous permet d&apos;accepter ou de refuser les cookies.
                    </p>
                    <p>
                        Vous pouvez modifier votre choix &agrave; tout moment.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        Pour toute question relative aux cookies, vous pouvez nous contacter &agrave; : <a href="mailto:contact@iaco.app">contact@iaco.app</a>
                    </p>

                    <hr />

                    {/* ========== ENGLISH ========== */}
                    <h1>Cookie Policy</h1>

                    <p>
                        Our website uses cookies to ensure its proper functioning and to measure audience numbers.
                    </p>

                    <h2>Strictly necessary cookies</h2>
                    <p>
                        These cookies are essential for the website to function. They cannot be disabled.
                    </p>

                    <h2>Audience measurement cookies</h2>
                    <p>
                        We use audience measurement cookies to analyze website traffic and improve its content.
                    </p>
                    <p>
                        These cookies are only stored with your consent.
                    </p>

                    <h2>Cookie management</h2>
                    <p>
                        When you first visit the site, a banner allows you to accept or refuse cookies.
                    </p>
                    <p>
                        You can change your choice at any time.
                    </p>

                    <h2>Contact</h2>
                    <p>
                        If you have any questions about cookies, please contact us at: <a href="mailto:contact@iaco.app">contact@iaco.app</a>
                    </p>
                </article>
            </div>
        </main>
    );
}
