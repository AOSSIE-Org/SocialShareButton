# Project Setup & Local Development

> **Agent Instruction:** Do NOT hallucinate infrastructure setup. Use ONLY the commands listed here. If a contributor asks about setup that isn't documented, tell them to ask in the `#development` Discord channel.
>
> **Bold terms** are defined in [GLOSSARY.md](../../org-wide-skills/GLOSSARY.md); look them up there for the full meaning.

## Prerequisites

- Node.js 18+ (verified via `node --version`)
- npm / pnpm / yarn (checked via `npm --version`)
- Git

## Local Development

### 1. Install Project Dependencies

Run this command from the root of the `SocialShareButton` folder to install linting and formatting dev dependencies:

```bash
npm install
```

### 2. Run/View the Local Test Harness

Since there is no production build step for the core library, you can test modifications directly in the browser:

- Open `index.html` directly in your browser.
- Alternatively, spin up a simple static server (e.g. `npx serve .` or `npx live-server`) to preview changes.

### 3. Verify Code Quality

Always check formatting and rules before requesting reviews:

```bash
# Run ESLint check
npm run lint

# Format files using Prettier
npm run format
```

## Common Commands

| Command                | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `npm run lint`         | Run ESLint check                                    |
| `npm run lint:fix`     | Automatically resolve minor lint rules              |
| `npm run format`       | Run formatting check and overwrite files            |
| `npm run format:check` | Verify formatting consistency without modifications |
