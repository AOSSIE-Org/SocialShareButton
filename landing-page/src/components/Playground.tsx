"use client";
import { useState } from "react";

type ButtonStyleKey = "default" | "primary" | "compact" | "icon-only";

const BUTTON_STYLES: { key: ButtonStyleKey; label: string }[] = [
  { key: "default", label: "default" },
  { key: "primary", label: "primary" },
  { key: "compact", label: "compact" },
  { key: "icon-only", label: "icon-only" },
];

const COLORS = [
  "#FFCC00",
  "#00C853",
  "#229ED9",
  "#FF4500",
  "#a855f7",
  "#ffffff",
];

const INITIAL_PLATFORMS = [
  { name: "WhatsApp", icon: "W", active: true, color: "#25D366" },
  { name: "Facebook", icon: "f", active: true, color: "#1877F2" },
  { name: "Twitter/X", icon: "X", active: true, color: "#111111" },
  { name: "LinkedIn", icon: "in", active: true, color: "#0A66C2" },
  { name: "Telegram", icon: "T", active: false, color: "#229ED9" },
  { name: "Reddit", icon: "R", active: false, color: "#FF4500" },
  { name: "Email", icon: "@", active: false, color: "#737373" },
];

// Pick readable text color (black/white) for a given hex background
function textColorFor(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff";
}

