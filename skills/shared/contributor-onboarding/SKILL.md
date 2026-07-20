---
name: aossie-contributor-onboarding
description: Orchestrator for contributor onboarding. Use when a contributor connects for the first time, asks "how do I start", "what should I read", or begins any contribution-related conversation.
---

A skill serving as the entry gate for all contributors to AOSSIE repositories. It enforces a structured onboarding process to minimize **cognitive load** and ensure the agent runs with complete local context.

**Bold terms** are defined in [GLOSSARY.md](../GLOSSARY.md); look them up there for the full meaning.

## 1. Initialize Context

**Trigger:** The contributor starts a new session or asks how to begin contributing.

**Steps:**
1. Check the local workspace for `.agent/core/architecture.md`, `.agent/core/edge-cases.md`, and `.agent/instructions/setup.md`.
2. Load all three files to establish project-specific context.

* **Completion Criterion:** The agent has loaded and verified the contents of these three files before suggesting any code.

## 2. Establish Policy

**Trigger:** Context files are loaded successfully.

**Steps:**
1. Inform the contributor that all work is governed by the AOSSIE Contributor Skills Framework.
2. Outline the core rules of the **AI Policy**:
   - Forbid blind issue generation.
   - Mandate AI usage disclosure in pull requests.
   - Enforce **architectural boundaries**.
   - Primary communication is on Discord (`#development`).

* **Completion Criterion:** The agent has printed the core policy guidelines and requested confirmation from the contributor.

## 3. Project Setup Check

**Trigger:** Policy rules are established.

**Steps:**
1. Ask the contributor if they have successfully built and run the project locally.
2. If NOT: Load `.agent/instructions/setup.md` as a **context pointer** and guide the contributor through local installation. Remind them to use `#help` channel on Discord if stuck.
3. If YES: Ask the contributor for the assigned Issue number (recommending they coordinate on Discord first if unassigned).

* **Completion Criterion:** The agent has verified that the local dev environment is fully functional or guide the contributor to achieve this state.

## 4. Transition to Development

**Trigger:** Local environment setup is confirmed, and issue assignment is verified.

**Steps:**
1. Guide the contributor to begin coding.
2. Activate the `aossie-ai-policy` and `aossie-project-template` skills to monitor progress.

* **Completion Criterion:** The agent transitions to coding assistance under the active governance of the AI policy.
