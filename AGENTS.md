# AOSSIE Contributor Agent Framework

> You are operating under the AOSSIE Contributor Skills Framework.
> Before doing ANY work, you MUST read and follow the files listed below relevant to your current task.

**Bold terms** are defined in [GLOSSARY.md](org-wide-skills/GLOSSARY.md); look them up there for the full meaning.

## 1. Project-Specific Local Context (.agent/ Facts & Commands)

To avoid unnecessary **context load**, load and read only the files relevant to your current task:

1. [.agent/core/architecture.md](.agent/core/architecture.md) — Establishes project **architectural boundaries** for this lightweight library (e.g. zero-dependency constraint).
2. [.agent/core/edge-cases.md](.agent/core/edge-cases.md) — Details project specific mistakes to prevent re-occurrences (e.g., bundle size restrictions).
3. [.agent/core/code-mapping.md](.agent/core/code-mapping.md) — Directory-to-purpose mapping layout (`src/`, `public/`, `landing-page/`).
4. [.agent/core/examples.md](.agent/core/examples.md) — Approved code patterns vs anti-patterns.
5. [.agent/instructions/setup.md](.agent/instructions/setup.md) — Commands for local setup and development.
6. [.agent/instructions/deployment.md](.agent/instructions/deployment.md) — CDN publish guidelines and environments.
7. [.agent/instructions/testing.md](.agent/instructions/testing.md) — ESLint, formatting, size checks, and visual browser verification standards.
8. [.agent/info/operational-data.md](.agent/info/operational-data.md) — Maintainer roster (@kpj2006), Discord links, and update templates.

## 2. Organization-Wide Skills (org-wide-skills/)

These skills govern AI agent behavior and policy constraints globally:

9. [org-wide-skills/GIT-DIS-AIPolicy/SKILL.md](org-wide-skills/GIT-DIS-AIPolicy/SKILL.md) — Governs the **AI Policy**, PR disclosures, and communication.
10. [org-wide-skills/project-template/SKILL.md](org-wide-skills/project-template/SKILL.md) — Shared architecture patterns.
11. [org-wide-skills/contributor-onboarding/SKILL.md](org-wide-skills/contributor-onboarding/SKILL.md) — Core onboarding flow.
12. [org-wide-skills/GLOSSARY.md](org-wide-skills/GLOSSARY.md) — Definitions for framework terminology.
13. [org-wide-skills/mcp-integration/SKILL.md](org-wide-skills/mcp-integration/SKILL.md) — Guides MCP integration for auto-PRs and UI testing.

- **Completion Criterion:** The agent has loaded the onboarding skill and confirmed compliance with all project instructions before writing any code.
