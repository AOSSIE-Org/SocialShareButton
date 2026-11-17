// @vitest-environment jsdom
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import fc from "fast-check";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DefaultLocaleLayout, { generateMetadata as defaultLayoutMetadata } from "@/app/(default)/layout";
import RootPage from "@/app/(default)/page";
import RootPrivacyPage, { generateMetadata as rootPrivacyMetadata } from "@/app/(default)/privacy/page";
import RootSupportPage, { generateMetadata as rootSupportMetadata } from "@/app/(default)/support/page";
import RootTermsPage, { generateMetadata as rootTermsMetadata } from "@/app/(default)/terms/page";
import ErrorBoundary from "@/app/[locale]/error";
import LocaleLayout, { dynamicParams, generateMetadata as localeLayoutMetadata, generateStaticParams } from "@/app/[locale]/layout";
import NotFound from "@/app/[locale]/not-found";
import Home from "@/app/[locale]/page";
import PrivacyPage, { generateMetadata as privacyMetadata } from "@/app/[locale]/privacy/page";
import LocaleSupportPage, { generateMetadata as supportMetadata } from "@/app/[locale]/support/page";
import TermsPage, { generateMetadata as termsMetadata } from "@/app/[locale]/terms/page";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { HomePage } from "@/components/site/HomePage";
import { LegalPage } from "@/components/site/LegalPage";
import { PageFrame } from "@/components/site/PageFrame";
import { SiteShell } from "@/components/site/SiteShell";
import { SupportPage } from "@/components/site/SupportPage";
import { faqKeys } from "@/components/sections/MoreSections";
import {
  aossieOrganizationId,
  aossieUrl,
  docsUrl,
  githubSponsorsUrl,
  gsocUrl,
  localeUrl,
  npmUrl,
  repoUrl,
  socialLinks,
  stabilityNexusUrl,
  supporters,
  vendorBase,
} from "@/config/site";
import getRequestConfig from "@/i18n/request";
import { messagesMap } from "@/i18n/messages";
import { REDUCED_MOTION, lenis, locales, media, message, navigation, renderWithIntl, resolveServer, translate, type TestLocale } from "./helpers";

type Props = Record<string, unknown>;
const props = (node: unknown) => (node as ReactElement<Props>).props;
const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

/** Renders a (possibly async) Server Component tree on the client, inside the real catalog. */
async function renderServer(node: ReactElement, locale: TestLocale) {
  return renderWithIntl(await resolveServer(node), locale);
}

