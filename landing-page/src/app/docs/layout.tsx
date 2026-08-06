import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;
  
  return {
    title: "Documentation",
    description:
      "Setup guide for SocialShareButton: installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript.",
    alternates: {
      canonical: "/docs",
    },
    openGraph: {
      ...(parentMetadata.openGraph as unknown as Metadata["openGraph"]),
      title: "Documentation | SocialShareButton",
      description:
        "Setup guide for SocialShareButton: installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript.",
      url: "https://social-share-button.aossie.org/docs",
    },
    twitter: {
      ...(parentMetadata.twitter as unknown as Metadata["twitter"]),
      title: "Documentation | SocialShareButton",
      description:
        "Setup guide for SocialShareButton: installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript.",
    },
  };
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
