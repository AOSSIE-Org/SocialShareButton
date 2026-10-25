import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/site/HomePage";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return <HomePage locale={locale} />;
}
