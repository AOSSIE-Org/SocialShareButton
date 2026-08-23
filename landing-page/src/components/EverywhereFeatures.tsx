"use client";

import { useState } from "react";
import { BookOpen, ShoppingBag, BarChart3, Newspaper, CheckCircle2 } from "lucide-react";

const CONTEXTS = [
  {
    id: "docs",
    title: "Engineering Docs & Blogs",
    icon: BookOpen,
    badge: "Developer Portals",
    description:
      "Allow readers to share code snippets, release notes, and documentation pages with clean canonical URLs and anchor tag persistence.",
    previewSnippet: `<SocialShareButton 
  url="https://docs.acme.dev/v2/migration"
  title="Migrating to v2 in 5 minutes"
  networks={["x", "linkedin", "reddit"]}
/>`,
  },
  {
    id: "saas",
    title: "SaaS & User Dashboards",
    icon: BarChart3,
    badge: "Product Growth",
    description:
      "Empower your users to share milestone celebrations, weekly metrics, referral links, and project achievements with one tap.",
    previewSnippet: `<SocialShareButton 
  url="https://app.saas.io/badges/100-streak"
  title="I just completed a 100-day build streak!"
  theme="dark"
  style="compact"
/>`,
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Retail",
    icon: ShoppingBag,
    badge: "Conversion",
    description:
      "Let shoppers broadcast wishlist items, limited-time flash sales, and product drops to WhatsApp group chats and social feeds.",
    previewSnippet: `<SocialShareButton 
  url="https://store.brand.com/products/ceramic-mug"
  title="Check out this handmade ceramic mug"
  networks={["whatsapp", "facebook", "pinterest"]}
/>`,
  },
  {
    id: "media",
    title: "News & Digital Media",
    icon: Newspaper,
    badge: "High Throughput",
    description:
      "Handle millions of readers during breaking news surges without relying on third-party tracking CDNs that could crash or lag your page.",
    previewSnippet: `<SocialShareButton 
  url="https://times.daily.org/2026/breaking-update"
  title="Major scientific breakthrough announced"
  style="inline"
/>`,
  },
];

export function EverywhereFeatures() {
  const [activeContext, setActiveContext] = useState(0);
  const current = CONTEXTS[activeContext];
  const Icon = current.icon;

  return (
    <section className="py-24 bg-card/40 border-b border-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-mono font-semibold text-secondary mb-4">
            <span>REAL-WORLD SURFACES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15] mb-4 text-balance">
            Wherever content needs to spread.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            From technical documentation to high-traffic newsrooms, SocialShareButton fits into any publishing surface seamlessly.
          </p>
        </div>

        {/* Interactive Surface Switcher */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Surface Selectors */}
          <div className="lg:col-span-5 space-y-3">
            {CONTEXTS.map((context, i) => {
              const CtxIcon = context.icon;
              const isSelected = activeContext === i;
              return (
                <button
                  key={context.id}
                  onClick={() => setActiveContext(i)}
                  className={`w-full text-left p-5 rounded-xl border transition-all flex items-start gap-4 cursor-pointer ${
                    isSelected
                      ? "bg-card border-primary/50 shadow-md shadow-primary/5"
                      : "bg-background/60 border-border hover:border-border/80 hover:bg-card/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CtxIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-base text-foreground">
                        {context.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {context.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Surface Preview Console */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-sm">
                      {current.title}
                    </h3>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {current.badge}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-muted text-primary font-medium">
                  Config Spec
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {current.description}
              </p>

              {/* Code Snippet Box */}
              <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs text-muted-foreground overflow-x-auto leading-relaxed">
                <pre className="text-foreground">
                  <code>{current.previewSnippet}</code>
                </pre>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Custom OpenGraph title</span>
                </span>
                <span className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dynamic UTM generator</span>
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}