---
agent: agent
description: >
  Automatically integrate @aossie-org/social-share-button into a client web project
  with zero manual steps except specifying where to place the button.
---

# SocialShareButton — Integration Skill

## Goal

Integrate `@aossie-org/social-share-button` into a client web project with minimal code, full context, and strict isolation between CDN and Package Manager methods.

---

## Step-by-Step Workflow

### 1. Locate Frontend Directory

- Locate the frontend app directory (`./`, `apps/*`, `packages/*`). Ignore backend services or unrelated subdirectories.

### 2. Identify Framework, Package Manager & Dependencies

- **Check `package.json` to Identify Framework**:
  - Check dependencies for framework precedence: Next.js → React, Preact → React, Vue 3, Angular.
  - If no `package.json` or no framework dependencies exist, classify the project as **Vanilla HTML / JS**.
- **Detect Package Manager**:
  - Check the selected frontend workspace's `package.json` `packageManager` field first (e.g., `pnpm`, `yarn`, `bun`, `npm`).
  - If not set in `package.json`, inspect lockfiles strictly within the selected workspace directory:
    - `pnpm-lock.yaml` → `pnpm`
    - `yarn.lock` → `yarn`
    - `bun.lockb` / `bun.lock` → `bun`
    - `package-lock.json` (or default) → `npm`
  - Stop detection and prompt the user to resolve if manifest (`packageManager`) and lockfile signals conflict.
  - Do not inspect repository-level or unrelated workspace lockfiles when determining the install command.

### 3. Scan Repository, Recommend Placement & Method

- **Scan for Placement Components**:
  - Scan the repository for existing components and layout files (e.g., `Header`, `Navbar`, `Nav`, `Footer`, `Hero`, `Sidebar`, `Layout`, `page.tsx`, `App.tsx`, `index.html`).
- **Ask Client Placement, Method & Style (Before Integrating)**:
  - Proactively recommend the best target file and section (e.g., *"I scanned your repository and found `src/components/Navbar.tsx`. I recommend placing the Social Share Button inside the Navbar next to your actions or in the Hero section. Where would you like it placed?"*).
  - Recommend the **CDN Method** by default (fastest, zero bundle overhead, zero build setup).
  - Prompt for preferred button style (`default` | `round` | `square`).
  - Confirm whether the user wants **CDN Method** or **Package Manager Method** (`npm`, `pnpm`, `yarn`, `bun`).

---

### 4. Strict Code Injection Rules (STRICT ISOLATION)

⚠️ **CRITICAL GUARDRAIL**: Follow EXACTLY ONE path below based on the chosen method. NEVER mix CDN and Package Manager code in the same project!

#### 🌐 PATH A: If CDN Method is Selected (Recommended)

1. **Root Layout / Base HTML**: Add CSS `<link>` and JS `<script>` CDN tags to the base HTML / root layout file (`index.html`, `layout.tsx`, `_document.tsx`, `app.html`):
   ```html
   <link
     rel="stylesheet"
     href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
   />
   <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
   ```
