import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    // Apply settings specifically to source files
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "error",
      "no-unused-vars": ["warn", { "caughtErrorsIgnorePattern": "^_" }],
      "semi": ["error", "always"],
    },
  },
  {
    // Special rules for configuration files
    files: ["eslint.config.js", "**/*.config.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];
