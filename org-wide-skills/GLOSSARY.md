# AOSSIE Skills Glossary

This glossary defines core terminology used across AOSSIE project agent instructions and shared skills. Bolded terms in any skill file reference these definitions.

---

### Core Skill Concepts

#### Context Load
The token memory cost of carrying descriptions or code in the LLM's active prompt. Bloated skills increase context load, reducing execution speed and accuracy.

#### Cognitive Load
The mental effort required by a human user to manually recall and trigger specific skills.

#### Router Skill
A user-invoked skill that acts as a single point of entry to delegate to other skills, resolving high cognitive load.

#### Model-Invoked Skill
A skill automatically triggered by the LLM based on keywords and description triggers. It contributes directly to **context load**.

#### User-Invoked Skill
A skill explicitly run by the user. It sets `disable-model-invocation: true`, avoiding automatic triggers and keeping **context load** at zero.

#### Completion Criterion
An exhaustive, checkable condition that must be met before a step or skill is considered finished. It prevents **premature completion**.

#### Legwork
The active exploration, file-reading, and codebase analysis that an agent must do before proposing edits or writing descriptions.

#### Context Pointer
A reference link in a skill (e.g., pointing to `references/nextjs-standards.md`) that directs the agent to load a specific external file when needed, rather than bloating `SKILL.md`.

---

### AOSSIE Repository Standards

#### AI Policy
Rules governing AI usage in AOSSIE repositories. It forbids unguided automatic bug-scanning (issue generation) and mandates AI disclosure in PR descriptions.

#### Architectural Boundary
Strict separation lines between project modules (e.g., API routes and database models, or React wrappers and vanilla core logic).

#### Zero-Dependency Core
A design constraint ensuring the core library has no external third-party dependencies, keeping the bundled/gzipped size under **10KB**.
