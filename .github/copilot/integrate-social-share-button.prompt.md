---
agent: agent
description: >
  Integrate SocialShareButton into any web project. Covers CDN (recommended),
  npm (advanced), and React Wrapper Component (optional). Framework-specific
  steps for CRA, Next.js App Router, Next.js Pages Router, Vite/Vue/Angular,
  and Vanilla HTML. Use this skill whenever a developer asks how to add the
  share button to their project.
---

# SocialShareButton — Integration Skill

You are helping a developer integrate the **SocialShareButton** library
(`social-share-button-aossie`) into their project. Follow these rules strictly.

---

> 🚫 **IMPORTANT:** Do NOT create new files like `ShareButton.jsx` or `ShareButton.tsx`!
> ✅ Add code directly to the developer's **existing** component (Header, Navbar, etc.)
> 📄 **Exception:** If a separate file is needed (e.g. a dedicated share component), follow **Method 3 — React Wrapper Component** exclusively.

---

## How to respond

The README defines **3 installation methods**. Ask (or infer) which the developer wants:

| Method | When to use |
|--------|-------------|
| **Method 1 — CDN (Recommended)** | Most projects. No build step needed. Load via `<script>` tag. |
| **Method 2 — npm** | Bundler-based projects (Webpack, Vite, etc.) that prefer `import` syntax. |
| **Method 3 — React Wrapper Component (Optional)** | Developer explicitly wants a reusable JSX component. |

These are **loading methods**, not tech stacks. CDN and npm both work with all frameworks.

---

## Integration overview

No matter which framework you use, integration always follows the same 3 steps:

| Step | What to do | Where |
|------|-----------|-------|
| **1️⃣ Load Library** | Add CSS + JS (CDN links) | Global layout file — `index.html` / `layout.tsx` / `_document.tsx` |
| **2️⃣ Add Container** | Place `<div id="share-button"></div>` | The UI component where you want the button to appear |
| **3️⃣ Initialize** | Call `new SocialShareButton({ container: "#share-button" })` | Inside that component, after the DOM is ready (e.g. `useEffect`, `mounted`, `ngAfterViewInit`) |

---

## Method 1 — CDN (Recommended)

CDN URLs to always use:

```
CSS: https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css
JS:  https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js
```

Then ask (or infer) the developer's **framework** to give the right Step 1 + Step 2.

---

### CDN — Vanilla HTML

No framework. Just add the CDN tags directly:

```html
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css" />
</head>
<body>
  <div id="share-button"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
  <script>
    new SocialShareButton({ container: "#share-button" });
  </script>
</body>
```

---

### CDN — Create React App

**Step 1:** Add CDN to `public/index.html`:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css"
  />
</head>
<body>
  <div id="root"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
</body>
```

**Step 2:** Open an **existing** component that renders on every page — typically `src/components/Header.jsx`, `src/layouts/MainLayout.jsx`, or your root `App.jsx`. Add the snippet below to that component so the share button is consistently available across your app.

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

---

### CDN — Next.js App Router

**Step 1:** Add CDN to `app/layout.tsx`:

```tsx
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
```

**Step 2:** Because `SocialShareButton` manipulates the DOM, it must run inside a **Client Component** (note the `"use client"` directive at the top). Add the snippet below to an existing component such as `app/components/Header.tsx` or `app/components/Navbar.tsx` — any component already included in your layout.

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
      if (initRef.current || !window.SocialShareButton || !containerRef.current)
        return;

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

---

### CDN — Next.js Pages Router

**Step 1:** Add CDN to `pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
      </body>
    </Html>
  );
}
```

**Step 2:** Open an existing component that is rendered on every page — typically `components/Header.tsx`, `components/Navbar.tsx`, or `components/Layout.tsx`. Since `_document.tsx` loads the script globally, the button is ready to initialize in any of these components.

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
      if (initRef.current || !window.SocialShareButton || !containerRef.current)
        return;

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

---

### CDN — Vite / Vue / Angular

**Step 1:** Add CDN to root `index.html`:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css"
  />
</head>
<body>
  <div id="app"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
</body>
```

**Step 2:** Open your root or layout component (e.g., `App.vue`, `app.component.html`, or `App.jsx`). Add a container `<div>` where you want the button to appear, then initialize the button after the DOM is ready:

```javascript
// Add <div id="share-button"></div> to your component's template/HTML first,
// then initialize once the DOM is ready (e.g., in mounted(), ngAfterViewInit(), or useEffect()):
new window.SocialShareButton({
  container: "#share-button",
});
```

---

