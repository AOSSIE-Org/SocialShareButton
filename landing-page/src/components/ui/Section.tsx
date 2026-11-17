import type { ReactNode } from "react";

export function Eyebrow({
  children,
  id,
  as: Tag = "p",
  tone = "accent",
  fit = false,
}: {
  children: ReactNode;
  id?: string;
  as?: "p" | "h2";
  tone?: "accent" | "highlight";
  /**
   * Scale the label down with its container (which must have the `@container` class) so a long
   * label never wraps. Short labels only step down from 14px to 12px on phones.
   */
  fit?: boolean;
}) {
  return (
    <Tag
      id={id}
      className={`font-sans font-semibold tracking-wide whitespace-nowrap uppercase ${fit ? "text-[length:min(0.875rem,100cqi/32)]" : "text-xs sm:text-sm"} ${tone === "accent" ? "text-accent" : "text-highlight"}`}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-3 max-w-2xl text-3xl/9 font-medium tracking-tighter text-balance text-foreground-primary sm:text-[2.5rem]/10"
    >
      {children}
    </h2>
  );
}

/** Full-bleed section separated by a hairline rule, in the style of tailwindcss.com. */
export function Section({
  id,
  labelledBy,
  children,
  className = "",
}: {
  id?: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`scroll-mt-16 border-t border-line ${className}`}>
      {children}
    </section>
  );
}

/** Horizontal padding shared by every section so hairline grids line up. */
export const sectionPadding = "px-4 sm:px-6 lg:px-10";
