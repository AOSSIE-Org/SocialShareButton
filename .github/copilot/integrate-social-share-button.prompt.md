---
agent: agent
description: >
  Automatically integrate @aossie-org/social-share-button into a client web project
  with zero manual steps except specifying where to place the button.
---

# SocialShareButton — Integration Skill

## Goal

Integrate `@aossie-org/social-share-button` into a client web project with zero manual steps from the user except specifying button location.

---

## Step-by-Step Workflow

### 1. Inspect Repo & Identify Frontend

- Locate frontend `package.json` and scan dependencies using deterministic specific-to-generic framework matching (identify Next.js before React, and Preact before React, so projects containing both select the specific framework template).
- In monorepos (`apps/`, `packages/`), target the frontend app directory only. Never modify backend projects.

### 2. Lock File & Tech Detection

- Check `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, or `bun.lock`/`bun.lockb` for package manager (`npm`|`pnpm`|`yarn`|`bun`, classifying `bun.lock` or `bun.lockb` as Bun).
- **CRITICAL DIRECTIVE**: Skip directly to the detected framework in **Technology Guides** below. Ignore all other guides.

### 3. Install Package (npm method)

- npm: `npm i @aossie-org/social-share-button` | pnpm: `pnpm add @aossie-org/social-share-button`
- yarn: `yarn add @aossie-org/social-share-button` | bun: `bun add @aossie-org/social-share-button`
  _(Skip if CDN method requested)._

### 4. Ask User Placement (If Unspecified)

Ask: _"Where would you like to place the Social Share Button? Options: npm | CDN. Style: default | round | square."_

### 5. Mandatory Integration Rules

- 🛑 **No New Files in Existing Projects (CRITICAL DIRECTIVE)**:
  - **Default Mode (Existing Projects)**: Do **NOT** create a new file (e.g., `ShareButton.jsx`, `ShareButton.tsx`). Inject imports, lifecycle hooks (`useEffect`, `onMounted`, etc.), and container element (`<div ref={...}></div>` or `<div id="..."></div>`) directly into the developer's existing component (e.g., `Header`, `Navbar`, `Footer`, `Article`, `page.tsx`).
  - **Exception Mode (New Projects or Explicit User Request)**: ONLY create a separate dedicated component file (e.g., `ShareButton.jsx`, `ShareButton.vue`) when initializing a new project from scratch OR if the user explicitly asks for a dedicated wrapper file.
- **ESM Import**: MUST use default import `import SocialShareButton from "@aossie-org/social-share-button";` (Do NOT use named `{ SocialShareButton }`).
- **CSS Import**: Include `@aossie-org/social-share-button/css` or CDN CSS in the component or root styles.
- **Next.js Client Components**: Include `"use client";` at the top of existing client components using hooks (`useEffect`, `useRef`).
- **No `as any` in `.js`/`.jsx`**: Do NOT use TypeScript assertions in JavaScript files.

---

## Technology Guides

> ⚠️ **CRITICAL DIRECTIVE**: Jump directly to target framework section. Ignore others. Apply **Default (Inline into Existing Component)** unless starting a new project or given an explicit user request for a separate file.

---

### ⚛️ React / Next.js

#### npm Method — Existing Project (Inline - DEFAULT)

Add directly into the target existing file (e.g., `src/components/Header.jsx` or `src/app/page.tsx`):

```jsx
"use client";
import { useEffect, useRef } from "react";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

export default function Header() {
  const shareContainerRef = useRef(null);
  const shareInstanceRef = useRef(null);

  useEffect(() => {
    if (!shareContainerRef.current) return;
    shareInstanceRef.current?.destroy?.();
    shareInstanceRef.current = new SocialShareButton({
      container: shareContainerRef.current,
      buttonStyle: "default",
    });
    return () => shareInstanceRef.current?.destroy?.();
  }, []);

  return (
    <header>
      {/* Existing component markup */}
      <div ref={shareContainerRef} className="social-share-wrapper"></div>
    </header>
  );
}
```

#### npm Method — New Project / Dedicated File (EXCEPTION)

Create wrapper component (`src/components/ShareButton.jsx`) ONLY for new projects or explicit requests:

```jsx
"use client";
import { useEffect, useRef } from "react";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

