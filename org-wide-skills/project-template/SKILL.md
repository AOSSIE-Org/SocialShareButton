---
name: aossie-project-template
description: Reference for org-level architecture standards (Next.js, React, Microservices, Web3, REST APIs). Use when proposing or implementing new features, files, or structural code changes.
---

A skill acting as the **architectural boundary** stabilizer across all AOSSIE repositories. It enforces standards to keep implementations consistent.

**Bold terms** are defined in [GLOSSARY.md](../GLOSSARY.md); look them up there for the full meaning.

## 1. Stack Identification

**Trigger:** The user asks to design, write, or refactor code.

**Steps:**
1. Check the local `package.json` or project structure to identify the technology stack.
2. Select the specific **context pointer** matching the stack (do NOT load multiple references to save **context load**).

* **Completion Criterion:** The agent has identified the tech stack and selected the correct reference file.

## 2. Rule Extraction

**Trigger:** A tech stack is identified.

**Steps:**
1. Load the corresponding reference file:
   - Next.js/React: Load [nextjs-standards.md](references/nextjs-standards.md)
   - Microservices: Load [microservice-standards.md](references/microservice-standards.md)
   - Web3/Solidity: Load [web3-standards.md](references/web3-standards.md)
   - REST API: Load [rest-standards.md](references/rest-standards.md)
2. Extract the rules and align them with the proposed changes.

* **Completion Criterion:** The agent has loaded only the matching reference file.

## 3. Architecture Deviation Guard

**Trigger:** The user proposes an architecture that differs from standard rules (e.g., GraphQL instead of REST, vanilla CSS instead of Tailwind if Tailwind is specified).

**Steps:**
1. Halt the code generation.
2. Output a warning: *"This pattern deviates from the AOSSIE Org-Level Standards. Please consult the maintainers in the `#development` Discord channel before proceeding."*

* **Completion Criterion:** The agent has flagged any deviation and blocked the unapproved pattern.
