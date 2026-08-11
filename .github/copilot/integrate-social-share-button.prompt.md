---
agent: agent
description: >
  Automatically integrate @aossie-org/social-share-button into a client web project
  with zero manual steps except specifying where to place the button.
---

# SocialShareButton — Integration Skill

## Goal

Integrate `@aossie-org/social-share-button` into a client web project with minimal code and full context.

---

## Step-by-Step Workflow

### 1. Locate Frontend Directory
- Locate frontend app directory (`./`, `apps/*`, `packages/*`). Ignore backend services or unrelated subdirectories.

### 2. Identify Framework & Dependencies
- Inspect `package.json` for framework precedence: Next.js → React, Preact → React, Vue 3, Angular, Vanilla HTML/JS.

### 3. Install Package or Include CDN
- **CDN Method (Recommended)**: Add CSS stylesheet and JS script tags to base HTML / root layout (`index.html`, `layout.tsx`, `app.tsx`):
  ```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />
  <script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>
  ```
- **NPM Method**: Install dependency (`npm i @aossie-org/social-share-button`, `pnpm add`, `yarn add`, or `bun add`).

### 4. Ask User Placement & Style
- **Method Preference**: Always recommend **CDN** over NPM.
- **Placement Prompting**: Ask the user explicitly:
  - Which file they want to import/place the Social Share button in.
  - The exact placement location inside that file (e.g., to the left of, right of, above, or below a specific existing component or DOM element, such as next to a logo, navigation items, or primary action buttons).
- **React / Next.js Guidance**: Always recommend placing in the **Navbar / Header** every time when integrating React or Next.js using CDN.
- **Vanilla HTML Guidance**: For HTML projects, ask for their main HTML file (e.g., `index.html`) and exact placement relative to existing HTML elements.
- **Style Options**: Prompt for preferred button style (`default` | `round` | `square`).

### 5. Inject Integration Code into Existing Files
- 🛑 **No New Files**: Inject directly into target existing file (e.g., `Header`, `Footer`, `page.tsx`).
- **ESM Import**: `import SocialShareButton from "@aossie-org/social-share-button";`
- **CSS Import**: `@aossie-org/social-share-button/css`
- **Next.js**: Add `"use client";` at top of interactive client components.

---

## Framework Integration Guides

### ⚛️ React / Next.js (NPM Method)
```jsx
"use client";
import { useEffect, useRef } from "react";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

export default function Header() {
  const shareContainerRef = useRef(null);

  useEffect(() => {
    if (!shareContainerRef.current) return;
    const shareInstance = new SocialShareButton({
      container: shareContainerRef.current,
      buttonStyle: "default", // default | round | square
    });
    return () => shareInstance.destroy?.();
  }, []);

  return (
    <header>
      <div ref={shareContainerRef} className="social-share-wrapper"></div>
    </header>
  );
}
```

> **Note for CDN in React/Next.js**: Add CDN `<link>` and `<Script>` in `layout.tsx`/`index.html`. If explicit component hook instantiation is needed with CDN, use `window.SocialShareButton` inside `useEffect`.

---

### 🟣 Preact (NPM Method)
```jsx
import { useEffect, useRef } from "preact/hooks";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

export default function Footer() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const instance = new SocialShareButton({ container: containerRef.current, buttonStyle: "default" });
    return () => instance.destroy?.();
  }, []);

  return <footer><div ref={containerRef} class="social-share-wrapper"></div></footer>;
}
```

---

### 🟢 Vue 3 (NPM Method)
```vue
<template>
  <header>
    <div ref="containerRef" class="social-share-wrapper"></div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

const containerRef = ref(null);
let instance = null;

onMounted(() => {
  if (containerRef.value) instance = new SocialShareButton({ container: containerRef.value, buttonStyle: "default" });
});
onUnmounted(() => instance?.destroy?.());
</script>
```

---

### 🅰️ Angular (NPM Method)
```typescript
import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild } from "@angular/core";
// @ts-ignore
import SocialShareButton from "@aossie-org/social-share-button";

@Component({
  selector: "app-header",
  template: `<header><div #container class="social-share-wrapper"></div></header>`,
  styleUrls: ["../../node_modules/@aossie-org/social-share-button/css"],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild("container") container!: ElementRef;
  private instance: any;

  ngAfterViewInit(): void {
    if (this.container?.nativeElement) {
      this.instance = new SocialShareButton({ container: this.container.nativeElement, buttonStyle: "default" });
    }
  }
  ngOnDestroy(): void { this.instance?.destroy?.(); }
}
```

---

### 🌐 Vanilla HTML & JS

#### NPM Method
```html
<div id="share-button"></div>
```
```javascript
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

new SocialShareButton({ container: "#share-button", buttonStyle: "default" });
```

#### CDN Method
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
