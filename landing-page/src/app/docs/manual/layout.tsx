import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manual Installation Guide",
  description:
    "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
  alternates: {
    canonical: "/docs/manual",
  },
};

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return children;
}
