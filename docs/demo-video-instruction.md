# Demo Video Instructions for Framework Integrations

**Note:** These demo video instructions are **only for contributors of this repository** submitting feature Pull Requests.
They are **not intended for end users integrating SocialShareButton into their own frontend applications.**

**Do not record your demo using this repository's `index.html`.**

Your demo must show SocialShareButton integrated into a **brand new project created with the official framework starter**. This represents how a real end-user would install or import and use the library in their own app.

---

### ⚠️ Important Note for PR Testing

If you are adding a new file in your PR, the new wrapper files exist **only in the contributor's PR branch** and are **not included in the latest CDN release (e.g., v1.0.3)**. Using the released CDN may load **older code**, which can break the integration demo.

For demo recording, contributors should use **jsDelivr with their branch name**.

Use the following CDN format:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/GITHUB_USERNAME/SocialShareButton@BRANCH_NAME/src/social-share-button.css"
/>

<script src="https://cdn.jsdelivr.net/gh/GITHUB_USERNAME/SocialShareButton@BRANCH_NAME/src/social-share-button.js"></script>
```

Example:

```
GITHUB_USERNAME: aashnaachaudhary10
BRANCH_NAME: feat/qwik-integration
```

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/aashnaachaudhary10/SocialShareButton@feat/qwik-integration/src/social-share-button.css"
/>

<script src="https://cdn.jsdelivr.net/gh/aashnaachaudhary10/SocialShareButton@feat/qwik-integration/src/social-share-button.js"></script>
```

---

## Requirements

Follow the **integration guide added in your PR** (or show the integration steps if they are already present in the **README or docs section**).

### Content Checklist

Your video must cover all of the following:

1. **Briefly show the fresh project** — the terminal output of the starter command or the running dev server URL (the video should start from here; no need to show the starter project setup).
2. **Show the setup inside the codebase** — demonstrate what code you added to integrate SocialShareButton.
3. **Show the integration guide added in your PR** (or show the section if it already exists in the README or documentation).
4. **Demonstrate the button rendering on localhost** in the running application.
5. **Click the Share button** to open the modal.
6. **Demonstrate at least two platform share links** (e.g., WhatsApp, Twitter/X, LinkedIn).
7. **Demonstrate the Copy Link button** — show the "Copied!" feedback.
8. **Close the modal** (via the close button, overlay click, or ESC key).
9. **Show the browser console** is free of errors during the demo.

---

## Video Quality

- Minimum resolution: **720p (1280×720)**.
- Make sure the browser window and all UI elements are **clearly and fully visible** — avoid recording a tiny window.
- **Do not perform any actions in the background while recording the preview** (such as running scripts, console commands, automation tools, or manual changes outside the UI). All interactions must be visible in the interface.

> ⚠️ **Warning:** If hidden or background actions are detected during the preview, the submission may be **rejected**.

- Audio commentary is optional but encouraged; if you choose to narrate, keep it clear.
- No need for heavy editing — a clean screen recording is sufficient.

---

## Notes

- The video duration must be **150 seconds (2 minutes 30 seconds) or less**.
- Upload the video to **Google Drive or any platform with public access** (the maintainers will later upload it to the **AOSSIE YouTube channel**).
- Add the **public video link to the README demo section** of the repository where the integration is demonstrated.
- **Reference Demo (Next.js App Router):**
  [https://youtu.be/cLJaT-8rEvQ?si=CLipA0Db4WL0EqKM](https://youtu.be/cLJaT-8rEvQ?si=CLipA0Db4WL0EqKM)

---

## Context

**SocialShareButton** is also a **small component of a potential idea for GSoC 2026**:

AOSSIE GSoC Ideas
[https://github.com/AOSSIE-Org/Info/blob/main/GSoC-Ideas/2026/SEO.md](https://github.com/AOSSIE-Org/Info/blob/main/GSoC-Ideas/2026/SEO.md)

Because of this, we aim to build **short tutorial-style demos for developers** that clearly demonstrate the **button’s integration and functionality across frameworks**.
