import Link from "next/link";
import { SiteNavbar } from "@/components/SiteNavbar";

export const metadata = {
  title: "Page Not Found",
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
        <p className="text-lg text-neutral-500 mb-8">
          This page doesn&apos;t exist. It may have been moved or removed.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full bg-[#00C853] text-black font-semibold hover:opacity-90 transition"
          >
            Go home
          </Link>
          <Link
            href="/docs"
            className="px-5 py-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-900 transition"
          >
            Read the docs
          </Link>
        </div>
      </main>
    </div>
  );
}
