"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Github, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface SiteNavbarProps {
  variant?: "landing" | "docs";
}

export function SiteNavbar({ variant = "landing" }: SiteNavbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Release Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center">
                <Image
                  src="/SocialShare_logo.webp"
                  alt="SocialShareButton Logo"
                  width={36}
                  height={36}
                  className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-base sm:text-lg tracking-tight leading-none text-foreground">
                  SocialShare<span className="text-primary font-mono font-medium">Button</span>
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none mt-0.5">
                  by AOSSIE
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              v1.0.4
            </span>
          </div>

          {/* Navigation Links for Landing */}
          {variant === "landing" && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#benchmarks" className="hover:text-foreground transition-colors">
                Benchmarks
              </Link>
              <Link href="#architecture" className="hover:text-foreground transition-colors">
                Architecture
              </Link>
              <Link href="#playground" className="hover:text-foreground transition-colors">
                Playground
              </Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Docs
              </Link>
            </nav>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <a
              href="https://github.com/AOSSIE-Org/SocialShareButton"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card/50 hover:bg-muted text-xs font-mono font-medium text-foreground transition-colors"
              aria-label="Star on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Star</span>
            </a>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-border/80 bg-card/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
}
