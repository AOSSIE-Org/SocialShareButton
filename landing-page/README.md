# Social Share Button — Website

The website for [Social Share Button](../README.md), live at **https://social-share-button.aossie.org**.

Built from the [AOSSIE Next.js webpage template](https://github.com/AOSSIE-Org/Template-Repo-NextJS): **Next.js 16 (App Router, static export)**, **React 19**, **Tailwind CSS v4**, **next-intl** (i18n/l10n), **next-themes** (light/dark/system) and **Lenis** smooth scrolling. The visual language follows [tailwindcss.com](https://tailwindcss.com).

AI coding agents: read [`../AGENTS.md`](../AGENTS.md) first.

---

## ⚡ Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). English is served at `/` and Hindi at `/hi`.

| Command                | What it does                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Syncs the library, then starts the dev server                                                                       |
| `npm run build`        | Syncs the library, then writes a static export to `out/`                                                            |
| `npm run lint`         | ESLint (Next.js core-web-vitals + TypeScript rules)                                                                 |
| `npm run sync-library` | Copies `../src/social-share-button.{js,css}` into `public/vendor/` and re-pins the CDN version in `public/llms.txt` |

The site **dogfoods the library**: the header's “Share” item and the “Click to Try Demo” live preview use the real `SocialShareButton` from `../src`. `predev` copies the library once, before the dev server starts; if you edit `../src` while `npm run dev` is running, run `npm run sync-library` to pick up the change. The version badge, CDN snippets and the gzipped-size metric are all derived from `../package.json` and `../src` at build time (see `next.config.ts`) — never hard-code them.

---

## 📂 Structure

```text
landing-page/
├── next.config.ts              # Static export, next-intl plugin, library version & size
├── scripts/sync-library.mjs    # Runs before dev/build
├── public/
│   ├── .well-known/            # ai-plugin.json, assetlinks.json (empty: no Android app)
│   ├── brand/                  # Brand.md, logo mark, favicon, Open Graph image
│   ├── vendor/                 # (generated, git-ignored) copy of ../src
│   └── llms.txt, robots.txt, openapi.yaml, site.webmanifest
└── src/
    ├── app/
    │   ├── (default)/          # Root layout + page for "/" (default locale, canonical)
    │   ├── [locale]/           # Root layout + page for "/en", "/hi"; error & not-found
    │   ├── globals.css         # Theme tokens and Tailwind v4 bindings
    │   └── sitemap.ts
    ├── components/
    │   ├── site/               # SiteShell (<html>), HomePage, Header, Footer
    │   ├── sections/           # Hero, Installation, TrustedBy, Features, Metrics, UseCases, Architecture, Faq, Testimonials
    │   ├── demo/               # Live preview dialog
    │   ├── ui/                 # CodeBlock, InfoTip, Section/Eyebrow, Icons
    │   └── providers/          # theme-provider, lenis-provider
    ├── config/                 # languages.ts, site.ts (URLs, social links, CDN base)
    ├── content/install.ts      # Copy-paste snippets per framework
    ├── i18n/                   # routing, request, navigation, metadata, messages
    ├── lib/                    # platforms.ts (constants), social-share-button.ts (React bindings)
    └── messages/               # en.json, hi.json
```

---

## 🛠️ Usage Guide

### 1. Adding a New Language

To add French (`fr`):

1. Register it in [`src/config/languages.ts`](src/config/languages.ts):
   ```ts
   { code: 'fr', name: 'French', localName: 'Français' },
   ```
2. Copy `src/messages/en.json` to `src/messages/fr.json` and translate the values. Keep every key.
3. Import the catalog in [`src/i18n/messages.ts`](src/i18n/messages.ts) and add its Open Graph locale (e.g. `fr_FR`) in [`src/i18n/metadata.ts`](src/i18n/metadata.ts).

Routing, static params, `hreflang` alternates and the sitemap pick the new locale up automatically.

### 2. Translating Text

Every user-visible string lives in `src/messages/*.json`. Server Components use `useTranslations` / `getTranslations`, Client Components use `useTranslations`:

```tsx
import { useTranslations } from "next-intl";

export function Example() {
  const t = useTranslations("Hero");
  return <p>{t("subtitle")}</p>;
}
```

ICU message syntax treats `<tag>` as rich text, so never write literal HTML tags in a message. Pass them as values, or mark inline code with the `code` tag:

```tsx
// "cdnHead": "Add <code>{tag}</code> to your HTML within <code>{parent}</code>"
t.rich("cdnHead", { ...richCode, tag: "<link>", parent: "<head>" });
```

Code snippets in [`src/content/install.ts`](src/content/install.ts) are not translated.

### 3. Navigation Helpers

Use the locale-aware helpers from [`src/i18n/navigation.ts`](src/i18n/navigation.ts) instead of `next/link` / `next/navigation`:

```tsx
import { Link, useRouter, usePathname } from "@/i18n/navigation";
```

### 4. Theme & Design Tokens

Colors are semantic CSS variables defined for both themes in [`src/app/globals.css`](src/app/globals.css) and exposed as Tailwind utilities. Use the tokens instead of `dark:` variants:

```tsx
<div className="bg-background-primary text-foreground-secondary border-t border-line">…</div>
```

Design primitives, after tailwindcss.com:

- `hatch` — diagonal hatching for gutters and empty states
- `border-line` — hairline rules; `gap-px bg-line` draws hairline grids
- `<Eyebrow>` — mono uppercase section labels; `<SectionHeading>` — `font-medium tracking-tighter` headings

New colors must be added to `:root` and `.dark` and keep WCAG AA contrast. Document palette changes in [`public/brand/Brand.md`](public/brand/Brand.md).

### 5. Smooth Scrolling (Lenis)

Configured in [`src/components/providers/lenis-provider.tsx`](src/components/providers/lenis-provider.tsx) with anchor-link support (offset for the sticky header). It is disabled for `prefers-reduced-motion`, and pauses while a share modal or the demo dialog is open. Add `data-lenis-prevent` to any element that scrolls on its own.

### 6. Updating the Installation Guide

When the library's recommended integration changes, update [`src/content/install.ts`](src/content/install.ts) together with the README “Quick Start Guide” and [`public/llms.txt`](public/llms.txt).

### 7. Adding Adopters and Testimonials

- Organizations for the “Trusted by builders at” marquee: `organizations` in [`src/components/sections/TrustedBy.tsx`](src/components/sections/TrustedBy.tsx).
- Testimonials: `testimonials` in [`src/components/sections/MoreSections.tsx`](src/components/sections/MoreSections.tsx). Only add real quotes from people who agreed to be quoted; until then the section shows an invitation instead.

---

## 🚀 Deployment

`npm run build` writes a static site to `out/`. [`.github/workflows/nextjs.yml`](../.github/workflows/nextjs.yml) builds it on every pull request and deploys `main` to GitHub Pages. [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs lint and build, and [`.github/workflows/seo-audit.yml`](../.github/workflows/seo-audit.yml) checks links, Lighthouse scores, the canonical URL, the single `<h1>` and JSON-LD.

Set `NEXT_PUBLIC_SITE_URL` at build time to deploy under a different domain (default: `https://social-share-button.aossie.org`).
