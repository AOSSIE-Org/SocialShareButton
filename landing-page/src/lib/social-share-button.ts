/** React bindings for the SocialShareButton library. Import only from Client Components. */
import { useEffect, useRef, useState } from "react";
import type { ButtonStyle, PlatformId } from "./platforms";

/** Subset of the library's options used by this site (see repository README for all options). */
export interface SocialShareButtonOptions {
  container: string | HTMLElement;
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  platforms?: PlatformId[];
  theme?: "dark" | "light";
  buttonText?: string;
  buttonStyle?: ButtonStyle;
  buttonColor?: string;
  buttonHoverColor?: string;
  showButton?: boolean;
}

export interface SocialShareButtonInstance {
  openModal(): void;
  closeModal(): void;
  destroy(): void;
  updateOptions(options: Partial<SocialShareButtonOptions>): void;
}

type SocialShareButtonConstructor = new (
  options: SocialShareButtonOptions
) => SocialShareButtonInstance;

declare global {
  interface Window {
    SocialShareButton?: SocialShareButtonConstructor;
  }
}

/** Resolves once the library script (loaded in the root layout) has defined window.SocialShareButton. */
export function useLibraryReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.SocialShareButton) {
      const frame = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(frame);
    }
    const interval = window.setInterval(() => {
      if (window.SocialShareButton) {
        window.clearInterval(interval);
        setReady(true);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  return ready;
}

/**
 * Mounts a SocialShareButton into `containerRef` and rebuilds it whenever `options` change.
 * The library's updateOptions() does not re-render theme, style or platforms, so a
 * destroy + recreate cycle is the reliable way to reflect every option.
 * `options` must be referentially stable (memoize it) to avoid needless rebuilds.
 */
export function useSocialShareButton(
  options: Omit<SocialShareButtonOptions, "container"> | null
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<SocialShareButtonInstance | null>(null);
  const ready = useLibraryReady();

  useEffect(() => {
    const container = containerRef.current;
    if (!ready || !options || !container || !window.SocialShareButton) return;

    const instance = new window.SocialShareButton({ ...options, container });
    instanceRef.current = instance;
    return () => {
      instance.destroy();
      if (instanceRef.current === instance) instanceRef.current = null;
    };
  }, [ready, options]);

  return { containerRef, instanceRef, ready };
}
