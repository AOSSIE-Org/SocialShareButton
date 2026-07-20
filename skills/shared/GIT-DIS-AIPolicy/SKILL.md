---
name: aossie-ai-policy
description: Governance and behavior constraints for contributor-side AI agents interacting with AOSSIE repositories. Use when the user requests issue creation, PR descriptions, or Discord communication.
---

A skill enforcing the **AI Policy** for contributors working on AOSSIE projects. It defines strict behavioral gates to control **context load** and prevent low-quality contributions.

**Bold terms** are defined in [GLOSSARY.md](../GLOSSARY.md); look them up there for the full meaning.

## 1. Issue Generation Check

**Trigger:** The user asks to "scan codebase for bugs", "find issues to fix", or "create bugs".

**Steps:**
1. Refuse the request to scan or automatically generate issues from scratch.
2. Inform the user that unguided issue generation violates the **AI Policy**.
3. Instruct the user to manually verify any bug or feature idea first, providing reproduction steps.

* **Completion Criterion:** The agent has blocked automatic generation and outputted a refusal message pointing to [ai-policy-rules.md](references/ai-policy-rules.md).

## 2. Issue Assignment Verification

**Trigger:** The user begins drafting a PR or starting work.

**Steps:**
1. Check the project's GitHub issues board to verify if the issue is officially assigned to the user.
2. If the issue is unassigned or assigned to someone else, warn the user.

* **Completion Criterion:** The agent has verified issue assignment status before allowing work to continue.

## 3. PR/Issue Formatting and AI Disclosure

**Trigger:** The user requests a PR description or issue report draft.

**Steps:**
1. Draft the description utilizing the repository's `.github/PULL_REQUEST_TEMPLATE.md` or default structure.
2. Inject the mandatory **AI Policy** disclosure block outlining tools used, scope of assistance, and verification statement.
3. Add a checkable reminder to attach screenshots or video proof of correctness.

* **Completion Criterion:** The draft description includes the exact Markdown block from [pr-issue-formatting.md](references/pr-issue-formatting.md).

## 4. Post-Creation Communication

**Trigger:** The user completes an issue or PR creation.

**Steps:**
1. Load [communication-templates.md](references/communication-templates.md).
2. Generate the Discord update message matching the repository templates.
3. Instruct the user to post this message in the `#development` channel.

* **Completion Criterion:** A copy-pasteable Discord template is printed with exact channel routing instructions.

## 5. Architectural Alignment Check

**Trigger:** Before implementing any code changes.

**Steps:**
1. Locate and read the local project `.agent/core/architecture.md` and `.agent/core/edge-cases.md`.
2. Compare the proposed changes against documented **architectural boundaries**.
3. Flag any deviation (e.g., adding unauthorized dependencies or changing layers) and warn the user to discuss on Discord.

* **Completion Criterion:** The agent has verified all planned edits against local project architecture and documented results.
