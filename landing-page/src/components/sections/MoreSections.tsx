import { useTranslations } from "next-intl";
import { GlowGroup } from "@/components/ui/GlowGroup";
import { ArrowRightIcon, DiscordIcon, PlusIcon } from "@/components/ui/Icons";
import { Eyebrow, Section, SectionHeading, sectionPadding } from "@/components/ui/Section";
import { frameworkIds } from "@/content/install";
import { platformIds } from "@/lib/platforms";
import { libraryGzipKb, socialLinks } from "@/config/site";

export const useCaseKeys = [
  "blogs",
  "docs",
  "commerce",
  "opensource",
  "portfolios",
  "events",
] as const;
export const faqKeys = [
  "free",
  "privacy",
  "frameworks",
  "platforms",
  "styling",
  "spa",
  "missing",
  "npm",
] as const;

export function Metrics() {
  const t = useTranslations("Metrics");
  const metrics = [
    { value: String(libraryGzipKb), label: t("size") },
    { value: "0", label: t("deps") },
    { value: String(platformIds.length), label: t("platforms") },
    { value: String(frameworkIds.length), label: t("frameworks") },
  ];

  return (
    <Section labelledBy="metrics-heading">
      <div className={`${sectionPadding} pt-16 pb-10 lg:pt-20`}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionHeading id="metrics-heading">{t("title")}</SectionHeading>
      </div>
      <dl className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`flex flex-col-reverse bg-background-primary py-8 ${sectionPadding}`}
          >
            <dt className="mt-2 text-sm/6 text-foreground-secondary">{metric.label}</dt>
            <dd className="text-5xl font-medium tracking-tighter text-foreground-primary tabular-nums sm:text-6xl">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

const compareRows = ["size", "requests", "tracking", "cookies", "styling", "source"] as const;

/** Qualitative comparison with hosted share widgets. Keep every claim verifiable; no invented numbers. */
export function Compare() {
  const t = useTranslations("Compare");

  return (
    <Section labelledBy="compare-heading">
      <div
        className={`grid gap-10 ${sectionPadding} py-16 lg:grid-cols-[1fr_1.4fr] lg:items-start lg:py-20`}
      >
        <div>
          <Eyebrow tone="highlight">{t("eyebrow")}</Eyebrow>
          <SectionHeading id="compare-heading">{t("title")}</SectionHeading>
          <p className="mt-4 max-w-xl text-base/7 text-foreground-secondary">{t("subtitle")}</p>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-card-bg ring-1 ring-line">
          <table className="w-full text-left text-sm/6">
            <caption className="sr-only">{t("caption")}</caption>
            <thead>
              <tr className="border-b border-line text-foreground-muted">
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">
                  {t("feature")}
                </th>
                <th scope="col" className="px-3 py-3 font-semibold text-accent">
                  {t("us")}
                </th>
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">
                  {t("them")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {compareRows.map((key) => (
                <tr key={key}>
                  <th
                    scope="row"
                    className="px-4 py-3.5 font-medium text-foreground-primary sm:px-6"
                  >
                    {t(`rows.${key}.label`)}
                  </th>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex rounded-md bg-accent-soft px-2 py-0.5 font-medium text-accent">
                      {t(`rows.${key}.us`, { size: libraryGzipKb })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-foreground-secondary sm:px-6">
                    {t(`rows.${key}.them`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

export function UseCases() {
  const t = useTranslations("UseCases");

  return (
    <Section id="use-cases" labelledBy="use-cases-heading">
      <div className={`${sectionPadding} pt-16 pb-10 lg:pt-20`}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionHeading id="use-cases-heading">{t("title")}</SectionHeading>
        <p className="mt-4 max-w-2xl text-base/7 text-foreground-secondary">{t("subtitle")}</p>
      </div>
      <ul className="grid gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {useCaseKeys.map((key, index) => (
          <li key={key} className={`bg-background-primary py-8 ${sectionPadding}`}>
            <span className="font-mono text-xs text-highlight">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-base font-medium tracking-tight text-foreground-primary">
              {t(`items.${key}.title`)}
            </h3>
            <p className="mt-1.5 text-sm/6 text-foreground-secondary">
              {t(`items.${key}.description`)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ModuleCard({
  title,
  description,
  files,
  emphasis = false,
}: {
  title: string;
  description: string;
  files: string[];
  emphasis?: boolean;
}) {
  return (
    <div
      data-glow
      className={`flex flex-col rounded-xl p-5 ring-1 ${emphasis ? "bg-accent-soft ring-accent/40" : "bg-background-primary ring-line"}`}
    >
      <h3
        className={`text-base font-medium tracking-tight ${emphasis ? "text-accent" : "text-foreground-primary"}`}
      >
        {title}
      </h3>
      <p className="mt-1.5 text-sm/6 text-foreground-secondary">{description}</p>
      {/* mt-auto pins the file chips to the bottom when cards are stretched to equal heights */}
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {files.map((file) => (
          <li
            key={file}
            className="rounded-md bg-card-bg px-2 py-0.5 font-mono text-[11px] text-foreground-primary ring-1 ring-line"
          >
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Connector() {
  return (
    <div
      aria-hidden
      className="flex items-center justify-center text-foreground-muted max-lg:rotate-90"
    >
      <ArrowRightIcon className="size-5" />
    </div>
  );
}

export function Architecture() {
  const t = useTranslations("Architecture");

  return (
    <Section labelledBy="architecture-heading">
      <div className={`${sectionPadding} py-16 lg:py-20`}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionHeading id="architecture-heading">{t("title")}</SectionHeading>
        <p className="mt-4 max-w-2xl text-base/7 text-foreground-secondary">{t("subtitle")}</p>

        {/*
          Delivery and Core share one subgrid row, so they match each other's height without
          stretching to the full right column; the right column splits its height evenly.
        */}
        <GlowGroup className="mt-10 grid gap-4 rounded-2xl p-4 ring-1 ring-line sm:p-6 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
          <div className="grid gap-4 lg:col-span-3 lg:grid-cols-subgrid lg:self-center">
            <ModuleCard
              title={t("delivery.title")}
              description={t("delivery.description")}
              files={["cdn.jsdelivr.net", "npm i @aossie-org/social-share-button"]}
            />
            <Connector />
            <ModuleCard
              emphasis
              title={t("core.title")}
              description={t("core.description")}
              files={["social-share-button.js", "social-share-button.css"]}
            />
          </div>
          <Connector />
          <div className="grid grid-rows-2 gap-4">
            <ModuleCard
              title={t("wrappers.title")}
              description={t("wrappers.description")}
              files={["-react.jsx", "-preact.jsx", "-qwik.tsx"]}
            />
            <ModuleCard
              title={t("analytics.title")}
              description={t("analytics.description")}
              files={["social-share-analytics.js"]}
            />
          </div>
        </GlowGroup>

        <div className="mt-10">
          <h3 className="text-base font-medium tracking-tight text-foreground-primary">
            {t("eventsTitle")}
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {(["dom", "callback", "plugins"] as const).map((key) => (
              <li
                key={key}
                className="rounded-xl bg-card-bg p-4 font-mono text-xs/5 text-foreground-secondary ring-1 ring-line"
              >
                {t(`events.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function Faq() {
  const t = useTranslations("Faq");

  return (
    <Section id="faqs" labelledBy="faqs-heading">
      <div className={`grid gap-10 ${sectionPadding} py-16 lg:grid-cols-[1fr_2fr] lg:py-20`}>
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionHeading id="faqs-heading">{t("title")}</SectionHeading>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqKeys.map((key) => (
            <details key={key} name="faq" className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                {t(`items.${key}.question`)}
                <PlusIcon className="size-5 shrink-0 text-foreground-muted transition-transform group-open:rotate-45" />
              </summary>
              <p className="-mt-1 pr-10 pb-5 text-sm/6 text-foreground-secondary">
                {t(`items.${key}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * Real quotes only. Add an entry once a user has agreed to be quoted, e.g.
 * { quote: "…", name: "Jane Doe", role: "Maintainer, Project" }.
 */
const testimonials: { quote: string; name: string; role: string }[] = [];

export function Testimonials() {
  const t = useTranslations("Testimonials");

  return (
    <Section labelledBy="testimonials-heading">
      <div className={`${sectionPadding} py-16 lg:py-20`}>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <SectionHeading id="testimonials-heading">{t("title")}</SectionHeading>

        {testimonials.length > 0 ? (
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <li key={item.name} className="rounded-xl bg-card-bg p-6 ring-1 ring-line">
                <blockquote className="text-base/7 text-foreground-primary">
                  “{item.quote}”
                </blockquote>
                <p className="mt-4 text-sm font-medium text-foreground-primary">{item.name}</p>
                <p className="text-sm text-foreground-muted">{item.role}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="hatch mt-10 flex flex-col items-start gap-5 rounded-2xl p-8 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-medium tracking-tight text-foreground-primary">
                {t("emptyTitle")}
              </p>
              <p className="mt-1.5 max-w-xl text-sm/6 text-foreground-secondary">
                {t("emptyBody")}
              </p>
            </div>
            <a
              href={socialLinks.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-discord-bg px-4 py-2 text-sm/6 font-semibold text-discord-text transition-colors hover:bg-discord-hover-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <DiscordIcon className="size-4" />
              {t("cta")}
            </a>
          </div>
        )}
      </div>
    </Section>
  );
}
