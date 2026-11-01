import type { Metadata } from 'next';
import { messagesMap, defaultMessages, Messages } from './messages';
import { routing } from './routing';
import { aossieUrl, legalPages, localeUrl, siteUrl, supportPagePath, type LegalPageId } from '@/config/site';

const ogLocales: Record<string, string> = { en: 'en_US', hi: 'hi_IN' };

/** A page below the home page: its path under each locale (e.g. "/privacy") and its own title and description. */
export interface PageMetadata {
  path: string;
  title: string;
  description: string;
}

export async function generateLocaleMetadata(
  locale: string,
  namespace: 'Home' = 'Home',
  page?: PageMetadata
): Promise<Metadata> {
  const messages = (messagesMap[locale] || defaultMessages) as Messages;
  const home = messages[namespace] || defaultMessages.Home;
  const meta = page ? { ...home, metaTitle: page.title, metaDescription: page.description } : home;
  const path = page?.path ?? '';
  const canonical = localeUrl(locale, path);
  const ogImage = `${siteUrl}/brand/og-image.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: meta.metaTitle,
    description: meta.metaDescription,
    keywords: meta.metaKeywords.split(',').map((keyword) => keyword.trim()),
    authors: [{ name: 'AOSSIE', url: aossieUrl }],
    creator: 'AOSSIE',
    publisher: 'AOSSIE',
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/brand/icons/favicon.ico', sizes: 'any' },
        { url: '/brand/icons/social-share-button-mark.svg', type: 'image/svg+xml' },
      ],
      apple: '/brand/icons/apple-icon.png',
    },
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(routing.locales.map((code) => [code, localeUrl(code, path)])),
        'x-default': localeUrl(routing.defaultLocale, path),
      },
    },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: canonical,
      siteName: 'Social Share Button',
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.ogImageAlt }],
      locale: ogLocales[locale] ?? 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@aossie_org',
      title: meta.metaTitle,
      description: meta.metaDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

/** Metadata for a legal page; its title and description come from the `Legal` namespace. */
export async function generateLegalMetadata(locale: string, page: LegalPageId): Promise<Metadata> {
  const { title, description } = ((messagesMap[locale] || defaultMessages) as Messages).Legal[page];
  return generateLocaleMetadata(locale, 'Home', { path: legalPages[page].path, title, description });
}

/** Metadata for the support page; its title and description come from the `Support` namespace. */
export async function generateSupportMetadata(locale: string): Promise<Metadata> {
  const { title, description } = ((messagesMap[locale] || defaultMessages) as Messages).Support;
  return generateLocaleMetadata(locale, 'Home', { path: supportPagePath, title, description });
}
