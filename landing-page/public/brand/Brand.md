# Brand Guidelines

This document details the visual identity guidelines for **Social Share Button** as well as the parent **AOSSIE** organization. It is the reference for contributors and AI coding agents working on the website in `landing-page/`.

---

## 🎨 Social Share Button Color Palette

The two brand colors are sampled from the Social Share Button logo (a green share glyph with a golden-amber accent). They are close relatives of AOSSIE's Baggy Green and Golden Wallet.

| Color Name       | Color Sample | HEX Code  | RGB Code             | Role                                                   |
| :--------------- | :----------- | :-------- | :------------------- | :----------------------------------------------------- |
| **Share Green**  | 🟩           | `#16A34A` | `rgb(22, 163, 74)`   | Primary project color: logo mark, accents, focus rings |
| **Signal Amber** | 🟨           | `#F5B000` | `rgb(245, 176, 0)`   | Secondary project color: logo node, highlights         |
| **Ink**          | ⬛           | `#030712` | `rgb(3, 7, 18)`      | Dark canvas, light-theme text and primary buttons      |
| **Paper**        | ⬜           | `#FFFFFF` | `rgb(255, 255, 255)` | Light canvas, dark-theme text                          |

### Theme tokens

The website never hard-codes theme colors in components. Semantic tokens are defined in [`globals.css`](../../src/app/globals.css) for both themes and exposed to Tailwind CSS v4 through the `@theme` block (e.g. `bg-background-primary`, `text-foreground-secondary`, `border-line`).

| Token                    | Light     | Dark       | Use                                                                    |
| :----------------------- | :-------- | :--------- | :--------------------------------------------------------------------- |
| `--background`           | `#FFFFFF` | `#030712`  | Page canvas                                                            |
| `--foreground`           | `#030712` | `#FFFFFF`  | Headings and strong text                                               |
| `--foreground-secondary` | `#4B5563` | `#9CA3AF`  | Body copy                                                              |
| `--foreground-muted`     | `#636A77` | `#8B93A0`  | Captions, icons                                                        |
| `--line`                 | Ink @ 6%  | Paper @ 8% | Hairline rules between sections and grid cells                         |
| `--pattern-fg`           | Ink @ 5%  | Paper @ 8% | Diagonal hatching in page gutters                                      |
| `--accent`               | `#15803D` | `#4ADE80`  | Eyebrow labels, selected states (Share Green, contrast-adjusted)       |
| `--highlight`            | `#B45309` | `#FBBF24`  | Secondary eyebrows and numbering (Signal Amber, contrast-adjusted)     |
| `--code-bg`              | `#F6F8FA` | `#0C1019`  | Code panels; syntax colors (`--sh-*`) are ≥ 4.5:1 on it in both themes |

Accent tokens are darkened in light mode and lightened in dark mode so text meets WCAG AA contrast (≥ 4.5:1) against the canvas. Measured: accent 5.0:1 / 11.6:1, highlight 5.0:1 / 12.1:1, muted 5.4:1 / 6.2:1 (light / dark).

---

## 👁️ Social Share Button Visual Assets

### 1. Project Logo

- **Logo mark (vector):** [social-share-button-mark.svg](icons/social-share-button-mark.svg) at `/brand/icons/social-share-button-mark.svg`. Used in the header, footer, favicon and web manifest. A React copy lives in `BrandMark` inside `src/components/ui/Icons.tsx`; keep the two in sync.
- **Full logo with wordmark (raster):** [social-share-button-logo.webp](icons/social-share-button-logo.webp) at `/brand/icons/social-share-button-logo.webp`.

### 2. Project Favicon & Icons

- **Favicon:** [favicon.ico](icons/favicon.ico) at `/brand/icons/favicon.ico`
- **Apple touch icon:** [apple-icon.png](icons/apple-icon.png) at `/brand/icons/apple-icon.png`
- **Open Graph image (1200×630):** [og-image.png](og-image.png) at `/brand/og-image.png`

---

## ✍️ Typography

- **Sans (UI and headings):** **Inter**: headings use `font-medium` with `tracking-tighter`, after tailwindcss.com.
- **Eyebrow labels:** **Inter**, uppercase, semibold, `tracking-wide`, 14px (12px on phones) and never wrapped. Long labels use `Eyebrow fit`, which scales with its `@container` column.
- **Mono (code):** **IBM Plex Mono**.
- **Devanagari:** **Noto Sans Devanagari**: fallback for Hindi. Negative letter-spacing is disabled for `lang="hi"` because it breaks conjunct shaping.
- **Fallback Stack:** `ui-sans-serif, system-ui, sans-serif` and `ui-monospace, SFMono-Regular, Menlo, monospace`.
- **Configuration:** Fonts are loaded with the Next.js Google Font optimizer in [`SiteShell.tsx`](../../src/components/site/SiteShell.tsx) and bound to `--font-sans` / `--font-mono` in [`globals.css`](../../src/app/globals.css).

---

## 📐 Layout Language

The design follows [tailwindcss.com](https://tailwindcss.com): a centered content column framed by hatched gutters, full-bleed hairline rules between sections, hairline grids drawn with a `1px` gap over the `--line` color, pill-shaped buttons, and code panels that follow the theme (light in light mode, dark in dark mode). The header and footer sit inside the same column as the content, so they end exactly at the hatched pillars.

---

## 🏛️ AOSSIE Organization Branding

The parent organization (AOSSIE - Australian Open Source Software Innovation and Education) branding guidelines:

### Color Palette

| Color Name        | Color Sample | HEX Code  | RGB Code             | Role                  |
| :---------------- | :----------- | :-------- | :------------------- | :-------------------- |
| **Golden Wallet** | 🟡           | `#FFCD00` | `rgb(255, 205, 0)`   | Primary Brand Color   |
| **Baggy Green**   | 🟢           | `#00843D` | `rgb(0, 132, 61)`    | Secondary Brand Color |
| **Neutral Dark**  | ⬛           | `#121212` | `rgb(18, 18, 18)`    | Dark Layouts & Text   |
| **Neutral Light** | ⬜           | `#FFFFFF` | `rgb(255, 255, 255)` | Light Layouts & Text  |
| **Neutral Muted** | 🔘           | `#7A7A7A` | `rgb(122, 122, 122)` | Borders & Muted Text  |

### Organization Assets

- **AOSSIE Logo:** [aossie_logo.svg](icons/aossie_logo.svg) (`/brand/icons/aossie_logo.svg`)
- **Stability Nexus Logo:** [stability_nexus_logo.svg](icons/stability_nexus_logo.svg) (`/brand/icons/stability_nexus_logo.svg`)
