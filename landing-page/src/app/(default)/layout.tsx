import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { defaultLanguage } from "@/config/languages";
import { generateLocaleMetadata } from "@/i18n/metadata";
import { SiteShell } from "@/components/site/SiteShell";
import "../globals.css";

/**
 * Root layout for "/". The default locale is served (and canonical) at the site root
 * instead of redirecting to "/en": a static export can only redirect client-side, which
 * crawlers and the SEO audit workflow would see as an empty page.
 */
export async function generateMetadata(): Promise<Metadata> {
  setRequestLocale(defaultLanguage);
  return generateLocaleMetadata(defaultLanguage, "Home");
}

export default function DefaultLocaleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  setRequestLocale(defaultLanguage);
  return <SiteShell locale={defaultLanguage}>{children}</SiteShell>;
}
