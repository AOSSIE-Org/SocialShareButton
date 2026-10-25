"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { BrandMark, CloseIcon, GitHubIcon, MenuIcon, ShareIcon } from "@/components/ui/Icons";
import { useSocialShareButton } from "@/lib/social-share-button";
import { platformIds } from "@/lib/platforms";
import { docsUrl, libraryVersion, localeUrl, repoUrl } from "@/config/site";

const sectionLinks = [
  { id: "get", key: "get" },
  { id: "use-cases", key: "useCases" },
  { id: "faqs", key: "faqs" },
] as const;

type SectionId = (typeof sectionLinks)[number]["id"];

/** Highlights the nav item for the section currently under the header. */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>("get");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: SectionId = "get";
      for (const { id } of sectionLinks) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.3) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}

/** The "Share" nav item dogfoods the library: a buttonless instance whose modal we open on click. */
function useSiteShare() {
  const t = useTranslations("Share");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  const options = useMemo(
    () => ({
      url: localeUrl(locale),
      title: t("title"),
      description: t("description"),
      hashtags: ["opensource", "javascript", "webdev"],
      via: "aossie_org",
      platforms: [...platformIds],
      theme: resolvedTheme === "light" ? ("light" as const) : ("dark" as const),
      showButton: false,
    }),
    [locale, resolvedTheme, t]
  );

  const { containerRef, instanceRef, ready } = useSocialShareButton(options);
  const open = useCallback(() => instanceRef.current?.openModal(), [instanceRef]);
  return { containerRef, ready, open };
}

function NavShareButton({
  label,
  ready,
  onOpen,
  className,
}: {
  label: string;
  ready: boolean;
  onOpen: () => void;
  className: string;
}) {
  return (
    <button type="button" onClick={onOpen} disabled={!ready} className={className}>
      <ShareIcon className="size-4" />
      {label}
    </button>
  );
}

export function Header() {
  const t = useTranslations("Nav");
  const active = useActiveSection();
  const { containerRef: shareContainerRef, ready: shareReady, open: openShare } = useSiteShare();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const linkClass = (isActive: boolean) =>
    `relative inline-flex h-8 items-center rounded-md px-2.5 text-sm/6 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
      isActive
        ? "text-foreground-primary after:absolute after:inset-x-2.5 after:-bottom-[13px] after:h-px after:bg-foreground-primary"
        : "text-foreground-secondary hover:text-foreground-primary"
    }`;

  const onShare = () => {
    setMenuOpen(false);
    openShare();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background-primary/85 backdrop-blur-md">
      <div ref={shareContainerRef} hidden />
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2.5">
          <a
            href="#get"
            aria-label={t("home")}
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <BrandMark className="size-7" />
            <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-foreground-primary">
              {t("brand")}
            </span>
          </a>
          <a
            href={`${repoUrl}/releases/tag/v${libraryVersion}`}
            target="_blank"
            rel="noopener noreferrer"
            title={t("release", { version: `v${libraryVersion}` })}
            className="rounded-2xl bg-button-secondary-bg px-2.5 py-0.5 text-xs/5 font-medium max-[25rem]:hidden text-foreground-primary tabular-nums transition-colors hover:bg-button-secondary-hover-bg focus-visible:outline-2 focus-visible:outline-accent"
          >
            v{libraryVersion}
            <span className="sr-only"> {t("external")}</span>
          </a>
        </div>

        <nav aria-label={t("primary")} className="hidden items-center gap-1 lg:flex">
          <a href="#get" aria-current={active === "get" ? "true" : undefined} className={linkClass(active === "get")}>
            {t("get")}
          </a>
          <NavShareButton
            label={t("share")}
            ready={shareReady}
            onOpen={onShare}
            className={`${linkClass(false)} cursor-pointer gap-1.5 disabled:cursor-wait disabled:opacity-60`}
          />
          <a
            href="#use-cases"
            aria-current={active === "use-cases" ? "true" : undefined}
            className={linkClass(active === "use-cases")}
          >
            {t("useCases")}
          </a>
          <a href={docsUrl} target="_blank" rel="noopener noreferrer" className={linkClass(false)}>
            {t("docs")}
            <span className="sr-only"> {t("external")}</span>
          </a>
          <a href="#faqs" aria-current={active === "faqs" ? "true" : undefined} className={linkClass(active === "faqs")}>
            {t("faqs")}
          </a>
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("github")} ${t("external")}`}
            className="inline-grid size-8 place-items-center rounded-full text-foreground-muted transition-colors hover:bg-button-secondary-bg hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent"
          >
            <GitHubIcon className="size-5" />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            className="inline-grid size-8 cursor-pointer place-items-center rounded-full text-foreground-primary hover:bg-button-secondary-bg focus-visible:outline-2 focus-visible:outline-accent lg:hidden"
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label={t("primary")}
          className="border-t border-line bg-background-primary px-4 pt-2 pb-4 sm:px-6 lg:hidden"
        >
          {/* Same order as the desktop nav: Get, Share, Use-Cases, View Docs, FAQs */}
          <ul className="flex flex-col">
            {(["get", "share", "use-cases", "docs", "faqs"] as const).map((item) => {
              const itemClass =
                "flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-base font-medium text-foreground-primary hover:bg-button-secondary-bg";
              if (item === "share") {
                return (
                  <li key={item}>
                    <NavShareButton
                      label={t("share")}
                      ready={shareReady}
                      onOpen={onShare}
                      className={`${itemClass} cursor-pointer disabled:opacity-60`}
                    />
                  </li>
                );
              }
              if (item === "docs") {
                return (
                  <li key={item}>
                    <a href={docsUrl} target="_blank" rel="noopener noreferrer" className={itemClass}>
                      {t("docs")}
                      <span className="sr-only"> {t("external")}</span>
                    </a>
                  </li>
                );
              }
              const { key } = sectionLinks.find((link) => link.id === item)!;
              return (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === item ? "true" : undefined}
                    className={itemClass}
                  >
                    {t(key)}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 border-t border-line pt-3 sm:hidden">
            <LanguageSwitcher align="start" />
          </div>
        </nav>
      )}
    </header>
  );
}
