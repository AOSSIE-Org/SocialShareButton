"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { highlight } from "sugar-high";
import { useTranslations } from "next-intl";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "./Icons";

/** Snippets longer than this collapse behind an expand toggle, since copying is the primary task. */
const COLLAPSE_AFTER_LINES = 14;

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts or browsers without the async clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}

/** `grow` lets the block fill a flex column on lg; the extra height is empty code background. */
export function CodeBlock({
  file,
  code,
  grow = false,
}: {
  file: string;
  code: string;
  grow?: boolean;
}) {
  const t = useTranslations("Install");
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const codeId = useId();

  const html = useMemo(() => highlight(code), [code]);
  const collapsible = code.split("\n").length > COLLAPSE_AFTER_LINES;
  const collapsed = collapsible && !expanded;

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const onCopy = async () => {
    if (!(await copyText(code))) return;
    setCopied(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-code-border bg-code-bg shadow-card ${grow ? "lg:flex lg:flex-1 lg:flex-col" : ""}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-code-divider py-1.5 pr-1.5 pl-4">
        <span className="truncate font-mono text-xs text-code-muted">{file}</span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? t("copied") : t("copy")}
          title={copied ? t("copied") : t("copy")}
          className="inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-code-muted transition-colors hover:bg-code-hover-bg hover:text-code-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          {copied ? (
            <CheckIcon className="size-4 text-code-success" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? t("copied") : ""}
        </span>
      </div>

      <div className="relative">
        <pre
          id={codeId}
          className={`overflow-x-auto p-4 font-mono [scrollbar-color:var(--code-divider)_transparent] [scrollbar-width:thin] text-[13px]/6 text-code-fg ${collapsed ? "max-h-64 overflow-y-hidden" : ""}`}
        >
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-code-bg to-transparent" />
        )}
      </div>

      {grow && <div aria-hidden className="max-lg:hidden lg:flex-1" />}

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={codeId}
          className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-t border-code-divider py-2 text-xs font-medium text-code-muted transition-colors hover:bg-code-hover-bg hover:text-code-fg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          {expanded ? t("collapse") : t("expand")}
          <ChevronDownIcon
            className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
