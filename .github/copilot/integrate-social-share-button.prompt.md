---
agent: agent
description: >
  Integrate SocialShareButton into any web project in 3 simple steps.
  Works with every framework — React, Next.js, Vue, Angular, Svelte, Qwik,
  Preact, Astro, Vanilla HTML, or anything else. No hooks, no wrappers,
  no framework-specific code. Just load the library, drop a container div,
  and call the constructor. Use this skill whenever a developer asks how
  to add the share button to their project.
---

# SocialShareButton — Integration Skill

You are helping a developer integrate the **SocialShareButton** library into their project.

**It works the same way in every framework.** There is no framework-specific code.

---

## RULES FOR AI / LLM AGENTS

> 🚫 **Do NOT** create new files like `ShareButton.jsx`, `ShareButton.tsx`, or any wrapper component.
> 🚫 **Do NOT** use `useEffect`, `useRef`, `useSignal`, `onMounted`, `ngAfterViewInit`, or any lifecycle hooks.
> ✅ Add code directly into the developer's **existing** files.
> ✅ The library handles everything internally — just load it and call the constructor.

---

## How it works — 3 steps, every framework

Integration is always the same 3 steps, regardless of tech stack:

| Step | What to do | Where |
|------|-----------|-------|
| **1. Load the library** | Add the CSS `<link>` and JS `<script>` tags | The root HTML file or layout that wraps the entire app |
| **2. Add the container** | Place `<div id="share-button"></div>` | Wherever you want the share button to appear |
| **3. Initialize** | Call `new SocialShareButton({ container: "#share-button" })` | In a `<script>` tag after the JS is loaded |

That's it. No hooks. No lifecycle methods. No wrappers.

---

## CDN URLs (v1.0.4)

Always use these exact URLs:

```
CSS: https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css
JS:  https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js
```

---

## Step-by-step integration

### Step 1 — Load the library

Add the CSS in `<head>` and the JS `<script>` before the closing `</body>` tag in the **root HTML/layout file** of the project.

**Which file to edit:**

| Framework / Tool | File to edit |
|-----------------|-------------|
| Vanilla HTML | `index.html` |
| Next.js (App Router) | `app/layout.tsx` |
| Next.js (Pages Router) | `pages/_document.tsx` |
| Create React App | `public/index.html` |
| Vite (React/Vue/Svelte) | `index.html` |
| Angular | `src/index.html` |
| Astro | `src/layouts/Layout.astro` or root layout |
| Preact | `index.html` |
| Qwik | `src/root.tsx` or root layout |

**What to add:**

```html
<!-- In <head> -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
/>

<!-- Before closing </body> -->
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
```

> **Next.js App Router note:** Use `<Script>` from `next/script` with `strategy="beforeInteractive"` instead of a plain `<script>` tag:
> ```tsx
> import Script from "next/script";
> // Inside the <body> of your layout:
> <Script
>   src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"
>   strategy="beforeInteractive"
> />
> ```

---

### Step 2 — Add the container

Place this `<div>` in any component or page where you want the share button to appear:

```html
<div id="share-button"></div>
```

That's it. Just a div with the id `share-button`.

---

### Step 3 — Initialize

Add a `<script>` tag **after** the library script to create the button:

```html
<script>
  new SocialShareButton({ container: "#share-button" });
</script>
```

---

## Complete example — Vanilla HTML

This is the simplest possible integration. Copy-paste ready:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Website</title>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
  />
</head>
<body>

  <h1>My Page</h1>

  <!-- Share button appears here -->
  <div id="share-button"></div>




  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
  <script>
    new SocialShareButton({ container: "#share-button" });
  </script>
</body>
</html>
```

---

## Complete example — Next.js App Router


**Step 1:** Add CDN to `public/index.html`:

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

**File: `app/layout.tsx`** — Load the library globally:


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

**Any page or component** — Add the container and init script:

```tsx
export default function SomePage() {
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

---

### CDN — Vite / Vue / Angular

**Step 1:** Add CDN to root `index.html`:

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

**Step 2:** Open your root or layout component (e.g., `App.vue`, `app.component.html`, or `App.jsx`). Add a container `<div>` where you want the button to appear, then initialize the button after the DOM is ready:

```javascript
// Add <div id="share-button"></div> to your component's template/HTML first,
// then initialize once the DOM is ready (e.g., in mounted(), ngAfterViewInit(), or useEffect()):
new window.SocialShareButton({
  container: "#share-button",
});
```

---

### CDN — Preact

**Step 1:** Add CDN to root `index.html`:

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

**Step 2:** Open your root or layout component (typically `src/components/Header.jsx` or your root `App.jsx`). Add a container element and initialize inside the `useEffect` hook:

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

    <main>
      <h1>My Page</h1>
      <div id="share-button"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `new SocialShareButton({ container: "#share-button" });`,
        }}
      />
    </main>

  );
}
```

---

## npm alternative

If the project uses a bundler (Webpack, Vite, etc.) and the developer prefers `import` syntax instead of CDN:


```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
  />
