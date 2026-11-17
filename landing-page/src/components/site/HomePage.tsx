import { getTranslations } from "next-intl/server";
import { PageFrame } from "./PageFrame";
import { Hero } from "@/components/sections/Hero";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { Features } from "@/components/sections/Features";
import { Installation } from "@/components/sections/Installation";
import { Architecture, Compare, Faq, faqKeys, Metrics, Testimonials, UseCases } from "@/components/sections/MoreSections";
import { sectionPadding } from "@/components/ui/Section";
import {
  aossieOrganizationId,
  aossieUrl,
  libraryVersion,
  licenseUrl,
  localeUrl,
  repoUrl,
  siteUrl,
} from "@/config/site";

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
        license: licenseUrl,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: { "@id": aossieOrganizationId },
      },
      {
        "@type": "WebPage",
        name: home("metaTitle"),
        description: home("metaDescription"),
        url: localeUrl(locale),
        inLanguage: locale,
        publisher: { "@id": aossieOrganizationId },
      },
      {
        "@type": "Organization",
        "@id": aossieOrganizationId,
        name: "AOSSIE",
        url: aossieUrl,
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
  const jsonLd = await structuredData(locale);

  return (
    <>
      <script
        id="schema-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageFrame locale={locale}>
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
      </PageFrame>
    </>
  );
}
