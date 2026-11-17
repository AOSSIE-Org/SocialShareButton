import fs from "fs";
import path from "path";
import { getTranslations } from "next-intl/server";
import { PageFrame } from "./PageFrame";
import { sectionPadding } from "@/components/ui/Section";
import { legalDocumentLocale, legalPages, type LegalPageId } from "@/config/site";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LegalDocument } from "@/lib/legal-markdown";

/** Typography for the rendered Markdown, matching the section headings, FAQ copy and inline code. */
const prose = [
  "text-base/7 text-foreground-secondary",
  "[&_h1]:text-4xl/10 [&_h1]:font-medium [&_h1]:tracking-tighter [&_h1]:text-balance [&_h1]:text-foreground-primary sm:[&_h1]:text-5xl/14",
  "[&_h2]:mt-12 [&_h2]:text-2xl/8 [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-foreground-primary",
  "[&_h3]:mt-8 [&_h3]:text-lg/7 [&_h3]:font-medium [&_h3]:text-foreground-primary",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:marker:text-foreground-muted",
  "[&_strong]:font-semibold [&_strong]:text-foreground-primary",
  "[&_a]:break-words [&_a]:text-accent [&_a]:underline [&_a]:decoration-accent/40 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:decoration-accent",
  "[&_code]:rounded-md [&_code]:bg-button-secondary-bg [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125em] [&_code]:text-foreground-primary",
].join(" ");

/** A legal document from the repository root, read at build time and framed like the home page. */
export async function LegalPage({ locale, page }: { locale: string; page: LegalPageId }) {
  const t = await getTranslations({ locale, namespace: "Legal" });
  const source = fs.readFileSync(path.join(process.cwd(), legalPages[page].file), "utf8");
  const pageLocale = routing.locales.find((code) => code === locale) ?? routing.defaultLocale;
  // Links between the two documents stay in the reader's locale
  const links = {
    privacy: getPathname({ href: legalPages.privacy.path, locale: pageLocale }),
    terms: getPathname({ href: legalPages.terms.path, locale: pageLocale }),
  };

  return (
    <PageFrame locale={locale}>
      <div className={`${sectionPadding} py-14 sm:py-20`}>
        <article className="max-w-3xl">
          {locale !== legalDocumentLocale && (
            <p className="mb-10 rounded-lg border border-card-border bg-card-bg px-4 py-3 text-sm/6 text-foreground-secondary">
              {t("englishOnly")}
            </p>
          )}
          <LegalDocument source={source} links={links} className={prose} />
        </article>
      </div>
    </PageFrame>
  );
}
