import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";
import { defaultLanguage, languages } from "@/config/languages";
import * as site from "@/config/site";

const { legalPages, localeUrl, siteUrl, supportPagePath } = site;

/** landing-page/, the directory `next build` runs in. */
const projectDir = fileURLToPath(new URL("..", import.meta.url));
const publicFile = (path: string) => fileURLToPath(new URL(`../public${path}`, import.meta.url));

/** Re-imports src/config/site.ts with the given build-time environment. */
async function importSiteWith(env: Record<string, string | undefined>) {
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  vi.resetModules();
  return import("@/config/site");
}

describe("localeUrl", () => {
  it("serves the default locale at the site root", () => {
    expect(localeUrl(defaultLanguage)).toBe(`${siteUrl}/`);
    expect(localeUrl(defaultLanguage, "/privacy")).toBe(`${siteUrl}/privacy`);
  });

  it("prefixes other locales with their code", () => {
    expect(localeUrl("hi")).toBe(`${siteUrl}/hi`);
    expect(localeUrl("hi", "/terms")).toBe(`${siteUrl}/hi/terms`);
  });

  it("builds an absolute URL on the site origin with the page as its path (property)", () => {
    const locale = fc.constantFrom(...languages.map(({ code }) => code));
    const path = fc.array(fc.stringMatching(/^[a-z0-9-]{1,12}$/), { maxLength: 3 }).map((parts) => parts.map((p) => `/${p}`).join(""));
    fc.assert(
      fc.property(locale, path, (code, page) => {
        const url = new URL(localeUrl(code, page));
        expect(url.origin).toBe(new URL(siteUrl).origin);
        const expectedPath = code === defaultLanguage ? page || "/" : `/${code}${page}`;
        expect(url.pathname).toBe(expectedPath);
      }),
    );
  });
});

describe("site pages", () => {
  const pagePaths = [...Object.values(legalPages).map(({ path }) => path), supportPagePath];

  it("uses distinct, root-relative page paths without a trailing slash", () => {
    expect(new Set(pagePaths).size).toBe(pagePaths.length);
    for (const path of pagePaths) expect(path).toMatch(/^\/[a-z0-9-]+$/);
  });

  it("points every legal page at a Markdown file that exists for the build", () => {
    for (const { file } of Object.values(legalPages)) {
      expect(file).toMatch(/\.md$/);
      expect(existsSync(resolve(projectDir, file))).toBe(true);
    }
  });

  it("writes the legal documents in a supported language", () => {
    expect(languages.map(({ code }) => code)).toContain(site.legalDocumentLocale);
  });

  it("references logos and vendor files by root-relative paths that exist in public/", () => {
    for (const path of [site.projectLogoPath, site.aossieLogoPath]) {
      expect(path).toMatch(/^\//);
      expect(existsSync(publicFile(path))).toBe(true);
    }
    expect(site.vendorBase).toMatch(/^\/vendor\//);
  });
});

describe("external links", () => {
  const external = {
    siteUrl,
    repoUrl: site.repoUrl,
    docsUrl: site.docsUrl,
    npmUrl: site.npmUrl,
    cdnBase: site.cdnBase,
    licenseUrl: site.licenseUrl,
    aossieUrl: site.aossieUrl,
    aossieOrganizationId: site.aossieOrganizationId,
    stabilityNexusUrl: site.stabilityNexusUrl,
    githubSponsorsUrl: site.githubSponsorsUrl,
    ...site.socialLinks,
  };

  it.each(Object.entries(external))("%s is an absolute https URL", (_name, url) => {
    expect(new URL(url).protocol).toBe("https:");
  });

  it("derives the npm and docs links from the package and repository", () => {
    expect(site.npmUrl).toBe(`https://www.npmjs.com/package/${site.npmPackage}`);
    expect(site.docsUrl.startsWith(site.repoUrl)).toBe(true);
    expect(site.aossieOrganizationId.startsWith(site.aossieUrl)).toBe(true);
  });
});

describe("build-time environment", () => {
  it("falls back to the production domain, version 0.0.0 and size 0", async () => {
    const fresh = await importSiteWith({
      NEXT_PUBLIC_SITE_URL: undefined,
      NEXT_PUBLIC_LIBRARY_VERSION: undefined,
      NEXT_PUBLIC_LIBRARY_GZIP_KB: undefined,
    });
    expect(fresh.siteUrl).toBe("https://social-share-button.aossie.org");
    expect(fresh.libraryVersion).toBe("0.0.0");
    expect(fresh.libraryGzipKb).toBe(0);
  });

  it("uses NEXT_PUBLIC_SITE_URL without its trailing slash", async () => {
    const fresh = await importSiteWith({ NEXT_PUBLIC_SITE_URL: "https://preview.example.org/" });
    expect(fresh.siteUrl).toBe("https://preview.example.org");
    expect(fresh.localeUrl("hi", "/support")).toBe("https://preview.example.org/hi/support");
  });

  it("pins the CDN to the injected library version and parses the bundle size", async () => {
    const fresh = await importSiteWith({ NEXT_PUBLIC_LIBRARY_VERSION: "1.2.3", NEXT_PUBLIC_LIBRARY_GZIP_KB: "4.5" });
    expect(fresh.libraryVersion).toBe("1.2.3");
    expect(fresh.cdnBase).toBe("https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.2.3/src");
    expect(fresh.libraryGzipKb).toBe(4.5);
  });
});
