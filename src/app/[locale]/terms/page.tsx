import { Link } from '@/i18n/navigation';
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {locale === 'fr' ? 'Retour' : 'Back'}
                </Link>

                <article className="prose prose-invert prose-sm max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:text-muted-foreground [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_ol]:text-muted-foreground [&_ol]:mb-4 [&_ol]:space-y-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:hover:underline [&_hr]:border-border [&_hr]:my-12">
                    {/* ========== FRENCH ========== */}
                    <h1>Conditions G&eacute;n&eacute;rales d&apos;Utilisation et de Vente</h1>
                    <p className="!text-foreground !text-base font-medium">
                        du service Iaco &ndash; Challenge 14 jours
                    </p>
                    <p className="!text-sm">
                        Derni&egrave;re mise &agrave; jour : 20 f&eacute;vrier 2026<br />
                        Entr&eacute;e en vigueur &agrave; compter du lancement officiel du site.
                    </p>

                    <h2>1. Objet</h2>
                    <p>
                        Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales d&apos;Utilisation et de Vente (ci-apr&egrave;s les &laquo;&nbsp;CGU&nbsp;&raquo;) ont pour objet de d&eacute;finir les modalit&eacute;s et conditions d&apos;acc&egrave;s, d&apos;utilisation et de vente du service propos&eacute; par la soci&eacute;t&eacute; Iaco, soci&eacute;t&eacute; par actions simplifi&eacute;e (SAS) immatricul&eacute;e en France, dont le si&egrave;ge social est situ&eacute; &agrave; 3 rue Paul Vaillant Couturier, 78210 Saint Cyr l&apos;Ecole, France, et joignable &agrave; l&apos;adresse e-mail <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>
                    <p>
                        Le service, accessible via le site <a href="https://iaco.app">https://iaco.app</a>, permet aux utilisateurs de participer au programme &laquo;&nbsp;Challenge 14 jours&nbsp;&raquo;, un parcours d&apos;apprentissage en ligne destin&eacute; &agrave; accompagner les d&eacute;butants dans la compr&eacute;hension et la s&eacute;curisation de leurs activit&eacute;s li&eacute;es aux cryptomonnaies.
                    </p>
                    <p>
                        Toute utilisation du service implique l&apos;acceptation pleine et enti&egrave;re des pr&eacute;sentes CGU. Si l&apos;utilisateur n&apos;accepte pas ces conditions, il doit cesser imm&eacute;diatement toute utilisation du service.
                    </p>

                    <h2>2. Mentions l&eacute;gales</h2>
                    <p>
                        <strong>&Eacute;diteur du site :</strong><br />
                        Soci&eacute;t&eacute; Iaco, SAS au capital de 1&nbsp;000&nbsp;&euro;<br />
                        Si&egrave;ge social : 3 rue Paul Vaillant Couturier, Saint Cyr l&apos;Ecole, 78210, France<br />
                        Num&eacute;ro RCS : 999204803<br />
                        Directeur de la publication : JOLIVET Elo&iuml;se<br />
                        Contact : <a href="mailto:contact@iaco.app">contact@iaco.app</a><br />
                        Nom de domaine : iaco.app
                    </p>
                    <p>
                        <strong>H&eacute;bergeur :</strong><br />
                        Site.fr DirectAdmin
                    </p>

                    <h2>3. Description du service</h2>
                    <p>
                        Iaco propose un programme num&eacute;rique intitul&eacute; &laquo;&nbsp;Challenge 14 jours&nbsp;&raquo;, ayant pour finalit&eacute; de fournir des contenus &eacute;ducatifs, p&eacute;dagogiques et interactifs sur le th&egrave;me des cryptomonnaies. Ce programme comprend notamment :
                    </p>
                    <ul>
                        <li>des modules de formation (textes, vid&eacute;os, quiz) sur la compr&eacute;hension du fonctionnement des cryptomonnaies et de la blockchain ;</li>
                        <li>un assistant conversationnel intelligent (IA) &agrave; vis&eacute;e &eacute;ducative, accessible 24h/24 ;</li>
                        <li>des outils de suivi de portefeuille et de configuration d&apos;alertes (sans transaction) ;</li>
                        <li>un espace utilisateur personnel permettant de suivre la progression et les r&eacute;sultats du challenge.</li>
                    </ul>
                    <p>
                        Le service ne permet pas l&apos;achat, la vente ni l&apos;&eacute;change de cryptoactifs. Il s&apos;agit d&apos;un outil &eacute;ducatif et informatif, sans gestion de fonds, ni conseil en investissement.
                    </p>

                    <h2>4. Acc&egrave;s au service et cr&eacute;ation de compte</h2>
                    <p>
                        L&apos;acc&egrave;s au Challenge 14 jours est r&eacute;serv&eacute; aux personnes majeures (18 ans ou plus). La cr&eacute;ation d&apos;un compte utilisateur est obligatoire. Elle peut se faire :
                    </p>
                    <ul>
                        <li>soit par l&apos;interm&eacute;diaire d&apos;un compte Google ;</li>
                        <li>soit par la cr&eacute;ation d&apos;un compte via une adresse email valide et la d&eacute;finition d&apos;un mot de passe.</li>
                    </ul>
                    <p>
                        Dans le cas d&apos;une inscription par adresse email, l&apos;activation du compte est subordonn&eacute;e &agrave; une proc&eacute;dure de v&eacute;rification. Un lien de confirmation est envoy&eacute; &agrave; l&apos;adresse email renseign&eacute;e. Le compte ne devient pleinement actif qu&apos;apr&egrave;s validation de ce lien par l&apos;utilisateur.
                    </p>
                    <p>
                        L&apos;utilisateur s&apos;engage &agrave; fournir des informations exactes et &agrave; maintenir leur mise &agrave; jour. L&apos;utilisateur est seul responsable du maintien de la confidentialit&eacute; de ses identifiants. Toute connexion r&eacute;alis&eacute;e &agrave; l&apos;aide de ses identifiants est r&eacute;put&eacute;e effectu&eacute;e par lui.
                    </p>
                    <p>
                        Iaco se r&eacute;serve le droit de suspendre ou de supprimer tout compte en cas d&apos;usage frauduleux, non conforme ou contraire aux pr&eacute;sentes CGU.
                    </p>

                    <h2>5. Conditions financi&egrave;res</h2>
                    <p>
                        Le programme &laquo;&nbsp;Challenge 14 jours&nbsp;&raquo; est propos&eacute; au prix de 19&nbsp;&euro; TTC, payable en ligne par carte bancaire via le prestataire de paiement s&eacute;curis&eacute; Stripe. Une facture &eacute;lectronique est automatiquement transmise &agrave; l&apos;utilisateur apr&egrave;s chaque paiement.
                    </p>
                    <p>
                        <strong>Ex&eacute;cution imm&eacute;diate du service et renonciation au droit de r&eacute;tractation</strong><br />
                        Conform&eacute;ment &agrave; l&apos;article L221-28, 13&deg; du Code de la consommation, le service num&eacute;rique commence d&egrave;s la confirmation du paiement. L&apos;utilisateur reconna&icirc;t et accepte express&eacute;ment renoncer &agrave; son droit de r&eacute;tractation de 14 jours d&egrave;s l&apos;acc&egrave;s au service.
                    </p>

                    <h2>6. Conditions de remboursement sp&eacute;cifiques</h2>
                    <p>Les conditions de remboursement sont pr&eacute;cis&eacute;es en Annexe 1 : Challenge 14 jours.</p>

                    <h2>7. Utilisation du service</h2>
                    <p>
                        L&apos;utilisateur s&apos;engage &agrave; utiliser le service de mani&egrave;re conforme &agrave; la loi, &agrave; l&apos;ordre public et aux pr&eacute;sentes CGU. Sont strictement interdits :
                    </p>
                    <ul>
                        <li>tout usage &agrave; des fins ill&eacute;gales, frauduleuses ou contraires &agrave; la r&eacute;glementation financi&egrave;re ;</li>
                        <li>toute tentative d&apos;acc&egrave;s non autoris&eacute; au syst&egrave;me, au code ou aux donn&eacute;es d&apos;autres utilisateurs ;</li>
                        <li>la copie, reproduction ou exploitation du code source, de l&apos;interface, des contenus ou de l&apos;IA sans autorisation &eacute;crite ;</li>
                        <li>l&apos;usage du service pour manipuler des march&eacute;s ou diffuser des informations trompeuses ;</li>
                        <li>la revente ou redistribution du service.</li>
                    </ul>
                    <p>
                        Tout manquement autorise Iaco &agrave; suspendre imm&eacute;diatement l&apos;acc&egrave;s de l&apos;utilisateur sans indemnit&eacute;.
                    </p>

                    <h2>8. Propri&eacute;t&eacute; intellectuelle</h2>
                    <p>
                        Tous les &eacute;l&eacute;ments du site et du service (textes, graphismes, logos, bases de donn&eacute;es, modules p&eacute;dagogiques, IA, code source, etc.) sont la propri&eacute;t&eacute; exclusive de Iaco. Toute reproduction, repr&eacute;sentation ou exploitation, totale ou partielle, sans autorisation &eacute;crite, est interdite.
                    </p>

                    <h2>9. Responsabilit&eacute; et nature &eacute;ducative du service</h2>
                    <p>
                        Le service Iaco est fourni &laquo;&nbsp;en l&apos;&eacute;tat&nbsp;&raquo;, &agrave; des fins strictement &eacute;ducatives. Les informations, r&eacute;ponses ou contenus produits par l&apos;intelligence artificielle ne constituent ni des conseils financiers, ni des recommandations d&apos;investissement, ni une incitation &agrave; acheter ou vendre des cryptoactifs.
                    </p>
                    <p>
                        L&apos;utilisateur reste seul responsable de ses d&eacute;cisions et reconna&icirc;t que toute op&eacute;ration r&eacute;elle sur le march&eacute; des cryptoactifs comporte des risques.
                    </p>
                    <p>Iaco ne pourra &ecirc;tre tenue responsable :</p>
                    <ul>
                        <li>des pertes, erreurs ou dommages r&eacute;sultant de l&apos;utilisation du service ;</li>
                        <li>des interruptions ou d&eacute;faillances techniques ;</li>
                        <li>des donn&eacute;es ou services tiers (notamment via API externes).</li>
                    </ul>
                    <p>
                        <strong>Clause de non-affiliation</strong><br />
                        Iaco n&apos;est affili&eacute;e &agrave; aucune plateforme d&apos;&eacute;change (Binance, Coinbase, Kraken, etc.). Toute connexion API &eacute;ventuelle se fait uniquement en lecture, sous la responsabilit&eacute; de l&apos;utilisateur.
                    </p>

                    <h2>10. Donn&eacute;es personnelles et confidentialit&eacute; (r&eacute;sum&eacute; RGPD)</h2>
                    <p>
                        Iaco collecte et traite uniquement les donn&eacute;es n&eacute;cessaires &agrave; la cr&eacute;ation du compte, au suivi du challenge et &agrave; l&apos;am&eacute;lioration du service :
                    </p>
                    <ul>
                        <li>pr&eacute;nom ou pseudonyme, adresse e-mail, progression, r&eacute;sultats aux quiz, &eacute;changes dans le chat (sans conservation nominative).</li>
                    </ul>
                    <p>
                        Les messages &eacute;chang&eacute;s avec l&apos;IA peuvent &ecirc;tre enregistr&eacute;s de mani&egrave;re anonymis&eacute;e et agr&eacute;g&eacute;e pour am&eacute;liorer les fonctionnalit&eacute;s du service, sans possibilit&eacute; d&apos;identifier un utilisateur.
                    </p>
                    <p>
                        Les donn&eacute;es sont conserv&eacute;es 3 ans maximum apr&egrave;s la derni&egrave;re activit&eacute; du compte, puis supprim&eacute;es.
                    </p>
                    <p>
                        Conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es (UE 2016/679), l&apos;utilisateur dispose des droits d&apos;acc&egrave;s, de rectification, d&apos;effacement, de limitation, de portabilit&eacute; et d&apos;opposition. Toute demande peut &ecirc;tre adress&eacute;e &agrave; <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>
                    <p>Les informations compl&egrave;tes figurent dans la Politique de confidentialit&eacute; disponible sur le site.</p>

                    <h2>11. Force majeure</h2>
                    <p>
                        Aucune des parties ne pourra &ecirc;tre tenue responsable en cas de non-ex&eacute;cution due &agrave; un &eacute;v&eacute;nement de force majeure au sens de l&apos;article 1218 du Code civil (catastrophes naturelles, pannes de r&eacute;seau, guerre, pand&eacute;mie, etc.).
                    </p>

                    <h2>12. Modification des CGU</h2>
                    <p>
                        Iaco peut modifier les pr&eacute;sentes CGU &agrave; tout moment. L&apos;utilisateur sera inform&eacute; de toute mise &agrave; jour substantielle par notification ou publication sur le site. L&apos;utilisation continue du service apr&egrave;s modification vaut acceptation des nouvelles conditions.
                    </p>

                    <h2>13. Preuve, archivage et signature &eacute;lectronique</h2>
                    <p>
                        L&apos;acceptation des pr&eacute;sentes CGU est mat&eacute;rialis&eacute;e par une case &agrave; cocher avant la cr&eacute;ation du compte. Iaco conserve la preuve de cette acceptation (date, adresse IP, version des CGU). Cette conservation vaut signature &eacute;lectronique au sens de l&apos;article 1366 du Code civil.
                    </p>
                    <p>
                        Les donn&eacute;es et journaux de progression du compte font foi entre les parties en cas de litige.
                    </p>

                    <h2>14. Droit applicable et juridiction</h2>
                    <p>
                        Les pr&eacute;sentes CGU sont r&eacute;gies par le droit fran&ccedil;ais. En cas de litige, les tribunaux comp&eacute;tents seront ceux du ressort du si&egrave;ge social de Iaco. En cas de divergence entre versions linguistiques, la version fran&ccedil;aise pr&eacute;vaut.
                    </p>

                    <h2>Annexe 1 &ndash; Challenge 14 jours</h2>

                    <h3>A. Pr&eacute;sentation</h3>
                    <p>
                        Le &laquo;&nbsp;Challenge 14 jours&nbsp;&raquo; est un programme d&apos;accompagnement &eacute;ducatif propos&eacute; par Iaco. Il vise &agrave; permettre aux participants de :
                    </p>
                    <ul>
                        <li>comprendre les bases des cryptomonnaies et de la s&eacute;curit&eacute; num&eacute;rique,</li>
                        <li>savoir configurer des alertes et suivre leur portefeuille de mani&egrave;re autonome,</li>
                        <li>reconna&icirc;tre les signes d&apos;arnaques et adopter les bons r&eacute;flexes.</li>
                    </ul>

                    <h3>B. Conditions de remboursement (&laquo;&nbsp;Garantie r&eacute;ussite&nbsp;&raquo;)</h3>
                    <p>
                        Un utilisateur peut demander le remboursement int&eacute;gral de son inscription s&apos;il remplit l&apos;ensemble des conditions suivantes :
                    </p>
                    <ol>
                        <li>Avoir termin&eacute; au moins 90&nbsp;% du programme ;</li>
                        <li>Avoir obtenu au moins 80&nbsp;% de bonnes r&eacute;ponses au quiz final ;</li>
                        <li>Avoir activ&eacute; deux alertes ;</li>
                        <li>Avoir adress&eacute; une demande de remboursement dans les 7 jours suivant la fin du programme &agrave; l&apos;adresse : <a href="mailto:contact@iaco.app">contact@iaco.app</a>.</li>
                    </ol>
                    <p>
                        Iaco proc&egrave;de au remboursement dans un d&eacute;lai maximum de 14 jours, sur le m&ecirc;me moyen de paiement que celui utilis&eacute; initialement. Aucun autre remboursement ne sera effectu&eacute;, sauf d&eacute;faillance technique imputable &agrave; Iaco.
                    </p>

                    <h3>C. V&eacute;rification et preuve</h3>
                    <p>
                        La progression, les quiz et les donn&eacute;es du compte utilisateur enregistr&eacute;s sur le site font pleinement foi. L&apos;utilisateur accepte que ces donn&eacute;es constituent la preuve exclusive de son avancement et de son &eacute;ligibilit&eacute; au remboursement.
                    </p>

                    <h3>D. Nature du programme</h3>
                    <p>
                        Le Challenge 14 jours ne propose aucun placement, achat, ni vente r&eacute;elle. Il s&apos;agit d&apos;une exp&eacute;rience d&apos;apprentissage permettant de recevoir des alertes &eacute;ducatives.
                    </p>

                    <h3>E. Certification</h3>
                    <p>
                        &Agrave; la fin du programme, un certificat num&eacute;rique &laquo;&nbsp;Crypto 14 Jours&nbsp;&raquo; peut &ecirc;tre d&eacute;livr&eacute; &agrave; titre symbolique. Ce document n&apos;a pas de valeur acad&eacute;mique ou professionnelle officielle.
                    </p>

                    <h3>F. R&eacute;siliation et suppression du compte</h3>
                    <p>
                        L&apos;utilisateur peut &agrave; tout moment supprimer son compte via son espace personnel ou sur simple demande &agrave; <a href="mailto:contact@iaco.app">contact@iaco.app</a>. La suppression entra&icirc;ne l&apos;effacement d&eacute;finitif des donn&eacute;es li&eacute;es au compte.
                    </p>

                    <h3>G. Service client</h3>
                    <p>
                        Pour toute question, r&eacute;clamation ou demande li&eacute;e au programme, l&apos;utilisateur peut contacter : <a href="mailto:contact@iaco.app">contact@iaco.app</a>
                    </p>

                    <p className="!text-sm !text-muted-foreground/70 mt-8">
                        Fait pour : Iaco soci&eacute;t&eacute; par actions simplifi&eacute;e.<br />
                        Les pr&eacute;sentes CGU entrent en vigueur &agrave; compter du lancement officiel du site.
                    </p>

                    <hr />

                    {/* ========== ENGLISH ========== */}
                    <h1>General Terms of Use and Sale</h1>
                    <p className="!text-foreground !text-base font-medium">
                        for the Iaco &ndash; 14-Day Challenge service
                    </p>
                    <p className="!text-sm">
                        Last update: February 20, 2026<br />
                        Effective as of the official launch of the website.
                    </p>

                    <h2>1. Purpose</h2>
                    <p>
                        These General Terms of Use and Sale (hereinafter the &ldquo;Terms&rdquo;) aim to define the conditions and modalities of access, use, and sale of the service offered by the company Iaco, a simplified joint-stock company (soci&eacute;t&eacute; par actions simplifi&eacute;e &ndash; SAS) registered in France, whose registered office is located at 3 rue Paul Vaillant Couturier, 78210 Saint Cyr l&apos;Ecole, France, and reachable at the email address <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>
                    <p>
                        The service, accessible via the website <a href="https://iaco.app">https://iaco.app</a>, allows users to participate in the &ldquo;14-Day Challenge&rdquo;, an online learning program designed to support beginners in understanding and securing their activities related to cryptocurrencies.
                    </p>
                    <p>
                        Any use of the service implies full and unconditional acceptance of these Terms. If the user does not accept these conditions, they must immediately cease all use of the service.
                    </p>

                    <h2>2. Legal notice</h2>
                    <p>
                        <strong>Website publisher:</strong><br />
                        Company Iaco, SAS with a share capital of &euro;1,000<br />
                        Registered office: 3 rue Paul Vaillant Couturier, Saint Cyr l&apos;Ecole, 78210, France<br />
                        RCS number: 999204803<br />
                        Director of publication: JOLIVET Elo&iuml;se<br />
                        Contact: <a href="mailto:contact@iaco.app">contact@iaco.app</a><br />
                        Domain name: iaco.app
                    </p>
                    <p>
                        <strong>Hosting provider:</strong><br />
                        Site.fr DirectAdmin
                    </p>

                    <h2>3. Description of the service</h2>
                    <p>
                        Iaco offers a digital program entitled &ldquo;14-Day Challenge&rdquo;, whose purpose is to provide educational, pedagogical, and interactive content on the topic of cryptocurrencies. This program notably includes:
                    </p>
                    <ul>
                        <li>training modules (texts, videos, quizzes) on understanding how cryptocurrencies and blockchain work;</li>
                        <li>an intelligent conversational assistant (AI) for educational purposes, accessible 24/7;</li>
                        <li>tools and alert configuration (no transactions);</li>
                        <li>a personal user space allowing users to track their progress and challenge results.</li>
                    </ul>
                    <p>
                        The service does not allow the purchase, sale, or exchange of crypto-assets. It is an educational and informational tool, with no fund management and no investment advice.
                    </p>

                    <h2>4. Access to the service and account creation</h2>
                    <p>
                        Access to the 14-Day Challenge is reserved for adults (18 years or older). The creation of a user account is mandatory. It may be completed:
                    </p>
                    <ul>
                        <li>either through a Google account;</li>
                        <li>or by creating an account using a valid email address and setting a password.</li>
                    </ul>
                    <p>
                        In the case of registration via email address, account activation is subject to a verification procedure. A confirmation link is sent to the email address provided. The account becomes fully active only after the user validates this link.
                    </p>
                    <p>
                        The user undertakes to provide accurate information and to keep it up to date. The user is solely responsible for maintaining the confidentiality of their login credentials. Any connection made using their credentials is deemed to have been carried out by them.
                    </p>
                    <p>
                        Iaco reserves the right to suspend or delete any account in the event of fraudulent use, non-compliant use, or use contrary to these Terms.
                    </p>

                    <h2>5. Financial conditions</h2>
                    <p>
                        The &ldquo;14-Day Challenge&rdquo; program is offered at a fixed price of &euro;19 including VAT, payable online by credit card via the secure payment provider Stripe. An electronic invoice is automatically sent to the user after each payment.
                    </p>
                    <p>
                        <strong>Immediate execution of the service and waiver of the right of withdrawal</strong><br />
                        In accordance with Article L221-28, 13&deg; of the French Consumer Code, the digital service begins upon confirmation of payment. The user expressly acknowledges and accepts waiving their 14-day right of withdrawal as soon as access to the service is granted.
                    </p>

                    <h2>6. Specific refund conditions</h2>
                    <p>Refund conditions are detailed in Appendix 1: 14-Day Challenge.</p>

                    <h2>7. Use of the service</h2>
                    <p>
                        The user undertakes to use the service in compliance with the law, public order, and these Terms. The following are strictly prohibited:
                    </p>
                    <ul>
                        <li>any use for illegal, fraudulent purposes or purposes contrary to financial regulations;</li>
                        <li>any attempt at unauthorized access to the system, code, or data of other users;</li>
                        <li>copying, reproducing, or exploiting the source code, interface, content, or AI without written authorization;</li>
                        <li>using the service to manipulate markets or disseminate misleading information;</li>
                        <li>resale or redistribution of the service.</li>
                    </ul>
                    <p>
                        Any breach authorizes Iaco to immediately suspend the user&apos;s access without compensation.
                    </p>

                    <h2>8. Intellectual property</h2>
                    <p>
                        All elements of the website and the service (texts, graphics, logos, databases, educational modules, AI, source code, etc.) are the exclusive property of Iaco. Any reproduction, representation, or exploitation, in whole or in part, without written authorization is prohibited.
                    </p>

                    <h2>9. Liability and educational nature of the service</h2>
                    <p>
                        The Iaco service is provided &ldquo;as is&rdquo; for strictly educational purposes. The information, responses, or content produced by the artificial intelligence do not constitute financial advice, investment recommendations, or an incentive to buy or sell crypto-assets.
                    </p>
                    <p>
                        The user remains solely responsible for their decisions and acknowledges that any real operation on the crypto-asset market involves risks.
                    </p>
                    <p>Iaco cannot be held liable for:</p>
                    <ul>
                        <li>losses, errors, or damages resulting from use of the service;</li>
                        <li>interruptions or technical failures;</li>
                        <li>third-party data or services (notably via external APIs).</li>
                    </ul>
                    <p>
                        <strong>Non-affiliation clause</strong><br />
                        Iaco is not affiliated with any exchange platform (Binance, Coinbase, Kraken, etc.). Any possible API connection is read-only and remains under the user&apos;s responsibility.
                    </p>

                    <h2>10. Personal data and confidentiality (GDPR summary)</h2>
                    <p>
                        Iaco collects and processes only the data necessary for account creation, challenge tracking, and service improvement:
                    </p>
                    <ul>
                        <li>first name or pseudonym, email address, progress, quiz results, chat exchanges (without nominative retention).</li>
                    </ul>
                    <p>
                        Messages exchanged with the AI may be recorded in an anonymized and aggregated manner to improve service functionalities, without any possibility of identifying a user.
                    </p>
                    <p>
                        Data is retained for a maximum of 3 years after the last account activity, then deleted.
                    </p>
                    <p>
                        In accordance with the General Data Protection Regulation (EU 2016/679), the user has the right of access, rectification, erasure, restriction, portability, and objection. Any request may be sent to <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>
                    <p>Full information is available in the Privacy Policy on the website.</p>

                    <h2>11. Force majeure</h2>
                    <p>
                        Neither party may be held liable in the event of non-performance due to a force majeure event within the meaning of Article 1218 of the French Civil Code (natural disasters, network failures, war, pandemic, etc.).
                    </p>

                    <h2>12. Modification of the Terms</h2>
                    <p>
                        Iaco may modify these Terms at any time. Users will be informed of any substantial update by notification or publication on the website. Continued use of the service after modification constitutes acceptance of the new conditions.
                    </p>

                    <h2>13. Proof, archiving, and electronic signature</h2>
                    <p>
                        Acceptance of these Terms is materialized by a checkbox prior to payment. Iaco retains proof of this acceptance (date, IP address, version of the Terms). This retention constitutes an electronic signature within the meaning of Article 1366 of the French Civil Code.
                    </p>
                    <p>
                        Account data and progress logs constitute proof between the parties in the event of a dispute.
                    </p>

                    <h2>14. Governing law and jurisdiction</h2>
                    <p>
                        These Terms are governed by French law. In the event of a dispute, the competent courts shall be those within the jurisdiction of Iaco&apos;s registered office. In the event of discrepancies between language versions, the French version shall prevail.
                    </p>

                    <h2>Appendix 1 &ndash; 14-Day Challenge</h2>

                    <h3>A. Presentation</h3>
                    <p>
                        The &ldquo;14-Day Challenge&rdquo; is an educational support program offered by Iaco. It aims to enable participants to:
                    </p>
                    <ul>
                        <li>understand the basics of cryptocurrencies and digital security;</li>
                        <li>know how to configure alerts and track their portfolio autonomously;</li>
                        <li>recognize scam signals and adopt best practices.</li>
                    </ul>

                    <h3>B. Refund conditions (&ldquo;Success guarantee&rdquo;)</h3>
                    <p>
                        A user may request a full refund of their registration if they meet all of the following conditions:
                    </p>
                    <ol>
                        <li>Have completed at least 90% of the program;</li>
                        <li>Have obtained at least 80% correct answers on the final quiz;</li>
                        <li>Have activated two alerts;</li>
                        <li>Have submitted a refund request within 7 days following the end of the program to: <a href="mailto:contact@iaco.app">contact@iaco.app</a>.</li>
                    </ol>
                    <p>
                        Iaco will process the refund within a maximum of 14 days, using the same payment method initially used. No other refund will be issued, except in the case of technical failure attributable to Iaco.
                    </p>

                    <h3>C. Verification and proof</h3>
                    <p>
                        Progress, quizzes, and user account data recorded on the website constitute full proof. The user accepts that these data constitute exclusive proof of their progress and refund eligibility.
                    </p>

                    <h3>D. Nature of the program</h3>
                    <p>
                        The 14-Day Challenge offers no real investment, purchase, or sale. It is a learning experience designed to simulate tracking and provide educational alerts.
                    </p>

                    <h3>E. Certification</h3>
                    <p>
                        At the end of the program, a digital &ldquo;Crypto 14 Days&rdquo; certificate may be issued for symbolic purposes. This document has no official academic or professional value.
                    </p>

                    <h3>F. Termination and account deletion</h3>
                    <p>
                        The user may delete their account at any time via their personal space or by simple request to <a href="mailto:contact@iaco.app">contact@iaco.app</a>. Deletion results in the permanent erasure of all account-related data.
                    </p>

                    <h3>G. Customer support</h3>
                    <p>
                        For any question, complaint, or request related to the program, the user may contact: <a href="mailto:contact@iaco.app">contact@iaco.app</a>
                    </p>

                    <p className="!text-sm !text-muted-foreground/70 mt-8">
                        Prepared for: Iaco simplified joint-stock company.<br />
                        These Terms enter into force as of the official launch of the website.
                    </p>
                </article>
            </div>
        </main>
    );
}
