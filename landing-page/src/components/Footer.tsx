"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Copy, Check, Terminal, ArrowRight, Heart } from "lucide-react";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.211.375-.444.879-.608 1.279a18.27 18.27 0 0 0-5.487 0A12.64 12.64 0 0 0 9.182 3a19.736 19.736 0 0 0-4.435 1.369C1.578 9.045.769 13.579 1.174 18.053a19.9 19.9 0 0 0 5.993 3.03c.484-.66.914-1.36 1.285-2.096a12.3 12.3 0 0 1-2.023-.975c.17-.124.336-.253.497-.386 3.902 1.804 8.13 1.804 11.986 0 .163.133.329.262.497.386-.646.389-1.325.719-2.026.977.372.735.8 1.435 1.284 2.095a19.86 19.86 0 0 0 6.002-3.03c.475-5.177-.8-9.669-3.352-13.685ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.955 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.947 2.419-2.157 2.419Z" />
    </svg>
  );
}

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i @aossie-org/social-share-button");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      
      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-border">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-4">
              <span>GET STARTED TODAY</span>
            </div>
            
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-[1.12] mb-4">
              Ready to ship fast, clean social sharing?
            </h2>
            
            <p className="text-base text-muted-foreground leading-relaxed">
              No API keys, no monthly tracking fees, no cookie consent hassle. Drop it into your application and start sharing in 30 seconds.
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* Terminal Copy Box */}
            <div className="p-4 rounded-xl border border-border bg-background flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 font-mono text-xs text-foreground overflow-hidden">
                <Terminal className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">npm i @aossie-org/social-share-button</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-xs hover:brightness-110 active:scale-95 transition-all shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/docs"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-sm"
              >
                <span>Read Full Documentation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="https://github.com/AOSSIE-Org/SocialShareButton"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted font-heading font-semibold text-xs sm:text-sm text-foreground transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links & AOSSIE Pedigree */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/SocialShare_logo.webp"
                alt="SocialShareButton Logo"
                width={32}
                height={32}
                className="w-7 h-7"
              />
              <span className="font-heading font-bold text-base tracking-tight text-foreground">
                SocialShare<span className="text-primary font-mono">Button</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Open-source, zero-dependency social sharing component library maintained by the AOSSIE open source community.
            </p>
          </div>

          {/* Col 2: Documentation */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Documentation
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  Quick Start Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/manual" className="hover:text-foreground transition-colors">
                  Manual Framework Setup
                </Link>
              </li>
              <li>
                <Link href="/docs#ai-agent" className="hover:text-foreground transition-colors">
                  AI Agent Integration
                </Link>
              </li>
              <li>
                <Link href="#playground" className="hover:text-foreground transition-colors">
                  Studio Configurator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="#benchmarks" className="hover:text-foreground transition-colors">
                  Zero-Tracker Benchmark
                </Link>
              </li>
              <li>
                <Link href="#architecture" className="hover:text-foreground transition-colors">
                  CSS Variable Engine
                </Link>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@aossie-org/social-share-button"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  NPM Registry Package
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & AOSSIE */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Community
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a
                  href="https://github.com/AOSSIE-Org/SocialShareButton"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/6mFZ2S846n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <DiscordIcon className="w-3.5 h-3.5" />
                  <span>AOSSIE Discord</span>
                </a>
              </li>
              <li>
                <a
                  href="https://aossie.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  AOSSIE Organization
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
          <p>© {new Date().getFullYear()} AOSSIE. Released under Apache-2.0 License.</p>
          <p className="flex items-center gap-1">
            Built with craft for the open web.
          </p>
        </div>
      </div>

    </footer>
  );
}