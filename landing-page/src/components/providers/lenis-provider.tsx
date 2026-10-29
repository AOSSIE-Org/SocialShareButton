"use client";

import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/** Pauses smooth scrolling while a SocialShareButton modal is open, so the page behind it stays put. */
function ShareModalScrollLock() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onShareEvent = (event: Event) => {
      const { interactionType } = (event as CustomEvent<{ interactionType?: string }>).detail ?? {};
      if (interactionType === "popup_open") lenis.stop();
      if (interactionType === "popup_close") lenis.start();
    };
    document.addEventListener("social-share", onShareEvent);
    return () => document.removeEventListener("social-share", onShareEvent);
  }, [lenis]);

  return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getSnapshot,
    getServerSnapshot
  );

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, anchors: { offset: -64 } }}
    >
      <ShareModalScrollLock />
      {children}
    </ReactLenis>
  );
}
