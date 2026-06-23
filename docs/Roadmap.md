# 🚀 SocialShareButton — Project Roadmap

> **Version:** 2.0 Draft  
> **Status:** Living Document 

---

## 📌 Vision

Transform SocialShareButton from a CDN-first widget into a **production-grade, framework-agnostic sharing SDK** — with privacy-first analytics, a live Theme Designer, and a hybrid CDN + npm distribution model — while keeping zero-config CDN usage as a first-class citizen.

---

## 🧭 Guiding Principles

- **Backward compatibility is non-negotiable.** Existing CDN + npm API surface (`onShare`, `onCopy`, `updateOptions`, all config keys) must not break.
- **Core is framework-free.** All DOM/framework dependencies live in wrappers, never in core.
- **Privacy by default.** Analytics opt-out, consent-gated activation, no PII collection unless explicitly configured.
- **One source of truth.** CDN builds and npm packages auto-generate from the same core package.
- **Contributor-first design.** Each package is independently contributable with clear ownership.

---

## 📍 Actual Current State (v1.0.3)

This section is the ground truth before any planning.

### ✅ What Already Exists

| Feature | Status | Notes |
|---|---|---|
| CDN distribution (jsDelivr) | ✅ | `v1.0.3` |
| npm package | ✅ | Published as `social-share-button-aossie` (unscoped) |
| 7 share platforms | ✅ | WhatsApp, Facebook, X, LinkedIn, Telegram, Reddit, Email |
| `onShare` callback | ✅ | `(platform, url) => {}` |
| `onCopy` callback | ✅ | `(url) => {}` |
| `theme: 'dark' \| 'light'` | ✅ | Basic two-mode theming |
| `buttonColor` / `buttonHoverColor` | ✅ | Programmatic color overrides |
| `customClass` | ✅ | Escape hatch for custom CSS |
| `modalPosition` | ✅ | Modal placement config |
| `updateOptions()` | ✅ | SPA dynamic URL updates |
| React wrapper | ✅ | Exists as `src/social-share-button-react.jsx` (copy-paste only) |
| TypeScript types | ❌ | None shipped |
| Scoped npm package | ❌ | Not yet (`@social-share/core` etc.) |
| Framework packages | ❌ | No installable Vue / Qwik / Solid packages |
| Proper CSS build artifact | ❌ | CSS imported from `src/` path — breaks in most bundlers |

### ⚠️ Known Issues to Fix Before Any New Features

- **CSS import path:** `import "social-share-button-aossie/src/social-share-button.css"` — `src/` is not a valid published path. Must export CSS from `dist/` via a `package.json` `exports` field.
- **No TypeScript types:** The npm package ships no `.d.ts` files — TypeScript users get no autocomplete or type safety.
- **React wrapper is copy-paste:** `src/social-share-button-react.jsx` is not installable — users copy it manually, making updates impossible.
- **No `exports` field in `package.json`:** No named exports, no ESM/CJS split, no tree-shaking support.

---

## 🏗️ Target Architecture

