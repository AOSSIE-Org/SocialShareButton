# Do Work — Contributor Workflow

> **Agent Instruction:** This is the canonical workflow for implementing any feature or bug fix in SocialShareButton. Follow each phase in order. Do NOT skip phases. Do NOT move to the next phase while the current one has unresolved issues.

## Phase 1: Explore

Read these files to establish context before touching any code:

1. **Project layout** — [core/code-mapping.md](../core/code-mapping.md)
2. **Boundaries & constraints** — [core/architecture.md](../core/architecture.md)
3. **Past agent mistakes** — [core/edge-cases.md](../core/edge-cases.md)
4. **Approved patterns** — [core/examples.md](../core/examples.md)

**Exit condition:** You can describe what the change will touch, which files will be affected, and confirm no architectural boundary is violated.

---

## Phase 2: Code

- Write code following the patterns in [core/examples.md](../core/examples.md).
- Respect all boundaries listed in [core/architecture.md](../core/architecture.md).
- Do NOT add external npm dependencies to `src/`.
- Do NOT hardcode colors — use CSS variables.
- Always call `destroy()` on unmount for framework wrappers.

**Exit condition:** Implementation is complete and matches the approved patterns.

---

## Phase 3: Verify (Gated Feedback Loop)

Run each check. If it fails, fix the issue and re-run that check before proceeding. Do NOT skip to the next check with failures.

**Step 1 — Lint:**
```bash
npm run lint
```
Fix all lint errors. Re-run until clean.

**Step 2 — Format:**
```bash
npm run format:check
```
If it fails, run `npm run format` to auto-fix, then re-check.

**Step 3 — Visual verification in browser:**
1. Open `index.html` directly in your browser.
2. Click every social platform button (WhatsApp, Facebook, Twitter, LinkedIn, etc.).
3. Verify each share dialog opens with the correct URL, title, and hashtags.
4. Click "Copy Link" and confirm clipboard is updated.
5. Open DevTools (F12) — confirm zero errors or warnings.
6. Enable responsive mode — confirm buttons and modal layout adapt correctly to mobile.

See full verification standards in [instructions/testing.md](../instructions/testing.md).

**Exit condition:** Lint is clean, format passes, and all social sharing interactions are visually verified in the browser with zero console errors.

---

## Phase 4: Pull Request

1. Rebase your branch against upstream `main`.
2. Format the PR description following [org-wide-skills/GIT-DIS-AIPolicy/SKILL.md](../../org-wide-skills/GIT-DIS-AIPolicy/SKILL.md):
   - Include the mandatory AI disclosure block.
   - Link the related GitHub issue.
   - Attach screenshots of verified button interactions.
3. Get the correct Discord message template and maintainer tags from [info/operational-data.md](../info/operational-data.md).
4. Post the Discord update in the `#development` channel.

**Exit condition:** PR is open with AI disclosure, linked issue, and screenshots attached. Discord notification is sent.
