import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      // The published library files (see "files" in package.json)
      include: ["src/social-share-button.js", "src/social-share-analytics.js"],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