```
social-share-button/               ← Turborepo monorepo root
│
├── packages/
│   ├── core/                      ← @social-share/core
│   │   ├── src/
│   │   │   ├── engine.ts          ← platform URL builders, share logic
│   │   │   ├── config.ts          ← schema validation (zod)
│   │   │   ├── platforms/         ← twitter.ts, linkedin.ts, etc.
│   │   │   └── types.ts           ← shared TypeScript interfaces
│   │   └── package.json
│   │
│   ├── analytics/                 ← @social-share/analytics
│   │   ├── src/
│   │   │   ├── emitter.ts         ← builds on existing onShare/onCopy hooks
│   │   │   ├── consent.ts         ← consent gate + opt-out logic
│   │   │   ├── adapters/
│   │   │   │   ├── ga4.ts
│   │   │   │   ├── mixpanel.ts
│   │   │   │   ├── segment.ts
│   │   │   │   ├── plausible.ts
│   │   │   │   ├── posthog.ts
│   │   │   │   └── custom.ts      ← BaseAdapter interface
│   │   │   └── debug.ts
│   │   └── package.json
│   │
│   ├── theme/                     ← @social-share/theme
│   │   ├── src/
│   │   │   ├── tokens.ts          ← CSS variable definitions (extends current dark/light)
│   │   │   ├── presets/           ← light.ts, dark.ts, minimal.ts, bold.ts
│   │   │   ├── designer/          ← Theme Designer app (React)
│   │   │   └── export.ts          ← JSON/CSS/URL export logic
│   │   └── package.json
│   │
│   ├── react/                     ← @social-share/react  (replaces copy-paste jsx)
│   ├── vue/                       ← @social-share/vue
│   ├── qwik/                      ← @social-share/qwik
│   ├── solid/                     ← @social-share/solid
│   └── web-components/            ← @social-share/wc (Lit-based)
│
├── apps/
│   ├── docs/                      ← Documentation site (Next.js)
│   ├── playground/                ← Live demo + Theme Designer host
│   └── cdn-build/                 ← Bundles core → CDN artifacts (JS + CSS)
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Layer Responsibilities

| Layer | Package | Responsibility |
|---|---|---|
| Core Engine | `@social-share/core` | Platform logic, URL building, config validation |
| Analytics | `@social-share/analytics` | Event emission, consent, adapter routing |
| Theme | `@social-share/theme` | CSS tokens, presets, Theme Designer, export |
| Framework Wrappers | `@social-share/react` etc. | Framework-specific components using core |
| CDN Build | `apps/cdn-build` | Bundles core + wrappers into single distributable |

---

## 🗺️ Roadmap Phases

---

### ✅ Phase 0 — Stabilization *(Now — before any refactoring)*

**Goal:** Fix the broken npm package experience and document the full API surface. No new features.

- [ ] Fix CSS export path — move build output to `dist/`, add `package.json` `exports` field:
  ```json
  {
    "exports": {
      ".": "./dist/social-share-button.js",
      "./style": "./dist/social-share-button.css"
    }
  }
  ```
- [ ] Write and publish TypeScript declaration file (`social-share-button.d.ts`) covering all config options, `updateOptions()`, `onShare`, `onCopy`
- [ ] Fill README gaps — every config key typed, defaulted, and exampled
- [ ] Write integration tests for every platform (WhatsApp URL format, Twitter `via` param, etc.)
- [ ] Write regression tests for `updateOptions()` in SPA mode
- [ ] Create `BACKWARD_COMPAT.md` — the locked API surface that must not change across versions

**Exit Criteria:** `npm install social-share-button-aossie` + `import "social-share-button-aossie/style"` works in Vite, Next.js, and CRA without path errors.

---

### 🔄 Phase 1 — Core Extraction + Monorepo Setup

**Goal:** Migrate to Turborepo monorepo. Extract share logic into a pure, framework-free `@social-share/core`. CDN output continues to work without any user-visible change.

```typescript
// packages/core/src/engine.ts
export interface ShareConfig {
  url: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  platforms?: Platform[];
  componentId?: string;       // for analytics attribution (Phase 3)
}

