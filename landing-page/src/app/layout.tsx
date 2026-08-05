import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { getTranslation } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const t = getTranslation();

export const metadata: Metadata = {
  metadataBase: new URL(t.common.url),
  title: {
    default: t.metadata.title,
    template: t.metadata.titleTemplate,
  },
  description: t.metadata.description,
  keywords: t.metadata.keywords,
  authors: [{ name: t.common.author }],
  creator: t.common.author,
  publisher: t.common.author,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: t.metadata.ogTitle,
    description: t.metadata.ogDescription,
    url: t.common.url,
    siteName: t.common.siteName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: t.metadata.ogImageAlt,
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: t.metadata.twitterTitle,
    description: t.metadata.twitterDescription,
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
    icon: "/SocialShare_logo.webp",
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: t.common.siteName,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description: t.metadata.jsonLdDescription,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: t.common.url,
  author: {
    "@type": "Organization",
    name: t.common.author,
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
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          
          {/* Three-column layout */}
          <div className="flex min-h-screen">
            
            {/* Left fixed panel */}
            <div className="hidden lg:block w-[120px] shrink-0">
              <div className="fixed top-0 left-0 w-[120px] h-full bg-[#e8e8e8] dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-900 z-40" />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>

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