import Link from "next/link";
import { SiteNavbar } from "@/components/SiteNavbar";

const notFoundCopy = {
  title: "Page Not Found",
  message: "This page doesn\u0027t exist. It may have been moved or removed.",
  goHome: "Go home",
  readDocs: "Read the docs",
};

export const metadata = {
  title: notFoundCopy.title,
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-16">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-4">404</h1>
        <p className="text-lg text-neutral-600 mb-8">
          {notFoundCopy.message}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-[#00C853] text-black font-semibold hover:opacity-90 transition"
          >
            {notFoundCopy.goHome}
          </Link>
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
          >
            {notFoundCopy.readDocs}
          </Link>
        </div>
      </main>
    </div>
  );
}