describe.each(locales)("Footer (%s)", (locale) => {
  it("links the project, community, socials, legal pages and support page", () => {
    renderWithIntl(<Footer />, locale);
    const footer = screen.getByRole("contentinfo");
    const href = (name: string) => within(footer).getByRole("link", { name }).getAttribute("href");
    expect(href(message(locale, "Footer.github"))).toBe(repoUrl);
    expect(href(message(locale, "Footer.docs"))).toBe(docsUrl);
    expect(href(message(locale, "Footer.npm"))).toBe(npmUrl);
    expect(href(message(locale, "Footer.releases"))).toBe(`${repoUrl}/releases`);
    expect(href(message(locale, "Footer.contributing"))).toBe(`${repoUrl}/blob/main/CONTRIBUTING.md`);
    expect(href(message(locale, "Footer.issues"))).toBe(`${repoUrl}/issues/new/choose`);
    for (const key of Object.keys(socialLinks) as (keyof typeof socialLinks)[]) {
      expect(href(`${message(locale, `Footer.${key}`)} ${message(locale, "Nav.external")}`)).toBe(socialLinks[key]);
    }
    expect(href(message(locale, "Footer.privacy"))).toBe(`/${locale}/privacy`);
    expect(href(message(locale, "Footer.terms"))).toBe(`/${locale}/terms`);
    // The heart is decorative (aria-hidden), so the link's name is the caption alone
    expect(href(message(locale, "Footer.support"))).toBe(`/${locale}/support`);
    expect(within(footer).getByRole("img", { name: message(locale, "Footer.aossieLogo") }).closest("a")?.getAttribute("href")).toBe(aossieUrl);
    expect(within(footer).getByRole("img", { name: message(locale, "Footer.stabilityNexusLogo") }).closest("a")?.getAttribute("href")).toBe(stabilityNexusUrl);
    expect(within(footer).getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(
      [message(locale, "Footer.project"), message(locale, "Footer.community")],
    );
    expect(footer.textContent).toContain(translate(locale, "Footer.copyright", { year: new Date().getFullYear() }));
  });
});

describe("site chrome links (property)", () => {
  it("opens every external link in a new tab without the opener and keeps internal links on the locale", () => {
    fc.assert(
      fc.property(fc.constantFrom(...locales), fc.constantFrom("/", "/privacy", "/terms", "/support"), (locale, pathname) => {
        navigation.pathname = pathname;
        const { unmount } = renderWithIntl(
          <>
            <Header />
            <Footer />
          </>,
          locale,
        );
        for (const link of screen.getAllByRole("link")) {
          const href = link.getAttribute("href")!;
          if (/^https?:/.test(href)) {
            expect(link.getAttribute("target")).toBe("_blank");
            expect(link.getAttribute("rel")).toBe("noopener noreferrer");
          } else if (pathname === "/") {
            expect(href.startsWith("#") || href.startsWith(`/${locale}/`)).toBe(true);
          } else {
            expect(href.startsWith(`/${locale}`)).toBe(true);
          }
        }
        unmount();
      }),
      { numRuns: 16 },
    );
  });
});

describe.each(locales)("PageFrame and HomePage (%s)", (locale) => {
  it("frames the page with a skip link, header, main and footer", async () => {
    await renderServer(<PageFrame locale={locale}><p>content</p></PageFrame>, locale);
    const skip = screen.getByRole("link", { name: message(locale, "Home.skipToContent") });
    expect(skip.getAttribute("href")).toBe("#main");
    expect(screen.getByRole("main").id).toBe("main");
    expect(within(screen.getByRole("main")).getByText("content")).toBeTruthy();
    expect(screen.getByRole("banner")).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders every home-page section and its structured data", async () => {
    const { container } = await renderServer(<HomePage locale={locale} />, locale);
    for (const id of ["get", "install", "use-cases", "faqs"]) expect(container.querySelector(`#${id}`)).not.toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("region", { name: message(locale, "Install.eyebrow") }).id).toBe("install");

    const script = container.querySelector("script#schema-jsonld")!;
    expect(script.getAttribute("type")).toBe("application/ld+json");
    expect(script.innerHTML).not.toContain("<");
    const data = JSON.parse(script.innerHTML) as { "@graph": Props[] };
    const byType = Object.fromEntries(data["@graph"].map((node) => [node["@type"], node]));
    expect(Object.keys(byType)).toEqual(["SoftwareApplication", "WebPage", "Organization", "FAQPage"]);
    expect(byType.SoftwareApplication).toMatchObject({ url: localeUrl(locale), codeRepository: repoUrl, author: { "@id": aossieOrganizationId } });
    expect(byType.WebPage).toMatchObject({ name: message(locale, "Home.metaTitle"), inLanguage: locale });
    expect(byType.Organization).toMatchObject({ "@id": aossieOrganizationId, url: aossieUrl });
    const questions = byType.FAQPage.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(questions.map((q) => q.name)).toEqual(faqKeys.map((key) => message(locale, `Faq.items.${key}.question`)));
    expect(questions[0].acceptedAnswer.text).toBe(message(locale, `Faq.items.${faqKeys[0]}.answer`));
  });
});

describe("LegalPage", () => {
  it("renders the privacy policy from the repository in English without a note", async () => {
    await renderServer(<LegalPage locale="en" page="privacy" />, "en");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Privacy Policy");
    expect(screen.queryByText(message("en", "Legal.englishOnly"))).toBeNull();
    expect(screen.getByRole("main").querySelector('[lang="en"]')).not.toBeNull();
    expect(screen.getByRole("link", { name: "contact@aossie.org" }).getAttribute("href")).toBe("mailto:contact@aossie.org");
  });

  it("notes that the terms are English-only and keeps links in the reader's locale", async () => {
    await renderServer(<LegalPage locale="hi" page="terms" />, "hi");
    expect(screen.getByText(message("hi", "Legal.englishOnly"))).toBeTruthy();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Terms of Service");
    expect(within(screen.getByRole("main")).getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe("/hi/privacy");
  });

  it("falls back to the default locale's links for an unknown locale", async () => {
    await renderServer(<LegalPage locale="fr" page="terms" />, "en");
    expect(within(screen.getByRole("main")).getByRole("link", { name: "Privacy Policy" }).getAttribute("href")).toBe("/en/privacy");
  });
});

describe.each(locales)("SupportPage (%s)", (locale) => {
  it("renders the Support Us widget with translated captions, AOSSIE and the sponsor link", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    await renderServer(SupportPage({ locale }), locale);
    const main = within(screen.getByRole("main"));
    expect(main.getByRole("heading", { level: 1 }).textContent).toBe(message(locale, "Support.title"));
    expect(main.getByText(message(locale, "Support.madeBy"))).toBeTruthy();
    expect(main.getByText(message(locale, "Support.supportedBy"))).toBeTruthy();
    expect(main.getByText(message(locale, "Support.aossieDescription"))).toBeTruthy();
    expect(main.getByText(message(locale, "Footer.tagline"))).toBeTruthy();
    expect(main.getByRole("link", { name: /AOSSIE/ }).getAttribute("href")).toBe(aossieUrl);
    fireEvent.click(main.getByRole("button", { name: "GitHub Sponsors" }));
    expect(open).toHaveBeenCalledWith(githubSponsorsUrl, "_blank", "noopener,noreferrer");
  });

  it("lists Google Summer of Code and Stability Nexus as supporters, linked and without a tier", async () => {
    await renderServer(SupportPage({ locale }), locale);
    const main = within(screen.getByRole("main"));
    const gsoc = main.getByRole("link", { name: /Google Summer of Code/ });
    const nexus = main.getByRole("link", { name: /Stability Nexus/ });
    expect(gsoc.getAttribute("href")).toBe(gsocUrl);
    expect(nexus.getAttribute("href")).toBe(stabilityNexusUrl);
    for (const link of [gsoc, nexus]) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
    expect(supporters.map(({ name }) => name)).toEqual(["Google Summer of Code", "Stability Nexus"]);
    expect(main.queryByText(/(Platinum|Gold|Silver|Bronze) Sponsor/)).toBeNull();
  });
});