export default function ShareButton({ style = "default", url, title, theme = "dark" }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    instanceRef.current?.destroy?.();
    instanceRef.current = new SocialShareButton({
      container: containerRef.current,
      buttonStyle: style,
      url,
      title,
      theme,
    });
    return () => instanceRef.current?.destroy?.();
  }, [style, url, title, theme]);

  return <div ref={containerRef} className="social-share-wrapper"></div>;
}
```

#### CDN Method

1. **Global Template**:
   - **React (`public/index.html`)**: Add CDN stylesheet `<link>` to `<head>` and `<script>` to `<body>`.
   - **Next.js App Router (`app/layout.tsx`)**: Add `import Script from "next/script";`, then place `<link rel="stylesheet" href="..." />` and `<Script src="..." strategy="beforeInteractive" />` inside `<head>`.
   - **Next.js Pages Router (`pages/_app.tsx`)**: Add `import Script from "next/script";`, then use `<Script src="..." strategy="afterInteractive" />`.

2. **Inline into Existing Component (DEFAULT)**:

```jsx
"use client";
import { useEffect, useRef } from "react";

export default function Header() {
  const shareContainerRef = useRef(null);
  const shareInstanceRef = useRef(null);

  useEffect(() => {
    let timer;
    const init = () => {
      if (!window.SocialShareButton || !shareContainerRef.current) return;
      shareInstanceRef.current?.destroy?.();
      shareInstanceRef.current = new window.SocialShareButton({
        container: shareContainerRef.current,
        buttonStyle: "default",
      });
    };

    if (window.SocialShareButton) init();
    else
      timer = setInterval(() => {
        if (window.SocialShareButton) {
          clearInterval(timer);
          init();
        }
      }, 100);

    return () => {
      if (timer) clearInterval(timer);
      shareInstanceRef.current?.destroy?.();
    };
  }, []);

  return (
    <header>
      {/* Existing component markup */}
      <div ref={shareContainerRef} className="social-share-wrapper"></div>
    </header>
  );
}
```

---

### 🟣 Preact

#### npm Method — Existing Project (Inline - DEFAULT)

Add directly into existing component (e.g. `src/components/Header.jsx`):

```jsx
import { useEffect, useRef } from "preact/hooks";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

export default function Header() {
  const shareContainerRef = useRef(null);
  const shareInstanceRef = useRef(null);

  useEffect(() => {
    if (!shareContainerRef.current) return;
    shareInstanceRef.current?.destroy?.();
    shareInstanceRef.current = new SocialShareButton({
      container: shareContainerRef.current,
      buttonStyle: "default",
    });
    return () => shareInstanceRef.current?.destroy?.();
  }, []);

  return (
    <header>
      <div ref={shareContainerRef} class="social-share-wrapper"></div>
    </header>
  );
}
```

#### npm Method — New Project / Dedicated File (EXCEPTION)

Create dedicated file (`src/components/ShareButton.jsx`) ONLY if starting a new project or explicitly requested:

```jsx
import { useEffect, useRef } from "preact/hooks";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

export default function ShareButton({ style = "default", url, title, theme = "dark" }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    instanceRef.current?.destroy?.();
    instanceRef.current = new SocialShareButton({
      container: containerRef.current,
      buttonStyle: style,
      url,
      title,
      theme,
    });
    return () => instanceRef.current?.destroy?.();
  }, [style, url, title, theme]);

  return <div ref={containerRef} class="social-share-wrapper"></div>;
}
```

#### CDN Method

Add CDN `<link>` to `<head>` and `<script>` to `<body>` in `index.html`. Inline initialization logic into existing component using `preact/hooks`.

---

### 🟢 Vue 3

#### npm Method — Existing Project (Inline - DEFAULT)

Add directly to existing `.vue` component (e.g., `src/components/Header.vue` or `App.vue`):

```vue
<template>
  <header>
    <!-- Existing template code -->
    <div ref="shareContainerRef" class="social-share-wrapper"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

const shareContainerRef = ref(null);
let shareInstance = null;

onMounted(() => {
  if (!shareContainerRef.value) return;
  shareInstance = new SocialShareButton({
    container: shareContainerRef.value,
    buttonStyle: "default",
  });
});