export function Playground() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [style, setStyle] = useState<ButtonStyleKey>("default");
  const [color, setColor] = useState<string>(COLORS[0]);
  const [platforms, setPlatforms] = useState(INITIAL_PLATFORMS);

  const textColor = textColorFor(color);
  const activePlatforms = platforms.filter((p) => p.active);

  const togglePlatform = (name: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.name === name ? { ...p, active: !p.active } : p))
    );
  };

  const isDark = theme === "dark";
  const isCompact = style === "compact";
  const isIconOnly = style === "icon-only";
  const isPrimary = style === "primary";

  // In light mode, pure white blends into the card background — anything that
  // relies on `color` for an outline or unfilled text needs to fall back to black.
  const whiteOnLight = !isDark && color === "#ffffff";
  const outlineColor = whiteOnLight ? "#000000" : color;

  return (
    <div id="playground" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-[#FFCC00] uppercase mb-4 block flex items-center gap-2">
            <div className="w-4 h-[2px] bg-[#FFCC00]"></div> INTERACTIVE DEMO
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-balance mb-6">
            Configure it live.<br />See it <span className="underline decoration-[#FFCC00] decoration-4 underline-offset-8">instantly.</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 font-medium max-w-md text-sm leading-relaxed">
            Tweak theme, style, platforms and color — the preview updates in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-24 items-start mt-16">

          {/* Left Column: Preview / Code */}
          <div className="flex flex-col items-center">

            <div className="flex items-center justify-center gap-6 mb-12">
              <button className="text-[#FFCC00] font-bold text-xl font-serif">Preview</button>
              <span className="text-white font-bold text-xl">|</span>
              <button className="text-white font-bold text-xl font-serif hover:text-neutral-300 transition-colors">Code</button>
            </div>

            {/* The Output Mockup */}
            <div
              className={`relative rounded-2xl border-2 shadow-[0_0_40px_rgba(255,204,0,0.15)] w-full max-w-[450px] transition-colors ${
                isDark ? "bg-neutral-900 dark:bg-[#111] text-white" : "bg-white text-black"
              } ${isCompact ? "p-6" : "p-8"}`}
              style={{ borderColor: outlineColor }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`font-serif font-bold text-center w-full ${isCompact ? "text-2xl" : "text-3xl"}`}
                  style={{ color: outlineColor }}
                >
                  Share this Page
                </h3>
                <button
                  className="absolute right-6 top-6 border rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
                  style={{ color: outlineColor, borderColor: outlineColor }}
                >
                  ✕
                </button>
              </div>

              {!isIconOnly && (
                <p className={`text-center text-sm mb-8 font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                  Share this page to your social networks:
                </p>
              )}

              <div className={`gap-4 mb-10 justify-center ${isCompact || isIconOnly ? "flex flex-wrap" : "grid grid-cols-5"}`}>
                {activePlatforms.length === 0 && (
                  <p className="text-xs text-neutral-500">No platforms selected — turn one on in the panel →</p>
                )}
                {activePlatforms.map((network, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div
                      className={`rounded-full flex items-center justify-center text-white font-bold shadow-md ${isCompact || isIconOnly ? "w-9 h-9 text-sm" : "w-12 h-12 text-xl"}`}
                      style={{ backgroundColor: network.color }}
                    >
                      {network.icon}
                    </div>
                    {!isIconOnly && (
                      <span className={`text-[11px] font-medium ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                        {network.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {!isIconOnly && (
                <div
                  className={`flex items-center gap-2 bg-transparent rounded-full p-1 pl-4 border mb-8 ${
                    isDark ? "border-neutral-600" : "border-neutral-300"
                  }`}
                >
                  <span className={`text-sm truncate flex-1 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    https://socialsharebutton.com
                  </span>
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${isPrimary ? "border-2" : ""}`}
                    style={
                      isPrimary
                        ? { color: outlineColor, borderColor: outlineColor, backgroundColor: "transparent" }
                        : {
                            backgroundColor: color,
                            color: textColor,
                            border: whiteOnLight ? "2px solid #000000" : "none",
                          }
                    }
                  >
                    Copy Link
                  </button>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  className={`font-bold shadow-lg transition-colors ${
                    isIconOnly
                      ? "w-14 h-14 rounded-full text-xl"
                      : isCompact
                      ? "px-8 py-2 rounded-full text-base w-40"
                      : "px-12 py-3 rounded-full text-lg w-48"
                  } ${isPrimary ? "border-2" : ""}`}
                  style={
                    isPrimary
                      ? { color: outlineColor, borderColor: outlineColor, backgroundColor: "transparent" }
                      : {
                          backgroundColor: color,
                          color: textColor,
                          border: whiteOnLight ? "2px solid #000000" : "none",
                        }
                  }
                >
                  {isIconOnly ? "↗" : "Share"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Configuration Panel */}
          <div className="w-full">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#111] overflow-hidden">

              {/* Panel Header */}
              <div className="bg-[#FFCC00] px-4 py-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-background rounded-full"></div>
                </div>
                <span className="text-black text-xs font-mono font-bold tracking-wide">Configuration panel</span>
              </div>

              <div className="p-6 space-y-8">

                {/* Theme Config */}
                <div>
                   <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Theme</h4>
                   <div className="flex rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0a0a0a] p-1">
                     <button
                       onClick={() => setTheme("light")}
                       className={`flex-1 py-2 text-sm rounded transition-colors ${
                         theme === "light"
                           ? "font-bold text-black bg-[#FFCC00] shadow-sm"
                           : "font-medium text-neutral-500 dark:text-neutral-400"
                       }`}
                     >
                       Light
                     </button>
                     <button
                       onClick={() => setTheme("dark")}
                       className={`flex-1 py-2 text-sm rounded transition-colors ${
                         theme === "dark"
                           ? "font-bold text-black bg-[#FFCC00] shadow-sm"
                           : "font-medium text-neutral-500 dark:text-neutral-400"
                       }`}
                     >
                       Dark
                     </button>
                   </div>
                </div>

                {/* Button Style Config */}
                <div>
                   <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Button Style</h4>
                   <div className="grid grid-cols-2 gap-2">
                     {BUTTON_STYLES.map((s) => (
                       <button
                         key={s.key}
                         onClick={() => setStyle(s.key)}
                         className={`py-2 text-sm rounded-md transition-colors ${
                           style === s.key
                             ? "font-bold text-black bg-[#FFCC00] shadow-sm"
                             : "font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
                         }`}
                       >
                         {s.label}
                       </button>
                     ))}
                   </div>
                </div>

                {/* Platforms Config */}
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Platforms</h4>
                  <div className="space-y-2">
                    {platforms.map((platform, i) => (
                      <button
                        key={i}
                        onClick={() => togglePlatform(platform.name)}
                        className={`w-full flex items-center justify-between p-2 rounded-md border transition-colors ${
                          platform.active
                            ? "border-[#00C853]/50 bg-[#00C853]/5"
                            : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-bold"
                            style={{ backgroundColor: platform.active ? platform.color : "#a3a3a3" }}
                          >
                            {platform.icon}
                          </div>
                          <span className={`text-xs font-medium ${platform.active ? "text-foreground" : "text-neutral-500"}`}>
                            {platform.name}
                          </span>
                        </div>

                        {/* Toggle */}
                        <div
                          className={`w-8 h-4 rounded-full relative transition-colors ${
                            platform.active
                              ? "bg-[#00C853]"
                              : "bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${
                              platform.active ? "bg-white right-0.5" : "bg-neutral-400 dark:bg-neutral-500 left-0.5"
                            }`}
                          ></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button Color Config */}
                <div>
                   <h4 className="text-[10px] font-mono tracking-widest text-neutral-500 mb-3 uppercase">Button Color</h4>
                   <div className="flex gap-2">
                     {COLORS.map((c) => (
                       <button
                         key={c}
                         onClick={() => setColor(c)}
                         aria-label={`Set button color to ${c}`}
                         className={`w-6 h-6 rounded transition-all ${
                           c === "#ffffff" ? "border border-neutral-200 dark:border-neutral-800" : ""
                         } ${color === c ? "scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground" : "hover:scale-105"}`}
                         style={{ backgroundColor: c }}
                       />
                     ))}
                   </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}