"use client";

import { useState } from "react";
import { Check, Copy, Terminal, CheckCircle2 } from "lucide-react";

type FrameworkKey = "react" | "vue" | "svelte" | "html";

const FRAMEWORK_SNIPPETS: Record<
  FrameworkKey,
  { label: string; file: string; code: string }
> = {
  react: {
    label: "React / Next.js",
    file: "ShareComponent.tsx",
    code: `import { SocialShareButton } from "@aossie-org/social-share-button";

export function PostFooter({ postUrl, postTitle }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <span className="text-sm font-medium">Share this article:</span>
      <SocialShareButton
        url={postUrl}
        title={postTitle}
        networks={["x", "linkedin", "whatsapp", "telegram"]}
        theme="auto"
        onShare={(network) => console.log(\`Shared to \${network}\`)}
      />
    </div>
  );
}`,
  },
  vue: {
    label: "Vue 3 / Nuxt",
    file: "ShareComponent.vue",
    code: `<script setup lang="ts">
import { SocialShareButton } from '@aossie-org/social-share-button/vue'

defineProps<{
  url: string
  title: string
}>()
</script>

<template>
  <div class="share-container">
    <SocialShareButton
      :url="url"
      :title="title"
      :networks="['x', 'linkedin', 'whatsapp', 'reddit']"
      theme="auto"
    />
  </div>
</template>`,
  },
  svelte: {
    label: "Svelte 5 / SvelteKit",
    file: "ShareButton.svelte",
    code: `<script lang="ts">
  import { SocialShareButton } from '@aossie-org/social-share-button/svelte';
  
  let { url, title } = $props<{ url: string; title: string }>();
</script>

<div class="share-wrap">
  <SocialShareButton 
    {url} 
    {title} 
    networks={['x', 'linkedin', 'whatsapp']} 
  />
</div>`,
  },
  html: {
    label: "Vanilla HTML / CDN",
    file: "index.html",
    code: `<!-- 1. Include CSS and JS via CDN (under 10KB) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@aossie-org/social-share-button/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/@aossie-org/social-share-button/dist/bundle.min.js"></script>

<!-- 2. Target Container -->
<div id="share-bar"></div>

<!-- 3. Initialize in 1 line -->
<script>
  SocialShare.mount('#share-bar', {
    url: window.location.href,
    title: document.title,
    networks: ['x', 'linkedin', 'whatsapp', 'telegram']
  });
</script>`,
  },
};

export function CodeShowcase() {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkKey>("react");
  const [copied, setCopied] = useState(false);

  const activeSnippet = FRAMEWORK_SNIPPETS[selectedFramework];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-background border-b border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Rationale & Value */}
          <div className="lg:col-span-5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-4">
              <span>DEVELOPER WORKFLOW</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-6 text-balance">
              30-second drop-in. <br />
              Any framework.
            </h2>
            
            <p className="text-base text-muted-foreground mb-8 leading-relaxed">
              Designed from first principles to be tree-shakable, strictly typed, and fully compatible with SSR, ISR, and static site generators.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground">
                    Strict TypeScript Support
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Complete autocompletion for network keys, theme variants, and callback events.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground">
                    SSR & Hydration Safe
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No `window is undefined` hydration mismatches in Next.js, Nuxt, or Astro.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-semibold text-sm text-foreground">
                    Modular Tree-Shaking
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Import only the networks you need — unused platform logic is discarded at build time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Code Editor Terminal */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-[#0B0E14] shadow-2xl overflow-hidden">
              
              {/* Terminal Tab Bar */}
              <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-[#1E2638] bg-[#10141D] gap-2">
                
                {/* Framework Selector Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
                  {(Object.keys(FRAMEWORK_SNIPPETS) as FrameworkKey[]).map((fw) => (
                    <button
                      key={fw}
                      onClick={() => setSelectedFramework(fw)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                        selectedFramework === fw
                          ? "bg-primary text-black font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {FRAMEWORK_SNIPPETS[fw].label}
                    </button>
                  ))}
                </div>

                {/* File indicator & Copy button */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-[#94A3B8] hidden sm:inline">
                    {activeSnippet.file}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-[#E2E8F0] min-h-[260px]">
                <pre className="whitespace-pre">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>

              {/* Status Bar */}
              <div className="px-4 py-2 border-t border-[#1E2638] bg-[#0E121A] flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
                <span>MODULE: ESM & CJS SUPPORTED</span>
                <span>TYPES: INCLUDED (.d.ts)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
