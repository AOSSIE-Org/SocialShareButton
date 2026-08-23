"use client";

import { ShieldCheck, Palette, Cpu, Accessibility, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

const ARCHITECTURAL_PILLARS = [
  {
    icon: ShieldCheck,
    tag: "PRIVACY ENGINE",
    title: "Zero-Tracker Isolation",
    description:
      "Unlike legacy widgets that ping advertising networks, SocialShareButton triggers direct native share intents with zero third-party telemetry, scripts, or cookie storage.",
    highlight: "GDPR Compliant out-of-the-box",
  },
  {
    icon: Palette,
    tag: "DESIGN TOKENS",
    title: "Pure CSS Variable Theming",
    description:
      "Every button, border, elevation, and transition responds to CSS custom properties. Match your brand or design system in three lines of CSS without fighting specificity.",
    highlight: "Light, dark & custom palettes",
  },
  {
    icon: Cpu,
    tag: "CORE RUNTIME",
    title: "Framework-Agnostic Core",
    description:
      "A pure TypeScript core that compiles to an ultra-compact bundle with tree-shakable adapters for React, Vue, Svelte, Preact, and standard vanilla script tags.",
    highlight: "< 10KB production weight",
  },
  {
    icon: Accessibility,
    tag: "ACCESSIBILITY",
    title: "WCAG 2.1 AA Compliant",
    description:
      "Built with proper semantic buttons, focus traps in modal sheets, keyboard shortcuts (Escape to dismiss, Tab indexing), and screen reader-friendly aria labels.",
    highlight: "Keyboard & screen reader ready",
  },
];

export function Features() {
  return (
    <section id="architecture" className="py-24 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-4">
            <span>SYSTEM ARCHITECTURE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-4 text-balance">
            Engineered for performance. Built for developers.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Every architectural decision is made to keep your bundle featherweight, your user data private, and your implementation effortless.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {ARCHITECTURAL_PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-7 sm:p-8 hover:border-primary/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-muted-foreground uppercase bg-muted px-2.5 py-1 rounded-md">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-primary font-medium">{pillar.highlight}</span>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group/link"
                  >
                    <span>Read spec</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
