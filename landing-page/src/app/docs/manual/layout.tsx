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

export default function ManualLayout({ children }: { children: React.ReactNode }) {
  return children;
}