describe("SiteShell", () => {
  it.each(locales)("renders the %s document with fonts, providers and the library", (locale) => {
    const html = renderToStaticMarkup(<SiteShell locale={locale}><p>page</p></SiteShell>);
    expect(html).toMatch(new RegExp(`<html lang="${locale}" class="--font-inter --font-plex-mono --font-devanagari h-full antialiased"`));
    expect(html).toContain(`href="${vendorBase}/social-share-button.css"`);
    expect(html).toContain(`<script src="${vendorBase}/social-share-button.js" data-strategy="afterInteractive">`);
    expect(html).toContain("<p>page</p>");
    expect(html).toContain('data-testid="lenis"');
  });

  it("falls back to the default catalog for an unknown locale", () => {
    function Brand() {
      return <p>{useTranslations("Nav")("brand")}</p>;
    }
    const html = renderToStaticMarkup(<SiteShell locale="fr"><Brand /></SiteShell>);
    expect(html).toContain('<html lang="fr"');
    expect(html).toContain(`<p>${message("en", "Nav.brand")}</p>`);
  });
});

describe("LenisProvider", () => {
  it("adds smooth scrolling with an anchor offset for the sticky header", () => {
    render(<LenisProvider><p>child</p></LenisProvider>);
    const root = screen.getByTestId("lenis");
    expect(root.dataset.root).toBe("true");
    expect(JSON.parse(root.dataset.options!)).toMatchObject({ smoothWheel: true, anchors: { offset: -64 } });
    expect(within(root).getByText("child")).toBeTruthy();
  });

  it("skips smooth scrolling when the reader prefers reduced motion, and follows changes", () => {
    media.set(REDUCED_MOTION, true);
    render(<LenisProvider><p>child</p></LenisProvider>);
    expect(screen.queryByTestId("lenis")).toBeNull();
    expect(screen.getByText("child")).toBeTruthy();
    act(() => media.set(REDUCED_MOTION, false));
    expect(screen.getByTestId("lenis")).toBeTruthy();
  });

  it("pauses smooth scrolling while a share modal is open", () => {
    lenis.instance = { stop: vi.fn(), start: vi.fn() };
    const { unmount } = render(<LenisProvider>x</LenisProvider>);
    const share = (detail?: object) => document.dispatchEvent(new CustomEvent("social-share", { detail }));
    share({ interactionType: "popup_open" });
    expect(lenis.instance.stop).toHaveBeenCalledTimes(1);
    share({ interactionType: "share" });
    share();
    expect(lenis.instance.start).not.toHaveBeenCalled();
    share({ interactionType: "popup_close" });
    expect(lenis.instance.start).toHaveBeenCalledTimes(1);
    unmount();
    share({ interactionType: "popup_open" });
    expect(lenis.instance.stop).toHaveBeenCalledTimes(1);
  });
});

