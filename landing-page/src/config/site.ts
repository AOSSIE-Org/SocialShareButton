import { defaultLanguage, type Locale } from "./languages";

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
export const licenseUrl = "https://www.gnu.org/licenses/gpl-3.0.html";

/** AOSSIE, the organization behind the project, and its sponsor Stability Nexus. */
export const aossieUrl = "https://aossie.org";
/** JSON-LD `@id` of the AOSSIE Organization node. */
export const aossieOrganizationId = `${aossieUrl}/#organization`;
export const stabilityNexusUrl = "https://stability.nexus";
/** Where readers can sponsor AOSSIE (linked from the support page). */
export const githubSponsorsUrl = "https://github.com/sponsors/AOSSIE-Org";
export const gsocUrl = "https://summerofcode.withgoogle.com";

/**
 * Organizations that support the project, listed on the support page. Names are proper nouns
 * (not translated), and no sponsorship tier is claimed for them.
 */
export const supporters = [
  { name: "Google Summer of Code", link: gsocUrl },
  { name: "Stability Nexus", link: stabilityNexusUrl },
] as const;

/** Logos in public/brand, shown on the support page. */
export const projectLogoPath = "/brand/icons/social-share-button-mark.svg";
export const aossieLogoPath = "/brand/icons/aossie_logo.svg";

/** Library files served by this site (copied from ../src by scripts/sync-library.mjs). */
export const vendorBase = "/vendor/social-share-button";

export const socialLinks = {
  discord: "https://discord.gg/hjUhu33uAn",
  telegram: "https://t.me/StabilityNexus",
  x: "https://x.com/aossie_org",
  linkedin: "https://www.linkedin.com/company/aossie/",
  youtube: "https://www.youtube.com/@AOSSIE-Org",
} as const;

/**
 * Pages that render the repository's legal documents. `path` is the page under each locale;
 * `file` is read at build time relative to landing-page/ (the documents live at the repo root).
 */
export const legalPages = {
  privacy: { path: "/privacy", file: "../PRIVACY.md" },
  terms: { path: "/terms", file: "../TERMS.md" },
} as const;

export type LegalPageId = keyof typeof legalPages;

/** Language the legal documents are written in; other locales show a note above them. */
export const legalDocumentLocale: Locale = "en";

/** The page under each locale that asks readers to support the project and AOSSIE. */
export const supportPagePath = "/support";

/**
 * The default locale is served at the site root; other locales live under /<locale>.
 * `path` is a page below the locale's home, e.g. "/privacy".
 */
export function localeUrl(locale: string, path = "") {
  return locale === defaultLanguage ? `${siteUrl}${path || "/"}` : `${siteUrl}/${locale}${path}`;
}
