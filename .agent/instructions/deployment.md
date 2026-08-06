# Version Release Instructions (Maintainers Only)

> **Access Note:** Not for external contributors. Version releasing, tag creation, and npm publishing are strictly restricted to repository maintainers with write/admin access.

## Environments & Release Artifacts

| Environment    | Delivery Mechanism                                      | Source Directory | Access / Trigger                                      |
| -------------- | ------------------------------------------------------- | ---------------- | ----------------------------------------------------- |
| CDN Staging    | jsDelivr raw branch                                     | `src/`           | Automatic via `main` branch                           |
| Production CDN | jsDelivr release tag (e.g., `@v1.0.4`)                  | `src/`           | Triggered by Git release tag `vX.Y.Z`                 |
| npm Registry   | `@aossie-org/social-share-button`                       | `src/`           | Manual `npm publish` by maintainer                    |
| Release Action | `.github/workflows/version-release.yml`                 | Root             | Pushing `VERSION` file changes to `main` (Maintainers)|

## Maintainer Version Release Checklist

Follow these steps when preparing and releasing a new version:

1. **Pre-Release Quality Verification**:
   ```bash
   npm run lint
   npm run format:check
   npm run test
   npm run check-size
   ```
2. **Version Bumping**:
   - Update `"version"` in `package.json` (e.g., `"1.0.5"`).
   - Update the semver version string in the `VERSION` file (e.g., `1.0.5`).
3. **Trigger Automated Release Workflow**:
   - Push commit updating `VERSION` to `main`.
   - The automated GitHub Action `.github/workflows/version-release.yml` verifies maintainer permissions, creates tag `v1.0.5`, and publishes the GitHub release.

## Publishing to npm

Publishing to the npm registry (`@aossie-org/social-share-button`) is performed by maintainers:

```bash
# 1. Verify files included in package (specified in package.json "files")
npm pack --dry-run

# 2. Publish package to npm registry (requires maintainer credentials)
npm publish --access public
```
