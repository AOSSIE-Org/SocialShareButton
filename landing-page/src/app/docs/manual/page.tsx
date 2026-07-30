"use client";
import { useState } from "react";
import { SiteNavbar } from "@/components/SiteNavbar";
import { CodeBox } from "@/components/CodeBox";

const frameworks = [
  { id: "html", name: "Vanilla HTML" },
  { id: "react", name: "React / Vite" },
  { id: "next", name: "Next.js" },
  { id: "vue", name: "Vue.js" },
  { id: "angular", name: "Angular" },
];

export default function ManualDocs() {
  const [activeTab, setActiveTab] = useState("html");

  return (
    <div className="min-h-screen selection:bg-[#FFCC00]/30">
      <SiteNavbar variant="docs" />
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-gradient-to-br from-[#FFCC00]/20 to-[#00C853]/20 rounded-3xl p-6 sm:p-8 md:p-12 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">
              Manual Integration
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              Choose your framework below for exact copy-paste snippets. The core logic remains the same across all technologies: Load the library, then drop the div.
            </p>
          </div>

          <div className="bg-background rounded-3xl p-6 sm:p-8 border-2 border-neutral-200 dark:border-neutral-800 shadow-lg">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-neutral-200 dark:border-neutral-800 pb-4">
              {frameworks.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setActiveTab(fw.id)}
                  className={`px-4 py-2 rounded-full font-bold transition-all ${
                    activeTab === fw.id
                      ? "bg-[#00C853] text-white border-2 border-transparent"
                      : "bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  {fw.name}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === "html" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">1. Load Library</h3>
                    <p className="text-muted-foreground mb-4">Add these to your <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-foreground">index.html</code>.</p>
                    <CodeBox code={'<!-- In <head> -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />'} />
                    <CodeBox code={'<!-- Before </body> -->\n<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>'} />
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">2. Add Button</h3>
                    <p className="text-muted-foreground mb-4">Place the div where it should appear.</p>
                    <CodeBox code={'<div data-social-share></div>'} />
                  </div>
                </div>
              )}
              {activeTab === "react" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">1. Load Library</h3>
                    <p className="text-muted-foreground mb-4">Add these to your <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-foreground">public/index.html</code> (CRA) or <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-foreground">index.html</code> (Vite).</p>
                    <CodeBox code={'<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />\n<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>'} />
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">2. Add Button Component</h3>
                    <p className="text-muted-foreground mb-4">Use the div inside any JSX component. (Auto-initialized by MutationObserver).</p>
                    <CodeBox code={'export default function MyComponent() {\n  return (\n    <div>\n      <div data-social-share></div>\n    </div>\n  );\n}'} />
                  </div>
                </div>
              )}
              {activeTab === "next" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">1. Load Library</h3>
                    <p className="text-muted-foreground mb-4">Add these to your <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-foreground">app/layout.tsx</code>.</p>
                    <CodeBox code={`import Script from "next/script";\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <head>\n        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />\n      </head>\n      <body>\n        {children}\n        <Script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js" strategy="lazyOnload" />\n      </body>\n    </html>\n  );\n}`} />
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">2. Add Button</h3>
                    <p className="text-muted-foreground mb-4">Use the div in any page or component.</p>
                    <CodeBox code={'<div data-social-share></div>'} />
                  </div>
                </div>
              )}
              {activeTab === "vue" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">1. Load Library</h3>
                    <p className="text-muted-foreground mb-4">Add these to your root <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-foreground">index.html</code>.</p>
                    <CodeBox code={'<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />\n<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>'} />
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">2. Add Button</h3>
                    <p className="text-muted-foreground mb-4">Use the div inside any Vue template.</p>
                    <CodeBox code={'<template>\n  <div>\n    <div data-social-share></div>\n  </div>\n</template>'} />
                  </div>
                </div>
              )}
              {activeTab === "angular" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">1. Load Library</h3>
                    <p className="text-muted-foreground mb-4">Add these to your <code className="bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-foreground">src/index.html</code>.</p>
                    <CodeBox code={'<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.css" />\n<script src="https://cdn.jsdelivr.net/gh/AOSSIE-Org/SocialShareButton@v1.0.4/src/social-share-button.js"></script>'} />
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl p-6 border-2 border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-bold mb-4">2. Add Button</h3>
                    <p className="text-muted-foreground mb-4">Use the div inside any Angular component HTML.</p>
                    <CodeBox code={'<div>\n  <div data-social-share></div>\n</div>'} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
