"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { InfoTip } from "@/components/ui/InfoTip";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { Eyebrow } from "@/components/ui/Section";
import { richCode } from "@/components/ui/rich";
import { frameworkIds, installGuides, type FrameworkId } from "@/content/install";

const STORAGE_KEY = "ssb:framework";

function StepNumber({ step, label }: { step: number; label: string }) {
  return (
    <span
      aria-label={label}
      className="relative grid size-9 shrink-0 place-items-center font-mono text-sm font-medium text-foreground-primary"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5 border-y border-l border-foreground-primary"
      />
      <span aria-hidden>{step}</span>
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-1.5 border-y border-r border-foreground-primary"
      />
    </span>
  );
}

function Step({
  step,
  title,
  info,
  grow = false,
  children,
}: {
  step: number;
  title?: ReactNode;
  info?: string;
  /** Let this step fill the remaining height on lg (the last step, for bottom alignment). */
  grow?: boolean;
  children: ReactNode;
}) {
  const t = useTranslations("Install");
  return (
    // Untitled steps (the framework picker) center the number on their control;
    // titled steps align the number with the heading's first line.
    <li className={`flex gap-4 sm:gap-5 ${title ? "" : "items-center"} ${grow ? "lg:flex-1" : ""}`}>
      <StepNumber step={step} label={t("stepLabel", { step })} />
      <div className={`min-w-0 flex-1 ${title ? "pt-1" : ""} ${grow ? "lg:flex lg:flex-col" : ""}`}>
        {title && (
          <h3 className="flex items-center gap-2 text-lg font-medium tracking-tight text-foreground-primary">
            {title}
            {info && <InfoTip>{info}</InfoTip>}
          </h3>
        )}
        <div
          className={`${title ? "mt-3 space-y-4" : ""} ${grow ? "lg:flex lg:flex-1 lg:flex-col" : ""}`}
        >
          {children}
        </div>
      </div>
    </li>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2.5 text-sm/6 text-foreground-secondary">
      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground-primary" />
      <span>{children}</span>
    </p>
  );
}

function FrameworkSelect({
  value,
  onChange,
}: {
  value: FrameworkId | null;
  onChange: (value: FrameworkId) => void;
}) {
  const t = useTranslations("Install");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const openList = () => {
    setActiveIndex(Math.max(0, value ? frameworkIds.indexOf(value) : 0));
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(frameworkIds[index]);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const last = frameworkIds.length - 1;
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActiveIndex((i) => Math.min(last, i + 1)),
      ArrowUp: () => setActiveIndex((i) => Math.max(0, i - 1)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      " ": () => choose(activeIndex),
      Escape: () => {
        setOpen(false);
        buttonRef.current?.focus();
      },
      Tab: () => setOpen(false),
    };
    const action = keys[event.key];
    if (!action) return;
    if (event.key !== "Tab") event.preventDefault();
    action();
  };

  return (
    <div ref={rootRef} className="relative">
      <span id={labelId} className="sr-only">
        {t("frameworkLabel")}
      </span>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${labelId}-value`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openList();
          }
        }}
        className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm/6 ring-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          value
            ? "bg-background-primary font-medium text-foreground-primary ring-line"
            : "bg-button-secondary-bg text-foreground-secondary ring-transparent hover:bg-button-secondary-hover-bg"
        }`}
      >
        <span id={`${labelId}-value`} className="truncate">
          {value ? t(`frameworks.${value}.label`) : t("frameworkPlaceholder")}
        </span>
        <ChevronDownIcon
          className={`size-4 shrink-0 text-foreground-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${listId}-${frameworkIds[activeIndex]}`}
          onKeyDown={onListKeyDown}
          data-lenis-prevent
          className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-auto rounded-xl bg-background-primary p-1.5 shadow-popover focus:outline-none"
        >
          {frameworkIds.map((id, index) => {
            const selected = id === value;
            return (
              <li
                key={id}
                id={`${listId}-${id}`}
                role="option"
                aria-selected={selected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground-primary ${
                  index === activeIndex ? "bg-button-secondary-bg" : ""
                }`}
              >
                {/* Radio indicator: exactly one framework can be selected */}
                <span
                  aria-hidden
                  className={`grid size-4 shrink-0 place-items-center rounded-full ring-1 transition-colors ${
                    selected ? "bg-accent ring-accent" : "ring-border-default"
                  }`}
                >
                  {selected && <span className="size-1.5 rounded-full bg-background-primary" />}
                </span>
                {t(`frameworks.${id}.label`)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function Installation() {
  const t = useTranslations("Install");
  const [framework, setFramework] = useState<FrameworkId | null>(null);

  // Remember the reader's framework between visits (a per-browser convenience only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && (frameworkIds as readonly string[]).includes(saved)) {
        const frame = requestAnimationFrame(() => setFramework(saved as FrameworkId));
        return () => cancelAnimationFrame(frame);
      }
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the default is fine.
    }
  }, []);

  const select = (id: FrameworkId) => {
    setFramework(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Ignore storage failures; selection still works for this visit.
    }
  };

  const guide = framework ? installGuides[framework] : null;

  return (
    <div className="lg:flex lg:flex-1 lg:flex-col">
      <Eyebrow as="h2" id="install-heading">
        {t("eyebrow")}
      </Eyebrow>
      <ol className="mt-8 space-y-10 lg:flex lg:flex-1 lg:flex-col">
        <Step step={1}>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <FrameworkSelect value={framework} onChange={select} />
            </div>
            <InfoTip>{t("frameworkInfo")}</InfoTip>
          </div>
        </Step>

        {guide && framework ? (
          <>
            <Step step={2} title={t("cdnTitle", { file: guide.loadFile })} info={t("cdnInfo")}>
              <Bullet>
                {t.rich("cdnHead", {
                  ...richCode,
                  tag: "<link>",
                  parent: framework === "next-pages" ? "<Head>" : "<head>",
                })}
              </Bullet>
              <CodeBlock file={guide.head.file} code={guide.head.code} />
              <Bullet>
                {t.rich("cdnBody", { ...richCode, tag: guide.body.tag, parent: guide.body.parent })}
              </Bullet>
              <CodeBlock file={guide.body.file} code={guide.body.code} />
            </Step>

            <Step step={3} title={t("containerTitle")} info={t("containerInfo")}>
              <Bullet>
                {t.rich(`frameworks.${framework}.container`, {
                  ...richCode,
                  file: guide.container.file,
                })}
              </Bullet>
              <CodeBlock file={guide.container.file} code={guide.container.code} />
            </Step>

            <Step step={4} title={t("initTitle")} info={t("initInfo")} grow>
              <Bullet>
                {t.rich(`frameworks.${framework}.init`, { ...richCode, tag: "</body>" })}
              </Bullet>
              <CodeBlock file={guide.init.file} code={guide.init.code} grow />
            </Step>
          </>
        ) : (
          <li className="hatch grid place-items-center rounded-xl px-6 py-10 text-center text-sm/6 text-foreground-secondary ring-1 ring-line lg:flex-1">
            {t("emptyState")}
          </li>
        )}
      </ol>
    </div>
  );
}
