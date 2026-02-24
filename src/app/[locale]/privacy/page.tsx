import { BackButton } from '@/components/ui/back-button';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
                <BackButton label={locale === 'fr' ? 'Retour' : 'Back'} />

                <article className="prose prose-invert prose-sm max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:text-muted-foreground [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_ol]:text-muted-foreground [&_ol]:mb-4 [&_ol]:space-y-2 [&_strong]:text-foreground [&_a]:text-primary [&_a]:hover:underline [&_hr]:border-border [&_hr]:my-12 [&_table]:w-full [&_table]:text-muted-foreground [&_table]:mb-4 [&_th]:text-left [&_th]:text-foreground [&_th]:font-semibold [&_th]:p-3 [&_th]:border [&_th]:border-border [&_td]:p-3 [&_td]:border [&_td]:border-border">
                    {/* ========== FRENCH ========== */}
                    <h1>Politique de confidentialit&eacute;</h1>
                    <p className="!text-sm">
                        Derni&egrave;re mise &agrave; jour : 23/02/2026<br />
                        Entr&eacute;e en vigueur : &agrave; compter du lancement officiel du site iaco.app
                    </p>

                    <h2>1. Identit&eacute; du responsable du traitement</h2>
                    <p>
                        Le pr&eacute;sent site et les services associ&eacute;s sont exploit&eacute;s par :
                    </p>
                    <p>
                        <strong>Iaco</strong>, Soci&eacute;t&eacute; par Actions Simplifi&eacute;e (SAS)<br />
                        3 rue Paul Vaillant Couturier, Saint Cyr l&apos;Ecole 78210, France<br />
                        Num&eacute;ro RCS : 999204803<br />
                        Contact : <a href="mailto:contact@iaco.app">contact@iaco.app</a>
                    </p>
                    <p>
                        Iaco agit en qualit&eacute; de responsable du traitement au sens du R&egrave;glement (UE) 2016/679 du 27 avril 2016 (RGPD) et de la loi &laquo;&nbsp;Informatique et Libert&eacute;s&nbsp;&raquo; du 6 janvier 1978 modifi&eacute;e.
                    </p>
                    <p>
                        Aucune d&eacute;signation formelle de D&eacute;l&eacute;gu&eacute; &agrave; la Protection des Donn&eacute;es (DPO) n&apos;a encore &eacute;t&eacute; effectu&eacute;e. Pour toute question relative &agrave; la protection des donn&eacute;es, les utilisateurs peuvent &eacute;crire &agrave; <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>

                    <h2>2. Donn&eacute;es collect&eacute;es</h2>
                    <p>
                        Iaco collecte uniquement les donn&eacute;es strictement n&eacute;cessaires &agrave; la fourniture et &agrave; l&apos;am&eacute;lioration de ses services :
                    </p>

                    <h3>2.1 Donn&eacute;es d&apos;inscription et de compte utilisateur</h3>
                    <ul>
                        <li>Nom, pr&eacute;nom ou pseudonyme</li>
                        <li>Adresse e-mail</li>
                        <li>Mot de passe (chiffr&eacute;)</li>
                    </ul>

                    <h3>2.2 Donn&eacute;es de paiement</h3>
                    <p>
                        Les paiements sont trait&eacute;s par le prestataire agr&eacute;&eacute; Stripe.<br />
                        Iaco ne conserve aucun num&eacute;ro de carte bancaire, cryptogramme ou date d&apos;expiration.
                    </p>
                    <p>Sont uniquement conserv&eacute;es :</p>
                    <ul>
                        <li>les r&eacute;f&eacute;rences de transaction,</li>
                        <li>le montant, la date et le moyen de paiement,</li>
                        <li>la facture correspondante.</li>
                    </ul>

                    <h3>2.3 Donn&eacute;es de communication et d&apos;assistance</h3>
                    <p>
                        Les &eacute;changes par e-mail ou via le formulaire de contact sont conserv&eacute;s le temps n&eacute;cessaire pour r&eacute;pondre &agrave; la demande, puis supprim&eacute;s ou archiv&eacute;s conform&eacute;ment aux obligations l&eacute;gales.
                    </p>

                    <h3>2.4 Donn&eacute;es techniques et de connexion</h3>
                    <ul>
                        <li>Adresse IP, type et version du navigateur, syst&egrave;me d&apos;exploitation, date et heure de connexion, logs de s&eacute;curit&eacute;.</li>
                    </ul>
                    <p>
                        Ces informations sont utilis&eacute;es &agrave; des fins de s&eacute;curit&eacute; et d&apos;am&eacute;lioration du service.
                    </p>

                    <h3>2.5 Donn&eacute;es issues des interactions avec l&apos;intelligence artificielle</h3>
                    <p>
                        Les messages &eacute;chang&eacute;s avec l&apos;assistant conversationnel peuvent &ecirc;tre enregistr&eacute;s :
                    </p>
                    <ul>
                        <li>sous forme identifi&eacute;e pour permettre &agrave; l&apos;utilisateur de retrouver son historique personnel ;</li>
                        <li>sous forme anonymis&eacute;e et agr&eacute;g&eacute;e pour am&eacute;liorer la qualit&eacute; des r&eacute;ponses et le fonctionnement du service.</li>
                    </ul>
                    <p>
                        Iaco ne relie jamais le contenu des conversations &agrave; l&apos;identit&eacute; r&eacute;elle d&apos;un utilisateur dans les traitements internes.
                    </p>

                    <h2>3. Finalit&eacute;s du traitement</h2>
                    <p>Les traitements r&eacute;alis&eacute;s par Iaco ont pour finalit&eacute; :</p>
                    <ol>
                        <li>La cr&eacute;ation, gestion et utilisation du compte utilisateur ;</li>
                        <li>L&apos;acc&egrave;s au programme Challenge 14 jours ;</li>
                        <li>Le suivi de la progression et des r&eacute;sultats ;</li>
                        <li>La gestion des paiements, factures et remboursements ;</li>
                        <li>Le support client et la communication avec les utilisateurs ;</li>
                        <li>L&apos;am&eacute;lioration du service et du fonctionnement de l&apos;intelligence artificielle ;</li>
                        <li>L&apos;envoi d&apos;informations, d&apos;actualit&eacute;s ou d&apos;offres commerciales, uniquement apr&egrave;s consentement explicite ;</li>
                        <li>Le respect des obligations l&eacute;gales et comptables.</li>
                    </ol>

                    <h2>4. Bases l&eacute;gales du traitement</h2>
                    <p>Conform&eacute;ment &agrave; l&apos;article 6 du RGPD :</p>
                    <ul>
                        <li>L&apos;ex&eacute;cution d&apos;un contrat justifie les traitements li&eacute;s &agrave; l&apos;acc&egrave;s au programme et &agrave; la facturation ;</li>
                        <li>Le respect d&apos;obligations l&eacute;gales fonde la conservation comptable ;</li>
                        <li>Le consentement fonde les traitements optionnels (communication marketing, b&ecirc;ta-test, participation &agrave; la communaut&eacute;) ;</li>
                        <li>L&apos;int&eacute;r&ecirc;t l&eacute;gitime fonde les traitements visant &agrave; am&eacute;liorer le service et assurer la s&eacute;curit&eacute;.</li>
                    </ul>

                    <h2>5. Destinataires des donn&eacute;es</h2>
                    <p>Les donn&eacute;es sont exclusivement accessibles :</p>
                    <ul>
                        <li>aux personnels autoris&eacute;s de Iaco ;</li>
                        <li>aux prestataires techniques n&eacute;cessaires au fonctionnement du site :
                            <ul>
                                <li>Site.fr (h&eacute;bergement) ;</li>
                                <li>Stripe (paiement s&eacute;curis&eacute;).</li>
                            </ul>
                        </li>
                    </ul>
                    <p>
                        Ces prestataires sont soumis &agrave; des obligations de confidentialit&eacute; et de s&eacute;curit&eacute; &eacute;quivalentes &agrave; celles de Iaco.
                    </p>
                    <p>
                        Aucune donn&eacute;e n&apos;est vendue, lou&eacute;e ou transmise &agrave; des tiers &agrave; des fins commerciales.
                    </p>

                    <h2>6. H&eacute;bergement et transferts hors de l&apos;Union europ&eacute;enne</h2>
                    <p>
                        Les donn&eacute;es sont h&eacute;berg&eacute;es au sein de l&apos;Union europ&eacute;enne.
                    </p>
                    <p>
                        Certaines op&eacute;rations effectu&eacute;es par nos prestataires techniques peuvent entra&icirc;ner des transferts de donn&eacute;es en dehors de l&apos;Union europ&eacute;enne (notamment vers les &Eacute;tats-Unis).
                    </p>
                    <p>
                        Lorsque de tels transferts ont lieu, Iaco s&apos;assure qu&apos;ils sont encadr&eacute;s par des garanties appropri&eacute;es conform&eacute;ment aux articles 44 et suivants du RGPD, notamment par la mise en place de clauses contractuelles types adopt&eacute;es par la Commission europ&eacute;enne ou par tout autre m&eacute;canisme l&eacute;galement reconnu assurant un niveau de protection ad&eacute;quat.
                    </p>

                    <h2>7. Dur&eacute;e de conservation</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Cat&eacute;gorie de donn&eacute;es</th>
                                <th>Dur&eacute;e maximale de conservation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Compte utilisateur inactif</td>
                                <td>3 ans apr&egrave;s la derni&egrave;re activit&eacute; (ou suppression sur demande)</td>
                            </tr>
                            <tr>
                                <td>Donn&eacute;es de facturation et comptables</td>
                                <td>10 ans (obligation l&eacute;gale)</td>
                            </tr>
                            <tr>
                                <td>Messages du chat IA (anonymis&eacute;s)</td>
                                <td>Dur&eacute;e illimit&eacute;e &agrave; des fins statistiques et d&apos;am&eacute;lioration</td>
                            </tr>
                            <tr>
                                <td>Messages du support client</td>
                                <td>Dur&eacute;e de traitement de la demande + 1 an maximum</td>
                            </tr>
                            <tr>
                                <td>Donn&eacute;es marketing (e-mail / SMS)</td>
                                <td>Jusqu&apos;au retrait du consentement ou 3 ans apr&egrave;s le dernier contact</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>8. Droits des utilisateurs</h2>
                    <p>Conform&eacute;ment au RGPD, tout utilisateur dispose des droits suivants :</p>
                    <ul>
                        <li>Droit d&apos;acc&egrave;s &agrave; ses donn&eacute;es ;</li>
                        <li>Droit de rectification des donn&eacute;es inexactes ;</li>
                        <li>Droit &agrave; l&apos;effacement (&laquo;&nbsp;droit &agrave; l&apos;oubli&nbsp;&raquo;) ;</li>
                        <li>Droit &agrave; la limitation du traitement ;</li>
                        <li>Droit &agrave; la portabilit&eacute; des donn&eacute;es ;</li>
                        <li>Droit d&apos;opposition au traitement de ses donn&eacute;es ;</li>
                        <li>Droit de d&eacute;finir le sort des donn&eacute;es apr&egrave;s d&eacute;c&egrave;s.</li>
                    </ul>
                    <p>
                        Ces droits peuvent &ecirc;tre exerc&eacute;s &agrave; tout moment en &eacute;crivant &agrave; : <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>
                    <p>
                        En cas de d&eacute;saccord non r&eacute;solu, l&apos;utilisateur peut introduire une r&eacute;clamation aupr&egrave;s de la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
                    </p>

                    <h2>9. S&eacute;curit&eacute; des donn&eacute;es</h2>
                    <p>
                        Iaco met en &oelig;uvre des mesures techniques et organisationnelles destin&eacute;es &agrave; prot&eacute;ger les donn&eacute;es contre la perte, l&apos;alt&eacute;ration, la divulgation ou l&apos;acc&egrave;s non autoris&eacute; :
                    </p>
                    <ul>
                        <li>chiffrement des &eacute;changes via HTTPS ;</li>
                        <li>stockage s&eacute;curis&eacute; sur serveurs prot&eacute;g&eacute;s ;</li>
                        <li>contr&ocirc;le d&apos;acc&egrave;s interne restreint ;</li>
                        <li>sauvegardes r&eacute;guli&egrave;res ;</li>
                        <li>pseudonymisation et anonymisation des donn&eacute;es analytiques.</li>
                    </ul>

                    <h2>10. Communications marketing</h2>
                    <p>
                        Sous r&eacute;serve du consentement de l&apos;utilisateur, Iaco peut lui adresser par e-mail ou SMS des informations, actualit&eacute;s ou offres promotionnelles.
                    </p>
                    <p>L&apos;utilisateur peut retirer son consentement &agrave; tout moment :</p>
                    <ul>
                        <li>via le lien de d&eacute;sinscription figurant dans chaque e-mail ;</li>
                        <li>ou en &eacute;crivant &agrave; <a href="mailto:contact@iaco.app">contact@iaco.app</a>.</li>
                    </ul>

                    <h2>11. Donn&eacute;es relatives aux mineurs</h2>
                    <p>
                        Le service Iaco &ndash; Challenge 14 jours est strictement r&eacute;serv&eacute; aux personnes majeures (18 ans et plus).
                    </p>
                    <p>
                        Aucune donn&eacute;e personnelle de mineur n&apos;est collect&eacute;e sciemment.
                    </p>

                    <h2>12. Modifications de la politique</h2>
                    <p>
                        Iaco peut modifier la pr&eacute;sente politique de confidentialit&eacute; &agrave; tout moment.
                    </p>
                    <p>
                        Les utilisateurs seront inform&eacute;s de toute mise &agrave; jour substantielle par notification ou publication sur le site.
                    </p>
                    <p>
                        L&apos;utilisation continue du service apr&egrave;s modification vaut acceptation de la nouvelle politique.
                    </p>

                    <h2>13. Version linguistique</h2>
                    <p>
                        La pr&eacute;sente politique est r&eacute;dig&eacute;e en fran&ccedil;ais.
                    </p>
                    <p>
                        En cas de traduction, la version fran&ccedil;aise pr&eacute;vaut en cas de divergence d&apos;interpr&eacute;tation.
                    </p>

                    <hr />

                    {/* ========== ENGLISH ========== */}
                    <h1>Privacy Policy</h1>
                    <p className="!text-sm">
                        Last update: 23/02/2026<br />
                        Effective date: as of the official launch of the iaco.app website
                    </p>

                    <h2>1. Identity of the data controller</h2>
                    <p>
                        This website and the associated services are operated by:
                    </p>
                    <p>
                        <strong>Iaco</strong>, Simplified Joint-Stock Company (SAS)<br />
                        3 rue Paul Vaillant Couturier, Saint Cyr l&apos;Ecole 78210, France<br />
                        RCS number: 999204803<br />
                        Contact: <a href="mailto:contact@iaco.app">contact@iaco.app</a>
                    </p>
                    <p>
                        Iaco acts as the data controller within the meaning of Regulation (EU) 2016/679 of 27 April 2016 (GDPR) and the amended French Data Protection Act (&ldquo;Informatique et Libert&eacute;s&rdquo;) of 6 January 1978.
                    </p>
                    <p>
                        No formal appointment of a Data Protection Officer (DPO) has yet been made. For any questions relating to data protection, users may contact: <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>

                    <h2>2. Data collected</h2>
                    <p>
                        Iaco collects only the data strictly necessary for the provision and improvement of its services.
                    </p>

                    <h3>2.1 Registration and user account data</h3>
                    <ul>
                        <li>Last name, first name, or pseudonym</li>
                        <li>Email address</li>
                        <li>Password (encrypted)</li>
                    </ul>

                    <h3>2.2 Payment data</h3>
                    <p>
                        Payments are processed by the approved provider Stripe.<br />
                        Iaco does not store any credit card number, security code, or expiration date.
                    </p>
                    <p>Only the following are retained:</p>
                    <ul>
                        <li>transaction references;</li>
                        <li>amount, date, and payment method;</li>
                        <li>the corresponding invoice.</li>
                    </ul>

                    <h3>2.3 Communication and support data</h3>
                    <p>
                        Email exchanges or communications via the contact form are retained for the time necessary to respond to the request, then deleted or archived in accordance with legal obligations.
                    </p>

                    <h3>2.4 Technical and connection data</h3>
                    <ul>
                        <li>IP address, browser type and version, operating system, date and time of connection, security logs.</li>
                    </ul>
                    <p>
                        This information is used for security purposes and service improvement.
                    </p>

                    <h3>2.5 Data resulting from interactions with artificial intelligence</h3>
                    <p>
                        Messages exchanged with the conversational assistant may be recorded:
                    </p>
                    <ul>
                        <li>in an identified form to allow the user to retrieve their personal history;</li>
                        <li>in an anonymized and aggregated form to improve response quality and service performance.</li>
                    </ul>
                    <p>
                        Iaco never links the content of conversations to a user&apos;s real identity in internal processing.
                    </p>

                    <h2>3. Purposes of processing</h2>
                    <p>Data processing carried out by Iaco serves the following purposes:</p>
                    <ol>
                        <li>Creation, management, and use of the user account;</li>
                        <li>Access to the 14-Day Challenge program;</li>
                        <li>Monitoring progress and results;</li>
                        <li>Management of payments, invoices, and refunds;</li>
                        <li>Customer support and communication with users (including beta testers);</li>
                        <li>Service improvement and enhancement of the artificial intelligence;</li>
                        <li>Sending information, news, or commercial offers, only after explicit consent;</li>
                        <li>Compliance with legal and accounting obligations.</li>
                    </ol>

                    <h2>4. Legal bases for processing</h2>
                    <p>In accordance with Article 6 of the GDPR:</p>
                    <ul>
                        <li>Performance of a contract justifies processing related to program access and billing;</li>
                        <li>Compliance with legal obligations justifies accounting data retention;</li>
                        <li>Consent forms the basis for optional processing (marketing communications, beta testing, community participation);</li>
                        <li>Legitimate interest justifies processing aimed at improving the service and ensuring security.</li>
                    </ul>

                    <h2>5. Data recipients</h2>
                    <p>Data is exclusively accessible to:</p>
                    <ul>
                        <li>authorized personnel of Iaco;</li>
                        <li>technical service providers necessary for website operation:
                            <ul>
                                <li>Site.fr (hosting);</li>
                                <li>Stripe (secure payment).</li>
                            </ul>
                        </li>
                    </ul>
                    <p>
                        These providers are subject to confidentiality and security obligations equivalent to those of Iaco.
                    </p>
                    <p>
                        No data is sold, rented, or transferred to third parties for commercial purposes.
                    </p>

                    <h2>6. Hosting and transfers outside the European Union</h2>
                    <p>
                        Data is hosted within the European Union.
                    </p>
                    <p>
                        Certain processing operations carried out by our technical service providers may involve transfers of personal data outside the European Union (notably to the United States).
                    </p>
                    <p>
                        Where such transfers occur, Iaco ensures that they are governed by appropriate safeguards in accordance with Articles 44 et seq. of the GDPR, including the implementation of Standard Contractual Clauses adopted by the European Commission or any other legally recognized mechanism ensuring an adequate level of protection.
                    </p>

                    <h2>7. Data retention periods</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Data category</th>
                                <th>Maximum retention period</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Inactive user account</td>
                                <td>3 years after last activity (or deletion upon request)</td>
                            </tr>
                            <tr>
                                <td>Billing and accounting data</td>
                                <td>10 years (legal obligation)</td>
                            </tr>
                            <tr>
                                <td>AI chat messages (anonymized)</td>
                                <td>Unlimited duration for statistical and improvement purposes</td>
                            </tr>
                            <tr>
                                <td>Customer support messages</td>
                                <td>Duration of request processing + maximum 1 year</td>
                            </tr>
                            <tr>
                                <td>Marketing data (email / SMS)</td>
                                <td>Until consent withdrawal or 3 years after last contact</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>8. User rights</h2>
                    <p>In accordance with the GDPR, each user has the following rights:</p>
                    <ul>
                        <li>Right of access to their data;</li>
                        <li>Right to rectification of inaccurate data;</li>
                        <li>Right to erasure (&ldquo;right to be forgotten&rdquo;);</li>
                        <li>Right to restriction of processing;</li>
                        <li>Right to data portability;</li>
                        <li>Right to object to processing;</li>
                        <li>Right to define the fate of data after death.</li>
                    </ul>
                    <p>
                        These rights may be exercised at any time by writing to: <a href="mailto:contact@iaco.app">contact@iaco.app</a>.
                    </p>
                    <p>
                        In the event of an unresolved dispute, the user may file a complaint with the CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
                    </p>

                    <h2>9. Data security</h2>
                    <p>
                        Iaco implements technical and organizational measures to protect data against loss, alteration, disclosure, or unauthorized access:
                    </p>
                    <ul>
                        <li>encryption of exchanges via HTTPS;</li>
                        <li>secure storage on protected servers;</li>
                        <li>restricted internal access control;</li>
                        <li>regular backups;</li>
                        <li>pseudonymization and anonymization of analytical data.</li>
                    </ul>

                    <h2>10. Marketing communications</h2>
                    <p>
                        Subject to the user&apos;s consent, Iaco may send information, news, or promotional offers by email or SMS.
                    </p>
                    <p>The user may withdraw consent at any time:</p>
                    <ul>
                        <li>via the unsubscribe link included in each email;</li>
                        <li>or by writing to <a href="mailto:contact@iaco.app">contact@iaco.app</a>.</li>
                    </ul>

                    <h2>11. Data relating to minors</h2>
                    <p>
                        The Iaco &ndash; 14-Day Challenge service is strictly reserved for adults (18 years and older).
                    </p>
                    <p>
                        No personal data of minors is knowingly collected.
                    </p>

                    <h2>12. Policy updates</h2>
                    <p>
                        Iaco may modify this Privacy Policy at any time.
                    </p>
                    <p>
                        Users will be informed of any substantial update by notification or publication on the website.
                    </p>
                    <p>
                        Continued use of the service after modification constitutes acceptance of the new policy.
                    </p>

                    <h2>13. Language version</h2>
                    <p>
                        This policy is drafted in English.
                    </p>
                    <p>
                        In the event of translation, the French version shall prevail in the event of any discrepancy in interpretation.
                    </p>
                </article>
            </div>
        </main>
    );
}
