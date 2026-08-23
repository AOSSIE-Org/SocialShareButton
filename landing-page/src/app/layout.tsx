import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://social-share-button.aossie.org"),
  title: {
    default: "SocialShareButton — Zero-Dependency Social Sharing Component",
    template: "%s | SocialShareButton",
  },
  description:
    "A zero-dependency, <10KB social sharing component for modern websites. Zero external trackers, zero cookie banners, instant framework-agnostic drop-in.",
  keywords: [
    "social share button",
    "share button library",
    "javascript share widget",
    "add to any website share button",
    "open source social share",
    "react share button",
    "preact share button",
    "vue share button",
    "cross platform share widget",
  ],
  authors: [{ name: "AOSSIE" }],
  creator: "AOSSIE",
  publisher: "AOSSIE",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SocialShareButton — Zero-Dependency Social Sharing Component",
    description:
      "Zero-dependency, cross-platform social share widget. Under 10KB, zero tracking, instant drop-in.",
    url: "https://social-share-button.aossie.org",
    siteName: "SocialShareButton",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SocialShareButton — Zero-Dependency Social Sharing Component",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialShareButton — Zero-Dependency Social Sharing Component",
    description: "Zero-dependency social share component widget for any website.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/SocialShare_logo.webp", type: "image/webp" },
    ],
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SocialShareButton",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Lightweight, zero-dependency social share button library for modern websites. Supports WhatsApp, Facebook, X, LinkedIn, Telegram, Reddit, and Email.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: "https://social-share-button.aossie.org",
  author: {
    "@type": "Organization",
    name: "AOSSIE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-[#00E599]/20 selection:text-[#00E599]`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {children}
          </div>

        </ThemeProvider>
      </body>
    </html>
  );
}