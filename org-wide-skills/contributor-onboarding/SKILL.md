---
name: aossie-contributor-onboarding
description: Org-level entry gate for all AOSSIE contributors. Use when a contributor asks "how do I start", "what should I read", or begins any contribution-related conversation.
---

A skill serving as the org-wide entry gate for all contributors to AOSSIE repositories.

**Bold terms** are defined in [GLOSSARY.md](../GLOSSARY.md); look them up there for the full meaning.

## 1. Read Local Project Context

**Trigger:** The contributor starts a new session or asks how to begin contributing.

**Steps:**
1. Read the local project context files in this order:
   - [`.agent/core/architecture.md`](.agent/core/architecture.md) — what the project does and its boundaries.
   - [`.agent/core/edge-cases.md`](.agent/core/edge-cases.md) — past agent mistakes to avoid.
   - [`.agent/instructions/setup.md`](.agent/instructions/setup.md) — local setup commands.
2. Confirm understanding of the project's **architectural boundaries** before suggesting any code.

- **Completion Criterion:** All three files loaded. Agent can describe the project architecture and core constraints.

## 2. Establish Policy

**Trigger:** Project context is loaded.

**Steps:**
1. Inform the contributor that all work is governed by the AOSSIE Contributor Skills Framework.
2. Read [GIT-DIS-AIPolicy/SKILL.md](../GIT-DIS-AIPolicy/SKILL.md) and outline its core rules:
   - Blind issue generation is forbidden.
   - AI usage must be disclosed in all pull requests.
   - All changes must stay within the **architectural boundaries** documented in `.agent/core/architecture.md`.
   - Primary communication is on Discord `#development`.

- **Completion Criterion:** Policy rules communicated and contributor has confirmed understanding.

## 3. Project Setup Check

**Trigger:** Policy rules established.

**Steps:**
1. Ask the contributor if they have successfully built and run the project locally.
2. If NOT: Follow the setup commands in [`.agent/instructions/setup.md`](.agent/instructions/setup.md). If stuck, direct them to Discord `#help`.
3. If YES: Ask the contributor for their assigned GitHub issue number.

- **Completion Criterion:** Local dev environment is confirmed working and contributor has an assigned issue.

## 4. Hand Off to Do-Work Workflow

**Trigger:** Local environment confirmed, issue assigned.

**Steps:**
1. Load [`.agent/workflows/do-work.md`](.agent/workflows/do-work.md) and follow it from Phase 1.

- **Completion Criterion:** Agent is actively running the do-work workflow.
