---
name: aossie-mcp-integration
description: Guides developer agents on how to leverage and initialize Model Context Protocol (MCP) servers (GitHub & Puppeteer) to automate code changes, UI/UX testing, and PR management in AOSSIE projects.
---

# MCP Integration & Configuration

A skill outlining the protocol and triggers for contributor-side AI agents to discover, initialize, and use Model Context Protocol (MCP) servers to automate tasks.

**Bold terms** are defined in [GLOSSARY.md](../GLOSSARY.md); look them up there for the full meaning.

## 1. Discovering Available MCP Servers

**Trigger:** The agent begins execution on any task in an AOSSIE repository.

**Steps:**
1. Check the local workspace environment (or client configuration file like `.agent/core/architecture.md`) to see if any MCP servers are requested/expected.
2. Check the active agent platform's available tools to see if MCP tools (e.g., `github_`, `puppeteer_`, or custom MCP tools) are loaded.
3. If expected MCP servers are missing, output a brief note asking the user to configure them.

* **Completion Criterion:** The agent has printed a summary of active/inactive MCP capabilities at the start of the task execution.

## 2. Using GitHub MCP for PR & Issue Automation

**Trigger:** The agent needs to retrieve issue details, submit a PR, or review a PR.

**Steps:**
1. Retrieve the issue details from GitHub using `github_get_issue` (or equivalent tool) to verify requirements.
2. Once development is complete, use the GitHub MCP tools to create a pull request or add comments detailing changes.
3. Apply the mandatory AOSSIE AI disclosure template to the PR description (as defined in `aossie-ai-policy`).

* **Completion Criterion:** The agent has successfully fetched or created GitHub resources using the GitHub MCP tools.

## 3. Using Puppeteer MCP for Visual UI Verification

**Trigger:** Modifying UI components or web layouts in any repository.

**Steps:**
1. Check the local project instructions (e.g., `.agent/instructions/testing.md` or local skills) for the dev server commands (e.g., `npm run dev` or serving static `index.html`).
2. Run the dev server or serve the local files.
3. Launch the Puppeteer/Browser MCP client and navigate to the local dev URL.
4. Interact with the elements, click target controls, check console logs for errors, and take screenshots.
5. Save the screenshots to the artifacts folder and include them in the `walkthrough.md`.

* **Completion Criterion:** The agent has verified visual correctness using the browser tool and attached screenshots as proof.

