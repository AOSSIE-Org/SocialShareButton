"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { InfoIcon } from "./Icons";

/**
 * Beginner-friendly explanation of a technical term. Opens on hover, focus or tap,
 * and closes on Escape or an outside click.
 */
export function InfoTip({ children, label }: { children: string; label?: string }) {
  const t = useTranslations("Install");
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const tipId = useId();
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setPinned(false);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setPinned(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <span
      ref={rootRef}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => !pinned && setOpen(false)}
    >
      <button
        type="button"
        aria-label={label ?? t("moreInfo")}
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        onClick={() => {
          setPinned(!pinned);
          setOpen(!pinned);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => !pinned && setOpen(false)}
        className="inline-grid size-6 cursor-pointer place-items-center rounded-full text-foreground-muted transition-colors hover:bg-button-secondary-bg hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent"
      >
        <InfoIcon className="size-5" />
      </button>
      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="absolute top-full left-1/2 z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl bg-background-primary p-3 text-sm/6 font-normal tracking-normal text-foreground-secondary shadow-popover max-sm:left-auto max-sm:right-0 max-sm:translate-x-0"
        >
          {children}
        </span>
      )}
    </span>
  );
}
