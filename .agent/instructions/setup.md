# Project Setup & Local Development

## Prerequisites

Verify local development environment tools before installing dependencies:

```bash
# Verify Node.js version (must be >= 18.0.0)
node --version

# Verify Package Manager & Git
npm --version
git --version
```

## Local Development Setup

### 1. Install Project Dependencies

Run this command from the root of the `SocialShareButton` folder to install dev dependencies:

```bash
npm install
```

### 2. Run/Preview the Local Test Harness

Since there is no production build step for the core library, you can preview and test modifications directly in the browser:

- Open `index.html` directly in your browser.
- Alternatively, spin up a simple static server:
  ```bash
  npm start
  ```

## Issue Assignment Check Before Coding

Before writing code or opening PRs:
1. Confirm your assigned GitHub issue number.
2. If unassigned, join the project Discord channel ([`.agent/info/operational-data.md`](../info/operational-data.md)) to discuss and get assigned before starting work.
