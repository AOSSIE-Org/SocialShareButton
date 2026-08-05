import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n";

const t = getTranslation();

export const metadata: Metadata = {
  title: t.manual.title,
  description: t.manual.description,
  alternates: {
    canonical: "/docs/manual",
  },
  openGraph: {
    title: `${t.manual.title} | ${t.common.siteName}`,
    description: t.manual.description,
    url: `${t.common.url}/docs/manual`,
  },
  twitter: {
    title: `${t.manual.title} | ${t.common.siteName}`,
    description: t.manual.description,
  },
};

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return children;
}
