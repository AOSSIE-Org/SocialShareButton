---
agent: agent
description: >
  Automatically integrate the Social Share Button package into a client's web project
  with zero manual steps from the user, except specifying where to place the button.
---

# Skill: Integrate Social Share Button

## Goal
Automatically integrate the Social Share Button package into a client's web project
with zero manual steps from the user, except specifying where to place the button.

---

## Step-by-Step Workflow

### Step 1 — Inspect the repository structure
- Look at the root directory first.
- Check if there is a single `package.json` or multiple (monorepo / fullstack).
- If multiple `package.json` files exist:
  - Identify which one belongs to the **frontend** (look for React, Vue, Svelte, Next.js, etc. as dependencies).
  - Ignore backend packages (Node/Express/Fastify/etc.).
  - Work **only inside the frontend folder** from this point forward.

### Step 2 — Inspect the lock file & Identify Technology
- Inside the correct frontend folder, read `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`.
- Confirm the project's package manager (npm / yarn / pnpm).
- Identify the framework/technology being used (React, Next.js, Vue, Angular, Preact, Qwik, or Vanilla JS).
- **CRITICAL LLM INSTRUCTION**: Once you identify the framework, skip directly to the relevant technology section in **Technology-Specific Guides** below and ignore all other framework-specific instructions/guides. For example, if the project is in React, go directly to the React section and ignore Next.js, Vanilla HTML, Vue, Qwik, etc.

### Step 3 — Install the Social Share Button package
Run the correct install command based on the package manager detected:
- npm: `npm install @aossie-org/social-share-button`
- yarn: `yarn add @aossie-org/social-share-button`
- pnpm: `pnpm add @aossie-org/social-share-button`
- or use CDN base files if CDN is preferred/requested.

### Step 4 — Ask the user ONE question
Before placing the button, ask:
> "Where would you like to place the Social Share Button?(header/footer/or any other part of the file and also mention the file name and location)
> Also, which style do you prefer?
> Options: Round | Square | Default"
Wait for the user's response before proceeding.

### Step 5 — Place the button
- Navigate to the file/component the user specified.
- Use the technology-specific guides below to place the button and import it correctly.
  - For React/Next.js/etc., import it as:
    ```js
    import { SocialShare } from "@aossie-org/social-share-button";
    ```
    (Or the wrapper/CDN equivalents depending on the method choice).
  - Place the component in the correct location in the JSX/template.
  - Pass the appropriate style prop based on the user's choice (e.g., `style="round"`, `style="square"`, or default).

### Step 6 — Verify
- Check that the import is correct.
- Check that no duplicate `package.json` was modified.
- Confirm the button renders in the correct frontend folder only.

---

## Edge Cases to Handle

| Situation | Action |
| --- | --- |
| Two `package.json` files found | Always pick the frontend one; never modify the backend |
| No lock file found | Ask user which package manager they use before installing |
| Monorepo (nx, turborepo) | Look for `apps/` or `packages/` folder; find the web app inside |
| Agent unsure which folder is frontend | List candidate folders and ask user to confirm before proceeding |

---

## What NOT to do
- Do NOT modify backend `package.json`
- Do NOT assume the root folder is the frontend
- Do NOT skip the user's style/placement preference
- Do NOT hallucinate import paths — use the actual installed package name.

---

## Technology-Specific Guides

> ⚠️ **CRITICAL LLM DIRECTIVE**: Locate the framework of the target project, jump directly to its section, and **IGNORE** all other technology guides (e.g., if the project is in React, go directly to React and do not read Next.js, Vanilla HTML, Vue, etc.).

### ⚛️ React (Create React App / Vite React)

#### CDN Method
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

**Step 2:** Add code to the target component (e.g. `Header.jsx`, `Navbar.jsx`):
```jsx
import { useEffect, useRef } from "react";

function Header({ style }) { // style can be "round", "square", or "default"
  const shareButtonRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !window.SocialShareButton) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: "#share-button",
      buttonStyle: style || "default",
    });
    initRef.current = true;

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, [style]);

  return (
    <header>
      <div id="share-button"></div>
    </header>
  );
}
```

#### npm Method
```jsx
import { useEffect, useRef } from "react";
import SocialShareButton from "social-share-button-aossie";
import "social-share-button-aossie/src/social-share-button.css";

function Header({ style }) {
  const shareButtonRef = useRef(null);

  useEffect(() => {
    shareButtonRef.current = new SocialShareButton({
      container: "#share-button",
      buttonStyle: style || "default",
    });

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
    };
  }, [style]);

  return (
    <header>
      <div id="share-button"></div>
    </header>
  );
}
```

---

### 🟢 Next.js App Router

#### CDN Method
**Step 1:** Add CDN to `app/layout.tsx`:
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

**Step 2:** Add code to target component (must be client component):
```tsx
"use client";

import { useEffect, useRef } from "react";

export default function Header({ style }: { style?: string }) {
  const shareButtonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    const initButton = () => {
      if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

      shareButtonRef.current = new window.SocialShareButton({
        container: "#share-button",
        buttonStyle: style || "default",
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
  }, [style]);

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}
```

---

### 🔵 Next.js Pages Router

#### CDN Method
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

**Step 2:** Add code to target component:
```tsx
import { useEffect, useRef } from "react";

export default function Header({ style }: { style?: string }) {
  const shareButtonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    const initButton = () => {
      if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

      shareButtonRef.current = new window.SocialShareButton({
        container: "#share-button",
        buttonStyle: style || "default",
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
  }, [style]);

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}
```

---

### 🌐 Vanilla HTML

Add the CDN tags directly:
```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
  />
</head>
<body>
  <div id="share-button"></div>
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
  <script>
    new SocialShareButton({ 
      container: "#share-button",
      buttonStyle: "default" // Round | Square | Default
    });
  </script>
</body>
```

---

### 🔴 Vite / Vue / Angular

Add to your HTML file:
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

And instantiate inside component mounted lifecycle hooks:
```javascript
new window.SocialShareButton({
  container: "#share-button",
  buttonStyle: "default",
});
```

---

### 🟣 Preact

#### CDN Method
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

**Step 2:** Place code in target component:
```jsx
import { useEffect, useRef } from "preact/hooks";

export default function Header({ style }) {
  const shareButtonRef = useRef(null);
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: "#share-button",
      buttonStyle: style || "default",
    });
    initRef.current = true;

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, [style]);

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}
```

---

### 🟡 Qwik

**Step 1:** Add CDN to your root or layout page (e.g. `src/root.tsx` or layout index):
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
```

**Step 2:** Initialize inside `useVisibleTask$`:
```tsx
import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";

export default component$(({ style }: { style?: string }) => {
  const containerRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ cleanup }) => {
    if (typeof window !== "undefined" && (window as any).SocialShareButton && containerRef.value) {
      const shareButton = new (window as any).SocialShareButton({
        container: containerRef.value,
        buttonStyle: style || "default",
      });

      cleanup(() => {
        if (shareButton && typeof shareButton.destroy === "function") {
          shareButton.destroy();
        }
      });
    }
  });

  return <div ref={containerRef} id="share-button"></div>;
});
```
