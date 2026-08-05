import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete setup guide for SocialShareButton — installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript projects.",
  alternates: {
    canonical: "/docs",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
