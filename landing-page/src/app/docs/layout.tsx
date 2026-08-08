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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://social-share-button.aossie.org",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Documentation",
      item: "https://social-share-button.aossie.org/docs",
    },
  ],
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