</head>
<body>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
</body>

```bash
npm install social-share-button-aossie

```

```javascript
import SocialShareButton from "social-share-button-aossie";
import "social-share-button-aossie/src/social-share-button.css";

new SocialShareButton({ container: "#share-button" });
```

> No CDN tags needed when using npm — the package includes both JS and CSS.

---

## Constructor options

All options you can pass to `new SocialShareButton({ ... })`:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | string / Element | — | **Required.** CSS selector or DOM element |
| `url` | string | `window.location.href` | URL to share |
| `title` | string | `document.title` | Share title / headline |
| `description` | string | `''` | Additional description text |
| `hashtags` | array | `[]` | e.g. `['js', 'webdev']` |
| `via` | string | `''` | Twitter handle (without @) |
| `platforms` | array | all platforms | Platforms to show (see list below) |
| `buttonText` | string | `'Share'` | Button label text |
| `buttonStyle` | string | `'default'` | `'default'` `'primary'` `'compact'` `'icon-only'` |
| `buttonColor` | string | `''` | Custom button background color |
| `buttonHoverColor` | string | `''` | Custom button hover color |
| `customClass` | string | `''` | Additional CSS class for button |
| `theme` | string | `'dark'` | `'dark'` or `'light'` |
| `modalPosition` | string | `'center'` | Modal position on screen |
| `showButton` | boolean | `true` | Show / hide the share button |
| `onShare` | function | `null` | `(platform, url) => void` |
| `onCopy` | function | `null` | `(url) => void` |
| `analytics` | boolean | `true` | Set `false` to disable all event emission |
| `onAnalytics` | function | `null` | `(payload) => void` — direct analytics hook |
| `analyticsPlugins` | array | `[]` | Adapter instances from `social-share-analytics.js` |
| `componentId` | string | `null` | Label this instance for analytics tracking |
| `debug` | boolean | `false` | Log analytics events to console |

**Available platforms:** `whatsapp`, `facebook`, `twitter`, `linkedin`, `telegram`, `reddit`, `email`, `pinterest`, `discord`

---

## Example with options

```html
<div id="share-button"></div>
<script>
  new SocialShareButton({
    container: "#share-button",
    platforms: ["twitter", "linkedin", "whatsapp"],
    buttonText: "Share this article",
    buttonStyle: "primary",
    theme: "dark",
    buttonColor: "#3b82f6",
    buttonHoverColor: "#2563eb",
    url: "https://example.com/my-article",
    title: "Check out this article!",
    hashtags: ["webdev", "opensource"],
  });
</script>
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Button not appearing | JS script not loaded | Make sure the `<script>` tag is in the page and loads before initialization |
| Modal not opening | CSS not loaded or ID mismatch | Verify CSS `<link>` is in `<head>`. Ensure `container: "#share-button"` matches `<div id="share-button">` |
| `TypeError: SocialShareButton is not a constructor` | Script hasn't finished loading | Move the init `<script>` below the library `<script>`, or add `defer` |
| Multiple buttons appearing | Constructor called more than once | Make sure you only call `new SocialShareButton()` once per container |

---

## Common mistakes to avoid

| ❌ Wrong | ✅ Correct |
|---------|-----------|
| Creating `ShareButton.jsx` or wrapper files | Add `<div id="share-button">` directly in existing components |
| Using `useEffect` or lifecycle hooks to initialize | Just call `new SocialShareButton()` in a `<script>` tag |
| Mismatched container ID | `container: "#share-button"` must exactly match `<div id="share-button">` |
| Loading JS in `<head>` without `defer` | Load JS before `</body>` or use `defer` attribute |
| Forgetting to load the CSS | Always add the CSS `<link>` in `<head>` — the button will look broken without it |

---

## Quick-reference for AI agents

When a developer asks to integrate SocialShareButton, do exactly this:

1. **Find their root HTML / layout file** → add the CSS `<link>` and JS `<script>`
2. **Find the component/page where they want the button** → add `<div id="share-button"></div>`
3. **Add the init script** → `new SocialShareButton({ container: "#share-button" })`
4. **Do NOT** create new files, wrappers, or use any framework-specific hooks
5. **Do NOT** use `useEffect`, `useRef`, `onMounted`, `ngAfterViewInit`, etc.
