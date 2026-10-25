import { getTranslations } from "next-intl/server";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Features } from "@/components/sections/Features";
import { Installation } from "@/components/sections/Installation";
import { Architecture, Compare, Faq, faqKeys, Metrics, Testimonials, UseCases } from "@/components/sections/MoreSections";
import { sectionPadding } from "@/components/ui/Section";
import { libraryVersion, localeUrl, repoUrl, siteUrl } from "@/config/site";

async function structuredData(locale: string) {
  const home = await getTranslations({ locale, namespace: "Home" });
  const faq = await getTranslations({ locale, namespace: "Faq" });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Social Share Button",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        softwareVersion: libraryVersion,
        description: home("metaDescription"),
        url: localeUrl(locale),
        codeRepository: repoUrl,
        license: "https://www.gnu.org/licenses/gpl-3.0.html",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@id": "https://aossie.org/#organization" },
      },
      {
        "@type": "WebPage",
        name: home("metaTitle"),
        description: home("metaDescription"),
        url: localeUrl(locale),
        inLanguage: locale,
        publisher: { "@id": "https://aossie.org/#organization" },
      },
      {
        "@type": "Organization",
        "@id": "https://aossie.org/#organization",
        name: "AOSSIE",
        url: "https://aossie.org",
        logo: `${siteUrl}/brand/icons/aossie_logo.svg`,
      },
      {
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: faqKeys.map((key) => ({
          "@type": "Question",
          name: faq(`items.${key}.question`),
          acceptedAnswer: { "@type": "Answer", text: faq(`items.${key}.answer`) },
        })),
      },
    ],
  };
}

export async function HomePage({ locale }: { locale: string }) {
  const home = await getTranslations({ locale, namespace: "Home" });
  const jsonLd = await structuredData(locale);

  return (
    <>
      <script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-button-primary-bg focus:px-4 focus:py-2 focus:text-sm focus:text-button-primary-text"
      >
        {home("skipToContent")}
      </a>
      {/*
        Hatched pillars run the full page height, after tailwindcss.com. Header, main and
        footer all live in the middle column, so the navbar and footer end exactly at the pillars.
      */}
      <div className="grid w-full flex-1 grid-cols-1 md:grid-cols-[2rem_minmax(0,1fr)_2rem] lg:grid-cols-[3rem_minmax(0,1fr)_3rem] 2xl:grid-cols-[4rem_minmax(0,1fr)_4rem]">
        <div aria-hidden className="hatch hidden border-r border-line md:block" />
        <div className="flex min-w-0 flex-col">
          <Header />
          <main id="main" className="min-w-0 flex-1">
            <div id="get" className="grid scroll-mt-14 grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
              <div
                className={`${sectionPadding} pt-14 pb-12 sm:pt-20 lg:col-start-1 lg:row-start-1 lg:border-r lg:border-line lg:pb-16`}
              >
                <Hero />
              </div>
              <section
                id="install"
                aria-labelledby="install-heading"
                className={`${sectionPadding} scroll-mt-14 border-t border-line py-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:border-t-0 lg:pt-20 lg:pb-16`}
              >
                <Installation />
              </section>
              {/*
                On lg both columns end on the same line: whichever side is shorter grows its last
                element (the Features bento here, step 4's code block in Installation).
              */}
              <div
                className={`${sectionPadding} space-y-14 border-t border-line py-12 lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:border-r lg:pb-16`}
              >
                <section aria-labelledby="trusted-heading">
                  <TrustedBy />
                </section>
                <section aria-labelledby="features-heading" className="lg:flex lg:flex-1 lg:flex-col">
                  <Features />
                </section>
              </div>
            </div>
            <Metrics />
            <Compare />
            <UseCases />
            <Architecture />
            <Faq />
            <Testimonials />
          </main>
          <Footer />
        </div>
        <div aria-hidden className="hatch hidden border-l border-line md:block" />
      </div>
    </>
  );
}