## Method 2 — npm (Advanced)

Use when the project has a bundler (Webpack, Vite, etc.) and the developer prefers `import` syntax. Works in any framework.

```javascript
import SocialShareButton from "social-share-button-aossie"; 
import "social-share-button-aossie/src/social-share-button.css";

new SocialShareButton({ container: "#share-button" });
```

> No CDN tags needed — the npm package includes both JS and CSS.

---

## Method 3 — React Wrapper Component (Optional)

Only use this when the developer **explicitly** wants a reusable JSX component.

Tell them to copy `src/social-share-button-react.jsx` from the library into their project — **do not create a new file from scratch**.

```jsx
import { SocialShareButton } from "./components/SocialShareButton";

function App() {
  return <SocialShareButton platforms={["twitter", "linkedin"]} />;
}
```

---

## All constructor options

| Option             | Type           | Default                | Description                                        |
| ------------------ | -------------- | ---------------------- | -------------------------------------------------- |
| `container`        | string/Element | —                      | **Required.** CSS selector or DOM element          |
| `url`              | string         | `window.location.href` | URL to share                                       |
| `title`            | string         | `document.title`       | Share title/headline                               |
| `description`      | string         | `''`                   | Additional description text                        |
| `hashtags`         | array          | `[]`                   | e.g. `['js', 'webdev']`                            |
| `via`              | string         | `''`                   | Twitter handle (without @)                         |
| `platforms`        | array          | All platforms          | `whatsapp facebook twitter linkedin telegram reddit email` |
| `buttonText`       | string         | `'Share'`              | Button label text                                  |
| `buttonStyle`      | string         | `'default'`            | `default` `primary` `compact` `icon-only`          |
| `buttonColor`      | string         | `''`                   | Custom button background color                     |
| `buttonHoverColor` | string         | `''`                   | Custom button hover color                          |
| `customClass`      | string         | `''`                   | Additional CSS class for button                    |
| `theme`            | string         | `'dark'`               | `dark` or `light`                                  |
| `modalPosition`    | string         | `'center'`             | Modal position on screen                           |
| `showButton`       | boolean        | `true`                 | Show/hide the share button                         |
| `onShare`          | function       | `null`                 | `(platform, url) => void`                          |
| `onCopy`           | function       | `null`                 | `(url) => void`                                    |
| `analytics`        | boolean        | `true`                 | Set `false` to disable all event emission          |
| `onAnalytics`      | function       | `null`                 | `(payload) => void` — direct analytics hook        |
| `analyticsPlugins` | array          | `[]`                   | Adapter instances from `social-share-analytics.js` |
| `componentId`      | string         | `null`                 | Label this instance for analytics tracking         |
| `debug`            | boolean        | `false`                | Log analytics events to console                    |

---

## Dynamic URL updates (SPA routing)

Call `updateOptions()` on route change so the shared URL and title always reflect the current page.

> The framework-specific examples above already include this pattern. The snippet below is the standalone reference:

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

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Multiple buttons appearing | Component re-renders creating duplicate instances | Use `useRef` + `initRef` guard (shown in all examples above) |
| Button not appearing | Script loads after component renders | Add `if (window.SocialShareButton)` null check |
| Modal not opening | CSS not loaded or ID mismatch | Verify CSS CDN in `<head>`; match `container: '#share-button'` with `<div id="share-button">` |
| `TypeError: SocialShareButton is not a constructor` | CDN script not loaded yet | Use interval polling (see Next.js examples above) |
| URL not updating on navigation | Component initialized once, doesn't track routes | Use `updateOptions()` on route change |

---

## Common mistakes to prevent

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| Creating `ShareButton.jsx` / `ShareButton.tsx` | Add directly to existing `Header.jsx`, `Navbar.tsx`, etc. |
| Calling `new SocialShareButton()` inside JSX `return` | Call only inside `useEffect` / lifecycle hook |
| Not calling `destroy()` on unmount | Always clean up — prevents duplicate modals on re-mount |
| Mismatched container ID | `container: '#share-button'` must exactly match `<div id="share-button">` |
| Script loads after component renders in Next.js | Use `strategy="beforeInteractive"` **or** poll with `setInterval` |

---

## Output format

- Ask the developer their **method** (CDN / npm / React Wrapper) and their **framework** (only needed for CDN).
- Show only the snippet(s) relevant to their choices.
- Always modify **existing** files — never suggest creating new component files.
- When modifying an existing file, mark additions with `// ADD THIS`.
- Do not add abstractions, wrappers, or extra files beyond what the README shows.

