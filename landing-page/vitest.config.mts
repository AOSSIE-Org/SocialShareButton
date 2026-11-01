import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // React 19 automatic JSX runtime, as in tsconfig.json ("jsx": "react-jsx")
  esbuild: { jsx: "automatic" },
  resolve: {
    // Same alias as "paths" in tsconfig.json
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    // Logic tests run in Node; component and page tests opt into jsdom with `// @vitest-environment jsdom`
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    // Shared mocks for what Node/jsdom cannot provide (Next.js build-time modules, request context, Lenis, matchMedia)
    setupFiles: ["tests/setup.tsx"],
    // The site URL and library version come from the environment at import time
    unstubEnvs: true,
    // jsdom rendering of whole pages under coverage instrumentation can exceed the 5 s default on slow CI runners
    testTimeout: 15_000,
    unstubGlobals: true,
    // next-intl imports "next/navigation" without an extension, which only Vite's resolver understands
    server: { deps: { inline: ["next-intl"] } },
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov", "html"],
      // The whole website: pages, layouts, components, hooks, config, i18n and lib
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts", // type declarations only
      ],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
