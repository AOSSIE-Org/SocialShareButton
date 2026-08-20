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
  - `pnpm-lock.yaml` → `pnpm`
  - `yarn.lock` → `yarn`
  - `bun.lockb` / `bun.lock` → `bun`
  - `package-lock.json` (or default) → `npm`

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
   - ❌ **DO NOT** add `useEffect`, `useRef`, `onMounted`, or manual constructor calls. The CDN script automatically initializes `<div data-social-share>` elements via `MutationObserver`.

---

#### 📦 PATH B: If Package Manager Method is Selected (NPM / PNPM / Yarn / Bun)

1. **Install Package**: Run the detected package manager install command:
   - **npm**: `npm i @aossie-org/social-share-button`
   - **pnpm**: `pnpm add @aossie-org/social-share-button`
   - **yarn**: `yarn add @aossie-org/social-share-button`
   - **bun**: `bun add @aossie-org/social-share-button`
2. **Target Component**: Inject the ESM import, CSS import, and framework lifecycle hooks directly into the existing target component (e.g., `Header`, `Navbar`, `Footer`, `Hero`).
3. 🛑 **STRICT PROHIBITIONS FOR PACKAGE MANAGER**:
   - ❌ **DO NOT** add CDN `<link>` or `<script>` tags to `index.html` or root layouts.
   - ❌ **DO NOT** create new files like `ShareButton.tsx` (inject into existing components).
   - ❌ **Next.js**: Ensure `"use client";` is at the top of client components.

---

## Framework Integration Guides

### ⚛️ React / Next.js

#### CDN Method (Recommended)
Add CDN `<link>` and `<script>` to `layout.tsx` / `index.html`. In the target component:
```jsx
export default function Header({ style = "default" }) {
  return (
    <header>
      <div data-social-share data-button-style={style}></div>
    </header>
  );
}
```

#### Package Manager Method (NPM / PNPM / Yarn / Bun)
```jsx
"use client";
import { useEffect, useRef } from "react";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

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
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

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
```vue
<template>
  <header>
    <div data-social-share :data-button-style="style"></div>
  </header>
</template>

<script setup>
defineProps({
  style: { type: String, default: "default" },
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
import { ref, onMounted, onUnmounted } from "vue";
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

const props = defineProps({
  style: { type: String, default: "default" },
});
const containerRef = ref(null);
let instance = null;

onMounted(() => {
  if (containerRef.value)
    instance = new SocialShareButton({ container: containerRef.value, buttonStyle: props.style });
});
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
import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, Input } from "@angular/core";
// @ts-ignore
import SocialShareButton from "@aossie-org/social-share-button";

@Component({
  selector: "app-header",
  template: `<header><div #container class="social-share-wrapper"></div></header>`,
  styleUrls: ["../../node_modules/@aossie-org/social-share-button/css"],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild("container") container!: ElementRef;
  @Input() style: string = "default";
  private instance: any;

  ngAfterViewInit(): void {
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

#### Package Manager Method
```html
<div id="share-button"></div>
```

```javascript
import SocialShareButton from "@aossie-org/social-share-button";
import "@aossie-org/social-share-button/css";

new SocialShareButton({ container: "#share-button", buttonStyle: "default" });
```
