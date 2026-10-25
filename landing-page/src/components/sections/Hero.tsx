import { useTranslations } from "next-intl";
import { DemoLauncher } from "@/components/demo/DemoLauncher";
import { ArrowUpRightIcon, StarIcon } from "@/components/ui/Icons";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { Eyebrow } from "@/components/ui/Section";
import { npmPackage, repoUrl } from "@/config/site";

export function Hero() {
  const t = useTranslations("Hero");
  const home = useTranslations("Home");
  const nav = useTranslations("Nav");

  return (
    // @container lets the eyebrow scale with this column so it always stays on one line
    <div className="@container">
      <Eyebrow fit>
        {t("eyebrow")}
        <span aria-hidden className="mx-2 text-foreground-muted">
          /
        </span>
        <span className="text-foreground-secondary">
          {t.rich("broughtBy", {
            link: (chunks) => (
              <a
                href="https://aossie.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {chunks}
                <ArrowUpRightIcon className="ml-0.5 inline size-[0.85em] -translate-y-px stroke-2" />
                <span className="sr-only"> {nav("external")}</span>
              </a>
            ),
          })}
        </span>
      </Eyebrow>
      {/*
        From sm up the first phrase ("Lightweight social share") is its own unbroken line, and the
        font scales with the @container column (capped at 3rem, then 3.75rem on xl) so it always fits.
      */}
      <h1 className="mt-5 text-4xl/[1.05] font-medium tracking-tighter text-balance text-foreground-primary sm:text-[length:min(3rem,100cqi/11)]/[1.02] xl:text-[length:min(3.75rem,100cqi/11)]/[1.02]">
        {home.rich("heading", {
          line: (chunks) => <span className="sm:block sm:whitespace-nowrap">{chunks}</span>,
        })}
      </h1>
      <p className="mt-6 max-w-xl text-lg/7 font-medium text-pretty text-foreground-secondary">
        {t("subtitle")}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-button-primary-bg px-4 py-2 text-sm/6 font-semibold text-button-primary-text transition-colors hover:bg-button-primary-hover-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <StarIcon className="size-4 text-icon-sun" />
          {t("starOnGithub")}
          <span className="sr-only"> {nav("external")}</span>
        </a>
        <DemoLauncher label={t("tryDemo")} />
      </div>
      <div className="mt-20">
        <Eyebrow>{t("npmTitle")}</Eyebrow>
        <div className="mt-6">
          <InstallCommand command={`npm install ${npmPackage}`} />
        </div>
      </div>
    </div>
  );
}
