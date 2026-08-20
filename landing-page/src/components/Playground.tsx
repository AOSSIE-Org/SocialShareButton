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

// Inline SVG path data for each platform brand icon (same paths used by the core library)
const PLATFORM_ICONS: Record<string, string> = {
  WhatsApp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  Facebook:
    "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  "Twitter/X":
    "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  Telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  Reddit:
    "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z",
  Email:
    "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
};

const INITIAL_PLATFORMS = [
  { name: "WhatsApp", active: true, color: "#25D366" },
  { name: "Facebook", active: true, color: "#1877F2" },
  { name: "Twitter/X", active: true, color: "#111111" },
  { name: "LinkedIn", active: true, color: "#0A66C2" },
  { name: "Telegram", active: false, color: "#229ED9" },
  { name: "Reddit", active: false, color: "#FF4500" },
  { name: "Email", active: false, color: "#737373" },
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
                      className={`rounded-full flex items-center justify-center shadow-md ${isCompact || isIconOnly ? "w-9 h-9" : "w-12 h-12"}`}
                      style={{ backgroundColor: network.color }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="white"
                        className={isCompact || isIconOnly ? "w-4 h-4" : "w-6 h-6"}
                        aria-hidden="true"
                      >
                        <path d={PLATFORM_ICONS[network.name]} />
                      </svg>
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
                           ? "font-bold text-black bg-[#FFCC00] shadow-xs"
                           : "font-medium text-neutral-500 dark:text-neutral-400"
                       }`}
                     >
                       Light
                     </button>
                     <button
                       onClick={() => setTheme("dark")}
                       className={`flex-1 py-2 text-sm rounded transition-colors ${
                         theme === "dark"
                           ? "font-bold text-black bg-[#FFCC00] shadow-xs"
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
                             ? "font-bold text-black bg-[#FFCC00] shadow-xs"
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
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: platform.active ? platform.color : "#a3a3a3" }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="white"
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            >
                              <path d={PLATFORM_ICONS[platform.name]} />
                            </svg>
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