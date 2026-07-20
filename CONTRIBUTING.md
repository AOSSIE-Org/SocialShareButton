# Contributing to TODO: Project Name

⭐ First off, thank you for considering contributing to this project! ⭐

We welcome contributions from everyone. By participating in this project, you agree to abide by our Code of Conduct.

## � IMPORTANT: Discord Communication is Mandatory

**All project communication MUST happen on Discord. We do not pay attention to GitHub notifications.**

- Join our [Discord server](https://discord.gg/hjUhu33uAn) before starting any work
- Post your PR/issue updates in the relevant Discord channel (**MANDATORY**)
- All discussions, questions, and updates should be on Discord
- GitHub is for code only - Discord is for communication

**PRs without Discord updates will not be reviewed or may face delays.**

## �📋 Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
- [Coding with AI](#coding-with-ai)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Debugging Pre-commit Hooks](#debugging-pre-commit-hooks)
- [Community Guidelines](#community-guidelines)

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots/Video (if applicable)
- Environment details (OS, browser, versions, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature has already been suggested
- Provide a clear description of the feature
- Explain why this feature would be useful
- Include examples of how it would work
### Contributing Code

1. **Submit an Issue First**: For features, bugs, or enhancements, create an issue first
2. **Get Assigned**: Wait to be assigned before starting work(preferable)
3. **Submit Your PR**: Once assigned, create a PR addressing the issue
4. **Unrelated PRs**: Pull requests unrelated to issues may be closed or take longer to review

## 🤖 Coding with AI

We accept the use of AI-powered tools (GitHub Copilot, ChatGPT, Claude, Cursor, etc.) for contributions, whether for code, tests, or documentation.

⚠️ However, transparency is required: if you use AI assistance, please mention it in your PR description. This helps maintainers during code review and ensure the quality of contributions.

What we expect:
- **Disclose AI usage**: A simple note like "Used GitHub Copilot for autocompletion" or "Generated initial test structure with ChatGPT" is sufficient.
- **Specify the scope**: Indicate which parts of your contribution involved AI assistance.
- **Review AI-generated content**: Ensure you understand and have verified any AI-generated code before submitting.

## 🚀 Getting Started

### Prerequisites

TODO: List prerequisites specific to your project

### Setup

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button at the top right of this page
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/TODO.git
   cd TODO
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/AOSSIE-Org/TODO.git
   ```

4. **Install Dependencies**
   ```bash
   npm install
   # or yarn install
   # or pnpm install
   ```

5. **Run the Project**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always work on a new branch, never on `main` or `dev`:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the project's code style
- Add comments where necessary
- Update documentation if needed

### 3. Test Your Changes

TODO: Add project-specific testing instructions

```bash
npm test
# or
npm run lint
```

### 4. Commit Your Changes

Write clear, concise commit messages:

```bash
git add .
git commit -m "feat: add user authentication"
# or
git commit -m "fix: resolve navigation bug"
```

**Commit Message Format:**
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
# or upstream/dev depending on the project
```

### 6. Push Your Changes

```bash
git push origin feature/your-feature-name
```

## 📤 Pull Request Guidelines

### Before Submitting

- [ ] Your code follows the project's style guidelines
- [ ] You've tested your changes thoroughly
- [ ] You've updated relevant documentation
- [ ] Your commits are clean and well-organized
- [ ] You've rebased with the latest upstream changes
- [ ] You've thought from the reviewer's perspective and made your PR easy to review

### Submitting a Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template with:
   - Clear description of changes
   - Link to related issue(s)
   - Screenshots (if UI changes)
   - Testing steps

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Related Issue
Closes #issue_number


## Screenshots/Video (if applicable)
Add screenshots here

## Testing(if applicable)
Steps to test the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### After Submission

- Post your PR in the project's Discord channel for visibility(**IMPORTANT**)
- Respond to review comments promptly
- Make requested changes in new commits
- Be patient - maintainers will review when available
- Use `[WIP]` in your PR title for incomplete PRs. Don't use this as a way to gatekeep; focus on one change until it gets merged.

### Reviewing PRs

- Instead of opening duplicate PRs, help review and improve existing ones.
- When reviewing, assess whether the change is actually necessary before diving into implementation details and functionality testing.

## 📝 Code Style Guidelines

TODO: Add project-specific code style guidelines

### General Guidelines

- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Remove console.logs before committing
- Avoid code duplication
- Avoid unnecessary complexity and minor over-optimization

### JavaScript/TypeScript
- Use ES6+ syntax
- Prefer `const` over `let`, avoid `var`
- Use arrow functions where appropriate
- Follow ESLint rules

### Python
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions/classes

## 🔧 Debugging Pre-commit Hooks

Pre-commit hooks help maintain code quality by running automated checks before each commit. This section helps you troubleshoot common issues.

### Initial Setup

If pre-commit is configured in this project, install it first:

```bash
pip install pre-commit
pre-commit install
```

### Common Errors and Solutions

#### 1. **Pre-commit Hook Failed: Trailing Whitespace**

**Error:**
```text
Trim Trailing Whitespace.................................................Failed
- hook id: trailing-whitespace
- exit code: 1
- files were modified by this hook
```

**Solution:**
```bash
# Pre-commit automatically fixes this. Just re-stage and commit:
git add .
git commit -m "your message"
```

#### 2. **Pre-commit Hook Failed: End of File Fixer**

**Error:**
```text
Fix End of Files.........................................................Failed
- hook id: end-of-file-fixer
- exit code: 1
- files were modified by this hook
```

**Solution:**
```bash
# Files are automatically fixed. Re-add and commit:
git add .
git commit -m "your message"
```

#### 3. **Pre-commit Hook Failed: Check YAML/JSON/TOML**

**Error:**
```text
Check Yaml..........................................Failed
- hook id: check-yaml
- exit code: 1

File .github/workflows/test.yml: mapping values are not allowed here
```

**Solution:**
```bash
# Fix the syntax error in the file (check line number in error)
# Common issues:
# - Incorrect indentation
# - Missing colons
# - Invalid characters
# Then commit again
```

#### 4. **Pre-commit Hook Failed: Detect Secrets**

**Error:**
```text
detect-secrets...........................................................Failed
- hook id: detect-secrets
- exit code: 1

Potential secrets about to be added to git repo:

  Secret Type: AWS Access Key
  Location:    config/settings.py:42
```

**Solution:**
```bash
# Option 1: Remove the secret and use environment variables
# Replace hardcoded secrets with:
# API_KEY = os.getenv('API_KEY')

# Option 2: If it's a false positive, update baseline:
# detect-secrets scan > .secrets.baseline
# git add .secrets.baseline
```

#### 5. **Pre-commit Hook Failed: Mixed Line Endings**

**Error:**
```text
Mixed line ending........................................................Failed
- hook id: mixed-line-ending
- exit code: 1
- files were modified by this hook
```

**Solution:**
```bash
# Automatically fixed to LF. Re-add and commit:
git add .
git commit -m "your message"
```

#### 6. **Pre-commit Hook Failed: Large Files**

**Error:**
```text
Check for added large files..............................................Failed
- hook id: check-added-large-files
- exit code: 1

large.zip (5.2 MB) exceeds 500 KB
```

**Solution:**
```bash
# Option 1: Remove large files
git rm --cached large.zip

# Option 2: Use Git LFS for large files
git lfs install
git lfs track "*.zip"
git add .gitattributes

# Option 3: Increase limit (not recommended)
# Edit .pre-commit-config.yaml:
# args: ['--maxkb=10000']  # 10MB
```

#### 7. **Pre-commit Hook Failed: Merge Conflict Markers**

**Error:**
```text
Check for merge conflicts................................................Failed
- hook id: check-merge-conflict
- exit code: 1

Merge conflict markers found in:
  src/main.js:45
```

**Solution:**
```bash
# Open the file and remove conflict markers:
# <<<<<<< HEAD
# =======
# >>>>>>> branch-name

# Then commit again
```

#### 8. **Pre-commit Not Running**

**Problem:** Commits go through without pre-commit checks

**Solution:**
```bash
# Reinstall pre-commit hooks
pre-commit uninstall
pre-commit install

# Verify installation
pre-commit run --all-files
```

#### 9. **Pre-commit Takes Too Long**

**Problem:** Pre-commit is slow on every commit

**Solution:**
```bash
# Run only on changed files (default behavior)
git commit -m "message"

# Skip pre-commit for quick commits (use sparingly!)
git commit --no-verify -m "message"

# Update pre-commit hooks
pre-commit autoupdate
```

#### 10. **Hook Installation Failed**

**Error:**
```text
An error has occurred: InvalidManifestError:
=====> /path/to/.pre-commit-config.yaml does not exist
```

**Solution:**
```bash
# Ensure you're in the project root directory
cd /path/to/project/root

# Verify config file exists
ls -la .pre-commit-config.yaml

# Reinstall
pre-commit install
```

### Bypassing Pre-commit (Emergency Only)

**⚠️ Use only when absolutely necessary:**

```bash
# Skip pre-commit hooks for a single commit
git commit --no-verify -m "emergency fix"

# Or use the short flag
git commit -n -m "emergency fix"
```

**Note:** This should be rare. If you need to bypass frequently, discuss with maintainers.

### Running Pre-commit Manually

```bash
# Run all hooks on all files
pre-commit run --all-files

# Run a specific hook
pre-commit run trailing-whitespace --all-files

# Run on specific files
pre-commit run --files src/main.js src/utils.js
```

### Updating Pre-commit Hooks

```bash
# Update to latest versions
pre-commit autoupdate

# Clean and reinstall
pre-commit clean
pre-commit install
```

### Getting Help

If you encounter issues not covered here:

1. Check [pre-commit documentation](https://pre-commit.com/)
2. Review the error message carefully (it usually tells you what's wrong)
3. Ask in the project's Discord channel
4. Search for similar issues in the repository

**Remember:** Pre-commit hooks are there to help you maintain code quality. Don't fight them - fix the issues they find!

## 🌟 Community Guidelines

### Communication

- Be respectful and inclusive
- Provide constructive feedback
- Help others when you can
- Ask questions - no question is too small!

### Progress Updates

- If your work is taking longer than expected, comment on the discord with updates
- Issues should be completed within 5-30 days depending on complexity
- If you can no longer work on an issue, let maintainers know on discord

### Getting Help

- Check existing documentation first
- Search closed issues for similar problems
- Ask in Discord 
- Tag maintainers if your PR is unattended for 1-2 weeks on discord

## 🎯 Issue Assignment

- One contributor per issue (unless specified otherwise)
<!--
- Wait for assignment before starting work
- Issues will be reassigned if inactive for extended periods
-->
- If there are no active PRs for an issue for 2+ days, mention your intent under the issue and begin
- Avoid working on issues which are assigned to someone, even if they are inactive
- Check for existing PRs before starting to avoid duplication, as there might PRs that didn't mention the related issue


Thank you for contributing to TODO! Your efforts help make this project better for everyone. 🚀
