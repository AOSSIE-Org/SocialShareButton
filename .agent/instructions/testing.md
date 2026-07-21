# Testing Strategy & Commands

> **Agent Instruction:** Every new feature or bug fix MUST include validation tests. Follow the testing patterns below. Do NOT skip verification steps.
>
> **Bold terms** are defined in [GLOSSARY.md](../../org-wide-skills/GLOSSARY.md); look them up there for the full meaning.

## Test Commands

Since the project uses manual validation and code quality enforcement:

| Command                | Purpose                  |
| ---------------------- | ------------------------ |
| `npm run lint`         | Check syntax and quality |
| `npm run format:check` | Check code styling       |

## Verification Standards

For every PR or change, you MUST perform **manual verification**:

1. Open the local `index.html` inside a browser.
2. Click every social platform button (WhatsApp, Facebook, Twitter, etc.) and check if the share dialog opens with the correct URL, title, and hashtags.
3. Verify that the "Copy Link" button works and updates the clipboard.
4. Open browser DevTools (F12) and confirm that NO errors or warnings are thrown during initialization, button clicks, or modal closing.
5. Check mobile layouts (using responsive mode) to ensure the buttons wrap correctly and the modal adapts.

- **Completion Criterion:** ESLint and Prettier checks are fully passed, and all social sharing interactions have been visually and behaviorally verified in the browser.
