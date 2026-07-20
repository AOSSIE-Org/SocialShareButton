# PR & Issue Formatting Standards

## PR Description Format

Every PR MUST follow this structure:

```markdown
### Addressed Issues
Fixes #[issue_number]

### What Changed
Brief description of what this PR does and why.

### How to Test
1. Step 1
2. Step 2
3. Expected result

### Screenshots/Recordings
[Attach screenshots or video proof of the change]

### Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated (if applicable)
- [ ] Self-review completed
- [ ] Discord notification sent in #development

### AI Assistance Disclosure
> *This contribution was assisted by an AI agent and manually verified by the contributor.*
> Tool: [tool name] | Scope: [what AI helped with]
```

## Issue Description Format

Every Issue MUST include:

```markdown
### Description
Clear description of the bug or feature.

### Steps to Reproduce (for bugs)
1. Go to '...'
2. Click on '...'
3. See error

### Expected Behavior
What should happen.

### Actual Behavior
What actually happens.

### Screenshots
[Attach evidence]

### Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.x]
```

## Good vs Bad Examples

### ✅ Good PR Title
```
feat: add user authentication with JWT tokens
fix: resolve navigation crash on mobile devices
```

### ❌ Bad PR Title
```
Update files
Fixed stuff
Changes
```

### ✅ Good Issue Title
```
Bug: Login page crashes when email field is empty
Feature: Add dark mode toggle to settings page
```

### ❌ Bad Issue Title
```
It doesn't work
Bug found
Please fix
```
