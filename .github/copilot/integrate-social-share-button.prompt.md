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

- npm: `npm i @aossie-org/social-share-button`
- pnpm: `pnpm add @aossie-org/social-share-button`
- yarn: `yarn add @aossie-org/social-share-button`
- bun: `bun add @aossie-org/social-share-button`
*(Skip if CDN method requested).*

### 4. Ask User Placement (If Unspecified)

Ask: *"Where would you like to place the Social Share Button? Options: npm | CDN. Style: default | round | square."*

### 5. Mandatory Integration Rules

- **ESM Import**: MUST use default import `import SocialShareButton from "@aossie-org/social-share-button";` (Do NOT use named `{ SocialShareButton }`).
- **CSS Import**: Include `@aossie-org/social-share-button/css` or CDN CSS.
- **Next.js Client Components**: Include `"use client";` at top of files using hooks (`useEffect`, `useRef`).
- **No `as any` in `.js`/`.jsx`**: Do NOT use TypeScript assertions in JavaScript files.

---

## Technology Guides

> ⚠️ **CRITICAL DIRECTIVE**: Jump directly to target framework section. Ignore others.

---

### ⚛️ React / Next.js

#### npm Method

Create wrapper component (`src/components/ShareButton.jsx`):

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

2. **Component Wrapper (`ShareButton.jsx`)**:

```jsx
"use client";
import { useEffect, useRef } from "react";

export default function ShareButton({ style = "default", url, title }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    let timer;
    const init = () => {
      if (!window.SocialShareButton || !containerRef.current) return;
      instanceRef.current?.destroy?.();
      instanceRef.current = new window.SocialShareButton({
        container: containerRef.current,
        buttonStyle: style,
        url,
        title,
      });
    };

    if (window.SocialShareButton) init();
    else timer = setInterval(() => { if (window.SocialShareButton) { clearInterval(timer); init(); } }, 100);

    return () => {
      if (timer) clearInterval(timer);
      instanceRef.current?.destroy?.();
    };
  }, [style, url, title]);

  return <div ref={containerRef} className="social-share-wrapper"></div>;
}
```

---

### 🟣 Preact

#### npm Method

Import hooks from `preact/hooks` (or ensure `react` and `react-dom` are aliased to `preact/compat` in bundler config):

Create component (`src/components/ShareButton.jsx`):

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

1. **Global Template (`index.html`)**: Add CDN `<link>` to `<head>` and `<script>` to `<body>`.

2. **Component Wrapper (`ShareButton.jsx`)**:

```jsx
import { useEffect, useRef } from "preact/hooks";

export default function ShareButton({ style = "default", url, title }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    let timer;
    const init = () => {
      if (!window.SocialShareButton || !containerRef.current) return;
      instanceRef.current?.destroy?.();
      instanceRef.current = new window.SocialShareButton({
        container: containerRef.current,
        buttonStyle: style,
        url,
        title,
      });
    };

    if (window.SocialShareButton) init();
    else timer = setInterval(() => { if (window.SocialShareButton) { clearInterval(timer); init(); } }, 100);

    return () => {
      if (timer) clearInterval(timer);
      instanceRef.current?.destroy?.();
    };
  }, [style, url, title]);

  return <div ref={containerRef} class="social-share-wrapper"></div>;
}
```

---

### CDN — Qwik

Add CDN `<link>` and `<script>` tags in `src/root.tsx` `<head>`.
Wrapper (`ShareButton.tsx`):

```tsx
import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";

interface Props { style?: "default" | "round" | "square"; url?: string; title?: string; }

export default component$<Props>(({ style = "default", url, title }) => {
  const containerRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ cleanup }) => {
    const Ctor = typeof window !== "undefined" ? (window as any).SocialShareButton : null;
    if (Ctor && containerRef.value) {
      const btn = new Ctor({ container: containerRef.value, buttonStyle: style, url: url || window.location.href, title: title || document.title });
      cleanup(() => btn?.destroy?.());
    }
  });

  return <div ref={containerRef} class="social-share-wrapper"></div>;
});
```

---

### 🟢 Vue 3

#### npm Method

`<script setup>` component (`ShareButton.vue`):

```vue
<template>
  <div ref="containerRef" class="social-share-wrapper"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

const props = defineProps({ style: { type: String, default: "default" }, url: String, title: String });
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

Add CDN `<link>` & `<script>` tags to `index.html`. In `onMounted`, verify `window.SocialShareButton` exists before instantiating `instance = new window.SocialShareButton({ container: containerRef.value, buttonStyle: "default" })`, and add `onUnmounted(() => instance?.destroy?.())` to safely dispose the instance.

---

### 🅰️ Angular

Component file (`share-button.component.ts`):

```typescript
import { Component, ElementRef, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
// @ts-ignore
import SocialShareButton from '@aossie-org/social-share-button';

@Component({
  selector: 'app-share-button',
  template: `<div #container class="social-share-wrapper"></div>`,
  styleUrls: ['../../node_modules/@aossie-org/social-share-button/css']
})
export class ShareButtonComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container') container!: ElementRef;
  @Input() buttonStyle: string = 'default';
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
        this.instance.updateOptions({ buttonStyle: this.buttonStyle, url: this.url, title: this.title });
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

  ngOnDestroy(): void { this.instance?.destroy?.(); }
}
```

---

### 🌐 Vanilla HTML & JS

#### npm Method (Vite/Webpack)

Entry module (`src/main.js`):

```javascript
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

new SocialShareButton({ container: "#share-button", buttonStyle: "default" });
```

HTML template (`index.html`):

```html
<div id="share-button"></div>
<script type="module" src="/src/main.js"></script>
```

#### CDN Method (Pure HTML)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />
<div id="share-button"></div>
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    new window.SocialShareButton({ container: "#share-button", buttonStyle: "default" });
  });
</script>
```
