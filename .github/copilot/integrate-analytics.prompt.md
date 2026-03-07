---
agent: agent
description: >
  Connect SocialShareButton analytics events to any analytics provider:
  Google Analytics 4, Mixpanel, Segment, Plausible, PostHog, or a custom
  system. Use this skill whenever a developer asks how to track share
  interactions or wire up analytics.
---

# SocialShareButton — Analytics Integration Skill

You are helping a developer connect **SocialShareButton** interaction events to
their analytics stack. The library is **privacy-by-design**: it never collects
or transmits data itself — it only emits local events that the host website
forwards to whatever tool they choose.

> **Prerequisite:** The button must already be integrated into the project.
> If it isn't, use the **`integrate-social-share-button`** skill first, then
> return here to wire up analytics.

---

## 1 — Standard event payload (every event carries these fields)

```js
{
  version        : "1.0",               // schema version — increment on breaking changes
  source         : "social-share-button", // always this value; useful for stream filtering
  eventName      : "social_share_click", // see event catalogue below
  interactionType: "share",              // "share" | "copy" | "popup_open" | "popup_close" | "error"
  platform       : "twitter",           // null for non-platform events
  url            : "https://example.com",
  title          : "My Page Title",
  timestamp      : 1709800000000,       // Date.now()
  componentId    : "hero-share",        // null unless set by developer
  errorMessage   : "...",               // only on social_share_error
}
```

---

## 2 — Core events catalogue

| `eventName`                  | `interactionType` | Fires when                                      |
| ---------------------------- | ----------------- | ----------------------------------------------- |
| `social_share_popup_open`    | `popup_open`      | Share modal/popup opens                         |
| `social_share_popup_close`   | `popup_close`     | Modal closes (button, overlay, or Esc key)      |
| `social_share_click`         | `share`           | User clicks a platform button (share intent)    |
| `social_share_success`       | `share`           | Platform share window opened successfully       |
| `social_share_copy`          | `copy`            | User copies the link to clipboard               |
| `social_share_error`         | `error`           | Share or copy action failed                     |

---

## 3 — Three delivery paths (choose one or combine freely)

### Path A — DOM CustomEvent (best for CDN / vanilla / any framework)

```js
// Fires on the container element and bubbles through the DOM (composed:true
// means it also crosses shadow-DOM boundaries).
document.addEventListener("social-share", (e) => {
  const payload = e.detail;
  // Forward to your analytics tool here
});
```

Multiple independent listeners can subscribe simultaneously — useful when GA4
and Mixpanel both need the same event.

### Path B — `onAnalytics` callback (best for inline single-consumer setups)

```js
new SocialShareButton({
  container: "#share-button",
  onAnalytics: (payload) => {
    // Forward to your analytics tool here
  },
});
```

### Path C — `analyticsPlugins` adapter registry (best for multiple providers)

Load the adapters file **in addition to** the main library script:

```html
<!-- After the main social-share-button.js script tag -->
<!-- CDN (pick whichever tag version ships this file): -->
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@main/src/social-share-analytics.js"></script>

<!-- Or via npm: -->
<!-- import { GoogleAnalyticsAdapter, MixpanelAdapter } from "social-share-button-aossie/src/social-share-analytics.js"; -->
```

```js
const { GoogleAnalyticsAdapter, MixpanelAdapter } = window.SocialShareAnalytics;

new SocialShareButton({
  container: "#share-button",
  analyticsPlugins: [
    new GoogleAnalyticsAdapter(),
    new MixpanelAdapter(),
  ],
});
```

---

## 4 — Built-in adapters (from `src/social-share-analytics.js`)

Each adapter checks that the provider's global exists before calling it, so
no errors occur if a provider hasn't loaded yet.

> **Relationship to `onShare` / `onCopy`:** These legacy callbacks fire for
> backwards-compatibility when a share or copy happens. `onAnalytics` and
> `analyticsPlugins` are the dedicated analytics channels — they receive
> **all** events (popup open/close, errors, etc.), not just share and copy.
> You can use both simultaneously without conflict.

### Google Analytics 4

Prerequisite: GA4 `gtag.js` snippet loaded by the host.

```js
const { GoogleAnalyticsAdapter } = window.SocialShareAnalytics;

new SocialShareButton({
  container: "#share-button",
  analyticsPlugins: [new GoogleAnalyticsAdapter()],
});

// Calls: gtag('event', payload.eventName, { share_platform, share_url, ... })
```

Custom event category (optional):

```js
new GoogleAnalyticsAdapter({ eventCategory: "engagement" })
```

### Mixpanel

