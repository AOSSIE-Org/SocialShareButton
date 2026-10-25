import { setRequestLocale } from "next-intl/server";
import { defaultLanguage } from "@/config/languages";
import { HomePage } from "@/components/site/HomePage";

export default function RootPage() {
  setRequestLocale(defaultLanguage);
  return <HomePage locale={defaultLanguage} />;
}
