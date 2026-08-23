"use client";

import { useState } from "react";
import { Check, Copy, Sliders, Eye, Code2, Sparkles, RefreshCw } from "lucide-react";

type ButtonStyleKey = "default" | "compact" | "icon-only" | "inline";

const BUTTON_STYLES: { key: ButtonStyleKey; label: string; description: string }[] = [
  { key: "default", label: "Modal Sheet", description: "Floating share dialog with copy bar" },
  { key: "compact", label: "Compact Pill", description: "Space-conscious for dense headers" },
  { key: "icon-only", label: "Icon Grid", description: "Clean, textless social icons" },
  { key: "inline", label: "Inline Bar", description: "Horizontal strip for article footers" },
];

const ACCENT_COLORS = [
  { name: "Electric Mint", hex: "#00E599" },
  { name: "Telemetry Amber", hex: "#FFB800" },
  { name: "Sky Blue", hex: "#229ED9" },
  { name: "Flame Orange", hex: "#FF4500" },
  { name: "Neon Purple", hex: "#A855F7" },
  { name: "Slate Monochrome", hex: "#475569" },
];

const PLATFORMS_CONFIG = [
  { id: "whatsapp", name: "WhatsApp", icon: "W", color: "#25D366", active: true },
  { id: "x", name: "X / Twitter", icon: "𝕏", color: "#111111", active: true },
  { id: "linkedin", name: "LinkedIn", icon: "in", color: "#0A66C2", active: true },
  { id: "telegram", name: "Telegram", icon: "TG", color: "#229ED9", active: true },
  { id: "reddit", name: "Reddit", icon: "r/", color: "#FF4500", active: false },
  { id: "facebook", name: "Facebook", icon: "f", color: "#1877F2", active: false },
  { id: "email", name: "Email", icon: "@", color: "#64748B", active: false },
];

