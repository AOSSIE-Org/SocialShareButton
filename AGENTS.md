<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `landing-page/node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Social Share Button

A lightweight, zero-dependency social share button library (vanilla JS + CSS) and its website. This repository contains **two projects**:

| Path               | What it is                                            | Toolchain                                                            |
| ------------------ | ----------------------------------------------------- | -------------------------------------------------------------------- |
| `src/` (repo root) | The library published to npm and jsDelivr             | Plain JS/CSS, Prettier (`pnpm`/`npm run format`)                     |
| `landing-page/`    | The website at https://social-share-button.aossie.org | Next.js 16, React 19, Tailwind CSS v4, next-intl, next-themes, Lenis |

## 🛠️ Stack & Commands

- **Library:** no build step. `npm run format` / `npm run format:check` at the repo root. Test by opening `index.html` in a browser.
- **Website stack:** Next.js 16.2 App Router (Turbopack, `output: "export"`), React 19, Tailwind CSS v4, `next-intl` (i18n), `next-themes` (light/dark; first visit follows the OS preference), `lenis` (smooth scroll), `sugar-high` (syntax highlighting).
- **Website commands** (run inside `landing-page/`): `npm run dev`, `npm run build`, `npm run lint`.
- `predev`/`prebuild` run `scripts/sync-library.mjs`, which copies `../src/social-share-button.{js,css}` into `public/vendor/` (git-ignored) and re-pins the CDN version in `public/llms.txt`. The site always demos the library code of the current commit.

---

## 🧩 Library Rules (`src/`)

- Zero runtime dependencies. Never add one.
- The library must work from a plain `<script>` tag and expose `window.SocialShareButton`.
- **Privacy by design:** the library never collects or sends data. It only emits events (DOM `social-share` CustomEvent, `onAnalytics`, `analyticsPlugins`).
- When you change options or behavior, update the README "Configuration" table, `landing-page/src/content/install.ts` (copy-paste snippets) and `landing-page/public/llms.txt`.
- `updateOptions()` does **not** re-render theme, style or platforms. To reflect those, destroy and recreate the instance (see `landing-page/src/lib/social-share-button.ts`).
- The library modal uses `z-index: 99999` and locks `body` scroll. Do not render it inside a native top-layer `<dialog>`, or it will appear underneath.

---

## 🎨 Styles & Theme System (website)

- **Class-Based Dark Mode:** Tailwind CSS v4 uses `@custom-variant dark (&:where(.dark, .dark *))` in [`globals.css`](landing-page/src/app/globals.css).
- **Semantic Tokens:** Do **not** write inline dark utilities (e.g. `dark:bg-black`). Use the semantic classes bound to theme variables (`bg-background-primary`, `text-foreground-secondary`, `border-line`, `bg-accent-soft`, …). New colors go into `:root` **and** `.dark`, then into `@theme`.
- **Contrast:** text tokens must stay at WCAG AA (≥ 4.5:1) in both themes. Brand.md lists the measured ratios.
- **Design language:** tailwindcss.com: hatched gutters (`hatch` utility), hairline rules (`border-line`), hairline grids (`gap-px bg-line`), uppercase single-line eyebrows (`Eyebrow`), pointer-following border light for card groups (`GlowGroup`), `font-medium tracking-tighter` headings.
- **Typography:** Inter (`--font-sans`), IBM Plex Mono (`--font-mono`), Noto Sans Devanagari for Hindi. Negative tracking is disabled for `lang="hi"`.
- **Brand:** see [`landing-page/public/brand/Brand.md`](landing-page/public/brand/Brand.md).

---

## 🌐 i18n & l10n Routing (website)

- **Two root layouts:** `src/app/(default)/` serves the default locale (English) at `/`; `src/app/[locale]/` serves `/en` and `/hi`. Both render `SiteShell` + `HomePage`. `/` is canonical for English (it is not a redirect: a static export can only redirect client-side, which the SEO audit workflow would fail).
- **Awaiting params:** Layout and Page `params` are Promises in Next.js 15/16. Always `await params`.
- **Static Export:** call `setRequestLocale(locale)` in layouts and pages and export `generateStaticParams()` under `[locale]`.
- **Navigation:** never import `Link`, `useRouter` or `usePathname` from `next/link` / `next/navigation`. Use [`src/i18n/navigation.ts`](landing-page/src/i18n/navigation.ts).
- **Strings:** every user-visible string lives in `src/messages/en.json` and `hi.json` with identical keys. Code snippets are not translated. ICU treats `<tag>` as rich text — pass literal tags like `<head>` as values, or use the `code` tag with `t.rich(..., richCode)`.
- **Adding a language:** register it in `src/config/languages.ts`, add `src/messages/<code>.json`, import it in `src/i18n/messages.ts` and add its Open Graph locale in `src/i18n/metadata.ts`.

---

## 📦 Project Boundaries

- **Config:** `next.config.ts` wraps the config with `createNextIntlPlugin("./src/i18n/request.ts")` and injects `NEXT_PUBLIC_LIBRARY_VERSION` and `NEXT_PUBLIC_LIBRARY_GZIP_KB` computed from `../package.json` and `../src`. Never hard-code the version or bundle size.
- **Site constants:** URLs, social links and the CDN base live in [`src/config/site.ts`](landing-page/src/config/site.ts). The production domain can be overridden with `NEXT_PUBLIC_SITE_URL`.
- **Server vs client:** constants shared with Server Components go in `src/lib/platforms.ts` (no hooks). React bindings for the library live in `src/lib/social-share-button.ts` and are imported only by Client Components.
- **Branding Assets:** logos, favicon, Open Graph image and `Brand.md` live in [`landing-page/public/brand/`](landing-page/public/brand/).
- **Machine-readable files:** `public/llms.txt`, `public/robots.txt`, `public/openapi.yaml`, `public/.well-known/`. Deployment uses `actions/upload-pages-artifact@v3`, which keeps dotfiles; v4 drops them by default — keep `.well-known/` in mind before upgrading.
- **Testimonials:** only real, consented quotes (`src/components/sections/MoreSections.tsx`). Never invent them.
