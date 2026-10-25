import { defaultLanguage } from "./languages";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://social-share-button.aossie.org";

export const siteUrl = rawSiteUrl.replace(/\/$/, "");

/** Injected from ../package.json by next.config.ts. */
export const libraryVersion = process.env.NEXT_PUBLIC_LIBRARY_VERSION || "0.0.0";

/** Gzipped size of the core JS + CSS, computed from ../src by next.config.ts. */
export const libraryGzipKb = Number(process.env.NEXT_PUBLIC_LIBRARY_GZIP_KB || 0);

export const repoUrl = "https://github.com/AOSSIE-Org/SocialShareButton";
export const docsUrl = `${repoUrl}#readme`;
export const npmPackage = "@aossie-org/social-share-button";
export const npmUrl = `https://www.npmjs.com/package/${npmPackage}`;
export const cdnBase = `https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v${libraryVersion}/src`;

/** Library files served by this site (copied from ../src by scripts/sync-library.mjs). */
export const vendorBase = "/vendor/social-share-button";

export const socialLinks = {
  discord: "https://discord.gg/hjUhu33uAn",
  telegram: "https://t.me/StabilityNexus",
  x: "https://x.com/aossie_org",
  linkedin: "https://www.linkedin.com/company/aossie/",
  youtube: "https://www.youtube.com/@AOSSIE-Org",
} as const;

/** The default locale is served at the site root; other locales live under /<locale>. */
export function localeUrl(locale: string) {
  return locale === defaultLanguage ? `${siteUrl}/` : `${siteUrl}/${locale}`;
}
