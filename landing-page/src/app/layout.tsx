import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "SocialShareButton",
  description: "Lightweight social share button library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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