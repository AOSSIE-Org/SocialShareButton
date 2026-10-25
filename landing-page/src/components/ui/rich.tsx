import type { ReactNode } from "react";

/** Tag renderers for `t.rich(...)` so translations can mark up inline code. */
export const richCode = {
  code: (chunks: ReactNode) => (
    <code className="rounded-md bg-button-secondary-bg px-1.5 py-0.5 font-mono text-[0.8125em] text-foreground-primary">
      {chunks}
    </code>
  ),
};
