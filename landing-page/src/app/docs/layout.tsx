import type { Metadata } from "next";
import { getTranslation } from "@/lib/i18n";

const t = getTranslation();

export const metadata: Metadata = {
  title: t.docs.title,
  description: t.docs.description,
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: `${t.docs.title} | ${t.common.siteName}`,
    description: t.docs.description,
    url: `${t.common.url}/docs`,
  },
  twitter: {
    title: `${t.docs.title} | ${t.common.siteName}`,
    description: t.docs.description,
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
