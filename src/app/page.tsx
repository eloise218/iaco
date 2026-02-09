import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IACO - Redirection...',
  description: 'Redirection vers votre langue préférée',
};

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  // Détecter la langue préférée de l'utilisateur
  let preferredLocale = routing.defaultLocale; // 'en' par défaut

  if (acceptLanguage) {
    // Vérifier si l'utilisateur préfère le français
    if (acceptLanguage.toLowerCase().includes('fr')) {
      preferredLocale = 'fr';
    }
  }

  // Rediriger vers la langue appropriée
  redirect(`/${preferredLocale}`);
}
