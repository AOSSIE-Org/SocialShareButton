# Demo Video Instructions

This document defines the requirements for recording a demo video of **SocialShareButton**.
These instructions apply to **all framework integrations** — Vanilla JS, React, Solid.js, Vue, or any other.

All contributors submitting a feature PR that includes a working demo are expected to follow these guidelines.

---

## Requirements

### Duration

- The video must be **150 seconds (2 minutes 30 seconds) or less**.
- Keep it concise — show only what is necessary to demonstrate the feature.

### Content Checklist

Your video must cover all of the following:

1. **Show the working demo page** in a browser (e.g., `index.html` opened locally, or a live hosted URL).
2. **Click the Share button** to open the modal.
3. **Demonstrate at least two platform share links** (e.g., WhatsApp, Twitter/X, LinkedIn).
4. **Demonstrate the Copy Link button** — show the "Copied!" feedback.
5. **Close the modal** (via the close button, overlay click, or ESC key).
6. **Show the browser console** is free of errors during the demo.

### Hosting

- Upload the video to **Google Drive**, **YouTube** (unlisted is fine), **Loom**, or any platform that provides a **publicly accessible link**.
- Do **not** attach the video file directly to the Pull Request — link it instead.
- The video will later be uploaded to the **AOSSIE YouTube channel** by the maintainers.

### Video Quality

- Minimum resolution: **720p (1280×720)**.
- Make sure the browser window and UI elements are clearly visible — avoid recording a tiny window.
- Audio commentary is optional but encouraged; if you do narrate, keep it clear.
- No need for heavy editing — a clean screen recording is sufficient.

---

## How to Submit

1. Record your demo following the checklist above.
2. Upload it to a public hosting platform.
3. Add the public link to your **Pull Request description** under a `Demo Video` section, like this:

```
## Demo Video
[Watch demo](https://your-link-here)
```

4. If submitting via Discord, paste the link in the relevant project channel alongside your PR link.

---

## Framework-Specific Notes

These notes apply on top of the common requirements above.

| Framework  | What to show specifically                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Vanilla JS | `index.html` opened directly in browser; show the `<script>` tag setup in DevTools Sources if possible                       |
| React      | Show the component rendered in a React app; demonstrate props like `theme`, `buttonText`, or `platforms` being passed        |
| Solid.js   | Show the component rendered in a Solid app; demonstrate reactivity — e.g., changing a prop live and seeing the button update |
| Vue        | Show the component in a Vue SFC; demonstrate `v-bind` prop passing if applicable                                             |
| Other      | Show the integration entry point (import/require) and the rendered output                                                    |

---

## Tips for a Good Recording

- Use a screen recording tool such as OBS Studio, Loom, or your OS built-in recorder.
- Hide personal bookmarks and notifications before recording.
- Use a clean browser profile or incognito mode to avoid clutter.
- Keep your mouse movements steady and deliberate so reviewers can follow along.

---

_Questions? Ask in the [AOSSIE Discord server](https://discord.gg/hjUhu33uAn)._
