import type { MetadataRoute } from 'next';
import { routing } from '../i18n/routing';
import { legalPages, localeUrl, supportPagePath } from '@/config/site';

export const dynamic = 'force-static';

/** Pages under each locale: the home page, the legal documents, then the support page. */
const pages: { path: string; changeFrequency: 'monthly' | 'yearly' }[] = [
  { path: '', changeFrequency: 'monthly' },
  ...Object.values(legalPages).map(({ path }) => ({ path, changeFrequency: 'yearly' as const })),
  { path: supportPagePath, changeFrequency: 'yearly' },
];

/**
 * The production domain comes from `NEXT_PUBLIC_SITE_URL` (see src/config/site.ts).
 * The default locale is canonical at the site root, so `/en` paths are intentionally omitted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, changeFrequency }) => {
    const languages = Object.fromEntries(routing.locales.map((code) => [code, localeUrl(code, path)]));

    return routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      changeFrequency,
      // The home page leads; legal and support pages rank below every home page
      priority: path ? 0.3 : locale === routing.defaultLocale ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
