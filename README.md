<!-- Don't delete it -->
<div id="readme-top"></div>

> ⚠️ **IMPORTANT**
>
> All project discussions happens on **[Discord](https://discord.com/channels/1022871757289422898/1479012884209078365)**.
>
> Please join the server **before opening PRs or Issues** and notify/tag the maintainer.  
> Failing to do so may cause **delays in review**.
>
> **Maintainer:** @kpj2006

<!-- Organization Logo -->
<p align="center">
  <img src="public/aossie_logo.svg" height="130" alt="AOSSIE logo" />
  &nbsp;&nbsp;
  <img src="public/socialshare.png" height="150" alt="Social Share Button logo" />
</p>

<!-- Organization Name -->
<p align="center">
  <a href="https://github.com/AOSSIE-Org/SocialShareButton">
    <img src="https://img.shields.io/badge/AOSSIE-Social_Share_Button-228B22?style=for-the-badge&labelColor=FFC517" alt="AOSSIE Social Share Button Badge" />
  </a>
</p>

<p align="center">
  <img src="./badges/lighthouse-performance.svg" alt="Lighthouse Performance" />
  <img src="./badges/lighthouse-accessibility.svg" alt="Lighthouse Accessibility" />
  <img src="./badges/lighthouse-best-practices.svg" alt="Lighthouse Best Practices" />
  <img src="./badges/lighthouse-seo.svg" alt="Lighthouse SEO" />
  <img src="./badges/lighthouse-pwa.svg" alt="Lighthouse PWA" />
</p>

<!-- Organization/Project Social Handles -->
<p align="center">
  <a href="https://t.me/StabilityNexus">
    <img src="https://img.shields.io/badge/Telegram-black?style=flat&logo=telegram&logoColor=white&logoSize=auto&color=24A1DE" alt="Telegram Badge"/>
  </a>
  &nbsp;
  <a href="https://x.com/aossie_org">
    <img src="https://img.shields.io/twitter/follow/aossie_org" alt="X (formerly Twitter) Badge"/>
  </a>
  &nbsp;
  <a href="https://discord.gg/hjUhu33uAn">
    <img src="https://img.shields.io/discord/1022871757289422898?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord Badge"/>
  </a>
  &nbsp;
  <a href="https://news.stability.nexus/">
    <img src="https://img.shields.io/badge/Medium-black?style=flat&logo=medium&logoColor=black&logoSize=auto&color=white" alt="Medium Badge"/>
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/company/aossie/">
    <img src="https://img.shields.io/badge/LinkedIn-black?style=flat&logo=LinkedIn&logoColor=white&logoSize=auto&color=0A66C2" alt="LinkedIn Badge"/>
  </a>
  &nbsp;
  <a href="https://www.youtube.com/@StabilityNexus">
    <img src="https://img.shields.io/youtube/channel/subscribers/UCZOG4YhFQdlGaLugr_e5BKw?style=flat&logo=youtube&logoColor=white&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube Badge"/>
  </a>
</p>

---

<div align="center">
<h1>Social Share Button</h1>
</div>

Lightweight social sharing component for web applications. **Zero dependencies, framework-agnostic.** One script and one stylesheet add a share button and a clean share modal to any website.

🌐 **Website & live demo:** [social-share-button.aossie.org](https://social-share-button.aossie.org)

[![npm version](https://img.shields.io/npm/v/@aossie-org/social-share-button.svg)](https://www.npmjs.com/package/@aossie-org/social-share-button)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

---

## 🚀 Project's Features

- 🌐 **Multiple platforms:** WhatsApp, Facebook, X, LinkedIn, Telegram, Reddit, Email, Pinterest, Discord
- 🎯 **Zero dependencies:** pure vanilla JavaScript
- ⚛️ **Framework support:** React, Preact, Next.js, Qwik, Vue, Angular, or plain HTML
- 🔄 **SPA-aware:** auto-detects the current URL and page title, and follows client-side route changes
- 📱 **Responsive:** fully responsive and mobile-ready
- 🎨 **Customizable:** dark/light themes, four button styles, custom colors and classes
- 📊 **Privacy-first analytics:** emits events only — adapters for Google Analytics 4, Mixpanel, Segment, Plausible and PostHog
- ⚡ **Lightweight:** ≈15 KB gzipped for the JS + CSS (unminified; the website computes the exact figure at build time)

---

## 💻 Tech Stack

| Part                      | Stack                                                                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library (`src/`)          | Vanilla JavaScript, plain CSS, no runtime dependencies. Delivered via [jsDelivr](https://www.jsdelivr.com/) and [npm](https://www.npmjs.com/package/@aossie-org/social-share-button). Formatted with Prettier. |
| Framework wrappers        | React (`social-share-button-react.jsx`), Preact (`social-share-button-preact.jsx`), Qwik (`social-share-button-qwik.tsx`)                                                                                      |
| Website (`landing-page/`) | Next.js 16 (App Router, static export), React 19, Tailwind CSS v4, TypeScript, `next-intl` (i18n/l10n), `next-themes`, Lenis, `sugar-high`                                                                     |
| CI/CD                     | GitHub Actions — lint & build, GitHub Pages deployment, Lighthouse/SEO audit, dependency review, CodeRabbit AI review                                                                                          |

---

## 📋 Project Maturity & TODO Checklist

In the checklist below, mark the items that have been completed for the project:

- [x] The project has a logo (`public/socialshare.png`, `landing-page/public/brand/icons/social-share-button-mark.svg`).
- [x] The project has a favicon (`landing-page/public/brand/icons/favicon.ico`).
- [x] The web frontend:
  - [x] Has proper title and metadata.
  - [x] Has proper open graph metadata, to ensure that it is shown well when shared in social media.
  - [x] Has a footer and header with AOSSIE logos and social handles.
  - [x] Uses React Server Components by default, introducing Client Components (`"use client"`) only when interactivity or client hooks are required.
  - [x] Is deployed to GitHub Pages via a GitHub Workflow (`.github/workflows/nextjs.yml`).
  - [x] Has automated CI build and lint validation (`.github/workflows/ci.yml`).
  - [x] Has CodeRabbit automated AI code review (`.coderabbit.yaml`).
  - [x] Has open-source legal compliance (`DCO.md`, `COPYRIGHT.md`, `LICENSE`).
  - [x] Is available in more than one language (English and Hindi).
  - [ ] Features real testimonials from adopters.

See also the [OpenSSF-based best practices checklist](BestPracticesChecklist.md).

---

## 🚀 Website's Features

The website in [`landing-page/`](landing-page/) is built from the [AOSSIE Next.js webpage template](https://github.com/AOSSIE-Org/Template-Repo-NextJS):

- **Dogfooded:** the “Share” button in the navigation and the “Click to Try Demo” live preview run the real library from `src/`, copied in at build time.
- **Copy-paste installation guide:** pick a framework and get the exact snippets, with a copy button on every code block and beginner-friendly tooltips.
- **Next.js 16 & React 19:** Server Components, static export, async routing.
- **Tailwind CSS v4:** semantic design tokens with a design language inspired by [tailwindcss.com](https://tailwindcss.com).
- **Dual Theme System:** flash-free light and dark themes with `next-themes`; first-time visitors start on their OS preference.
- **Robust i18n & l10n:** English at `/` and Hindi at `/hi` with `next-intl`, localized metadata, `hreflang` alternates and a localized sitemap.
- **SEO & AI discoverability:** Open Graph, JSON-LD (`SoftwareApplication`, `FAQPage`), `robots.txt`, `sitemap.xml`, `llms.txt`, `.well-known/ai-plugin.json`.
- **Accessibility:** keyboard-navigable listbox and dialog, focus management, skip link, WCAG AA color contrast.
- **AI Agent Pairing Ready:** includes [`AGENTS.md`](AGENTS.md) and [`CLAUDE.md`](CLAUDE.md).

---

## 📂 Project Structure

```text
├── .github/
│   ├── ISSUE_TEMPLATE/          # Bug, feature and good-first-issue templates
│   ├── copilot/                 # AI-agent prompts for integrating the library
│   └── workflows/               # CI, GitHub Pages deploy, SEO audit, labels, template sync
├── src/                         # 📦 The library (published to npm / jsDelivr)
│   ├── social-share-button.js           # Core
│   ├── social-share-button.css          # Styles
│   ├── social-share-analytics.js        # Optional analytics adapters
│   └── social-share-button-{react,preact,qwik}.*  # Optional framework wrappers
├── index.html                   # Local demo page for the library
├── docs/                        # Roadmap and guides
├── landing-page/                # 🌐 The website (Next.js 16)
│   ├── next.config.ts           # Static export + next-intl; injects library version & size
│   ├── scripts/sync-library.mjs # Copies ../src into public/vendor before dev/build
│   ├── public/
│   │   ├── .well-known/         # ai-plugin.json, assetlinks.json
│   │   ├── brand/               # Brand.md, logos, favicon, Open Graph image
│   │   └── llms.txt, robots.txt, openapi.yaml, site.webmanifest
│   └── src/
│       ├── app/
│       │   ├── (default)/       # "/" — default locale (English), canonical
│       │   ├── [locale]/        # "/en", "/hi" + localized error & not-found pages
│       │   ├── globals.css      # Tailwind v4 theme tokens (light/dark)
│       │   └── sitemap.ts       # Localized sitemap
│       ├── components/          # site/, sections/, demo/, ui/, providers/
│       ├── config/              # languages.ts, site.ts
│       ├── content/install.ts   # Per-framework installation snippets
│       ├── i18n/                # routing, request, navigation, metadata, messages
│       ├── lib/                 # Library constants and React bindings
│       └── messages/            # en.json, hi.json
├── AGENTS.md / CLAUDE.md        # Guidance for AI coding agents
├── BestPracticesChecklist.md    # OpenSSF-based checklist
├── CONTRIBUTING.md, MAINTAINERS.md, SECURITY.md
├── COPYRIGHT.md, DCO.md, LICENSE
└── .coderabbit.yaml             # CodeRabbit AI review configuration
```

---

## 📦 Installation

### Via CDN (Recommended)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
/>
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
```

---

## ⚡ Quick Start Guide

> 🚫 **IMPORTANT:** Do NOT create new files like `ShareButton.jsx` or `ShareButton.tsx`!  
> ✅ Add code directly to your **existing** component (Header, Navbar, etc.)

### 🗺️ Integration Overview

No matter which framework you use, integration always follows the same 3 steps:

| Step                 | What to do                                                   | Where                                                                                          |
| -------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **1️⃣ Load Library**  | Add CSS + JS (CDN links)                                     | Global layout file — `index.html` / `layout.tsx` / `_document.tsx`                             |
| **2️⃣ Add Container** | Place `<div id="share-button"></div>`                        | The UI component where you want the button to appear                                           |
| **3️⃣ Initialize**    | Call `new SocialShareButton({ container: "#share-button" })` | Inside that component, after the DOM is ready (e.g. `useEffect`, `mounted`, `ngAfterViewInit`) |

> 💡 Pick your framework below for the full copy-paste snippet:

<details>
<summary><b>📦 Create React App</b></summary>

### Step 1: Add CDN to `public/index.html`

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
  />
</head>
<body>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
</body>
```

### Step 2: Add to your layout or header component

Open an **existing** component that renders on every page — typically `src/components/Header.jsx`, `src/layouts/MainLayout.jsx`, or your root `App.jsx`. Add the snippet below to that component so the share button is consistently available across your app.

```jsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // omit if not using React Router

// ⬇️ Replace 'Header' with the name of the component where you want the
// share button to appear — e.g. Navbar, MainLayout, App, etc.
function Header() {
  const shareButtonRef = useRef(null);
  const initRef = useRef(false);
  const { pathname } = useLocation(); // omit if not using React Router

  useEffect(() => {
    if (initRef.current || !window.SocialShareButton) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: "#share-button",
    });
    initRef.current = true;

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  // Keep the share URL and title in sync with the current route
  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: window.location.href,
        title: document.title,
      });
    }
  }, [pathname]); // re-runs on every client-side route change

  return (
    <header>
      <div id="share-button"></div>
    </header>
  );
}
```

</details>

<details>
<summary><b>▲ Next.js (App Router)</b></summary>

### Step 1: Add CDN to `app/layout.tsx`

```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
```

### Step 2: Add to a Client Component (Header, Navbar, or similar)

Because `SocialShareButton` manipulates the DOM, it must run inside a **Client Component** (note the `"use client"` directive at the top). Add the snippet below to an existing component such as `app/components/Header.tsx` or `app/components/Navbar.tsx` — any component already included in your layout.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// ⬇️ Replace 'Header' with the name of the component where you want the
// share button to appear — e.g. Navbar, MainLayout, App, etc.
export default function Header() {
  const shareButtonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const initButton = () => {
      if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

      shareButtonRef.current = new window.SocialShareButton({
        container: "#share-button",
      });
      initRef.current = true;
    };

    if (window.SocialShareButton) {
      initButton();
    } else {
      const checkInterval = setInterval(() => {
        if (window.SocialShareButton) {
          clearInterval(checkInterval);
          initButton();
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (shareButtonRef.current?.destroy) {
          shareButtonRef.current.destroy();
        }
        initRef.current = false;
      };
    }

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  // Keep the share URL and title in sync with the current route
  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: window.location.href,
        title: document.title,
      });
    }
  }, [pathname]); // re-runs on every client-side navigation

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}

declare global {
  interface Window {
    SocialShareButton: any;
  }
}
```

</details>

<details>
<summary><b>📄 Next.js (Pages Router)</b></summary>

### Step 1: Add CDN to `pages/_document.tsx`

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
      </body>
    </Html>
  );
}
```

### Step 2: Add to your Header, Navbar, or shared layout component

Open an existing component that is rendered on every page — typically `components/Header.tsx`, `components/Navbar.tsx`, or `components/Layout.tsx`. Since `_document.tsx` loads the script globally, the button is ready to initialize in any of these components.

```tsx
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

// ⬇️ Replace 'Header' with the name of the component where you want the
// share button to appear — e.g. Navbar, MainLayout, App, etc.
export default function Header() {
  const shareButtonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const { pathname } = useRouter();

  useEffect(() => {
    const initButton = () => {
      if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

      shareButtonRef.current = new window.SocialShareButton({
        container: "#share-button",
      });
      initRef.current = true;
    };

    if (window.SocialShareButton) {
      initButton();
    } else {
      const checkInterval = setInterval(() => {
        if (window.SocialShareButton) {
          clearInterval(checkInterval);
          initButton();
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (shareButtonRef.current?.destroy) {
          shareButtonRef.current.destroy();
        }
        initRef.current = false;
      };
    }

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  // Keep the share URL and title in sync with the current route
  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: window.location.href,
        title: document.title,
      });
    }
  }, [pathname]); // re-runs on every client-side navigation

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}

declare global {
  interface Window {
    SocialShareButton: any;
  }
}
```

</details>

<details>
<summary><b>⚡ Vite / Vue / Angular</b></summary>

### Step 1: Add CDN to `index.html`

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
  />
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
</body>
```

### Step 2: Add a container element and initialize in your component

Open your root or layout component (e.g., `App.vue`, `app.component.html`, or `App.jsx`). Add a container `<div>` where you want the button to appear, then initialize the button after the DOM is ready:

```javascript
// Add <div id="share-button"></div> to your component's template/HTML first,
// then initialize once the DOM is ready (e.g., in mounted(), ngAfterViewInit(), or useEffect()):
new window.SocialShareButton({
  container: "#share-button",
});
```

</details>

<details>
<summary><b>⚛️ Preact</b></summary>

### Step 1: Add CDN to `index.html`

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
  />
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
</body>
```

### Step 2: Add to a layout or header component

Open an **existing** component that renders on every page — typically `src/components/Header.jsx`, `src/components/Navbar.jsx`, or your root `App.jsx`. Add the snippet below to that component so the share button is consistently available across your app.

```jsx
import { useEffect, useRef } from "preact/hooks";

// ⬇️ Replace 'Header' with the name of the component where you want the
// share button to appear — e.g. Navbar, MainLayout, App, etc.
export default function Header() {
  const shareButtonRef = useRef(null);
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: "#share-button",
    });
    initRef.current = true;

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}
```

</details>

---

## ⚙️ Configuration

### Basic Options

```jsx
new SocialShareButton({
  container: "#share-button", // Required: CSS selector or DOM element
  url: "https://example.com", // Optional: defaults to window.location.href
  title: "Custom Title", // Optional: defaults to document.title
  buttonText: "Share", // Optional: button label text
  buttonStyle: "primary", // default | primary | compact | icon-only
  theme: "dark", // dark | light
  platforms: ["twitter", "linkedin"], // Optional: defaults to all platforms
});
```

### All Available Options

| Option             | Type           | Default                | Description                                        |
| ------------------ | -------------- | ---------------------- | -------------------------------------------------- |
| `container`        | string/Element | -                      | **Required.** CSS selector or DOM element          |
| `url`              | string         | `window.location.href` | URL to share                                       |
| `title`            | string         | `document.title`       | Share title/headline                               |
| `description`      | string         | `''`                   | Additional description text                        |
| `hashtags`         | array          | `[]`                   | Hashtags for posts (e.g., `['js', 'webdev']`)      |
| `via`              | string         | `''`                   | Twitter handle (without @)                         |
| `platforms`        | array          | All platforms          | Platforms to show (see below)                      |
| `buttonText`       | string         | `'Share'`              | Button label text                                  |
| `buttonStyle`      | string         | `'default'`            | `default`, `primary`, `compact`, `icon-only`       |
| `buttonColor`      | string         | `''`                   | Custom button background color                     |
| `buttonHoverColor` | string         | `''`                   | Custom button hover color                          |
| `customClass`      | string         | `''`                   | Additional CSS class for button                    |
| `theme`            | string         | `'dark'`               | `dark` or `light`                                  |
| `modalPosition`    | string         | `'center'`             | Modal position on screen                           |
| `showButton`       | boolean        | `true`                 | Show/hide the share button                         |
| `onShare`          | function       | `null`                 | Callback when user shares: `(platform, url) => {}` |
| `onCopy`           | function       | `null`                 | Callback when user copies link: `(url) => {}`      |

**Available Platforms:**  
`whatsapp`, `facebook`, `twitter`, `linkedin`, `telegram`, `reddit`, `email`, `pinterest`, `discord`

### Customize Share Message/Post Text

Control the text that appears when users share to social platforms:

```jsx
new SocialShareButton({
  container: "#share-button",
  url: "https://myproject.com",
  title: "Check out my awesome project!", // Main title/headline
  description: "An amazing tool for developers", // Additional description
  hashtags: ["javascript", "webdev", "opensource"], // Hashtags included in posts
  via: "MyProjectHandle", // Your Twitter handle
});
```

**How messages are customized per platform:**

- **WhatsApp:** `title` + `description` + `hashtags` + link
- **Facebook:** `title` + `description` + `hashtags` + link
- **Twitter/X:** `title` + `description` + `hashtags` + `via` handle + link
- **Telegram:** `title` + `description` + `hashtags` + link
- **LinkedIn:** `title` + `description` + link
- **Reddit:** `title` - `description` (used as title)
- **Email:** Subject = `title`, Body = `description` + link
- **Pinterest:** `title` + `description` + `hashtags` + link
- **Discord:** `title` + `description` + `hashtags` + link

### Customize Button Color & Appearance

**Option 1: Use Pre-built Styles** (Easiest)

```jsx
new SocialShareButton({
  container: "#share-button",
  buttonStyle: "primary", // or 'default', 'compact', 'icon-only'
});
```

**Option 2: Programmatic Color Customization** (Recommended)

Pass `buttonColor` and `buttonHoverColor` to match your project's color scheme:

```jsx
new SocialShareButton({
  container: "#share-button",
  buttonColor: "#ff6b6b", // Button background color
  buttonHoverColor: "#ff5252", // Hover state color
});
```

**Option 3: CSS Class Customization** (Advanced)

For more complex styling, use a custom CSS class:

```jsx
new SocialShareButton({
  container: "#share-button",
  buttonStyle: "primary",
  customClass: "my-custom-button",
});
```

Then in your CSS file:

```css
/* Override the button background color */
.my-custom-button.social-share-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Customize hover state */
.my-custom-button.social-share-btn:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}
```

**Color Examples:**

```jsx
// Material Design Red
new SocialShareButton({
  container: "#share-button",
  buttonColor: "#f44336",
  buttonHoverColor: "#da190b",
});

// Tailwind Blue
new SocialShareButton({
  container: "#share-button",
  buttonColor: "#3b82f6",
  buttonHoverColor: "#2563eb",
});

// Custom Brand Color
new SocialShareButton({
  container: "#share-button",
  buttonColor: "#your-brand-color",
  buttonHoverColor: "#your-brand-color-dark",
});
```

### Button Styles

| Style       | Description                        |
| ----------- | ---------------------------------- |
| `default`   | Standard button with icon and text |
| `primary`   | Gradient button (recommended)      |
| `compact`   | Smaller size for tight spaces      |
| `icon-only` | Icon without text                  |

### Callbacks

```jsx
new SocialShareButton({
  container: "#share-button",
  onShare: (platform, url) => {
    console.log(`Shared on ${platform}: ${url}`);
  },
  onCopy: (url) => {
    console.log("Link copied:", url);
  },
});
```

---

## 🧠 Advanced Usage

### Using npm Package

```javascript
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/src/social-share-button.css";

new SocialShareButton({
  container: "#share-button",
});
```

### React Wrapper Component (Optional)

If you want a reusable React component, copy `src/social-share-button-react.jsx` to your project:

```jsx
import { SocialShareButton } from "./components/SocialShareButton";

function App() {
  return <SocialShareButton platforms={["twitter", "linkedin"]} />;
}
```

### Update URL Dynamically (SPA)

```jsx
// Next.js App Router: import { usePathname } from "next/navigation";
// Next.js Pages Router: import { useRouter } from "next/router";
// React Router: import { useLocation } from "react-router-dom";

const shareButton = useRef(null);
// Get the current pathname from your router, e.g.:
// const pathname = usePathname();          // Next.js App Router
// const { pathname } = useRouter();        // Next.js Pages Router
// const { pathname } = useLocation();      // React Router

useEffect(() => {
  shareButton.current = new window.SocialShareButton({
    container: "#share-button",
  });
}, []);

useEffect(() => {
  if (shareButton.current) {
    shareButton.current.updateOptions({
      url: window.location.href,
      title: document.title,
    });
  }
}, [pathname]); // re-runs on every client-side route change
```

---

## 🩺 Troubleshooting

<details>
<summary><b>Multiple buttons appearing</b></summary>

**Cause:** Component re-renders creating duplicate instances

**Solution:** Use `useRef` to track initialization (already in examples above)

</details>

<details>
<summary><b>Button not appearing</b></summary>

**Cause:** Script loads after component renders

**Solution:** Add null check:

```jsx
if (window.SocialShareButton) {
  new window.SocialShareButton({ container: "#share-button" });
}
```

</details>

<details>
<summary><b>Modal not opening</b></summary>

**Cause:** CSS not loaded or ID mismatch

**Solution:**

- Verify CSS CDN link in `<head>`
- Match container ID: `container: '#share-button'` = `<div id="share-button">`

</details>

<details>
<summary><b>TypeError: SocialShareButton is not a constructor</b></summary>

**Cause:** CDN script not loaded yet

**Solution:** Use interval polling (see Next.js example above)

</details>

<details>
<summary><b>URL not updating on navigation</b></summary>

**Cause:** Component initialized once, doesn't track routes

**Solution:** Use `updateOptions()` method (see Advanced Usage above)

</details>

---

## 🧪 Examples

### Mobile Menu

```jsx
<nav>
  <div id="share-button"></div>
</nav>
```

### Custom Platforms

```jsx
// Professional networks only
new SocialShareButton({
  container: "#share-button",
  platforms: ["linkedin", "twitter", "email"],
});

// Messaging apps only
new SocialShareButton({
  container: "#share-button",
  platforms: ["whatsapp", "telegram"],
});
```

### Custom Styling

```jsx
new SocialShareButton({
  container: "#share-button",
  buttonStyle: "icon-only",
  theme: "light",
});
```

---

## 🎬 Demo

Try the live, configurable demo at **[social-share-button.aossie.org](https://social-share-button.aossie.org)** (“Click to Try Demo”), or open `index.html` in your browser to see all features locally.
Tutorial: https://youtu.be/cLJaT-8rEvQ?si=CLipA0Db4WL0EqKM

---

## 🌐 Website Development and Deployment

```bash
cd landing-page
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm run dev` and `npm run build` first copy the library from `../src`, so the site always showcases your local changes. `npm run build` produces a static export in `landing-page/out`, deployed to GitHub Pages by [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml). See [`landing-page/README.md`](landing-page/README.md) for adding languages, translating text and theming.

---

## 🤝 Contributing

We welcome contributions of all kinds! To contribute:

1. Fork the repository and create your feature branch (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3. Run code quality checks:
   - `npm run format:check` / `npm run format` — library formatting (repository root)
   - `npm run lint` and `npm run build` — website (inside `landing-page/`)
4. Test your changes by opening `index.html` in your browser, or run the website locally.
5. Push your branch (`git push origin feature/AmazingFeature`).
6. Open a Pull Request for review.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`DCO.md`](DCO.md) first. If you encounter bugs, need help, or have feature requests, please open an issue with detailed information, logs or screenshots.

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file and [COPYRIGHT.md](COPYRIGHT.md) for details.

---

## 💪 Thanks To All Contributors

Thanks a lot for spending your time helping Social Share Button grow. Keep rocking 🥂

[![Contributors](https://contrib.rocks/image?repo=AOSSIE-Org/SocialShareButton)](https://github.com/AOSSIE-Org/SocialShareButton/graphs/contributors)

© 2025-2026 AOSSIE

<p align="right">(<a href="#readme-top">back to top</a>)</p>
