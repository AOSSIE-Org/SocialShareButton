"use client";

import { useTranslations } from "next-intl";
import SupportUsButton from "support-us-button";
// Scoped by the package to `.sub-root`, so it never styles the rest of the site
import "support-us-button/style.css";
import { aossieLogoPath, aossieUrl, githubSponsorsUrl, projectLogoPath, supporters } from "@/config/site";

/** The Support Us widget; `Theme="auto"` inherits the page font and colours in both themes. */
export function SupportUs() {
  const t = useTranslations("Support");
  const nav = useTranslations("Nav");
  const footer = useTranslations("Footer");

  return (
    <SupportUsButton
      Theme="auto"
      heading={t("title")}
      labels={{ madeBy: t("madeBy"), supportedBy: t("supportedBy") }}
      organizationInformation={{
        name: "AOSSIE",
        desc: t("aossieDescription"),
        image: aossieLogoPath,
        link: aossieUrl,
      }}
      projectInformation={{ name: nav("brand"), description: footer("tagline"), image: projectLogoPath }}
      ctaSection={{ sponsorLink: [{ name: "GitHub Sponsors", url: githubSponsorsUrl }] }}
      sponsors={[...supporters]}
    />
  );
}