// Same platform URL logic currently in social-share-button.js
export function buildShareURL(platform: Platform, config: ShareConfig): string { ... }
export function executeShare(platform: Platform, config: ShareConfig): void { ... }
```

- Core has **zero DOM dependency** — no `document`, no `window` in `packages/core`
- Runtime config validated via `zod`
- Existing `onShare` / `onCopy` / `updateOptions` API preserved in the CDN shim layer
- CDN artifact (`apps/cdn-build`) generates IIFE bundle from core — same output as today
- `bundlesize` CI check — CDN bundle must stay < 10KB gzipped

**Exit Criteria:** CDN artifact generated from `@social-share/core`. No user-facing behavior change. `npm install @social-share/core` works.

---

### 📦 Phase 2 — npm SDK + Framework Wrappers

**Goal:** Replace the copy-paste React wrapper with installable framework packages. React first since it already exists as `.jsx`.

**Priority order:**
1. `@social-share/react` — replaces `src/social-share-button-react.jsx`
2. `@social-share/vue` — Composition API component
3. `@social-share/qwik` — Resumable, SSR-safe (open issue)
4. `@social-share/solid` — Signal-based (open issue)
5. `@social-share/wc` — Lit-based custom element (open issue)

**Shared props interface across all wrappers:**

```typescript
interface SocialShareButtonProps {
  url?: string;                   // default: window.location.href
  title?: string;                 // default: document.title
  description?: string;
  hashtags?: string[];
  via?: string;
  platforms?: Platform[];
  buttonText?: string;
  buttonStyle?: 'default' | 'primary' | 'compact' | 'icon-only';
  buttonColor?: string;           // existing API
  buttonHoverColor?: string;      // existing API
  customClass?: string;           // existing API
  theme?: 'dark' | 'light' | ThemeTokens;  // string shorthand still works
  analytics?: AnalyticsConfig;    // Phase 3
  componentId?: string;
  onShare?: (platform: Platform, url: string) => void;  // same signature as today
  onCopy?: (url: string) => void;                       // same signature as today
}
```

**Migration for existing React wrapper users:**
```tsx
// Before (copy-paste)
import { SocialShareButton } from "./components/SocialShareButton";

// After (installable)
import { SocialShareButton } from "@social-share/react";
// Props interface identical — zero breaking change
```

**SSR safety:** All wrappers lazy-import `window` APIs; Qwik uses `$`; Vue/React use lifecycle guards. `updateOptions()` becomes automatic prop reactivity — no manual call needed.

**Exit Criteria:** Each wrapper published to npm, passes E2E tests, React migration requires zero prop changes.

---

### 🔬 Phase 3 — Analytics Module 

**Goal:** Ship `@social-share/analytics` — a privacy-first, pluggable analytics layer that uses the existing `onShare` / `onCopy` callbacks as its internal trigger mechanism.

#### Three Delivery Paths

```typescript
// Path 1: DOM Events — zero config, works with any analytics tool
document.addEventListener('ssb:share', (e) => console.log(e.detail));
document.addEventListener('ssb:copy', (e) => console.log(e.detail));
document.addEventListener('ssb:modal_open', (e) => console.log(e.detail));
document.addEventListener('ssb:modal_close', (e) => console.log(e.detail));

// Path 2: Single callback hook — simplest npm integration
new SocialShareButton({
  analytics: {
    onEvent: (event: SSBEvent) => myAnalytics.track(event.name, event.data)
  }
});

// Path 3: Named adapter — built-in wiring for popular tools
import { GA4Adapter } from '@social-share/analytics/adapters/ga4';

