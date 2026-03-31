import js from "@eslint/js";
import globals from "globals";

/**
 * ESLint Configuration
 * 
 * Defines project-wide code quality and style standards.
 * Supports Vanilla JS, React (JSX), and Preact environments.
 */
export default [
  // Start with ESLint's recommended base rules
  js.configs.recommended,

  // Configuration for source files (JS and JSX)
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX support for React/Preact components
        },
      },
     globals: {
      ...globals.browser, // Standard browser globals (window, document, etc.)
      ...globals.es2021,  // Modern ES2021 features
      module: "readonly", // Allow CommonJS usage
      exports: "readonly",
    },
    },
    rules: {
      // Prevent accidental console logs in production code
      "no-console": "error",
      
      // Warn about unused variables, but ignore those prefixed with _ (common in catch blocks)
      "no-unused-vars": ["warn", { caughtErrorsIgnorePattern: "^_" }],
      
      // Enforce double quotes to maintain consistency across the codebase
      quotes: ["error", "double", { avoidEscape: true }],
      
      // Enforce semicolons for clear statement termination
      semi: ["error", "always"],
    },
  },

  // Configuration for project config files (running in Node.js)
  {
    files: ["eslint.config.js", "**/*.config.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];
