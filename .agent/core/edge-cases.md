# Edge Cases & Agent Lessons Learned

> **Agent Instruction:** This file contains specific errors previously made by AI agents in this project. Check this file before writing code to avoid repeating historical mistakes. Maintainers add entries whenever significant mistakes occur.

## 🔴 Critical — Will Break Things

- **Framework Double Rendering:** In React/Preact/Qwik, strict mode or standard state updates can trigger component re-renders. If `SocialShareButton` is instantiated without a `useRef` guard or cleanup routine, duplicate buttons or modal overlays will populate the DOM. You MUST implement and document the `destroy()` call on unmount.
- **Zero-Dependency Constraint:** Never add third-party npm modules (like `lodash`, `axios`, or dedicated social libraries) to `dependencies` or import them in `src/`. The core library is strictly **zero-dependency**.

## 🟡 Caution — Common Agent Mistakes

- **Gzipped Bundle Limit:** The total size of `src/social-share-button.js` and `src/social-share-button.css` combined must remain under **10KB** when compressed. Avoid adding extensive inline SVGs, redundant functions, or large asset mappings.
- **Theme Variables:** Do not hardcode colors in `src/social-share-button.css`. Use CSS variables so the buttons adjust cleanly to light/dark themes in the hosting application.
- **Param Encoding:** When generating sharing URLs for platforms (e.g. WhatsApp, Twitter), ensure all queries are fully escaped using `encodeURIComponent()` to prevent breakage on special characters.

## 🟢 Info — Good to Know

- Local manual testing is completed by opening `index.html` directly in the browser and verifying the sharing modal works.
- Keep ESLint rules satisfied by running `npm run lint` before committing.