Prerequisite: `mixpanel-browser` snippet or SDK loaded.

```js
const { MixpanelAdapter } = window.SocialShareAnalytics;
new SocialShareButton({
  container: "#share-button",
  analyticsPlugins: [new MixpanelAdapter()],
});
// Calls: mixpanel.track(eventName, { platform, url, ... })
```

### Segment (Analytics.js / analytics-next)

```js
const { SegmentAdapter } = window.SocialShareAnalytics;
new SocialShareButton({
  container: "#share-button",
  analyticsPlugins: [new SegmentAdapter()],
});
// Calls: analytics.track(eventName, { platform, url, ... })
```

### Plausible

Prerequisite: Plausible `script.js` loaded with custom events enabled.

```js
const { PlausibleAdapter } = window.SocialShareAnalytics;
new SocialShareButton({
  container: "#share-button",
  analyticsPlugins: [new PlausibleAdapter()],
});
// Calls: plausible(eventName, { props: { platform, url, ... } })
```

### PostHog

```js
const { PostHogAdapter } = window.SocialShareAnalytics;
new SocialShareButton({
  container: "#share-button",
  analyticsPlugins: [new PostHogAdapter()],
});
// Calls: posthog.capture(eventName, { platform, url, ... })
```

### Custom / inline function

Wrap any one-off function without subclassing:

```js
const { CustomAdapter } = window.SocialShareAnalytics;
new SocialShareButton({
  analyticsPlugins: [
    new CustomAdapter((payload) => {
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }),
  ],
});
```

### Custom provider class (full adapter)

```js
class MyAnalyticsAdapter {
  track(payload) {
    MyAnalytics.logEvent(payload.eventName, {
      platform: payload.platform,
      url: payload.url,
    });
  }
}

new SocialShareButton({
  analyticsPlugins: [new MyAnalyticsAdapter()],
});
```

---

## 5 — Combining multiple providers

All three delivery paths run simultaneously. The example below sends events to
GA4, Mixpanel, and a custom endpoint at the same time:

```js
const { GoogleAnalyticsAdapter, MixpanelAdapter, CustomAdapter } = window.SocialShareAnalytics;

document.addEventListener("social-share", (e) => {
  console.log("Raw event:", e.detail); // Debugging / logging
});

new SocialShareButton({
  container: "#share-button",
  componentId: "homepage-hero",
  analyticsPlugins: [
    new GoogleAnalyticsAdapter(),
    new MixpanelAdapter(),
    new CustomAdapter((p) => fetch("/log", { method: "POST", body: JSON.stringify(p) })),
  ],
});
```

---

## 6 — Debug mode

Pass `debug: true` to log every emitted event to the browser console during
development. Remove or set to `false` in production.

```js
new SocialShareButton({
  container: "#share-button",
  debug: true,
  // → [SocialShareButton Analytics] { version: '1.0', source: 'social-share-button', ... }
});
```

---

## 7 — Opting out of analytics

Set `analytics: false` to disable all event emission. No CustomEvents,
callbacks, or adapter calls will be made — useful for environments where any
instrumentation must be explicitly consented to before activation.

```js
new SocialShareButton({
  container: "#share-button",
  analytics: false,
});
```

---

## 8 — Privacy and compliance

- The library **never** initiates network requests.
- Payloads contain only the `url` and `title` the host developer already chose
  to share — no PII is inferred or added.
- GDPR / CCPA: activate analytics adapters only **after** the user has consented
  via your consent management platform (CMP):

```js
// Example: activate only after CMP consent
consentManager.onConsent("analytics", () => {
  shareButtonInstance.updateOptions({
    analyticsPlugins: [new GoogleAnalyticsAdapter()],
  });
});
```

---

## 9 — Event naming alignment (GA4)

All events follow `social_<object>_<action>`, which matches GA4's recommended
naming convention for custom events. Mapping to other platforms:

| Library event            | GA4 event name           | Mixpanel / Segment     |
| ------------------------ | ------------------------ | ---------------------- |
| `social_share_click`     | `social_share_click`     | `Social Share Click`   |
| `social_share_success`   | `social_share_success`   | `Social Share Success` |
| `social_share_copy`      | `social_share_copy`      | `Social Share Copy`    |
| `social_share_popup_open`| `social_share_popup_open`| `Social Share Popup Open` |

---

## 10 — Output format

- Show only the snippet relevant to the developer's chosen analytics provider.
- If the developer asks about GDPR / consent, always demonstrate the deferred
  activation pattern from section 8.
- Never suggest bundling analytics SDKs inside the component — point to the
  host-side script tag instead.
- Remind developers that `debug: true` should be removed before production.
