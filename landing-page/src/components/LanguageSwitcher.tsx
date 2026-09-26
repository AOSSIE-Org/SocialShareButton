"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { defaultLanguage, languages } from "@/config/languages";
import { useTranslations, useLocale } from "next-intl";
import { CheckIcon, ChevronDownIcon, GlobeIcon } from "./ui/Icons";

/**
 * Locale picker: a pill button that opens a listbox of languages, each shown in its own
 * script with the English name underneath. Keyboard: arrows, Home/End, Enter/Space, Escape.
 */
export default function LanguageSwitcher({
  align = "end",
  fullWidth = false,
}: {
  /** Which edge the menu aligns to; "end" suits the header's right edge. */
  align?: "start" | "end";
  fullWidth?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const currentIndex = Math.max(0, languages.findIndex((lang) => lang.code === locale));
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const current = languages[currentIndex];

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(currentIndex);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleLanguageChange = (newLocale: string) => {
    close();
    if (newLocale === locale) return;
    // The default-locale home page is canonical at "/" (see src/app/(default)), not "/en".
    if (newLocale === defaultLanguage && pathname === "/") {
      window.location.assign("/");
      return;
    }
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const last = languages.length - 1;
    const actions: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActiveIndex((i) => Math.max(0, i - 1)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => handleLanguageChange(languages[activeIndex].code),
      " ": () => handleLanguageChange(languages[activeIndex].code),
      Escape: close,
      Tab: () => setOpen(false),
    };
    const action = actions[event.key];
    if (!action) return;
    if (event.key !== "Tab") event.preventDefault();
    action();
  };

  return (
    <div ref={rootRef} className={`relative ${fullWidth ? "w-full" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${t("label")}: ${current.localName}`}
        disabled={isPending}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu();
          }
        }}
        className={`group inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full py-1 pr-2 pl-2.5 text-xs/5 font-medium text-foreground-primary ring-1 ring-line transition-colors hover:bg-button-secondary-bg focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-60 ${
          open ? "bg-button-secondary-bg" : ""
        } ${fullWidth ? "w-full justify-between" : ""}`}
      >
        <span className="inline-flex items-center gap-1.5">
          <GlobeIcon className="size-4 text-foreground-muted group-hover:text-foreground-primary" />
          {current.localName}
        </span>
        <ChevronDownIcon
          className={`size-3 text-foreground-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={t("label")}
          aria-activedescendant={`${listId}-${languages[activeIndex].code}`}
          onKeyDown={onListKeyDown}
          className={`absolute top-full z-50 mt-2 min-w-48 rounded-xl bg-background-primary p-1.5 shadow-popover focus:outline-none ${
            align === "end" ? "right-0" : "left-0"
          } ${fullWidth ? "w-full" : ""}`}
        >
          <li role="presentation" className="px-2.5 pt-1.5 pb-2 font-sans text-xs font-semibold tracking-wide text-foreground-muted uppercase">
            {t("label")}
          </li>
          {languages.map((lang, index) => {
            const selected = lang.code === locale;
            return (
              <li
                key={lang.code}
                id={`${listId}-${lang.code}`}
                role="option"
                lang={lang.code}
                aria-selected={selected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2.5 py-2 ${
                  index === activeIndex ? "bg-button-secondary-bg" : ""
                }`}
              >
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-foreground-primary">{lang.localName}</span>
                  <span className="text-xs text-foreground-muted">{lang.name}</span>
                </span>
                {selected && <CheckIcon className="size-4 text-accent" strokeWidth={2} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
