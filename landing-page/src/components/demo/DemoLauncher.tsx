"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useLenis } from "lenis/react";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { CloseIcon, PlayIcon } from "@/components/ui/Icons";
import { useSocialShareButton } from "@/lib/social-share-button";
import {
  buttonStyles,
  platformIds,
  platformLabels,
  type ButtonStyle,
  type PlatformId,
} from "@/lib/platforms";
import { localeUrl } from "@/config/site";

const swatches = ["#16a34a", "#f59e0b", "#2563eb", "#e11d48", "#7c3aed", "#030712"] as const;
const defaultPlatforms: PlatformId[] = ["whatsapp", "facebook", "twitter", "linkedin", "telegram", "reddit"];

/** Darkens a #rrggbb color for the hover state. */
function darken(hex: string, amount = 0.15) {
  const value = parseInt(hex.slice(1), 16);
  const channel = (shift: number) => Math.round(((value >> shift) & 0xff) * (1 - amount));
  return `#${((channel(16) << 16) | (channel(8) << 8) | channel(0)).toString(16).padStart(6, "0")}`;
}

function toSnippet(config: Record<string, unknown>) {
  const lines = Object.entries(config).map(([key, value]) => `  ${key}: ${JSON.stringify(value)},`);
  return `new SocialShareButton({\n${lines.join("\n")}\n});`;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-sans text-[13px] font-semibold tracking-wide text-foreground-muted uppercase">
        {label}
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-button-secondary-bg p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
              value === option.value
                ? "bg-background-primary text-foreground-primary shadow-card"
                : "text-foreground-secondary hover:text-foreground-primary"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function DemoDialog({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Demo");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const lenis = useLenis();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<"light" | "dark">(resolvedTheme === "light" ? "light" : "dark");
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>("primary");
  const [platforms, setPlatforms] = useState<PlatformId[]>(defaultPlatforms);
  const [color, setColor] = useState<string>("");
  const [buttonText, setButtonText] = useState("Share");
  const [tab, setTab] = useState<"preview" | "code">("preview");

  const config = useMemo(() => {
    const snippet: Record<string, unknown> = { container: "#share-button", theme, buttonStyle, platforms };
    if (buttonText.trim() && buttonText.trim() !== "Share") snippet.buttonText = buttonText.trim();
    if (color) {
      snippet.buttonColor = color;
      snippet.buttonHoverColor = darken(color);
    }
    return snippet;
  }, [theme, buttonStyle, platforms, color, buttonText]);

  const options = useMemo(
    () =>
      platforms.length === 0
        ? null
        : {
            url: localeUrl(locale),
            title: t("shareTitle"),
            description: t("shareDescription"),
            hashtags: ["opensource", "webdev"],
            via: "aossie_org",
            theme,
            buttonStyle,
            platforms,
            buttonText: buttonText.trim() || "Share",
            buttonColor: color,
            buttonHoverColor: color ? darken(color) : "",
          },
    [locale, t, theme, buttonStyle, platforms, buttonText, color]
  );

  const { containerRef, ready } = useSocialShareButton(tab === "preview" ? options : null);

  // Lock page scroll and move focus into the dialog; restore both on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    lenis?.stop();
    panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      root.style.overflow = previousOverflow;
      lenis?.start();
      previouslyFocused?.focus();
    };
  }, [lenis]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        // Let the library's own share modal handle Escape first when it is open.
        if (document.querySelector(".social-share-modal-overlay.active")) return;
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input, [href], [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    },
    [onClose]
  );

  const togglePlatform = (id: PlatformId) =>
    setPlatforms((current) =>
      current.includes(id) ? current.filter((p) => p !== id) : platformIds.filter((p) => p === id || current.includes(p))
    );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm" aria-hidden onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-background-primary shadow-popover sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-medium tracking-tight text-foreground-primary">
              {t("title")}
            </h2>
            <p className="mt-0.5 text-sm text-foreground-secondary">{t("description")}</p>
          </div>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label={t("close")}
            className="inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-foreground-muted hover:bg-button-secondary-bg hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-h-80 flex-col border-line max-lg:border-b lg:border-r">
            <div role="tablist" aria-label={t("title")} className="flex gap-4 border-b border-line px-5 sm:px-6">
              {(["preview", "code"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  id={`demo-tab-${key}`}
                  aria-selected={tab === key}
                  aria-controls={`demo-panel-${key}`}
                  onClick={() => setTab(key)}
                  className={`-mb-px cursor-pointer border-b py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                    tab === key
                      ? "border-foreground-primary text-foreground-primary"
                      : "border-transparent text-foreground-muted hover:text-foreground-primary"
                  }`}
                >
                  {t(key)}
                </button>
              ))}
            </div>

            {tab === "preview" ? (
              <div
                id="demo-panel-preview"
                role="tabpanel"
                aria-labelledby="demo-tab-preview"
                className={`hatch relative m-4 grid flex-1 place-items-center rounded-xl p-10 transition-colors sm:m-6 ${
                  theme === "dark" ? "bg-gray-950 [--pattern-fg:rgb(255_255_255/0.06)]" : "bg-white [--pattern-fg:rgb(3_7_18/0.05)]"
                } ring-1 ring-line`}
              >
                {/* The preview canvas keeps its own light/dark colors, so its captions do too (both ≥ 7:1). */}
                <div
                  className={`flex flex-col items-center gap-4 text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  <div ref={containerRef} className="flex min-h-12 items-center justify-center" />
                  {!ready && <p>{t("loading")}</p>}
                  {ready && <p>{platforms.length > 0 ? t("hint") : t("noPlatforms")}</p>}
                </div>
              </div>
            ) : (
              <div id="demo-panel-code" role="tabpanel" aria-labelledby="demo-tab-code" className="m-4 sm:m-6">
                <CodeBlock file="index.js" code={toSnippet(config)} />
              </div>
            )}
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <Segmented
              label={t("theme")}
              value={theme}
              onChange={setTheme}
              options={[
                { value: "light", label: t("light") },
                { value: "dark", label: t("dark") },
              ]}
            />
            <Segmented
              label={t("style")}
              value={buttonStyle}
              onChange={setButtonStyle}
              options={buttonStyles.map((style) => ({ value: style, label: t(`styles.${style}`) }))}
            />

            <fieldset>
              <legend className="font-sans text-[13px] font-semibold tracking-wide text-foreground-muted uppercase">
                {t("platforms")}
              </legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {platformIds.map((id) => {
                  const on = platforms.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => togglePlatform(id)}
                      className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                        on
                          ? "bg-accent-soft text-accent ring-accent/40"
                          : "text-foreground-muted ring-line hover:text-foreground-primary"
                      }`}
                    >
                      {platformLabels[id]}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="font-sans text-[13px] font-semibold tracking-wide text-foreground-muted uppercase">
                {t("color")}
              </legend>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={color === ""}
                  onClick={() => setColor("")}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium ring-1 focus-visible:outline-2 focus-visible:outline-accent ${
                    color === "" ? "text-foreground-primary ring-foreground-primary" : "text-foreground-muted ring-line"
                  }`}
                >
                  {t("defaultColor")}
                </button>
                {swatches.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    aria-pressed={color === swatch}
                    aria-label={t("colorLabel", { color: swatch })}
                    onClick={() => setColor(swatch)}
                    style={{ backgroundColor: swatch }}
                    className={`size-6 cursor-pointer rounded-full ring-1 ring-line ring-offset-2 ring-offset-background-primary transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-accent ${
                      color === swatch ? "ring-2 ring-foreground-primary" : ""
                    }`}
                  />
                ))}
              </div>
            </fieldset>

            <div>
              <label
                htmlFor="demo-button-text"
                className="font-sans text-[13px] font-semibold tracking-wide text-foreground-muted uppercase"
              >
                {t("buttonText")}
              </label>
              <input
                id="demo-button-text"
                value={buttonText}
                maxLength={24}
                onChange={(event) => setButtonText(event.target.value)}
                className="mt-2 w-full rounded-lg bg-button-secondary-bg px-3 py-2 text-sm text-foreground-primary ring-1 ring-line outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoLauncher({ label }: { label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-button-secondary-bg px-4 py-2 text-sm/6 font-semibold text-button-secondary-text transition-colors hover:bg-button-secondary-hover-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <PlayIcon className="size-4" />
        {label}
      </button>
      {open && <DemoDialog onClose={() => setOpen(false)} />}
    </>
  );
}
