import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: "Manual Installation Guide",
    description:
      "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
    alternates: {
      canonical: "/docs/manual",
    },
    openGraph: {
      ...(parentMetadata.openGraph as unknown as Metadata["openGraph"]),
      title: "Manual Installation Guide | SocialShareButton",
      description:
        "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
      url: "https://social-share-button.aossie.org/docs/manual",
    },
    twitter: {
      ...(parentMetadata.twitter as unknown as Metadata["twitter"]),
      title: "Manual Installation Guide | SocialShareButton",
      description:
        "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Manual Installation Guide",
      item: "https://social-share-button.aossie.org/docs/manual",
    },
  ],
};

export default function ManualLayout({ children }: { children: React.ReactNode }) {
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
