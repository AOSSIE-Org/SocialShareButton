import type { Metadata } from 'next';
import { messagesMap, defaultMessages, Messages } from './messages';
import { routing } from './routing';
import { localeUrl, siteUrl } from '@/config/site';

const ogLocales: Record<string, string> = { en: 'en_US', hi: 'hi_IN' };

export async function generateLocaleMetadata(
  locale: string,
  namespace: 'Home' = 'Home'
): Promise<Metadata> {
  const messages = (messagesMap[locale] || defaultMessages) as Messages;
  const meta = messages[namespace] || defaultMessages.Home;
  const canonical = localeUrl(locale);
  const ogImage = `${siteUrl}/brand/og-image.png`;

  return {
    metadataBase: new URL(siteUrl),
    title: meta.metaTitle,
    description: meta.metaDescription,
    keywords: meta.metaKeywords.split(',').map((keyword) => keyword.trim()),
    authors: [{ name: 'AOSSIE', url: 'https://aossie.org' }],
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
        ...Object.fromEntries(routing.locales.map((code) => [code, localeUrl(code)])),
        'x-default': localeUrl(routing.defaultLocale),
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
