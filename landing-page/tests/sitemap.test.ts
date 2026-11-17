import { describe, expect, it } from "vitest";
import { languages } from "@/config/languages";
import { legalPages, localeUrl, siteUrl, supportPagePath } from "@/config/site";
import sitemap, { dynamic } from "@/app/sitemap";
import { routing } from "@/i18n/routing";

const locales = languages.map(({ code }) => code);
const subPages = [...Object.values(legalPages).map(({ path }) => path), supportPagePath];
const entries = sitemap();

describe("sitemap", () => {
  it("is generated at build time (required by the static export)", () => {
    expect(dynamic).toBe("force-static");
  });

  it("lists every page in every locale exactly once", () => {
    const expected = ["", ...subPages].flatMap((path) => locales.map((locale) => localeUrl(locale, path)));
    const urls = entries.map(({ url }) => url);
    expect(new Set(urls).size).toBe(urls.length);
    expect([...urls].sort()).toEqual([...expected].sort());
  });

  it("uses https URLs on the site origin and never the /en duplicate of the root", () => {
    for (const { url } of entries) {
      const parsed = new URL(url);
      expect(parsed.protocol).toBe("https:");
      expect(parsed.origin).toBe(new URL(siteUrl).origin);
      expect(parsed.pathname).not.toMatch(new RegExp(`^/${routing.defaultLocale}(/|$)`));
    }
  });

  it("links each entry to its translations, including itself", () => {
    for (const { url, alternates } of entries) {
      const translations = alternates?.languages as Record<string, string>;
      expect(Object.keys(translations).sort()).toEqual([...locales].sort());
      expect(Object.values(translations)).toContain(url);
    }
  });

  it("ranks the English home page first, other home pages next and sub-pages last", () => {
    const priority = (url: string) => entries.find((entry) => entry.url === url)?.priority;
    expect(priority(localeUrl(routing.defaultLocale))).toBe(1);
    for (const locale of locales.filter((code) => code !== routing.defaultLocale)) {
      expect(priority(localeUrl(locale))).toBe(0.8);
    }
    for (const locale of locales) for (const path of subPages) expect(priority(localeUrl(locale, path))).toBe(0.3);
  });

  it("marks home pages monthly and sub-pages yearly", () => {
    for (const { url, changeFrequency } of entries) {
      const isHome = locales.some((locale) => localeUrl(locale) === url);
      expect(changeFrequency).toBe(isHome ? "monthly" : "yearly");
    }
  });
});