describe("error and not-found pages", () => {
  it.each(locales)("the error boundary logs the error and retries (%s)", (locale) => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const reset = vi.fn();
    const error = new Error("boom");
    renderWithIntl(<ErrorBoundary error={error} reset={reset} />, locale);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(message(locale, "Error.title"));
    expect(screen.getByText(message(locale, "Error.description"))).toBeTruthy();
    expect(log).toHaveBeenCalledWith(error);
    fireEvent.click(screen.getByRole("button", { name: message(locale, "Error.retry") }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it.each(locales)("the not-found page links home (%s)", (locale) => {
    renderWithIntl(<NotFound />, locale);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(message(locale, "NotFound.title"));
    expect(screen.getByRole("link", { name: message(locale, "NotFound.home") }).getAttribute("href")).toBe(`/${locale}`);
  });
});

describe("routes at the site root (default locale)", () => {
  it("serves the English home page with its metadata", async () => {
    expect((await defaultLayoutMetadata()).alternates?.canonical).toBe(localeUrl("en"));
    const layout = DefaultLocaleLayout({ children: "page" });
    expect(layout.type).toBe(SiteShell);
    expect(props(layout)).toMatchObject({ locale: "en", children: "page" });
    const page = RootPage();
    expect(page.type).toBe(HomePage);
    expect(props(page).locale).toBe("en");
    expect(setRequestLocale).toHaveBeenCalledWith("en");
  });

  it.each([
    ["privacy", rootPrivacyMetadata, RootPrivacyPage],
    ["terms", rootTermsMetadata, RootTermsPage],
  ] as const)("serves the %s page", async (page, metadata, Page) => {
    const meta = await metadata();
    expect(meta.title).toBe(message("en", `Legal.${page}.title`));
    expect(meta.alternates?.canonical).toBe(localeUrl("en", `/${page}`));
    const element = Page();
    expect(element.type).toBe(LegalPage);
    expect(props(element)).toEqual({ locale: "en", page });
  });

  it("serves the support page", async () => {
    expect((await rootSupportMetadata()).title).toBe(message("en", "Support.title"));
    const element = RootSupportPage();
    expect(element.type).toBe(SupportPage);
    expect(props(element).locale).toBe("en");
  });
});

describe("routes under /[locale]", () => {
  const notFound = expect.objectContaining({ digest: expect.stringContaining("404") });

  it("pre-renders every locale and nothing else", () => {
    expect(generateStaticParams()).toEqual([{ locale: "en" }, { locale: "hi" }]);
    expect(dynamicParams).toBe(false);
  });

  it.each(locales)("wraps %s pages in the site shell with localized metadata", async (locale) => {
    const meta = await localeLayoutMetadata(params(locale));
    expect(meta.title).toBe(message(locale, "Home.metaTitle"));
    const layout = await LocaleLayout({ children: "x", ...params(locale) });
    expect(layout.type).toBe(SiteShell);
    expect(props(layout).locale).toBe(locale);
    const home = await Home(params(locale));
    expect(home.type).toBe(HomePage);
    expect(props(home).locale).toBe(locale);
  });

  it.each(locales)("serves the %s legal and support pages", async (locale) => {
    expect((await privacyMetadata(params(locale))).alternates?.canonical).toBe(localeUrl(locale, "/privacy"));
    expect((await termsMetadata(params(locale))).title).toBe(message(locale, "Legal.terms.title"));
    expect((await supportMetadata(params(locale))).title).toBe(message(locale, "Support.title"));
    expect(props(await PrivacyPage(params(locale)))).toEqual({ locale, page: "privacy" });
    expect(props(await TermsPage(params(locale)))).toEqual({ locale, page: "terms" });
    const support = await LocaleSupportPage(params(locale));
    expect(isValidElement(support) && support.type).toBe(SupportPage);
  });

  it("responds 404 for an unknown locale", async () => {
    await expect(localeLayoutMetadata(params("fr"))).rejects.toEqual(notFound);
    await expect(LocaleLayout({ children: null, ...params("fr") })).rejects.toEqual(notFound);
    await expect(privacyMetadata(params("fr"))).rejects.toEqual(notFound);
    await expect(termsMetadata(params("fr"))).rejects.toEqual(notFound);
    await expect(supportMetadata(params("fr"))).rejects.toEqual(notFound);
  });
});

describe("i18n request config", () => {
  type RequestConfig = (options: { requestLocale: Promise<string | undefined> }) => Promise<{ locale: string; messages: unknown }>;
  const config = getRequestConfig as unknown as RequestConfig;

  it("loads the requested locale's messages", async () => {
    await expect(config({ requestLocale: Promise.resolve("hi") })).resolves.toEqual({ locale: "hi", messages: messagesMap.hi });
  });

  it("falls back to English for a missing or unsupported locale", async () => {
    await expect(config({ requestLocale: Promise.resolve(undefined) })).resolves.toEqual({ locale: "en", messages: messagesMap.en });
    await expect(config({ requestLocale: Promise.resolve("fr") })).resolves.toMatchObject({ locale: "en" });
  });
});
