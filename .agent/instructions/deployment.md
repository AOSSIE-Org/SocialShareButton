# Deployment & CI/CD

> **Agent Instruction:** Do NOT guess deployment steps. Use ONLY what is documented here. If deployment info is missing, tell the contributor to consult maintainers.

## Environments

| Environment    | Delivery Mechanism                        | Source Directory |
| -------------- | ----------------------------------------- | ---------------- |
| Development    | Local `index.html` file                   | `/`              |
| CDN Staging    | jsDelivr raw branch                       | `src/`           |
| Production CDN | jsDelivr release tag                      | `src/`           |
| npm Package    | npm registry (social-share-button-aossie) | `src/`           |

## Release Checklist

Before releasing a new version:

- [ ] All ESLint checks pass (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Version bump in `package.json`
- [ ] Version bump in `VERSION` file
- [ ] Update CDN links in `README.md` to match the new version tag (e.g. `@v1.0.4`)
- [ ] Merge to `main` and push the Git tag (e.g. `v1.0.4`)

## Publishing to npm

Only project administrators publish packages to the npm registry:

```bash
# Verify contents to pack
npm pack --dry-run

# Publish version (requires credentials)
npm publish
```
