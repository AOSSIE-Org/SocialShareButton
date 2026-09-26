import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/components/ui/Section";
import { platformIds, platformLabels, type PlatformId } from "@/lib/platforms";
import { libraryGzipKb } from "@/config/site";

/** Brand colors used only as small identifying dots. */
const platformColors: Record<PlatformId, string> = {
  whatsapp: "#25D366",
  facebook: "#1877F2",
  twitter: "#71717A",
  linkedin: "#0A66C2",
  telegram: "#229ED9",
  reddit: "#FF4500",
  email: "#6B7280",
  pinterest: "#E60023",
  discord: "#5865F2",
};

const adapters = ["Google Analytics 4", "Mixpanel", "Segment", "Plausible", "PostHog"];

function Cell({ title, description, children, className = "" }: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col rounded-2xl bg-card-bg p-6 ring-1 ring-line transition-colors hover:ring-border-default ${className}`}>
      {children && <div className="mb-6 flex-1">{children}</div>}
      <h3 className="text-base font-medium tracking-tight text-foreground-primary">{title}</h3>
      <p className="mt-1.5 text-sm/6 text-foreground-secondary">{description}</p>
    </div>
  );
}

export function Features() {
  const t = useTranslations("Features");

  return (
    <div className="lg:flex lg:flex-1 lg:flex-col">
      <Eyebrow as="h2" id="features-heading">
        {t("eyebrow")}
      </Eyebrow>
      <p className="mt-3 max-w-md text-2xl/8 font-medium tracking-tighter text-balance text-foreground-primary">
        {t("title")}
      </p>

      {/* Bento: individual tiles separated by a small gap */}
      <div className="mt-8 grid gap-3 sm:grid-cols-5 lg:flex-1">
        <Cell
          className="sm:col-span-2"
          title={t("zeroDeps.title")}
          description={t("zeroDeps.description", { size: libraryGzipKb })}
        >
          <p className="font-mono text-5xl font-medium tracking-tighter text-foreground-primary">
            {libraryGzipKb}
            <span className="ml-1 text-xl text-foreground-muted">{t("zeroDeps.unit")}</span>
          </p>
          <p className="mt-3 inline-flex rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-xs font-medium text-accent">
            {t("zeroDeps.dependencies", { count: 0 })}
          </p>
        </Cell>

        <Cell
          className="sm:col-span-3 sm:row-span-2"
          title={t("platforms.title")}
          description={t("platforms.description")}
        >
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {platformIds.map((id) => (
              <li
                key={id}
                className="flex items-center gap-2 rounded-lg bg-card-bg px-2.5 py-2 text-xs font-medium text-foreground-primary ring-1 ring-line"
              >
                <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: platformColors[id] }} />
                {platformLabels[id]}
              </li>
            ))}
          </ul>
        </Cell>

        <Cell className="sm:col-span-2 sm:row-span-2" title={t("themes.title")} description={t("themes.description")}>
          <div className="grid grid-cols-2 gap-2" aria-hidden>
            <span className="grid h-9 place-items-center rounded-full bg-button-primary-bg text-xs font-semibold text-button-primary-text">
              {t("themes.styles.primary")}
            </span>
            <span className="grid h-9 place-items-center rounded-full bg-button-secondary-bg text-xs font-semibold text-foreground-primary">
              {t("themes.styles.default")}
            </span>
            <span className="grid h-7 place-items-center self-center rounded-full bg-accent-soft text-[11px] font-semibold text-accent">
              {t("themes.styles.compact")}
            </span>
            <span className="grid size-9 place-items-center justify-self-center rounded-full bg-highlight text-xs font-semibold text-background-primary">
              ↗
            </span>
          </div>
        </Cell>

        <Cell className="sm:col-span-3" title={t("analytics.title")} description={t("analytics.description")}>
          <ul className="flex flex-wrap gap-1.5">
            {adapters.map((adapter) => (
              <li
                key={adapter}
                className="rounded-full px-2.5 py-1 font-mono text-[11px] text-foreground-secondary ring-1 ring-line"
              >
                {adapter}
              </li>
            ))}
          </ul>
        </Cell>
      </div>
    </div>
  );
}
