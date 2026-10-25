import { cdnBase } from "@/config/site";

/**
 * Copy-paste installation snippets per framework. Code is intentionally not translated;
 * the surrounding prose lives in src/messages/*.json under Install.frameworks.<id>.
 * Keep these in sync with the "Quick Start Guide" section of the repository README.
 */

export const frameworkIds = ["cra", "next-app", "next-pages", "vite", "preact", "html"] as const;
export type FrameworkId = (typeof frameworkIds)[number];

export interface Snippet {
  file: string;
  code: string;
}

export interface FrameworkGuide {
  /** File that loads the library (step 2). */
  loadFile: string;
  head: Snippet;
  body: Snippet & { tag: string; parent: string };
  container: Snippet;
  init: Snippet;
}

const cssHref = `${cdnBase}/social-share-button.css`;
const jsSrc = `${cdnBase}/social-share-button.js`;

const htmlHead = `<head>
  <link
    rel="stylesheet"
    href="${cssHref}"
  />
</head>`;

const htmlBody = (mount: string) => `<body>
  ${mount}
  <script src="${jsSrc}"></script>
</body>`;

const reactEffectBody = `  useEffect(() => {
    const initButton = () => {
      if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

      shareButtonRef.current = new window.SocialShareButton({
        container: "#share-button",
      });
      initRef.current = true;
    };

    if (window.SocialShareButton) {
      initButton();
    } else {
      const checkInterval = setInterval(() => {
        if (window.SocialShareButton) {
          clearInterval(checkInterval);
          initButton();
        }
      }, 100);

      return () => {
        clearInterval(checkInterval);
        if (shareButtonRef.current?.destroy) {
          shareButtonRef.current.destroy();
        }
        initRef.current = false;
      };
    }

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  // Keep the share URL and title in sync with the current route
  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: window.location.href,
        title: document.title,
      });
    }
  }, [pathname]); // re-runs on every client-side navigation

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}

declare global {
  interface Window {
    SocialShareButton: any;
  }
}`;

const reactContainer = `// Inside the JSX your component returns:
<div id="share-button" ref={containerRef}></div>`;

export const installGuides: Record<FrameworkId, FrameworkGuide> = {
  cra: {
    loadFile: "public/index.html",
    head: { file: "public/index.html", code: htmlHead },
    body: {
      file: "public/index.html",
      code: htmlBody(`<div id="root"></div>`),
      tag: "<script>",
      parent: "<body>",
    },
    container: { file: "src/components/Header.jsx", code: reactContainer },
    init: {
      file: "src/components/Header.jsx",
      code: `import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom"; // omit if not using React Router

// Replace 'Header' with the component where the button should appear
function Header() {
  const shareButtonRef = useRef(null);
  const containerRef = useRef(null);
  const initRef = useRef(false);
  const { pathname } = useLocation(); // omit if not using React Router

  useEffect(() => {
    if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: "#share-button",
    });
    initRef.current = true;

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  // Keep the share URL and title in sync with the current route
  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: window.location.href,
        title: document.title,
      });
    }
  }, [pathname]);

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}

export default Header;`,
    },
  },
  "next-app": {
    loadFile: "app/layout.tsx",
    head: {
      file: "app/layout.tsx",
      code: `<head>
  <link
    rel="stylesheet"
    href="${cssHref}"
  />
</head>`,
    },
    body: {
      file: "app/layout.tsx",
      code: `import Script from "next/script";

<body>
  {children}
  <Script
    src="${jsSrc}"
    strategy="beforeInteractive"
  />
</body>`,
      tag: "<Script>",
      parent: "<body>",
    },
    container: { file: "app/components/Header.tsx", code: reactContainer },
    init: {
      file: "app/components/Header.tsx",
      code: `"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Replace 'Header' with the component where the button should appear
export default function Header() {
  const shareButtonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const pathname = usePathname();

${reactEffectBody}`,
    },
  },
  "next-pages": {
    loadFile: "pages/_document.tsx",
    head: {
      file: "pages/_document.tsx",
      code: `<Head>
  <link
    rel="stylesheet"
    href="${cssHref}"
  />
</Head>`,
    },
    body: {
      file: "pages/_document.tsx",
      code: `<body>
  <Main />
  <NextScript />
  <script src="${jsSrc}"></script>
</body>`,
      tag: "<script>",
      parent: "<body>",
    },
    container: { file: "components/Header.tsx", code: reactContainer },
    init: {
      file: "components/Header.tsx",
      code: `import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

// Replace 'Header' with the component where the button should appear
export default function Header() {
  const shareButtonRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const { pathname } = useRouter();

${reactEffectBody}`,
    },
  },
  vite: {
    loadFile: "index.html",
    head: { file: "index.html", code: htmlHead },
    body: {
      file: "index.html",
      code: htmlBody(`<div id="app"></div>`),
      tag: "<script>",
      parent: "<body>",
    },
    container: {
      file: "App.vue / app.component.html / App.jsx",
      code: `<!-- Add this to your component's template/HTML -->
<div id="share-button"></div>`,
    },
    init: {
      file: "App.vue / app.component.ts / App.jsx",
      code: `// Initialize once the DOM is ready
// (e.g. in mounted(), ngAfterViewInit(), or useEffect()):
new window.SocialShareButton({
  container: "#share-button",
});`,
    },
  },
  preact: {
    loadFile: "index.html",
    head: { file: "index.html", code: htmlHead },
    body: {
      file: "index.html",
      code: htmlBody(`<div id="app"></div>`),
      tag: "<script>",
      parent: "<body>",
    },
    container: { file: "src/components/Header.jsx", code: reactContainer },
    init: {
      file: "src/components/Header.jsx",
      code: `import { useEffect, useRef } from "preact/hooks";

// Replace 'Header' with the component where the button should appear
export default function Header() {
  const shareButtonRef = useRef(null);
  const containerRef = useRef(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current || !window.SocialShareButton || !containerRef.current) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: "#share-button",
    });
    initRef.current = true;

    return () => {
      if (shareButtonRef.current?.destroy) {
        shareButtonRef.current.destroy();
      }
      initRef.current = false;
    };
  }, []);

  return (
    <header>
      <div id="share-button" ref={containerRef}></div>
    </header>
  );
}`,
    },
  },
  html: {
    loadFile: "index.html",
    head: { file: "index.html", code: htmlHead },
    body: {
      file: "index.html",
      code: htmlBody(`<!-- your page content -->`),
      tag: "<script>",
      parent: "<body>",
    },
    container: {
      file: "index.html",
      code: `<div id="share-button"></div>`,
    },
    init: {
      file: "index.html",
      code: `<script>
  new SocialShareButton({
    container: "#share-button",
  });
</script>`,
    },
  },
};
