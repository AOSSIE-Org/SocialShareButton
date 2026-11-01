import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { languages } from "@/config/languages";
import { legalPages, localeUrl, siteUrl, supportPagePath, type LegalPageId } from "@/config/site";
import { messagesMap, type Messages } from "@/i18n/messages";
import {
  generateLegalMetadata,
  generateLocaleMetadata,
  generateSupportMetadata,
} from "@/i18n/metadata";
import { routing } from "@/i18n/routing";

const locales = languages.map(({ code }) => code);
const catalog = (locale: string) => messagesMap[locale] as Messages;

/** The fields these tests read, without Next's wide unions. */
function fields(meta: Metadata) {
  return {
    canonical: meta.alternates?.canonical as string,
    languages: meta.alternates?.languages as Record<string, string>,
    ogUrl: (meta.openGraph as { url?: string }).url,
    ogLocale: (meta.openGraph as { locale?: string }).locale,
    twitterTitle: (meta.twitter as { title?: string }).title,
  };
}

/** hreflang alternates must list every locale plus x-default (the site root, i.e. English). */
function expectAlternates(meta: Metadata, path: string) {
  const { languages: alternates } = fields(meta);
  expect(Object.keys(alternates).sort()).toEqual([...locales, "x-default"].sort());
  for (const code of locales) expect(alternates[code]).toBe(localeUrl(code, path));
  expect(alternates["x-default"]).toBe(localeUrl(routing.defaultLocale, path));
}

describe.each(locales)("home page metadata (%s)", (locale) => {
  it("uses the locale's own canonical URL, title and description", async () => {
    const meta = await generateLocaleMetadata(locale);
    const home = catalog(locale).Home;
    expect(fields(meta).canonical).toBe(localeUrl(locale));
    expect(fields(meta).ogUrl).toBe(localeUrl(locale));
    expect(meta.title).toBe(home.metaTitle);
    expect(meta.description).toBe(home.metaDescription);
    expect(fields(meta).twitterTitle).toBe(home.metaTitle);
    expect(meta.metadataBase?.toString()).toBe(`${siteUrl}/`);
  });

  it("lists every locale as an alternate", async () => {
    expectAlternates(await generateLocaleMetadata(locale), "");
  });

  it("has an Open Graph locale for the language", async () => {
    expect(fields(await generateLocaleMetadata(locale)).ogLocale).toMatch(new RegExp(`^${locale}_[A-Z]{2}$`));
  });

  it("splits the keywords into trimmed, non-empty entries", async () => {
    const keywords = (await generateLocaleMetadata(locale)).keywords as string[];
    expect(keywords.length).toBeGreaterThan(0);
    for (const keyword of keywords) {
      expect(keyword).toBe(keyword.trim());
      expect(keyword).not.toBe("");
    }
  });
});

describe.each(locales)("sub-page metadata (%s)", (locale) => {
  it.each(Object.keys(legalPages) as LegalPageId[])("legal page %s", async (page) => {
    const meta = await generateLegalMetadata(locale, page);
    const path = legalPages[page].path;
    expect(meta.title).toBe(catalog(locale).Legal[page].title);
    expect(meta.description).toBe(catalog(locale).Legal[page].description);
    expect(fields(meta).canonical).toBe(localeUrl(locale, path));
    expect(fields(meta).ogUrl).toBe(localeUrl(locale, path));
    expectAlternates(meta, path);
  });

  it("support page", async () => {
    const meta = await generateSupportMetadata(locale);
    expect(meta.title).toBe(catalog(locale).Support.title);
    expect(meta.description).toBe(catalog(locale).Support.description);
    expect(fields(meta).canonical).toBe(localeUrl(locale, supportPagePath));
    expectAlternates(meta, supportPagePath);
  });
});

describe("unknown locales", () => {
  it("fall back to the English strings and Open Graph locale", async () => {
    const meta = await generateLocaleMetadata("xx");
    expect(meta.title).toBe(catalog("en").Home.metaTitle);
    expect(fields(meta).ogLocale).toBe("en_US");
    expect(fields(meta).canonical).toBe(`${siteUrl}/xx`);
  });

  it("fall back to English legal and support strings", async () => {
    expect((await generateLegalMetadata("xx", "terms")).title).toBe(catalog("en").Legal.terms.title);
    expect((await generateSupportMetadata("xx")).title).toBe(catalog("en").Support.title);
  });

  it("use the English home strings when a catalog lacks them", async () => {
    messagesMap.zz = {};
    try {
      expect((await generateLocaleMetadata("zz")).title).toBe(catalog("en").Home.metaTitle);
    } finally {
      delete messagesMap.zz;
    }
  });
});
