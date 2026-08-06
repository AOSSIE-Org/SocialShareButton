# Rules for PR & Issue Formatting

This reference defines the strict formatting rules, issue categories, and title rules that AI agents must enforce when drafting Pull Requests or Issue reports.

---

## 1. Issue Categorization Rules

When drafting or classifying an Issue, the agent MUST determine the exact issue category:

| Category | Title Prefix | Applicable Template in `.github/ISSUE_TEMPLATE/` | Description |
| :--- | :--- | :--- | :--- |
| **Bug Report** | `Bug: <symptom>` | `bug_report.yml` / `bug_report.md` | Unexpected errors, crashes, broken UI, or incorrect behavior. |
| **Feature Request** | `Feature: <capability>` | `feature_request.yml` / `feature_request.md` | New capabilities, new platform support, or UI enhancements. |
| **Documentation / Chore** | `Docs: <summary>` | Default issue form | Maintenance, documentation updates, or config changes. |
| **Good First Issue** | `<Category>: <summary>` | Any template + `good-first-issue` label | Beginner-friendly tasks with clear, scoped requirements. |

---

## 2. Title Formatting Rules

Agents MUST generate conventional, rule-based titles reflecting the exact context of the work done:

### Pull Request Title Rules (`<prefix>: <summary>`)
- **Bug fixes**: Must start with `fix:` (e.g., `fix: resolve React wrapper double instantiation`)
- **New features**: Must start with `feat:` (e.g., `feat: add Telegram share button component`)
- **Documentation changes**: Must start with `docs:` (e.g., `docs: update setup prerequisites in README`)
- **Code refactoring**: Must start with `refactor:` (e.g., `refactor: streamline agent intent routing`)
- **Maintenance / Chore**: Must start with `chore:` (e.g., `chore: update size-limit dev dependency`)

### Issue Title Rules (`<Category>: <summary>`)
- **Bug reports**: `Bug: <concise symptom description>`
- **Feature requests**: `Feature: <concise capability description>`
- **Docs updates**: `Docs: <concise documentation goal>`

---

## 3. Pull Request Population Rules

When drafting a Pull Request for work performed:

1. **Title**: Apply the PR Title Rules above based on the commit/code diff context.
2. **Read Template**: Inspect `.github/PULL_REQUEST_TEMPLATE.md` in the active repository.
3. **Populate Sections**:
   - **Addressed Issues**: Link the verified assigned issue (`Fixes #<issue_number>`).
   - **What Changed**: Detail the exact files modified and technical rationale.
   - **Screenshots / Recordings**: Prompt the contributor to attach visual browser verification proof.
   - **Checklist**: Mark completed verification items (`- [x]`).
4. **Mandatory AI Disclosure Block**: Append the official disclosure at the bottom of the PR description:
   ```markdown
   ## ⚠️ AI Notice - Important!
   > *This contribution was assisted by an AI agent and manually verified by the contributor.*
   > **Tools Used**: [e.g., Antigravity IDE / Claude Code] | **Scope**: [e.g., bug fix, refactoring, tests]
   ```

---

## 4. Issue Report Population Rules

When drafting an Issue requested by a user:

1. **Category Check**: Determine the issue category (Bug Report, Feature Request, Docs) from Section 1.
2. **Title**: Apply the Issue Title Rules above.
3. **Read Template**: Inspect `.github/ISSUE_TEMPLATE/` for matching template fields in the active repository.
4. **Populate Fields**:
   - **Description**: Clear explanation of the bug or requested feature.
   - **Steps to Reproduce**: Sequential steps to reproduce the bug.
   - **Logs & Screenshots**: Include console error logs or screenshot placeholders.
   - **Environment Details**: Specify OS, Browser version, and Node.js version.
5. **Governance Constraint**: Never auto-generate issues from unguided codebase scans without user reproduction (violates AI Policy).
