---
agent: agent
description: Automatically integrate @aossie-org/social-share-button into a client web project with zero manual steps except specifying where to place the button.
---

# SocialShareButton — Integration Skill

## Goal
Integrate `@aossie-org/social-share-button` into a client web project with minimal code, full context, and strict isolation between CDN and Package Manager methods.

---

## Step-by-Step Workflow

### 1. Locate Frontend Directory
Target the frontend app directory (`./`, `apps/*`, `packages/*`). Ignore backend services or unrelated subdirectories.

### 2. Identify Framework, Package Manager & Dependencies
- **Check `package.json` to Identify Framework**:
  - Precedence: Next.js → React, Preact → React, Vue 3, Angular.
  - If no `package.json` or framework dependencies exist, classify as **Vanilla HTML / JS**.
- **Detect Package Manager**:
  1. Check workspace `package.json` `packageManager` field first (`pnpm`, `yarn`, `bun`, `npm`).
  2. If unset, check workspace-scoped lockfiles strictly: `pnpm-lock.yaml` (`pnpm`), `yarn.lock` (`yarn`), `bun.lockb`/`bun.lock` (`bun`), `package-lock.json` (`npm`, default).
  3. Stop detection and prompt user if `packageManager` and lockfile signals conflict. Never inspect repository-level or unrelated lockfiles.

### 3. Scan Repository, Recommend Placement & Method
- Scan for existing layout/components (`Navbar`, `Header`, `Footer`, `Hero`, `Layout`, `App.tsx`, `index.html`, etc.).
- Proactively recommend target placement, recommend **CDN Method** by default, and prompt for:
  - Placement location
  - Button style (`default` | `round` | `square`)
  - Integration method (CDN vs Package Manager)

---

## Strict Code Injection Rules (STRICT ISOLATION)

⚠️ **CRITICAL GUARDRAIL**: Follow EXACTLY ONE path below. NEVER mix CDN and Package Manager code!

### 🌐 PATH A: CDN Method (Recommended)
- **CDN Assets**:
  - CSS: `https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css`
  - JS: `https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js`
- **Injection**: Add `<link>` and `<script>` to root layout / base HTML. Insert `<div data-social-share data-button-style="default"></div>` into target component (replace `"default"` with chosen style).
- 🛑 **Prohibitions**:
  - ❌ DO NOT run install commands (`npm i`, `pnpm add`, `yarn add`, `bun add`).
  - ❌ DO NOT add JS/CSS imports (`import SocialShareButton ...`).
  - ❌ DO NOT add `useEffect`, `useRef`, or manual constructors for React/Preact/Angular/Vanilla (MutationObserver auto-initializes).
  - ⚠️ **Vue Exception**: Only Vue uses `onMounted`/`onUnmounted` to guard `window.SocialShareButton`, retain instance, and destroy it on unmount.

### 📦 PATH B: Package Manager Method (NPM / PNPM / Yarn / Bun)
- **Install Package**: Run `npm i` | `pnpm add` | `yarn add` | `bun add` `@aossie-org/social-share-button`.
- **Target Component**:
  - Import implementation: `@aossie-org/social-share-button/src/social-share-button.js` (resolve via `const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;`).
  - Import styles: `@aossie-org/social-share-button/src/social-share-button.css` (do not use unverified subpaths like `/css`).
  - Inject framework lifecycle hooks directly into existing target components.
- 🛑 **Prohibitions**:
  - ❌ DO NOT add CDN `<link>` or `<script>` tags to root layouts or HTML.
  - ❌ DO NOT create new files like `ShareButton.tsx` (inject into existing components).
  - ❌ Next.js client components MUST include `"use client";`.

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
      <head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" /></head>
      <body>
        {children}
        <Script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js" strategy="afterInteractive" />
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
      <Head><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" /></Head>
      <Component {...pageProps} />
      <Script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js" strategy="afterInteractive" />
    </>
  );
}
```

##### Target Component (Next.js / React)
```jsx
export default function Header({ style = "default" }) {
  return <header><div data-social-share data-button-style={style}></div></header>;
}
```
*(For plain React/Vite SPA, place CDN `<link>` and `<script>` directly in `index.html`).*

#### Package Manager Method
```jsx
"use client";
import { useEffect, useRef } from "react";
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";
import "@aossie-org/social-share-button/src/social-share-button.css";

const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;

export default function Header({ style = "default" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const instance = new SocialShareButton({ container: containerRef.current, buttonStyle: style });
    return () => instance.destroy?.();
  }, [style]);

  return <header><div ref={containerRef} className="social-share-wrapper"></div></header>;
}
```

---

### 🟣 Preact

#### CDN Method (Recommended)
```jsx
export default function Footer({ style = "default" }) {
  return <footer><div data-social-share data-button-style={style}></div></footer>;
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

  return <footer><div ref={containerRef} class="social-share-wrapper"></div></footer>;
}
```

---

### 🟢 Vue 3

#### CDN Method (Recommended)
Add CDN `<link>` and `<script>` to `index.html`. Target component:
```vue
<template>
  <header><div ref="containerRef" class="social-share-wrapper"></div></header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({ style: { type: String, default: "default" } });
const containerRef = ref(null);
let instance = null;

function initButton() {
  instance?.destroy?.();
  if (containerRef.value && typeof window !== "undefined" && window.SocialShareButton) {
    instance = new window.SocialShareButton({ container: containerRef.value, buttonStyle: props.style });
  }
}

onMounted(initButton);
watch(() => props.style, initButton);
onUnmounted(() => instance?.destroy?.());
</script>
```

#### Package Manager Method
```vue
<template>
  <header><div ref="containerRef" class="social-share-wrapper"></div></header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import SocialShareButtonModule from "@aossie-org/social-share-button/src/social-share-button.js";
import "@aossie-org/social-share-button/src/social-share-button.css";

const SocialShareButton = SocialShareButtonModule?.default || SocialShareButtonModule;
const props = defineProps({ style: { type: String, default: "default" } });
const containerRef = ref(null);
let instance = null;

function initButton() {
  instance?.destroy?.();
  if (containerRef.value) {
    instance = new SocialShareButton({ container: containerRef.value, buttonStyle: props.style });
  }
}

onMounted(initButton);
watch(() => props.style, initButton);
onUnmounted(() => instance?.destroy?.());
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
import { Component, ElementRef, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, ViewChild, Input } from "@angular/core";
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

  ngAfterViewInit(): void { this.initButton(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["style"] && !changes["style"].isFirstChange()) this.initButton();
  }

  private initButton(): void {
    this.instance?.destroy?.();
    if (this.container?.nativeElement) {
      this.instance = new SocialShareButton({ container: this.container.nativeElement, buttonStyle: this.style });
    }
  }

  ngOnDestroy(): void { this.instance?.destroy?.(); }
}
```

---

### 🌐 Vanilla HTML & JS

#### CDN Method (Recommended)
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />
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
  buttonStyle: "default", // "default" | "round" | "square"
});
```
