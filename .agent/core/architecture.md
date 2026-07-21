# Core Project Architecture

## Architecture Overview

SocialShareButton is a lightweight, framework-agnostic social sharing library designed to have a **zero-dependency core** and remain under a bundled/gzipped size of **10KB**.

- **Core Vanilla Logic:** `src/social-share-button.js` handles the main configuration, DOM manipulation, share URL generation, modal creation, and cleanup.
- **Core CSS:** `src/social-share-button.css` styles the button layout, themes, modal container, and responsiveness.
- **Analytics:** `src/social-share-analytics.js` tracks sharing events and coordinates user-configured callbacks.
- **Framework Wrappers:** Specific wrapper files (`social-share-button-react.jsx`, `social-share-button-preact.jsx`, `social-share-button-qwik.tsx`) expose the core class in a framework-friendly manner.

## Architecture Boundaries

1. The core files in `src/` must remain completely independent of any external npm packages or custom libraries.
2. Framework wrappers must wrap the vanilla class instantiations and DOM elements properly (e.g., using React's `useRef` and `useEffect` hooks to prevent double renders).
3. Do NOT add node-specific APIs; all code must run in standard modern browsers.
4. CSS styles must use CSS variables to support light/dark themes natively.

## Conceptual Flow

```
User Click → Wrapper Component / Vanilla Class
           → Instantiate/Trigger SocialShareButton
           → Generate Platform URLs (WhatsApp, Facebook, Twitter, etc.)
           → Trigger Custom Callbacks (onShare, onCopy) via Analytics
           → Open Social Modal / Copy Link
```

## Dependency Map

| Dependency | Purpose               | Location       |
| ---------- | --------------------- | -------------- |
| ESLint     | Code Linting (Dev)    | `package.json` |
| Prettier   | Code Formatting (Dev) | `package.json` |
