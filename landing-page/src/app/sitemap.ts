import type { MetadataRoute } from 'next';
import { routing } from '../i18n/routing';
import { localeUrl } from '@/config/site';

export const dynamic = 'force-static';

/**
 * The production domain comes from `NEXT_PUBLIC_SITE_URL` (see src/config/site.ts).
 * The default locale is canonical at the site root, so `/en` is intentionally omitted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((code) => [code, localeUrl(code)]));

  return routing.locales.map((locale) => ({
    url: localeUrl(locale),
    changeFrequency: 'monthly',
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
