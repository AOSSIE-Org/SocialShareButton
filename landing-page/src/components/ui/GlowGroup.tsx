"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Pointer-following border light for a group of cards (styles in globals.css).
 * The group and every descendant with `data-glow` get `--glow-x`/`--glow-y` in their own
 * coordinates. One passive listener, batched per animation frame, reads all rects before
 * writing, and only runs on devices with a fine hover pointer.
 */
export function GlowGroup({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      const targets = [root, ...root.querySelectorAll<HTMLElement>("[data-glow]")];
      const rects = targets.map((target) => target.getBoundingClientRect());
      targets.forEach((target, index) => {
        target.style.setProperty("--glow-x", `${pointerX - rects[index].left}px`);
        target.style.setProperty("--glow-y", `${pointerY - rects[index].top}px`);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`glow-group ${className}`}>
      {children}
    </div>
  );
}
