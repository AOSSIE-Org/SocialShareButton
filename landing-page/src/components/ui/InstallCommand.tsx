"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { copyText } from "./CodeBlock";
import { CheckIcon, CopyIcon } from "./Icons";

/** One-line terminal command with a copy button, e.g. the npm install command in the hero. */
export function InstallCommand({ command }: { command: string }) {
  const t = useTranslations("Install");
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const onCopy = async () => {
    if (!(await copyText(command))) return;
    setCopied(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-fit max-w-full items-center gap-3 rounded-xl bg-card-bg py-2 pr-2 pl-4 ring-1 ring-line">
      <code className="no-scrollbar overflow-x-auto font-mono text-[13px]/6 whitespace-nowrap text-foreground-primary">
        <span aria-hidden className="text-accent select-none">
          ~{" "}
        </span>
        {command}
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? t("copied") : t("copyCommand")}
        title={copied ? t("copied") : t("copyCommand")}
        className="inline-grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-foreground-muted transition-colors hover:bg-button-secondary-bg hover:text-foreground-primary focus-visible:outline-2 focus-visible:outline-accent"
      >
        {copied ? <CheckIcon className="size-4 text-accent" /> : <CopyIcon className="size-4" />}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? t("copied") : ""}
      </span>
    </div>
  );
}
