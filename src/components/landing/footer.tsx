'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faRedditAlien, faYoutube, faDiscord, faFacebookF, faTwitter, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');

  return (
    <footer className="border-t bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="IACO Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-clip-text text-primary">
                IACO
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-sm">
              {t('description')}
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faLinkedinIn} className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Reddit" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faRedditAlien} className="w-4 h-4" />
              </a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faYoutube} className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Discord" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faDiscord} className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center">
                <FontAwesomeIcon icon={faFacebookF} className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@iaco.app"
                aria-label="Email"
                className="w-9 h-9 rounded-lg border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">{t('product')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('features')}
                </Link>
              </li>
              <li>
                <Link
                  href="#refund"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('livePrices')}
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {tCommon('getStarted')}
                </Link>
              </li>
              <li>
                <Link
                  href="#who-we-are"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t('resources')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('documentation')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('learningCenter')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('apiReference')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('community')}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('legal')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('privacyPolicy')}
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('termsOfService')}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('cookiePolicy')}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('disclaimer')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              {t('copyright', { year: currentYear })}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>⚠️</span>
              <p className="max-w-md text-center md:text-right">
                {t('educationalNotice')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
