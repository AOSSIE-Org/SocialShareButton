"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MoonIcon, SunIcon } from "@/components/ui/Icons";

/**
 * Two-state light/dark switch. First-time visitors start on their OS preference
 * (see theme-provider.tsx); after that the button only toggles between light and dark.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("ThemeToggle");
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) {
    return <div className="size-8 rounded-full bg-button-secondary-bg animate-pulse" />;
  }

  const current = resolvedTheme === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${t("toggleTheme")}. ${t("current", { theme: t(current) })}`}
      title={t("current", { theme: t(current) })}
      className="inline-grid size-8 cursor-pointer place-items-center rounded-full text-foreground-muted transition-colors hover:bg-button-secondary-bg hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent"
    >
      {/* key remounts the icon so it animates in on every toggle */}
      {current === "light" ? (
        <SunIcon key="sun" className="size-5 text-icon-sun motion-safe:animate-theme-icon" />
      ) : (
        <MoonIcon key="moon" className="size-5 text-icon-moon motion-safe:animate-theme-icon" />
      )}
    </button>
  );
}
