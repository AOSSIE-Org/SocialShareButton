# AOSSIE Contributor Agent Framework

> You are operating under the AOSSIE Contributor Skills Framework.
> Read the section matching your current task intent.

**Glossary**: Terminology definitions are in [GLOSSARY.md](org-wide-skills/GLOSSARY.md).

## Task-Based Intent Router

###  Onboarding & First Setup
Load when a contributor asks "how do I start", "what should I read", or is new to the project:
- [org-wide-skills/contributor-onboarding/SKILL.md](org-wide-skills/contributor-onboarding/SKILL.md) — Entry gate: reads local context, establishes policy, hands off to do-work.

###  Implementing a Feature or Bug Fix (Full Workflow)
Load when the contributor has an assigned issue and is ready to code:
- [.agent/workflows/do-work.md](.agent/workflows/do-work.md) — Canonical workflow: Explore → Code → Verify → PR.

###  Writing & Modifying Code (Reference Only)
Load individual files as needed during coding:
- [.agent/core/architecture.md](.agent/core/architecture.md) — Zero-dependency constraint and architectural boundaries.
- [.agent/core/code-mapping.md](.agent/core/code-mapping.md) — Directory layout (`src/`, `public/`, `landing-page/`).
- [.agent/core/examples.md](.agent/core/examples.md) — Approved code patterns vs anti-patterns.
- [org-wide-skills/project-template/SKILL.md](org-wide-skills/project-template/SKILL.md) — Shared architecture standards by stack.

###  Testing & Debugging
Load when running verification checks or fixing errors:
- [.agent/instructions/testing.md](.agent/instructions/testing.md) — ESLint, formatting, and visual browser verification steps.
- [.agent/core/edge-cases.md](.agent/core/edge-cases.md) — Historical agent mistakes and size-budget restrictions.
- [org-wide-skills/mcp-integration/SKILL.md](org-wide-skills/mcp-integration/SKILL.md) — Automated UI browser testing via MCP.

###  Pull Requests & Deployment
Load when opening a PR or preparing a release:
- [org-wide-skills/GIT-DIS-AIPolicy/SKILL.md](org-wide-skills/GIT-DIS-AIPolicy/SKILL.md) — Mandatory AI disclosure, PR formatting, issue assignment rules.
- [.agent/info/operational-data.md](.agent/info/operational-data.md) — Maintainer contacts (@kpj2006), Discord channels, and message templates.
- [.agent/instructions/deployment.md](.agent/instructions/deployment.md) — CDN release checklist and npm publishing steps.

---

- **Completion Criterion:** Confirm compliance with the files loaded for the active task before completing work.
