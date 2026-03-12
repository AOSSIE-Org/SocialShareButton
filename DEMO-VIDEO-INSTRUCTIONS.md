# Demo Video Instructions

This document defines the requirements for recording a demo video of **SocialShareButton**.
These instructions apply to **all framework integrations** — Vanilla JS, React, Solid.js, Vue, Qwik, Preact, Remix, and any other.

All contributors submitting a feature PR that includes a working demo are expected to follow these guidelines.

---

## Important: Use a Fresh Project — Not This Repo

**Do not record your demo using this repository's `index.html`.**

Your demo must show SocialShareButton integrated into a **brand new project created with the official framework starter**. This represents how a real end-user would install and use the library in their own app.

### Steps

1. Create a fresh app using the official starter command for your framework (see table below).
2. Install SocialShareButton into that new project.
3. Integrate the component.
4. Run the dev server and record your demo from the running app.

---

## Official Starter Commands by Framework

Use the official starter for your framework. These generate the cleanest starter code directly.

| Framework    | Starter Command                                                          |
| ------------ | ------------------------------------------------------------------------ |
| React (Vite) | `npm create vite@latest my-app -- --template react`                      |
| Next.js      | `npx create-next-app@latest my-app`                                      |
| Solid.js     | `npx degit solidjs/templates/js my-app`                                  |
| Qwik         | `npm create qwik@latest`                                                 |
| Preact       | `npm create preact@latest`                                               |
| Remix        | `npx create-remix@latest`                                                |
| Vue          | `npm create vue@latest`                                                  |
| Svelte       | `npx sv create my-app`                                                   |
| Astro        | `npm create astro@latest`                                                |
| Angular      | `npx @angular/cli new my-app`                                            |
| Django       | `django-admin startproject myapp`                                        |
| Rails        | `rails new my-app`                                                       |
| Vanilla JS   | Create an `index.html` file with a `<script>` tag (no build tool needed) |

After running the starter command, follow the setup steps for your ecosystem:

**JavaScript frameworks (React, Solid.js, Vue, Qwik, Preact, Remix, Svelte, Astro, Angular, Next.js):**

```bash
cd my-app
npm install        # or yarn install / pnpm install
npm run dev        # start the dev server
```

**Django:**

```bash
cd myapp
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install django
python manage.py runserver
```

**Rails:**

```bash
cd my-app
bundle install
bin/rails server
```

Then install SocialShareButton and integrate it following the README.

---

## Requirements

### Duration

- The video must be **150 seconds (2 minutes 30 seconds) or less**.
- Keep it concise — show only what is necessary to demonstrate the feature.

### Content Checklist

Your video must cover all of the following:

1. **Briefly show the fresh project** — the terminal output of the starter command or the running dev server URL.
2. **Show SocialShareButton rendered** inside the new app in a browser.
3. **Click the Share button** to open the modal.
4. **Demonstrate at least two platform share links** (e.g., WhatsApp, Twitter/X, LinkedIn).
5. **Demonstrate the Copy Link button** — show the "Copied!" feedback.
6. **Close the modal** (via the close button, overlay click, or ESC key).
7. **Show the browser console** is free of errors during the demo.

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
3. Add the public link to your **Pull Request description** under a `Demo Video` section. Example:

   ```md
   ## Demo Video

   [Watch demo](https://your-link-here)
   ```

4. If submitting via Discord, paste the link in the relevant project channel alongside your PR link.

---

## Tips for a Good Recording

- Use a screen recording tool such as OBS Studio, Loom, or your OS built-in recorder.
- Hide personal bookmarks and notifications before recording.
- Use a clean browser profile or incognito mode to avoid clutter.
- Keep your mouse movements steady and deliberate so reviewers can follow along.

---

_Questions? Ask in the [AOSSIE Discord server](https://discord.gg/hjUhu33uAn)._
