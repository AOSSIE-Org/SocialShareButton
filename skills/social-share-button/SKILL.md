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

1. Guide the contributor to run ESLint checks:
   ```bash
   npm run lint
   ```
2. Guide the contributor to format files to project standards:
   ```bash
   npm run format
   ```
3. Guide the contributor to perform manual verification:
   - Open `index.html` in a web browser.
   - Click and test all social sharing buttons.
   - Check the developer console for errors or warnings.
   - Resize the window to verify mobile responsiveness.

- **Completion Criterion:** The agent has verified that code quality checks (`lint` and `format:check`) pass, and the contributor has completed manual browser testing.

## 4. Submission Prep

**Trigger:** The contributor is ready to open a pull request.

**Steps:**

1. Guide the contributor to rebase with upstream `main` and push their branch.
2. Format the PR description incorporating the **AI Policy** disclosure block and linking the related issue.
3. Output the Discord notification template pointing to the `#development` channel.

- **Completion Criterion:** The PR template draft and Discord message are generated and ready for use.
