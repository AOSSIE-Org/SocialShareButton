# SocialShareButton — Quick Integration Prompt

> Use this simple prompt with any AI (ChatGPT, Claude, OpenCode, Copilot, etc.) to integrate SocialShareButton into your project in seconds.

---

## The Simple Prompt

Copy and paste this into any AI:

```
Read the full integration instructions from:
https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/copilot/integrate-social-share-button.prompt.md

My project uses Next.js App Router.
Add the SocialShareButton to my existing Navbar component.
Also enable debug: true to see analytics events in the console.
```

---

## What This Does

The AI will automatically:

1. Add the CDN CSS link to your layout file (`<head>`)
2. Add the CDN JS script to your layout file (`beforeInteractive`)
3. Add the share button container `<div id="share-button">` to your Navbar
4. Add the initialization code with `useEffect` (Next.js safe)
5. Enable `debug: true` so you can see analytics events in browser console

---

## What You'll See

### Console Events (with debug: true)

```
[SocialShareButton Analytics] { eventName: 'social_share_popup_open', ... }
[SocialShareButton Analytics] { eventName: 'social_share_click', platform: 'twitter', ... }
[SocialShareButton Analytics] { eventName: 'social_share_copy', ... }
```

---

## Framework Options

Change the prompt based on your framework:

| Framework            | Prompt Change                          |
| -------------------- | -------------------------------------- |
| Next.js App Router   | "My project uses Next.js App Router"   |
| Next.js Pages Router | "My project uses Next.js Pages Router" |
| React (CRA)          | "My project uses Create React App"     |
| Vite / Vue / Angular | "My project uses Vite"                 |
| Vanilla HTML         | "My project is plain HTML"             |

---

## Full Documentation

- Integration Guide: [.github/copilot/integrate-social-share-button.prompt.md](../.github/copilot/integrate-social-share-button.prompt.md)
- Analytics Guide: [.github/copilot/integrate-analytics.prompt.md](../.github/copilot/integrate-analytics.prompt.md)
- README: [../README.md](../README.md)

---

## Tutorial Videos

- **Video 1 — AI-Powered Integration**: https://youtu.be/xNDE-Y6h_Qo
- **Video 2 — Live Preview**: https://youtu.be/3s6ZxDcHanI
