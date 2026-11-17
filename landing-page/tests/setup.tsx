/**
 * Runs before every test file (vitest.config.mts `setupFiles`). Mocks only what Node and jsdom
 * cannot provide; everything else (next-intl, next-themes, the message catalogs) is real.
 */
import type { ReactNode } from "react";
import { afterEach, vi } from "vitest";
import { lenis, media, navigation, resetHelpers } from "./helpers";

// Server-only next-intl APIs need a Next.js request context; serve them from the real catalogs instead.
vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const { messagesMap, defaultMessages } = await import("@/i18n/messages");
  return {
    setRequestLocale: vi.fn(),
    getTranslations: async ({ locale, namespace }: { locale: string; namespace?: string }) =>
      createTranslator({ locale, messages: messagesMap[locale] ?? defaultMessages, namespace: namespace as never }),
    // The request config factory is the plain function next-intl would call per request
    getRequestConfig: <T,>(create: T) => create,
  };
});

// next/font is a build-time transform; at runtime it only exposes class names and CSS variables.
vi.mock("next/font/google", () => {
  const font = (name: string) => () => ({ className: `font-${name}`, variable: `--font-${name}`, style: { fontFamily: name } });
  return { Inter: font("inter"), IBM_Plex_Mono: font("plex-mono"), Noto_Sans_Devanagari: font("devanagari") };
});

// next/script injects scripts through the Next.js runtime; render a plain tag so the src can be checked.
vi.mock("next/script", () => ({
  // eslint-disable-next-line @next/next/no-sync-scripts -- a test double that only records the src and strategy
  default: ({ src, strategy }: { src: string; strategy?: string }) => <script src={src} data-strategy={strategy} />,
}));

// The pathname and router come from the Next.js App Router, which tests do not run; Link and getPathname stay real.
vi.mock("@/i18n/navigation", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/i18n/navigation")>();
  return { ...actual, usePathname: () => navigation.pathname, useRouter: () => navigation.router };
});

// Lenis drives scrolling with requestAnimationFrame and window.scrollTo, which jsdom cannot lay out.
vi.mock("lenis/react", () => ({
  ReactLenis: ({ children, root, options }: { children: ReactNode; root?: boolean; options?: object }) => (
    <div data-testid="lenis" data-root={String(root)} data-options={JSON.stringify(options)}>
      {children}
    </div>
  ),
  useLenis: () => lenis.instance,
}));

if (typeof window !== "undefined") {
  // jsdom has no matchMedia; queries match when a test adds them to `media.matching`.
  window.matchMedia = (query: string) =>
    ({
      media: query,
      get matches() {
        return media.matching.has(query);
      },
      onchange: null,
      addEventListener: (_type: string, listener: () => void) => {
        if (!media.listeners.has(query)) media.listeners.set(query, new Set());
        media.listeners.get(query)!.add(listener);
      },
      removeEventListener: (_type: string, listener: () => void) => media.listeners.get(query)?.delete(listener),
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

afterEach(async () => {
  // Vitest runs without globals, so React Testing Library cannot register its own cleanup
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
    document.documentElement.removeAttribute("class");
    document.documentElement.removeAttribute("style");
    localStorage.clear();
    delete window.SocialShareButton;
  }
  resetHelpers();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
