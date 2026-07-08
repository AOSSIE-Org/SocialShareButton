# Code Examples & Patterns

> **Agent Instruction:** Follow the approved patterns below. If you find yourself writing something that looks like an anti-pattern, stop and reconsider.
>
> **Bold terms** are defined in [GLOSSARY.md](../../../skills/GLOSSARY.md); look them up there for the full meaning.

## ✅ Approved Patterns

### Core Class Instantiation (Vanilla JS)

```javascript
import SocialShareButton from "./social-share-button.js";

const shareBtn = new SocialShareButton({
  container: "#share-container",
  url: "https://aossie.org",
  title: "AOSSIE Org",
  platforms: ["twitter", "linkedin", "whatsapp"],
  onShare: (platform, url) => {
    console.log(`Shared to ${platform}: ${url}`);
  },
});

// Always clean up when removing elements
shareBtn.destroy();
```

### React Wrapper Pattern (Preventing Double-Instantiation)

```jsx
import { useEffect, useRef } from "react";

export function SocialShare({ url, title }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!instanceRef.current && window.SocialShareButton) {
      instanceRef.current = new window.SocialShareButton({
        container: containerRef.current,
        url: url,
        title: title,
      });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [url, title]);

  return <div ref={containerRef} id="share-button"></div>;
}
```

## ❌ Anti-Patterns — Do NOT Use

### ❌ Double Initialization (Causes DOM Clutter)

```jsx
// BAD: Re-creates instance every render without clean up
useEffect(() => {
  new window.SocialShareButton({ container: "#share" });
}); // Missing dependency array and cleanup!
```

### ❌ Swallowing Event Errors

```javascript
// BAD
try {
  navigator.clipboard.writeText(url);
} catch (e) {
  // Silent failure
}

// GOOD
try {
  await navigator.clipboard.writeText(url);
  this.triggerCallback("copy", url);
} catch (err) {
  console.error("Clipboard copy failed:", err);
}
```

### ❌ Direct Styles Manipulation

```javascript
// BAD: Modifying style attributes directly in JS instead of CSS classes
button.style.backgroundColor = "#ff0000";

// GOOD: Use the CSS configuration options
new SocialShareButton({
  container: "#share",
  buttonColor: "#ff0000",
});
```