new SocialShareButton({
  analytics: {
    adapter: new GA4Adapter({ measurementId: 'G-XXXXXXXX' })
  }
});
```

#### Event Schema

```typescript
interface SSBEvent {
  name: 'ssb:share' | 'ssb:copy' | 'ssb:modal_open' | 'ssb:modal_close';
  platform?: Platform;
  componentId?: string;       // developer-defined identifier
  url: string;
  timestamp: number;
  sessionId: string;          // anonymous, ephemeral, never persisted
}
```

#### Built-in Adapters

| Adapter | Notes |
|---|---|
| `GA4Adapter` | `gtag('event', ...)` — no PII sent |
| `MixpanelAdapter` | `mixpanel.track()` — requires Mixpanel loaded |
| `SegmentAdapter` | `analytics.track()` — wraps Segment's standard API |
| `PlausibleAdapter` | `plausible()` custom event — cookieless by default |
| `PostHogAdapter` | `posthog.capture()` — EU cloud + self-hosted compatible |
| `CustomAdapter` | Extend `BaseAdapter`, implement `track(event: SSBEvent): void` |

#### Privacy Controls

```typescript
SocialShareButton.analytics.enable();    // call after consent granted
SocialShareButton.analytics.disable();   // opt-out / consent withdrawn
SocialShareButton.analytics.isEnabled(); // boolean
SocialShareButton.analytics.debug(true); // log to console, don't send
```

- No PII by default — no IP, no user ID, no fingerprinting
- `sessionId` is ephemeral — never written to `localStorage` or cookies
- CI lint rule flags `localStorage`, `document.cookie`, IP-related calls inside `packages/analytics`
- CDN users configure via `window.SocialShareButtonConfig.analytics`

**Exit Criteria:** All 6 adapters ship. Consent API implemented. Zero PII verified in tests.

---

### 🎨 Phase 4 — Theme System + Theme Designer 

**Goal:** Extend existing `dark` / `light` theming into a full CSS-variable-based system with an interactive Theme Designer. All existing `theme`, `buttonColor`, `buttonHoverColor`, `customClass` options remain fully supported.

#### CSS Token Layer

```css
/* packages/theme/src/tokens.css — formalizes and extends current theming */
:root {
  /* Extends current buttonColor / buttonHoverColor */
  --ssb-btn-bg: #1da1f2;
  --ssb-btn-bg-hover: #0d8fd9;
  --ssb-btn-radius: 6px;
  --ssb-btn-shadow: 0 2px 8px rgba(0,0,0,0.12);

  /* Per-platform icon colors */
  --ssb-icon-twitter: #1da1f2;
  --ssb-icon-linkedin: #0077b5;
  --ssb-icon-whatsapp: #25d366;
  --ssb-icon-facebook: #1877f2;
  --ssb-icon-telegram: #2ca5e0;
  --ssb-icon-reddit: #ff4500;

  /* Modal — extends current modalPosition */
  --ssb-modal-bg: #ffffff;
  --ssb-modal-width: 420px;
  --ssb-modal-animation-speed: 200ms;

  --ssb-font-family: system-ui, sans-serif;
  --ssb-shape: rounded;   /* rounded | pill | square */
}
```

#### Theme Designer App

Hosted at `apps/playground`.

**Controls:**
- Colors & Gradients — solid + gradient builder per button
- Shapes — rounded / pill / square
- Border — width, color, style
- Per-platform icon color overrides
- Modal controls — background, width, position, animation speed
- Font family, shadow intensity, hover effect selector

**Export formats:**
- CSS variables block
- `.json` theme file (SDK-importable)
- Shareable URL (theme as URL params)
- npm config object

**SDK usage:**

```typescript
import { darkTheme } from '@social-share/theme/presets';
import myTheme from './my-theme.json'; // from Theme Designer

