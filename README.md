# <!-- Don't delete it -->
<div name="readme-top"></div>


> ⚠️ **IMPORTANT**
>
> All project discussions happens on **[Discord](https://discord.com/channels/1022871757289422898/1479012884209078365)**.
>
> Please join the server **before opening PRs or Issues** and notify/tag the maintainer.  
> Failing to do so may cause **delays in review**.
>
> **Maintainer:** @kpj2006

<!-- Organization Logo -->
<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
  <img alt="Stability Nexus" src="public/aossie_logo.svg" width="175">
  <!-- <img src="public/todo-project-logo.svg" width="175" /> -->
</div>

&nbsp;

<!-- Organization Name -->
<div align="center">

[![Static Badge](https://img.shields.io/badge/AOSSIE-Social_Share_Button-228B22?style=for-the-badge&labelColor=FFC517)](https://TODO.aossie/)

<!-- Correct deployed url to be added -->

</div>

<!-- Organization/Project Social Handles -->
<p align="center">
<!-- Telegram -->
<a href="https://t.me/StabilityNexus">
<img src="https://img.shields.io/badge/Telegram-black?style=flat&logo=telegram&logoColor=white&logoSize=auto&color=24A1DE" alt="Telegram Badge"/></a>
&nbsp;&nbsp;
<!-- X (formerly Twitter) -->
<a href="https://x.com/aossie_org">
<img src="https://img.shields.io/twitter/follow/aossie_org" alt="X (formerly Twitter) Badge"/></a>
&nbsp;&nbsp;
<!-- Discord -->
<a href="https://discord.gg/hjUhu33uAn">
<img src="https://img.shields.io/discord/1022871757289422898?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord Badge"/></a>
&nbsp;&nbsp;
<!-- Medium -->
<a href="https://news.stability.nexus/">
  <img src="https://img.shields.io/badge/Medium-black?style=flat&logo=medium&logoColor=black&logoSize=auto&color=white" alt="Medium Badge"></a>
&nbsp;&nbsp;
<!-- LinkedIn -->
<a href="https://www.linkedin.com/company/aossie/">
  <img src="https://img.shields.io/badge/LinkedIn-black?style=flat&logo=LinkedIn&logoColor=white&logoSize=auto&color=0A66C2" alt="LinkedIn Badge"></a>
&nbsp;&nbsp;
<!-- Youtube -->
<a href="https://www.youtube.com/@StabilityNexus">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCZOG4YhFQdlGaLugr_e5BKw?style=flat&logo=youtube&logoColor=white&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube Badge"></a>
</p>

---

<div align="center">
<h1>SocialShareButton</h1>
</div>

Lightweight social sharing component for web applications. Zero dependencies, framework-agnostic.

[![npm version](https://img.shields.io/npm/v/social-share-button-aossie.svg)](https://www.npmjs.com/package/social-share-button-aossie)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

---

## Features

- 🌐 Multiple platforms: WhatsApp, Facebook, X, LinkedIn, Telegram, Reddit, Email
- 🎯 Zero dependencies - pure vanilla JavaScript
- ⚛️ Framework support: React, Next.js, Vue, Angular, or plain HTML
- 🔄 Auto-detects current URL and page title
- 📱 Fully responsive and mobile-ready
- 🎨 Customizable themes (dark/light)
- ⚡ Lightweight (< 10KB gzipped)

---

## Installation

### Via CDN (Recommended)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.css">
<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.3/src/social-share-button.js"></script>
```

### Via npm

```bash
npm install social-share-button-aossie
```

---

## Quick Start

```javascript
new SocialShareButton({
  container: '#share-button'
});
```

Add this HTML element:

```html
<div id="share-button"></div>
```

---

## 📚 Documentation & Getting Started

Choose your framework and start sharing in minutes — no dependencies, no setup friction.

**Start here if you're new to SocialShareButton:**

### Installation Guides
- [CDN Setup](./docs/installation-cdn.md) - Fastest way to get started
- [npm Package](./docs/installation-npm.md) - For build-based workflows

### Framework Guides
- [Vanilla JavaScript](./docs/vanilla-js.md) – Zero-build, script-tag usage
- [React](./docs/react.md) – Create React App & React projects
- [Next.js (App Router)](./docs/nextjs-app-router.md) – Recommended for new Next.js apps
- [Next.js (Pages Router)](./docs/nextjs-pages-router.md) – Legacy Next.js support
- [Vue / Angular / Vite](./docs/vue-angular.md) – Framework-agnostic setup

### Customize & Configure
- [Configuration Options](./docs/customization.md) - Colors, styles, button variants, and messaging
- [Callbacks](./docs/callbacks.md) - Track share events in your app
- [Dynamic URLs (SPA)](./docs/spa-dynamic-url.md) - Update share URL on route changes

### Help & Support
- [Troubleshooting](./docs/troubleshooting.md) - Common issues and solutions
- [View all docs](./docs/index.md) - Complete documentation index

---

## 🎬 Demo

See SocialShareButton in action! Open `index.html` in your browser to explore all features.

📺 **Video Tutorial:** [Watch on YouTube](https://youtu.be/cLJaT-8rEvQ?si=CLipA0Db4WL0EqKM)

---

We welcome contributions of all kinds! To contribute:

1. Fork the repository and create your feature branch (`git checkout -b feature/AmazingFeature`).
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
3. Test your changes by opening `index.html` in your browser to verify functionality.
4. Push your branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request for review.

If you encounter bugs, need help, or have feature requests:

- Please open an issue in this repository providing detailed information.
- Describe the problem clearly and include any relevant logs or screenshots.

We appreciate your feedback and contributions!

---

## License

This project is licensed under the GNU General Public License v3.0.
See the [LICENSE](LICENSE) file for details.