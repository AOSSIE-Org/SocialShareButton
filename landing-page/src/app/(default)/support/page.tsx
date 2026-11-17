import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { defaultLanguage } from "@/config/languages";
import { generateSupportMetadata } from "@/i18n/metadata";
import { SupportPage } from "@/components/site/SupportPage";

/** The default locale's copy at "/support", canonical for English like the home page at "/". */
export async function generateMetadata(): Promise<Metadata> {
  setRequestLocale(defaultLanguage);
  return generateSupportMetadata(defaultLanguage);
}

export default function RootSupportPage() {
  setRequestLocale(defaultLanguage);
  return <SupportPage locale={defaultLanguage} />;
}
