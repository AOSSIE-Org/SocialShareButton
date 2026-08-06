import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manual Installation Guide",
  description:
    "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
  alternates: {
    canonical: "/docs/manual",
  },
  openGraph: {
    title: "Manual Installation Guide | SocialShareButton",
    description:
      "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
    url: "https://social-share-button.aossie.org/docs/manual",
  },
  twitter: {
    title: "Manual Installation Guide | SocialShareButton",
    description:
      "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
  },
};

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return children;
}
