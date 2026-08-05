export const resources = {
  en: {
    common: {
      siteName: "SocialShareButton",
      author: "AOSSIE",
      url: "https://social-share-button.aossie.org",
    },
    metadata: {
      title: "SocialShareButton — Lightweight Social Share Button Library",
      titleTemplate: "%s | SocialShareButton",
      description:
        "Add native-feeling social share buttons (WhatsApp, Facebook, X, LinkedIn, Telegram) to any website with one script. Zero dependencies, cross-platform, fast, secure, and open source.",
      keywords: [
        "social share button",
        "share button library",
        "javascript share widget",
        "add to any website share button",
        "open source social share",
        "react share button",
        "preact share button",
        "cross platform share widget",
      ],
      ogTitle: "SocialShareButton — Lightweight Social Share Button Library",
      ogDescription:
        "Zero-dependency, cross-platform social share button widget. Add it to your site with one script.",
      ogImageAlt: "SocialShareButton — Lightweight Social Share Button Library",
      twitterTitle: "SocialShareButton — Lightweight Social Share Button Library",
      twitterDescription: "Zero-dependency social share button widget for any website.",
      jsonLdDescription:
        "Lightweight, zero-dependency social share button library for modern websites. Supports WhatsApp, Facebook, X, LinkedIn, and Telegram.",
    },
    docs: {
      title: "Documentation",
      description:
        "Complete setup guide for SocialShareButton — installation, AI-agent-assisted setup, and manual integration for React, Preact, Qwik, and vanilla JavaScript projects.",
    },
    manual: {
      title: "Manual Installation Guide",
      description:
        "Step-by-step guide to manually add SocialShareButton to your website with a single script tag — no build tools or bundler required.",
    },
  },
};

export type Locale = keyof typeof resources;
export const defaultLocale: Locale = "en";

export function getTranslation(locale: Locale = defaultLocale) {
  return resources[locale] || resources[defaultLocale];
}
