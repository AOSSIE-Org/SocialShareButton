import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { defaultLanguage } from "@/config/languages";
import { generateLegalMetadata } from "@/i18n/metadata";
import { LegalPage } from "@/components/site/LegalPage";

/** The default locale's copy at "/privacy", canonical for English like the home page at "/". */
export async function generateMetadata(): Promise<Metadata> {
  setRequestLocale(defaultLanguage);
  return generateLegalMetadata(defaultLanguage, "privacy");
}

export default function RootPrivacyPage() {
  setRequestLocale(defaultLanguage);
  return <LegalPage locale={defaultLanguage} page="privacy" />;
}
