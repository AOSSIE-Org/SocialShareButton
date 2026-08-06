# CI/CD Workflows & Log Diagnosis

This instruction file guides AI agents on how to inspect, diagnose, and resolve failures across all GitHub Actions workflows defined in `.github/workflows/`.

## Workflow Directory Map

The repository uses the following GitHub Actions workflows:

| Workflow File | Purpose | Triggers | Primary Fix / Troubleshooting Command |
| :--- | :--- | :--- | :--- |
| `lint.yml` | Code quality, Prettier styling, and size budget checks | Pull Requests & Pushes | `npm run lint:fix` / `npm run format` / check 10KB size limit |
| `nextjs.yml` | Landing page website build & validation | Changes in `landing-page/` | Run build check inside `landing-page/` |
| `version-release.yml` | Automated version tagging & GitHub releases | Push `VERSION` changes to `main` | Maintainers only; verify semver format in `VERSION` |
| `dependency-review-action.yml` | Security vulnerability & license check on PRs | Pull Requests | Audit dependencies in `package.json` |
| `sync-org-skills.yml` | Automated selective sync of org-wide skills | Pushes touching `org-wide-skills/` | Run `python scripts/sync_org_skills.py` locally |
| `label-merge-conflicts.yml` | Automatically labels PRs that have merge conflicts | PR updates | Rebase branch against `main` to resolve conflicts |
| `sync-pr-labels.yml` | Manages PR & Issue label state machine | PR/Issue events | Check GitHub workflow permissions |
| `stale.yml` | Manages stale issues and pull requests | Scheduled (Daily) | Administrative automated cleanup |
| `template-sync.yml` | Syncs upstream template changes | Scheduled / Dispatch | Administrative template sync |

---

## CI Diagnosis & Log Inspection Protocol

When requested to debug a failing CI workflow (via PR link, PR number, or pasted logs):

### 1. Log Retrieval

- **If a PR link or PR number is provided**:
  Use `gh` CLI behind the scenes to inspect checks and retrieve the failed logs:
  ```bash
  # Check PR status & find failing run ID
  gh pr checks <pr-number-or-link>

  # Fetch failed logs for the workflow run
  gh run view <run-id> --log-failed
  ```

- **If log output is pasted directly**:
  Match the error traceback to the workflow table above to identify the failing job and step.

---

## 2. Common Failure Resolution Procedures

### Failure in `lint.yml`
1. **ESLint Errors**: Run `npm run lint:fix` locally and re-run `npm run lint`.
2. **Prettier Formatting Mismatch**: Run `npm run format` locally.
3. **Size Budget Exceeded**: `src/social-share-button.js` exceeded 10KB. Optimize/minified code additions.

### Failure in `label-merge-conflicts.yml`
1. The branch has merge conflicts with `main`.
2. Rebase the feature branch against `main` (`git fetch origin main; git rebase origin/main`) and resolve conflicts.

### Failure in `nextjs.yml`
1. Inspect changes inside `landing-page/`.
2. Ensure all Next.js dependencies build cleanly locally.

---

## 3. Pre-Push Local Verification

Before instructing the contributor or maintainer to push a fix:

```bash
# Core library verification
npm run lint
npm run format:check
npm run test
npm run check-size
```
