# AOSSIE Contributor Agent Framework

> You are operating under the AOSSIE Contributor Skills Framework.

**Glossary**: Framework terminology definitions are in [GLOSSARY.md](org-wide-skills/GLOSSARY.md).

## 1. Mandatory Project Baseline Context

At the start of ANY session or task, load these 3 core files to establish project baseline rules:
- [.agent/core/architecture.md](.agent/core/architecture.md) — Zero-dependency constraint & architectural boundaries.
- [.agent/core/code-mapping.md](.agent/core/code-mapping.md) — Directory layout (`src/`, `public/`, `landing-page/`).
- [.agent/core/edge-cases.md](.agent/core/edge-cases.md) — Historical agent mistakes & size budget restrictions.

## 2. Task Intent Router

Load additional files as needed based on the user's current request:

### Onboarding & Setup
- [.agent/instructions/setup.md](.agent/instructions/setup.md) — Local installation commands & issue assignment check.

### Writing & Modifying Code
- [.agent/core/examples.md](.agent/core/examples.md) — Approved code patterns vs anti-patterns.
- [org-wide-skills/project-template/SKILL.md](org-wide-skills/project-template/SKILL.md) — Shared org architecture standards.

### Testing & Verification
- [.agent/instructions/testing.md](.agent/instructions/testing.md) — ESLint, formatting, and visual browser testing.
- [.agent/instructions/ci-cd.md](.agent/instructions/ci-cd.md) — Load when user explicitly asks to debug failing CI, provides a PR link/number, or pastes CI logs.
- [org-wide-skills/mcp-integration/SKILL.md](org-wide-skills/mcp-integration/SKILL.md) — Automated UI browser testing via MCP.

### Pull Requests & Community
- [org-wide-skills/GIT-DIS-AIPolicy/SKILL.md](org-wide-skills/GIT-DIS-AIPolicy/SKILL.md) — Mandatory AI disclosures, PR rules, issue verification.
- [.agent/info/operational-data.md](.agent/info/operational-data.md) — Maintainer contacts, Discord channels, and message templates.

---

- **Completion Criterion:** Confirm compliance with mandatory baseline rules and active task files before completing work.
