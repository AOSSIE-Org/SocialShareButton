import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Skip link, header, `<main>` and footer shared by the home page and the legal pages. */
export async function PageFrame({ locale, children }: { locale: string; children: ReactNode }) {
  const home = await getTranslations({ locale, namespace: "Home" });

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-button-primary-bg focus:px-4 focus:py-2 focus:text-sm focus:text-button-primary-text"
      >
        {home("skipToContent")}
      </a>
      {/*
        Hatched pillars run the full page height, after tailwindcss.com. Header, main and
        footer all live in the middle column, so the navbar and footer end exactly at the pillars.
      */}
      <div className="grid w-full flex-1 grid-cols-1 md:grid-cols-[2rem_minmax(0,1fr)_2rem] lg:grid-cols-[3rem_minmax(0,1fr)_3rem] 2xl:grid-cols-[4rem_minmax(0,1fr)_4rem]">
        <div aria-hidden className="hatch hidden border-r border-line md:block" />
        <div className="flex min-w-0 flex-col">
          <Header />
          <main id="main" className="min-w-0 flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <div aria-hidden className="hatch hidden border-l border-line md:block" />
      </div>
    </>
  );
}
