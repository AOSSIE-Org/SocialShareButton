# Tutorial Video: SocialShareButton + Analytics Integration

> Related issue: [#94 — Record a Tutorial Video for SocialShareButton Analytics Integration](https://github.com/AOSSIE-Org/SocialShareButton/issues/94)
> Reference PR: [#65 — Analytics Integration](https://github.com/AOSSIE-Org/SocialShareButton/pull/65)

---

## Video Links

**Video 1 — Setup & Code Integration**
https://youtu.be/xNDE-Y6h_Qo

**Video 2 — Live Preview on AOSSIE Website**
https://youtu.be/3s6ZxDcHanI

_Uploaded to YouTube (unlisted). Anyone with the link can view._

---

## What the Video Covers

This tutorial is split into **two videos** (authentic screen-recordings, no simulations, no heavy edits):

**Video 1 — Setup & Code Integration**

- Adding SocialShareButton CDN to the AOSSIE-Org/Website (Next.js + Tailwind)
- Adding the share button to the existing Navbar component
- Enabling `debug: true` to see analytics events in browser console
- Showing `social_share_popup_open` and `social_share_click` events firing

**Video 2 — Live Preview on AOSSIE Website**

- Full working UI of the share button on the live website
- Share modal opening with all platforms (WhatsApp, Facebook, Twitter, LinkedIn, etc.)
- Copy link functionality working
- Console showing analytics events in real-time

---

## Timestamped Breakdown

### Video 1 — Setup & Code Integration

| Timestamp | What is shown                                                                       |
| --------- | ----------------------------------------------------------------------------------- |
| 0:00–0:30 | Terminal: cloning AOSSIE-Org/Website repo, running `npm install` and `npm run dev`  |
| 0:30–1:00 | VS Code: Opening project, finding the Navbar component                              |
| 1:00–1:30 | Adding CDN links (CSS + JS) to the Next.js layout                                   |
| 1:30–2:00 | Adding `<div id="share-button">` container to Navbar                                |
| 2:00–2:30 | Adding `useEffect` with `SocialShareButton` initialization                          |
| 2:30–3:00 | Adding `debug: true` option                                                         |
| 3:00–3:30 | Browser: showing share button working, opening modal                                |
| 3:30–4:00 | DevTools Console: showing `social_share_popup_open` and `social_share_click` events |

### Video 2 — Live Preview on AOSSIE Website

| Timestamp | What is shown                                               |
| --------- | ----------------------------------------------------------- |
| 0:00–0:15 | Full AOSSIE website with share button visible in Navbar     |
| 0:15–0:45 | Clicking share button → modal opens with all platforms      |
| 0:45–1:15 | Clicking Twitter → opens Twitter share window               |
| 1:15–1:45 | Clicking WhatsApp → opens WhatsApp share window             |
| 1:45–2:15 | Clicking "Copy link" → link copied, toast/feedback shown    |
| 2:15–2:45 | Console panel: showing analytics events firing in real-time |
| 2:45–3:00 | Summary: button fully functional, analytics tracking works  |

---

## Code Used in the Video

### Step 1 — Debug mode (zero-config, all events to console)

Add `debug: true` to the existing `SocialShareButton` init call in the host project:

```js
// In AOSSIE-Org/Website's Navbar component (or your existing layout component)
shareButtonRef.current = new window.SocialShareButton({
  container: '#share-button',
  debug: true, // single addition — logs every event to the browser console
});
```

**Events you will see in the console:**

```
[SocialShareButton Analytics] { eventName: 'social_share_popup_open', platform: null, url: '...', ... }
[SocialShareButton Analytics] { eventName: 'social_share_click',       platform: 'twitter', url: '...', ... }
[SocialShareButton Analytics] { eventName: 'social_share_copy',        platform: null, url: '...', ... }
```

---

### Step 2 — Google Analytics 4 adapter (production-ready)

Load the analytics adapter from the CDN, then pass the adapter via `analyticsPlugins`:

```html
<!-- In your layout HTML (before </body>) -->
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-analytics.js"></script>

<script>
  const btn = new window.SocialShareButton({
    container: '#share-button',
    analyticsPlugins: [new window.SocialShareAnalytics.GoogleAnalyticsAdapter()],
  });
</script>
```

This calls `window.gtag('event', 'social_share_click', { share_platform: 'twitter', ... })` automatically for every interaction.

---

### Step 3 — Listening via DOM CustomEvent (framework-agnostic alternative)

If you prefer not to use adapters, listen to the `social-share` DOM event directly:

```js
document.addEventListener('social-share', (e) => {
  console.log('Share event:', e.detail);
  // Forward to your own analytics pipeline
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(e.detail),
  });
});
```

---

## Analytics Events Reference

| Event Name                 | Trigger                                                      |
| -------------------------- | ------------------------------------------------------------ |
| `social_share_popup_open`  | User clicked the share button and the modal opened           |
| `social_share_popup_close` | User dismissed the modal (button, overlay click, or Esc key) |
| `social_share_click`       | User clicked a platform inside the modal (intent to share)   |
| `social_share_success`     | Platform share window opened successfully                    |
| `social_share_copy`        | User clicked "Copy link"                                     |
| `social_share_error`       | An error prevented sharing or copying                        |

Every event carries the same payload schema:

```json
{
  "version": "1.0",
  "source": "social-share-button",
  "eventName": "social_share_click",
  "interactionType": "share",
  "platform": "twitter",
  "url": "https://example.com/page",
  "title": "My Page Title",
  "timestamp": 1710000000000,
  "componentId": null
}
```

---

## Host Repository Used

**AOSSIE-Org/Website** — Next.js + Tailwind CSS official AOSSIE website.

This repo was chosen because:

- It is the official AOSSIE organization website (real production project).
- Built with Next.js App Router — the most common modern web framework.
- The SocialShareButton README already documents Next.js integration steps directly.
- Easy to demonstrate working UI on a real public-facing website.

> Per the issue rules, the SocialShareButton repository itself was **not** used as the host.

---

## Recording Setup

- **Tool:** OBS Studio (free, open-source)
- **Resolution:** 1920×1080 @ 30fps
- **Duration:** ≤ 150 seconds (as required by Issue #94)
- **Style:** No simulations. No synthetic walkthroughs. Pure authentic screen-recording.

---

## Additional Resources

- [SocialShareButton README — Analytics section](../README.md)
- [Analytics adapter source — `src/social-share-analytics.js`](../src/social-share-analytics.js)
- [Reference PR #65 — Analytics integration](https://github.com/AOSSIE-Org/SocialShareButton/pull/65)
- [AOSSIE Discord](https://discord.gg/hjUhu33uAn)
