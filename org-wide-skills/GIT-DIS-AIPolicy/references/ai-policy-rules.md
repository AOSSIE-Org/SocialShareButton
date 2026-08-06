# AI Policy Rules — Detailed Reference

## Why This Policy Exists

Contributors increasingly use AI tools (Cursor, Claude, Copilot, ChatGPT) to generate code, issues, and PR descriptions. Without governance, this leads to:

- **Issue spam** — AI generates low-quality, duplicate, or non-existent bugs
- **Architectural drift** — AI invents patterns that conflict with project structure
- **Wasted reviewer time** — Maintainers must filter noise from signal
- **Security risks** — AI-generated code may introduce vulnerabilities

## Rules

### Rule 1: No Blind Issue Generation

AI-generated issues MUST be manually verified by the contributor before submission.

**What counts as verification:**
- ✅ Reproducing the bug locally
- ✅ Checking if the issue already exists
- ✅ Providing clear reproduction steps
- ✅ Including screenshots or logs

**What does NOT count:**
- ❌ "AI found this problem" without manual confirmation
- ❌ Batch-generating issues by scanning code
- ❌ Submitting style/lint suggestions as issues

### Rule 2: AI Disclosure is Mandatory

Every PR that used AI assistance MUST include this disclosure in the description:

```markdown
## AI Assistance Disclosure
- **Tool used:** [e.g., GitHub Copilot, Claude, Cursor]
- **Scope:** [e.g., "Generated initial test structure", "Autocomplete for boilerplate"]
- **Verification:** I have reviewed and verified all AI-generated code.
```

### Rule 3: Contributors Own Their Submissions

Even if AI generated the code, the contributor is responsible for:
- Correctness
- Test coverage
- Documentation updates
- Architectural compliance

"AI wrote it" is NOT an excuse for broken code.

### Rule 4: No AI-Generated Architectural Decisions

AI agents must NOT:
- Add new frameworks without maintainer approval
- Change state management patterns (e.g., adding Redux when Context API is used)
- Create new directory structures
- Modify database schemas without running migrations
- Introduce new API patterns that deviate from existing standards

Always consult `.agent/core/architecture.md` first.
