import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://social-share-button.aossie.org"),
  title: {
    default: "SocialShareButton — Lightweight Social Share Button Library",
    template: "%s | SocialShareButton",
  },
  manifest: "/site.webmanifest",
  description:
    "Add native-feeling share buttons (WhatsApp, Facebook, X, LinkedIn, Telegram) to any site with one script. Zero dependencies, fast, secure, open source.",
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
  authors: [{ name: "AOSSIE" }],
  creator: "AOSSIE",
  publisher: "AOSSIE",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SocialShareButton — Lightweight Social Share Button Library",
    description:
      "Zero-dependency, cross-platform social share button widget. Add it to your site with one script.",
    url: "https://social-share-button.aossie.org",
    siteName: "SocialShareButton",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SocialShareButton — Lightweight Social Share Button Library",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialShareButton — Lightweight Social Share Button Library",
    description: "Zero-dependency social share button widget for any website.",
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
    "Lightweight, zero-dependency social share button library for modern websites. Supports WhatsApp, Facebook, X, LinkedIn, and Telegram.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {/* Three-column layout */}
          <div className="flex min-h-screen">
            {/* Left fixed panel */}
            <div className="hidden lg:block w-[120px] shrink-0">
              <div className="fixed top-0 left-0 w-[120px] h-full bg-[#e8e8e8] dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-900 z-40" />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">{children}</div>

            {/* Right fixed panel */}
            <div className="hidden lg:block w-[120px] shrink-0">
              <div className="fixed top-0 right-0 w-[120px] h-full bg-[#e8e8e8] dark:bg-[#111111] border-l border-neutral-200 dark:border-neutral-900 z-40" />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