export function Playground() {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [styleVariant, setStyleVariant] = useState<ButtonStyleKey>("default");
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].hex);
  const [platforms, setPlatforms] = useState(PLATFORMS_CONFIG);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const activePlatforms = platforms.filter((p) => p.active);
  const activeIds = activePlatforms.map((p) => `"${p.id}"`).join(", ");

  const generatedSnippet = `<SocialShareButton
  url="https://yourdomain.com/post-slug"
  title="Share this page"
  networks={[${activeIds}]}
  theme="${themeMode}"
  style="${styleVariant}"
  accentColor="${accentColor}"
/>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://social-share-button.aossie.org");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isDark = themeMode === "dark";

  return (
    <section id="playground" className="py-24 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE STUDIO CONFIGURATOR</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-4 text-balance">
            Configure visually. <br />
            Ship in seconds.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Test theme modes, layout styles, and target social destinations with real-time synchronized code generation.
          </p>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Configuration Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
              
              {/* 1. Theme Selection */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-2.5">
                  1. Color Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setThemeMode("dark")}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      themeMode === "dark"
                        ? "bg-foreground text-background border-foreground shadow-xs"
                        : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dark Theme
                  </button>
                  <button
                    onClick={() => setThemeMode("light")}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                      themeMode === "light"
                        ? "bg-foreground text-background border-foreground shadow-xs"
                        : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Light Theme
                  </button>
                </div>
              </div>

              {/* 2. Style Variant */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-2.5">
                  2. Layout Variant
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BUTTON_STYLES.map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setStyleVariant(style.key)}
                      className={`p-2.5 text-left rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        styleVariant === style.key
                          ? "bg-primary/10 border-primary text-foreground font-semibold"
                          : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="font-heading font-bold text-foreground capitalize">
                        {style.label}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Accent Color */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-2.5">
                  3. Brand Accent Token
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setAccentColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        accentColor === c.hex
                          ? "scale-125 border-foreground shadow-md"
                          : "border-transparent hover:scale-110"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Active Social Platforms */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-muted-foreground mb-2.5">
                  4. Active Platforms ({activePlatforms.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        p.active
                          ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                          : "bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                      {p.active && <Check className="w-3 h-3 text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: Live Rendered Output & Code Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              
              {/* Studio Canvas Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-xs text-muted-foreground font-semibold">
                    studio_canvas.live
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg bg-background p-0.5 border border-border">
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                        activeTab === "preview"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("code")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                        activeTab === "code"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>React JSX</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas Preview Area */}
              <div className="p-8 min-h-[380px] flex items-center justify-center bg-background/50 relative overflow-hidden">
                {activeTab === "preview" ? (
                  <div
                    className={`w-full max-w-md rounded-2xl border p-6 transition-all shadow-xl ${
                      isDark ? "bg-[#10141D] text-white border-[#1E2638]" : "bg-white text-black border-slate-200"
                    }`}
                    style={{ borderColor: accentColor }}
                  >
                    {styleVariant === "default" && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-lg font-bold" style={{ color: accentColor }}>
                            Share this page
                          </h3>
                          <span className="text-xs opacity-50 cursor-pointer">✕</span>
                        </div>
                        <p className="text-xs opacity-75 mb-5 font-sans">
                          Select a network to share instantly:
                        </p>
                        
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 my-4">
                          {activePlatforms.map((p) => (
                            <div key={p.id} className="flex flex-col items-center gap-1">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono text-xs font-bold shadow-xs hover:scale-105 transition-transform cursor-pointer"
                                style={{ backgroundColor: p.color }}
                              >
                                {p.icon}
                              </div>
                              <span className="text-[10px] opacity-75 truncate max-w-[50px] text-center">
                                {p.name.split(" ")[0]}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value="https://social-share-button.aossie.org"
                            className="text-xs font-mono bg-black/20 rounded-lg px-3 py-2 flex-1 border border-white/10 opacity-80"
                          />
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-2 rounded-lg font-heading font-semibold text-xs transition-all text-black shrink-0"
                            style={{ backgroundColor: accentColor }}
                          >
                            {copiedLink ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                    )}

                    {styleVariant === "compact" && (
                      <div className="flex items-center gap-2 flex-wrap justify-center py-2">
                        <span className="text-xs font-medium opacity-80 mr-2">Share:</span>
                        {activePlatforms.map((p) => (
                          <button
                            key={p.id}
                            className="px-2.5 py-1 rounded-full text-xs font-mono font-medium text-white flex items-center gap-1.5 shadow-xs"
                            style={{ backgroundColor: p.color }}
                          >
                            <span>{p.icon}</span>
                            <span>{p.name.split(" ")[0]}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {styleVariant === "icon-only" && (
                      <div className="flex items-center justify-center gap-3 py-4 flex-wrap">
                        {activePlatforms.map((p) => (
                          <div
                            key={p.id}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-mono font-bold text-sm shadow-md hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: p.color }}
                          >
                            {p.icon}
                          </div>
                        ))}
                      </div>
                    )}

                    {styleVariant === "inline" && (
                      <div className="space-y-3">
                        <div className="text-xs font-heading font-semibold uppercase tracking-wider opacity-60">
                          Spread the word
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {activePlatforms.map((p) => (
                            <button
                              key={p.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border flex items-center gap-2 hover:brightness-110 transition-all text-white"
                              style={{ backgroundColor: p.color, borderColor: "transparent" }}
                            >
                              <span>{p.icon}</span>
                              <span>{p.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full font-mono text-xs leading-relaxed overflow-x-auto p-4 rounded-xl bg-[#0B0E14] border border-[#1E2638] text-[#E2E8F0]">
                    <pre>
                      <code>{generatedSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Studio Canvas Action Bar */}
              <div className="px-6 py-3.5 border-t border-border bg-muted/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-muted-foreground">
                  OUTPUT: <strong className="text-foreground">Zero-dependency bundle component</strong>
                </span>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg font-heading font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shadow-xs"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied Snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Component Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}