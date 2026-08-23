"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Terminal, Share2, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

const PLATFORMS = [
  { name: "WhatsApp", color: "#25D366", initial: "W", shareUrl: "https://api.whatsapp.com/send?text=" },
  { name: "X / Twitter", color: "#000000", initial: "𝕏", shareUrl: "https://twitter.com/intent/tweet?text=" },
  { name: "LinkedIn", color: "#0A66C2", initial: "in", shareUrl: "https://www.linkedin.com/sharing/share-offsite/?url=" },
  { name: "Telegram", color: "#229ED9", initial: "TG", shareUrl: "https://t.me/share/url?url=" },
  { name: "Reddit", color: "#FF4500", initial: "r/", shareUrl: "https://reddit.com/submit?url=" },
];

export function Hero() {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [lastShared, setLastShared] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [packetTelemetry, setPacketTelemetry] = useState<{
    platform: string;
    latency: string;
    bytes: string;
    trackers: number;
  } | null>({
    platform: "Ready",
    latency: "0.1ms",
    bytes: "< 10 KB",
    trackers: 0,
  });

  const handleShareClick = (platformName: string) => {
    setLastShared(platformName);
    setPacketTelemetry({
      platform: platformName,
      latency: `${(Math.random() * 0.4 + 0.1).toFixed(1)}ms`,
      bytes: "0.0 KB tracking",
      trackers: 0,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://social-share-button.aossie.org");
    setCopiedLink(true);
    setLastShared("Clipboard");
    setPacketTelemetry({
      platform: "Direct Clipboard",
      latency: "0.05ms",
      bytes: "0.0 KB",
      trackers: 0,
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText("npm i @aossie-org/social-share-button");
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <section className="pt-28 pb-20 sm:pt-36 sm:pb-28 relative overflow-hidden console-grid dark:console-grid">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: The Narrative Thesis */}
          <div className="lg:col-span-7 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/80 border border-border text-xs font-mono font-medium text-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">ZERO TRACKERS</span>
              <span className="text-border">•</span>
              <span className="text-muted-foreground">ZERO DEPENDENCIES</span>
              <span className="text-border">•</span>
              <span className="text-primary font-semibold">&lt; 10KB</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6 text-balance">
              Zero bloat. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Instant social sharing
              </span>{" "}
              for modern web apps.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed text-balance">
              Legacy sharing libraries inject megabytes of tracking code and cookies into your site.
              <strong className="text-foreground font-semibold"> SocialShareButton</strong> gives you clean, accessible, framework-agnostic share sheets with 0 tracking and 100% Core Web Vitals.
            </p>

            {/* CTAs & Terminal Copy */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-heading font-semibold text-sm hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={handleCopyCommand}
                className="inline-flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/40 text-foreground font-mono text-xs sm:text-sm transition-colors group"
                aria-label="Copy install command"
              >
                <Terminal className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">npm i @aossie-org/social-share-button</span>
                {copiedCommand ? (
                  <Check className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />
                )}
              </button>

              <Link
                href="#playground"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground font-heading font-medium text-xs sm:text-sm transition-colors"
              >
                <span>Configure Live</span>
                <span className="text-muted-foreground">↓</span>
              </Link>
            </div>

            {/* Quick architectural signals */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <span>Zero 3rd-party cookies</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <span>Sub-millisecond parse</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Layers className="w-4 h-4 text-primary shrink-0" />
                <span>React, Vue & Svelte</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Live Telemetry Workbench */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden telemetry-glow transition-all">
              
              {/* Console Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/60">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
                  <span className="ml-2 font-mono text-[11px] text-muted-foreground font-semibold">
                    live_transmission.widget
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex items-center rounded-lg bg-background p-0.5 border border-border">
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                      activeTab === "preview"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                      activeTab === "code"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    JSX Code
                  </button>
                </div>
              </div>

              {/* Main Console Body */}
              <div className="p-6 sm:p-7">
                {activeTab === "preview" ? (
                  <div>
                    {/* Simulated Share Dialog */}
                    <div className="rounded-xl border border-border/80 bg-background/80 p-5 sm:p-6 mb-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="font-heading text-lg font-bold text-foreground">
                            Share this article
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Distribute instantaneously to your audience
                          </p>
                        </div>
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          ✕
                        </span>
                      </div>

                      {/* Platform Buttons */}
                      <div className="grid grid-cols-5 gap-2.5 sm:gap-3 my-5">
                        {PLATFORMS.map((p) => (
                          <button
                            key={p.name}
                            onClick={() => handleShareClick(p.name)}
                            className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-muted/80 transition-all group active:scale-95 cursor-pointer"
                            title={`Share to ${p.name}`}
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-mono text-xs font-bold shadow-sm transition-transform group-hover:-translate-y-0.5"
                              style={{ backgroundColor: p.color === "#000000" ? "#1A1E29" : p.color }}
                            >
                              {p.initial}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground truncate w-full text-center">
                              {p.name.split(" ")[0]}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Direct Copy Bar */}
                      <div className="flex items-center gap-2 p-1.5 pl-3 rounded-lg border border-border bg-card">
                        <span className="text-xs font-mono text-muted-foreground truncate flex-1">
                          https://aossie.org/release-v1
                        </span>
                        <button
                          onClick={handleCopyLink}
                          className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-heading font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shrink-0"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Live Telemetry Packet HUD */}
                    <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-muted-foreground">TELEMETRY:</span>
                        <span className="text-primary font-semibold">
                          {packetTelemetry?.platform === "Ready" ? "Awaiting Interaction" : `Broadcast: ${packetTelemetry?.platform}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span>Latency: <strong className="text-foreground">{packetTelemetry?.latency}</strong></span>
                        <span>Bloat: <strong className="text-primary">{packetTelemetry?.trackers} trackers</strong></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Code Output Tab */
                  <div className="font-mono text-xs leading-relaxed overflow-x-auto p-4 rounded-xl bg-background border border-border">
                    <pre className="text-muted-foreground">
                      <span className="text-accent">import</span>{" "}
                      <span className="text-foreground">{"{ "}SocialShareButton{" }"}</span>{" "}
                      <span className="text-accent">from</span>{" "}
                      <span className="text-primary">"@aossie-org/social-share-button"</span>;
                      {"\n\n"}
                      <span className="text-muted-foreground">{"// Drop anywhere in your component tree"}</span>
                      {"\n"}
                      <span className="text-accent">export default function</span>{" "}
                      <span className="text-secondary">ArticleHeader</span>() {"{"}
                      {"\n  "}
                      <span className="text-accent">return</span> (
                      {"\n    "}&lt;<span className="text-primary">SocialShareButton</span>
                      {"\n      "}url=<span className="text-secondary">"https://yourdomain.com/post"</span>
                      {"\n      "}title=<span className="text-secondary">"Zero bloat sharing"</span>
                      {"\n      "}networks=<span className="text-foreground">{"{["}</span>
                      <span className="text-primary">"whatsapp"</span>,{" "}
                      <span className="text-primary">"x"</span>,{" "}
                      <span className="text-primary">"linkedin"</span>
                      <span className="text-foreground">{"]}"}</span>
                      {"\n      "}theme=<span className="text-primary">"auto"</span>
                      {"\n    "}/&gt;
                      {"\n  "});
                      {"\n"}
                      {"}"}
                    </pre>
                  </div>
                )}
              </div>

              {/* Console Status Bar */}
              <div className="px-4 py-2 border-t border-border bg-muted/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  STATUS: LIVE_READY
                </span>
                <span>BUNDLE: &lt; 10KB GZIPPED</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
