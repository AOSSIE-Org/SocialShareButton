---
name: aossie-social-share-button
description: Guidance for development, testing, and contribution in the SocialShareButton repository. Use when modifying core JS/CSS, framework wrappers, or running lint/format commands.
---

A skill governing technical standards and developer workflows in the `SocialShareButton` project. It enforces the **zero-dependency core** architectural rule.

**Bold terms** are defined in [GLOSSARY.md](../../../skills/GLOSSARY.md); look them up there for the full meaning.

## 1. Project-Specific Onboarding

**Trigger:** The contributor starts work in the `SocialShareButton` repository.

**Steps:**

1. Direct the contributor to read local `.agent/core/architecture.md` and `.agent/core/edge-cases.md`.
2. Ensure the contributor understands the **zero-dependency core** constraint and the < 10KB size limit.

- **Completion Criterion:** The agent has confirmed the contributor has read the local architecture and constraints.

## 2. Implementation Rules

**Trigger:** The user asks to write, edit, or refactor code.

**Steps:**

1. Verify if the change is in the core vanilla library (`src/social-share-button.js`, `src/social-share-button.css`, `src/social-share-analytics.js`) or wrapper components (React, Preact, Qwik).
2. Enforce the **architectural boundary**: Do NOT import any external dependencies or node modules. Use only native browser APIs and ES6 module exports.
3. Keep the styling changes responsive and theme-compatible (supporting light/dark themes).

- **Completion Criterion:** The agent has reviewed the planned code changes and verified that no third-party dependencies are introduced.

## 3. Testing and Code Quality

**Trigger:** Code changes are complete and ready for verification.

**Steps:**

### Agent-Only Auto Verification (Preferred)

If the agent has terminal and browser execution capability:

1. Run ESLint, formatting, unit tests, and size-limit audits automatically:
   ```bash
   npm run lint
   npm run format
   npm run test
   npm run check-size
   ```
   - Ensure all DOM unit tests pass successfully.
   - Verify that file sizes remain within strict budgets (JS < 10KB, CSS < 5KB).
2. Serve the project locally using the start script:
   ```bash
   npm start
   ```
3. Use the browser subagent or Puppeteer MCP server tool:
   - Navigate to the local server URL (typically `http://localhost:8080`).
   - Interact with the social sharing buttons: click each button (Facebook, Twitter, LinkedIn, etc.) and verify they trigger correct sharing URLs.
   - Capture a screenshot of each button interaction state.
   - Retrieve console logs and check for runtime errors or warnings.
4. Save the screenshots locally and prepare them to be embedded directly into the Pull Request description.

### Contributor Manual Verification (Fallback)

If the agent lacks browser execution or is running in a constrained environment:

1. Guide the contributor to run ESLint, formatting, unit testing, and size-limit checks:
   ```bash
   npm run lint
   npm run format
   npm run test
   npm run check-size
   ```
2. Instruct the contributor to open `index.html` in their browser, test all social sharing buttons manually, inspect the developer console, and verify responsiveness.

- **Completion Criterion:** The agent has verified that linting, formatting, unit tests, and size-limit checks are complete, and either successfully auto-verified visual behavior using browser tools or walked the human contributor through manual verification.

## 4. Submission Prep

**Trigger:** The contributor is ready to open a pull request.

**Steps:**

1. Guide the contributor to rebase with upstream `main` and push their branch.
2. Format the PR description:
   - Incorporate the **AI Policy** disclosure block.
   - Link the related issue.
   - Attach and embed the captured button interaction screenshots (taken during Step 3) directly into the Pull Request description. This gives the maintainers immediate visual context of what changes were made and how they function.
3. Output the Discord notification template pointing to the `#development` channel.

- **Completion Criterion:** The PR template draft (complete with embedded screenshots and AI disclosure) and Discord message are generated and ready for use.