onUnmounted(() => shareInstance?.destroy?.());
</script>
```

#### npm Method — New Project / Dedicated File (EXCEPTION)

Create component (`ShareButton.vue`) ONLY for new projects or explicit requests:

```vue
<template>
  <div ref="containerRef" class="social-share-wrapper"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

const props = defineProps({
  style: { type: String, default: "default" },
  url: String,
  title: String,
});
const containerRef = ref(null);
let instance = null;

const init = () => {
  if (!containerRef.value) return;
  instance?.destroy?.();
  instance = new SocialShareButton({
    container: containerRef.value,
    buttonStyle: props.style,
    url: props.url,
    title: props.title,
  });
};

onMounted(init);
watch(() => [props.style, props.url, props.title], init);
onUnmounted(() => instance?.destroy?.());
</script>
```

#### CDN Method

Add CDN `<link>` to `<head>` and `<script>` to `<body>` in `index.html`. In `onMounted`, verify `window.SocialShareButton` exists before instantiating `shareInstance = new window.SocialShareButton({ container: shareContainerRef.value, buttonStyle: "default" })`, and add `onUnmounted(() => shareInstance?.destroy?.())` to safely dispose the instance.

---

### 🅰️ Angular

#### Existing Project (Inline into Target Component - DEFAULT)

Add directly into an existing Angular component (e.g. `header.component.ts` & template):

```typescript
import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from "@angular/core";
// @ts-ignore
import SocialShareButton from "@aossie-org/social-share-button";

@Component({
  selector: "app-header",
  template: `
    <header>
      <!-- Existing template content -->
      <div #shareContainer class="social-share-wrapper"></div>
    </header>
  `,
  styleUrls: ["../../node_modules/@aossie-org/social-share-button/css"],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild("shareContainer") shareContainer!: ElementRef;
  private shareInstance: any;

  ngAfterViewInit(): void {
    if (this.shareContainer?.nativeElement) {
      this.shareInstance = new SocialShareButton({
        container: this.shareContainer.nativeElement,
        buttonStyle: "default",
      });
    }
  }

  ngOnDestroy(): void {
    this.shareInstance?.destroy?.();
  }
}
```

#### New Project / Dedicated Component (EXCEPTION)

Create component file (`share-button.component.ts`) ONLY for new projects or explicit requests:

```typescript
import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
// @ts-ignore
import SocialShareButton from "@aossie-org/social-share-button";

@Component({
  selector: "app-share-button",
  template: `<div #container class="social-share-wrapper"></div>`,
  styleUrls: ["../../node_modules/@aossie-org/social-share-button/css"],
})
export class ShareButtonComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild("container") container!: ElementRef;
  @Input() buttonStyle: string = "default";
  @Input() url?: string;
  @Input() title?: string;
  private instance: any;

  ngAfterViewInit(): void {
    if (this.container?.nativeElement) {
      this.instance = new SocialShareButton({
        container: this.container.nativeElement,
        buttonStyle: this.buttonStyle,
        url: this.url,
        title: this.title,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.instance) {
      if (this.instance.updateOptions) {
        this.instance.updateOptions({
          buttonStyle: this.buttonStyle,
          url: this.url,
          title: this.title,
        });
      } else {
        this.instance.destroy?.();
        if (this.container?.nativeElement) {
          this.instance = new SocialShareButton({
            container: this.container.nativeElement,
            buttonStyle: this.buttonStyle,
            url: this.url,
            title: this.title,
          });
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.instance?.destroy?.();
  }
}
```

---

### 🌐 Vanilla HTML & JS

#### Existing Project (Inline into existing entry/template - DEFAULT)

Add container element into existing HTML (e.g. `index.html`):

```html
<div id="share-button"></div>
```

Instantiate directly in existing JS module (e.g. `src/main.js`):

```javascript
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

new SocialShareButton({ container: "#share-button", buttonStyle: "default" });
```

#### CDN Method (Pure HTML - Inline)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css"
/>
<div id="share-button"></div>
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    new window.SocialShareButton({ container: "#share-button", buttonStyle: "default" });
  });
</script>
```