2. **Target Component**: Insert ONLY the declarative HTML container in the confirmed target component:
   ```html
   <div data-social-share data-button-style="default"></div>
   ```
   *(Replace `"default"` with the user's chosen style: `"default"`, `"round"`, or `"square"`).*
3. 🛑 **STRICT PROHIBITIONS FOR CDN**:
   - ❌ **DO NOT** run `npm i`, `pnpm add`, `yarn add`, or `bun add`.
   - ❌ **DO NOT** add `import SocialShareButton from ...` or `import ".../css"` in any JavaScript/TypeScript/Vue/JSX/TSX files.
   - ❌ **DO NOT** add `useEffect`, `useRef`, or manual constructor calls for other frameworks. The CDN script automatically initializes `<div data-social-share>` elements via `MutationObserver`.
   - ⚠️ **Vue Exception**: Explicitly allowed only for Vue to use `onMounted`/`onUnmounted` lifecycle hooks to guard `window.SocialShareButton`, retain the created instance, and destroy it during unmount (`instance?.destroy?.()`). Manual initialization outside this documented Vue exception remains strictly prohibited.

---

#### 📦 PATH B: If Package Manager Method is Selected (NPM / PNPM / Yarn / Bun)

1. **Install Package**: Run the detected package manager install command:
   - **npm**: `npm i @aossie-org/social-share-button`
   - **pnpm**: `pnpm add @aossie-org/social-share-button`
   - **yarn**: `yarn add @aossie-org/social-share-button`
   - **bun**: `bun add @aossie-org/social-share-button`
2. **Target Component**:
   - Import implementation from `@aossie-org/social-share-button/src/social-share-button.js` and resolve the constructor without assuming a default export (e.g., `const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;`).
   - Import styles from `@aossie-org/social-share-button/src/social-share-button.css` instead of unverified CSS subpaths.
   - Inject the framework lifecycle hooks directly into the existing target component (e.g., `Header`, `Navbar`, `Footer`, `Hero`).
3. 🛑 **STRICT PROHIBITIONS FOR PACKAGE MANAGER**:
   - ❌ **DO NOT** add CDN `<link>` or `<script>` tags to `index.html` or root layouts.
   - ❌ **DO NOT** create new files like `ShareButton.tsx` (inject into existing components).
   - ❌ **Next.js**: Ensure `"use client";` is at the top of client components.

---

## Framework Integration Guides

### ⚛️ React / Next.js

#### CDN Method (Recommended)

##### Next.js App Router (`app/layout.tsx`)
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
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

##### Next.js Pages Router (`pages/_app.tsx`)
```tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
        />
      </Head>
      <Component {...pageProps} />
      <Script
        src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"
        strategy="afterInteractive"
      />
    </>
  );
}
```

##### Target Component (Next.js / React)
```jsx
export default function Header({ style = "default" }) {
  return (
    <header>
      <div data-social-share data-button-style={style}></div>
    </header>
  );
}
```
*(For plain React / Vite SPA, add the CDN `<link>` and `<script>` directly to `index.html`).*

#### Package Manager Method (NPM / PNPM / Yarn / Bun)
```jsx
"use client";
import { useEffect, useRef } from "react";
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";
import "@aossie-org/social-share-button/src/social-share-button.css";

const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;

export default function Header({ style = "default" }) {
  const shareContainerRef = useRef(null);

  useEffect(() => {
    if (!shareContainerRef.current) return;
    const shareInstance = new SocialShareButton({
      container: shareContainerRef.current,
      buttonStyle: style, // "default" | "round" | "square"
    });
    return () => shareInstance.destroy?.();
  }, [style]);

  return (
    <header>
      <div ref={shareContainerRef} className="social-share-wrapper"></div>
    </header>
  );
}
```

---

### 🟣 Preact

#### CDN Method (Recommended)
```jsx
export default function Footer({ style = "default" }) {
  return (
    <footer>
      <div data-social-share data-button-style={style}></div>
    </footer>
  );
}
```

#### Package Manager Method
```jsx
import { useEffect, useRef } from "preact/hooks";
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";
import "@aossie-org/social-share-button/src/social-share-button.css";

const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;

export default function Footer({ style = "default" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const instance = new SocialShareButton({ container: containerRef.current, buttonStyle: style });
    return () => instance.destroy?.();
  }, [style]);

  return (
    <footer>
      <div ref={containerRef} class="social-share-wrapper"></div>
    </footer>
  );
}
```

---

### 🟢 Vue 3

#### CDN Method (Recommended)
Add CDN `<link>` and `<script>` to `index.html`. In the target component:
```vue
<template>
  <header>
    <div ref="containerRef" class="social-share-wrapper"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  style: { type: String, default: "default" },
});
const containerRef = ref(null);
let instance = null;

function initButton() {
  instance?.destroy?.();
  if (containerRef.value && typeof window !== "undefined" && window.SocialShareButton) {
    instance = new window.SocialShareButton({
      container: containerRef.value,
      buttonStyle: props.style,
    });
  }
}

onMounted(initButton);

watch(() => props.style, initButton);

onUnmounted(() => {
  instance?.destroy?.();
});
</script>
```

#### Package Manager Method
```vue
<template>
  <header>
    <div ref="containerRef" class="social-share-wrapper"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";
import "@aossie-org/social-share-button/src/social-share-button.css";

const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;

const props = defineProps({
  style: { type: String, default: "default" },
});
const containerRef = ref(null);
let instance = null;

function initButton() {
  instance?.destroy?.();
  if (containerRef.value) {
    instance = new SocialShareButton({
      container: containerRef.value,
      buttonStyle: props.style,
    });
  }
}

onMounted(initButton);

watch(() => props.style, initButton);

onUnmounted(() => {
  instance?.destroy?.();
});
</script>
```

---

### 🅰️ Angular

#### CDN Method (Recommended)
```typescript
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-header",
  template: `<header><div data-social-share [attr.data-button-style]="style"></div></header>`,
})
export class HeaderComponent {
  @Input() style: string = "default";
}
```

#### Package Manager Method
```typescript
import {
  Component,
  ElementRef,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  Input,
} from "@angular/core";
// @ts-ignore
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";

const SocialShareButton = (SocialShareButtonModule as any)?.default || SocialShareButtonModule;

@Component({
  selector: "app-header",
  template: `<header><div #container class="social-share-wrapper"></div></header>`,
  styleUrls: ["../../node_modules/@aossie-org/social-share-button/src/social-share-button.css"],
})
export class HeaderComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild("container") container!: ElementRef;
  @Input() style: string = "default";
  private instance: any;

  ngAfterViewInit(): void {
    this.initButton();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["style"] && !changes["style"].isFirstChange()) {
      this.initButton();
    }
  }

  private initButton(): void {
    this.instance?.destroy?.();
    if (this.container?.nativeElement) {
      this.instance = new SocialShareButton({
        container: this.container.nativeElement,
        buttonStyle: this.style,
      });
    }
  }

  ngOnDestroy(): void {
    this.instance?.destroy?.();
  }
}
```

---

### 🌐 Vanilla HTML & JS

#### CDN Method (Recommended)
```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
/>
<div data-social-share data-button-style="default"></div>
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
```

#### Package Manager Method (Vite / Webpack / Bundler)

##### 1. HTML (`index.html`)
```html
<div id="share-button"></div>
<script type="module" src="/src/main.js"></script>
```

##### 2. Bundler Entry Module (`src/main.js`)
```javascript
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";
import "@aossie-org/social-share-button/src/social-share-button.css";

const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;

new SocialShareButton({
  container: "#share-button",
  buttonStyle: "default", // replace with chosen style: "default" | "round" | "square"
});
```
