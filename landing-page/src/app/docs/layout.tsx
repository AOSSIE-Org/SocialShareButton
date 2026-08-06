import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Setup guide for SocialShareButton: installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "Documentation | SocialShareButton",
    description:
      "Setup guide for SocialShareButton: installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript.",
    url: "https://social-share-button.aossie.org/docs",
  },
  twitter: {
    title: "Documentation | SocialShareButton",
    description:
      "Setup guide for SocialShareButton: installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript.",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
