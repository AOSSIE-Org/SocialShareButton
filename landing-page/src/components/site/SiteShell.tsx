import type { ReactNode } from "react";
import Script from "next/script";
import { IBM_Plex_Mono, Inter, Noto_Sans_Devanagari } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { messagesMap, defaultMessages } from "@/i18n/messages";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { vendorBase } from "@/config/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

/**
 * The <html> document shared by both root layouts: `/` (default locale, see app/(default))
 * and `/[locale]`. Loads the SocialShareButton library that the page dogfoods.
 */
export function SiteShell({ locale, children }: { locale: string; children: ReactNode }) {
  // Provide messages to Client Components directly via messagesMap
  const messages = messagesMap[locale] || defaultMessages;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${plexMono.variable} ${devanagari.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-background-primary text-foreground-primary font-sans"
        suppressHydrationWarning
      >
        <link rel="stylesheet" href={`${vendorBase}/social-share-button.css`} precedence="default" />
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          <ThemeProvider>
            <LenisProvider>{children}</LenisProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Script src={`${vendorBase}/social-share-button.js`} strategy="afterInteractive" />
      </body>
    </html>
  );
}