<SocialShareButton theme={darkTheme} />
<SocialShareButton theme={myTheme} />
<SocialShareButton theme="dark" />  // string shorthand still works
```

**Exit Criteria:** Theme Designer live. All export formats work. String `theme` option still works. Preset tokens map 1:1 to current CSS class behavior.

---

### 🌐 Phase 5 — Hybrid Distribution + Platform Integrations

**Goal:** CDN and SDK reach full feature parity. Complete all planned server-side and CMS integrations.

**CDN feature parity:**
- Bundle includes analytics + theming (opt-in at build config level)
- Config via `data-ssb-*` HTML attributes or `window.SocialShareButtonConfig`
- SRI hash generation in CI, hosted on jsDelivr + unpkg

**Platform integrations:**

| Integration | Delivery | Issue Status |
|---|---|---|
| Remix | `@social-share/react` + SSR guide | 🟡 Open |
| Solid.js | `@social-share/solid` | 🟡 Open |
| Rails | Gem wrapper + CDN tag helper | 🟡 Open |
| Django | Template tag + CDN | 🟡 Open |
| Laravel | Blade component + CDN | 🟡 Open |
| WordPress | Plugin (CDN-backed) | 🟡 Open |
| Hugo | Shortcode + CDN | 🟡 Open |
| Jekyll | Include template + CDN | 🟡 Open |
| Web Components (Lit) | `@social-share/wc` | 🟡 Open |
| Alpine.js | `x-data` binding guide + CDN | 🟡 Open |

CI smoke test per integration: spin up minimal app, assert button renders and emits share event.

---

### ⚡ Phase 6 — Advanced Features & Ecosystem 

**Accessibility:**
- Full ARIA — `role="button"`, `aria-label`, `aria-expanded` on modal
- Keyboard navigation — Tab, Enter, Escape
- `prefers-reduced-motion` support (maps to `--ssb-modal-animation-speed: 0ms`)
- WCAG 2.1 AA tested with axe-core in CI

**Performance:**
- CDN bundle: target < 8KB gzipped
- npm packages: tree-shakeable — twitter-only import ~1KB
- CSS: single `@layer` block, no `@import` chains

**Plugin System:**

```typescript
SocialShareButton.registerPlatform({
  id: 'bluesky',
  label: 'Bluesky',
  icon: BlueskyIcon,
  buildURL: (config) => `https://bsky.app/intent/compose?text=${config.title} ${config.url}`,
});
```

**Native Web Share API:**
```typescript
new SocialShareButton({
  preferNativeShare: 'mobile-only',  // true | false | 'mobile-only'
});
// Falls back to custom modal when navigator.share() is unavailable
```

**Monorepo tooling maturity:**
- Changesets-based automated releases via GitHub Actions
- Per-package changelogs
- Canary / beta release channel
- Renovate bot for dependency updates

---

## 🤝 Contribution Opportunities

| Area | Skills Needed | Phase |
|---|---|---|
| Fix CSS export path + `exports` field | npm packaging | 0 |
| Write `.d.ts` TypeScript declarations | TypeScript | 0 |
| Core engine extraction | TypeScript, DOM APIs | 1 |
| Turborepo + pnpm workspace setup | Monorepo tooling | 1 |
| `@social-share/react` (from existing jsx) | React | 2 |
| `@social-share/vue` / `solid` / `qwik` | Vue / Solid / Qwik | 2 |
| Analytics adapters | GA4 / PostHog / Segment APIs | 3 |
| Theme Designer UI | React, CSS variables | 4 |
| CMS / server-side integrations | Rails / Django / Laravel / WP | 5 |
| Accessibility audit | WCAG, axe-core | 6 |
| Docs site | Next.js, MDX | Ongoing |
| CI/CD pipelines | GitHub Actions, Changesets | Ongoing |

> 💡 Phase 0 tasks are labeled `good-first-issue` and require no monorepo knowledge — ideal starting point for new contributors.

---

## 🔭 Future Considerations

- **Remote caching:** Turborepo remote cache (Vercel or self-hosted) to cut CI time as packages scale
- **Automated CDN/SDK sync:** Single Changesets release flow publishes npm + regenerates CDN artifact simultaneously
- **i18n:** Button labels and modal copy localized via lightweight key/value config
- **Analytics dashboard:** Optional self-hostable micro-service aggregating `@social-share/analytics` events into a share insights view
- **Figma design tokens sync:** Export Theme Designer tokens to Figma via Tokens Studio plugin format

---

## 📊 Distribution Strategy

| Path | Audience | Package | Status |
|---|---|---|---|
| CDN (`<script>` tag) | No-build / CMS / quick integration | IIFE bundle | ✅ v1.0.3 |
| npm (unscoped) | Current npm users | `social-share-button-aossie` | ✅ Needs fix (Phase 0) |
| npm (scoped core) | Framework-agnostic use | `@social-share/core` | 🚧 Phase 1 |
| npm (framework) | React / Vue / Next.js apps | `@social-share/react` etc. | 🎯 Phase 2 |
| npm (analytics) | Apps needing share tracking | `@social-share/analytics` | 🎯 Phase 3 |
| npm (theme) | Theme Designer consumers | `@social-share/theme` | 🎯 Phase 4 |
| Server-side templates | Rails, Django, Laravel, WP | CDN + thin wrapper | 🎯 Phase 5 |

---

*This roadmap is a living document. Phases may shift based on contributor capacity and community feedback. Open a GitHub Discussion to propose changes.*
