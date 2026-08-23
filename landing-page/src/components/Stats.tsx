"use client";

import { Activity, ShieldCheck, Gauge, Share2 } from "lucide-react";

const TELEMETRY_METRICS = [
  {
    icon: Gauge,
    value: "< 10 KB",
    label: "PRODUCTION BUNDLE",
    description: "Tree-shakable, 0 runtime dependencies",
  },
  {
    icon: ShieldCheck,
    value: "0",
    label: "TRACKERS & COOKIES",
    description: "GDPR compliant without cookie consent prompts",
  },
  {
    icon: Activity,
    value: "5",
    label: "FRAMEWORKS",
    description: "React, Next.js, Vue, Angular, Vanilla JS ",
  },
  {
    icon: Share2,
    value: "7+ NETWORKS",
    label: "GLOBAL DESTINATIONS",
    description: "Native apps, desktop web & Web Share API fallback",
  },
];

export function Stats() {
  return (
    <section className="border-y border-border bg-card/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {TELEMETRY_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div
                key={i}
                className="py-8 px-6 flex flex-col justify-center transition-colors hover:bg-muted/30 group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-muted-foreground uppercase">
                    {metric.label}
                  </span>
                </div>

                <div className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-1">
                  {metric.value}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
