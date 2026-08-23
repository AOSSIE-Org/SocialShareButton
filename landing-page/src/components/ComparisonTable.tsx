"use client";

import { Check, X, Shield, Zap, Lock, Terminal } from "lucide-react";

export function ComparisonTable() {
  const specs = [
    {
      feature: "Gzipped Bundle Size",
      aossie: "< 10 KB",
      addthis: "340 KB+",
      sharethis: "280 KB+",
      better: true,
    },
    {
      feature: "External HTTP Requests",
      aossie: "0 (Self-contained)",
      addthis: "18+ third-party calls",
      sharethis: "14+ third-party calls",
      better: true,
    },
    {
      feature: "Data Tracking & Telemetry",
      aossie: "Zero user data collected",
      addthis: "Ad-network profiling",
      sharethis: "Cross-site tracking",
      better: true,
    },
    {
      feature: "Mandatory Cookie Banner",
      aossie: "Not required (0 cookies)",
      addthis: "Required (GDPR/CCPA)",
      sharethis: "Required (GDPR/CCPA)",
      better: true,
    },
    {
      feature: "CSS Variable Customization",
      aossie: "100% Themeable",
      addthis: "Locked iframe / limited",
      sharethis: "Locked iframe / limited",
      better: true,
    },
    {
      feature: "Open Source Codebase",
      aossie: "Apache 2.0 (AOSSIE Org)",
      addthis: "Closed / Sunsetting",
      sharethis: "Closed proprietary",
      better: true,
    },
  ];

  return (
    <section id="benchmarks" className="py-24 bg-background border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-4">
            <span>ARCHITECTURAL BENCHMARK</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-4 text-balance">
            Stop sacrificing speed and privacy for a share button.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Legacy sharing widgets load dozens of external tracking scripts that degrade your Core Web Vitals and force you to display intrusive cookie consent banners.
          </p>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs font-mono uppercase text-muted-foreground">
                  <th className="py-4 px-6 font-semibold">Architectural Spec</th>
                  <th className="py-4 px-6 font-bold text-foreground bg-primary/10 border-x border-primary/20">
                    <span className="flex items-center gap-1.5 text-primary">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      SocialShareButton
                    </span>
                  </th>
                  <th className="py-4 px-6 font-semibold">AddThis (Legacy)</th>
                  <th className="py-4 px-6 font-semibold">ShareThis (Legacy)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {specs.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6 font-heading font-medium text-foreground">
                      {row.feature}
                    </td>

                    {/* AOSSIE Share */}
                    <td className="py-4 px-6 font-mono font-bold text-primary bg-primary/5 border-x border-primary/20">
                      <span className="inline-flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{row.aossie}</span>
                      </span>
                    </td>

                    {/* AddThis */}
                    <td className="py-4 px-6 font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-2 text-red-500/90 dark:text-red-400">
                        <X className="w-4 h-4 shrink-0" />
                        <span>{row.addthis}</span>
                      </span>
                    </td>

                    {/* ShareThis */}
                    <td className="py-4 px-6 font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-2 text-red-500/90 dark:text-red-400">
                        <X className="w-4 h-4 shrink-0" />
                        <span>{row.sharethis}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer Callout */}
          <div className="p-4 bg-muted/40 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-foreground">
            <span>BENCHMARK AUDIT: Tested on standard Next.js 15 production build</span>
            <span className="text-primary font-semibold">✓ 100% GDPR, CCPA & ePrivacy Compliant</span>
          </div>
        </div>

      </div>
    </section>
  );
}
