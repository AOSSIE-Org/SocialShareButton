# AOSSIE Best Practices Checklist

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.
>
> **Project:** Social Share Button (library + website) · **[Discord Channel](https://discord.com/channels/1022871757289422898/1479012884209078365)**
>
> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard.
> Scorecard already handles: License, SAST tools, CI tests, Security Policy file, Branch Protection,
> Pinned Dependencies, Signed Releases, Maintained status, and Known Vulnerabilities.
>
> **Legend:** `[x]` met · `[-]` not applicable · `[ ]` not met · 🔴 MUST · 🟡 SHOULD · 🔵 SUGGESTED

---

## Score Summary

| Category           | Met | N/A | Total (Applicable) | Status |
|--------------------|-----|-----|--------------------|--------|
| Basics             | 8   | 0   | 8                  | 🟢     |
| Change Control     | 5   | 1   | 5 (6)              | 🟢     |
| Reporting          | 7   | 1   | 7 (8)              | 🟢     |
| Quality            | 11  | 0   | 11                 | 🟢     |
| Security           | 3   | 6   | 3 (9)              | 🟢     |
| Analysis           | 5   | 2   | 5 (7)              | 🟢     |
| **Total**          | **39** | **10** | **39 (49)**    | **100.0%** |

*N/A items are excluded from the denominator.*

---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** — The project README/website clearly describes what the software does and what problem it solves.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton#readme

- [x] 🔴 **interact** — The project provides information on how to obtain the software, submit bug reports, and contribute.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md

- [x] 🔴 **contribution** — `CONTRIBUTING.md` explains the contribution process (e.g., PRs are used, how to open one).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md

- [x] 🟡 **contribution_requirements** — `CONTRIBUTING.md` references acceptable contribution standards (coding style, tests required, etc.).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md#-code-style--architecture

- [x] 🔴 **documentation_basics** — Basic documentation exists for the software (README, Wiki, or docs folder).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton#readme

- [x] 🔴 **documentation_interface** — Reference documentation describes the external interface (API inputs/outputs, CLI flags, config schema, etc.).
  - *Note:* Every library option, event and framework wrapper is documented in the README Configuration and Advanced Usage sections; the website configuration is documented in [README](https://github.com/AOSSIE-Org/SocialShareButton#readme) and [AGENTS.md](https://github.com/AOSSIE-Org/SocialShareButton/blob/main/AGENTS.md).

### Other Basics

- [x] 🔴 **discussion** — Project has a searchable, URL-addressable discussion mechanism (GitHub Issues, Discord with archive, mailing list, etc.) that doesn't require proprietary client software.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/issues and https://discord.com/channels/1022871757289422898/1479012884209078365

- [x] 🟡 **english** — Documentation is provided in English and English bug reports/comments are accepted.
  - *Note:* All documentation is in English; the site itself is localized with next-intl.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** — Project uses a distributed VCS (e.g., git). *(SUGGESTED)*
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton

### Version Numbering

- [x] 🔴 **version_unique** — Each release has a unique version identifier (e.g., v1.0.0).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/VERSION (the version-release workflow refuses to reuse an existing tag)

- [x] 🔵 **version_semver** — Project uses [SemVer](https://semver.org) or [CalVer](https://calver.org/) format. *(SUGGESTED)*
  - *Note:* `VERSION` is validated as `MAJOR.MINOR.PATCH` by `.github/workflows/version-release.yml`.

- [x] 🔵 **version_tags** — Releases are tagged in the VCS (e.g., `git tag v1.0.0`). *(SUGGESTED)*
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/workflows/version-release.yml

### Release Notes

- [x] 🔴 **release_notes** — Each release includes human-readable release notes summarizing major changes.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/releases (draft notes published by `.github/workflows/version-release.yml`)

- [-] 🔴 **release_notes_vulns** — Release notes identify every publicly known vulnerability (with CVE) fixed in that release.
  - *Note:* `[~]` N/A: no publicly known vulnerabilities have been reported or fixed.

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** — A bug-reporting process exists (e.g., GitHub Issues link in README).
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/issues/new/choose

- [x] 🟡 **report_tracker** — An issue tracker (e.g., GitHub Issues) is used to track individual bugs.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/issues

- [x] 🔴 **report_responses** — A majority of bug reports submitted in the last 2–12 months have been acknowledged.
  - *Self-certification note:* Maintainers triage issues on GitHub and in the project Discord channel.

- [x] 🟡 **enhancement_responses** — More than 50% of enhancement requests in the last 2–12 months have received a response.
  - *Self-certification note:* Feature requests are discussed and answered in the project Discord channel and on GitHub.

- [x] 🔴 **report_archive** — Reports and responses are publicly archived and searchable.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/issues?q=is%3Aissue

### Vulnerability Reporting

- [x] 🔴 **vulnerability_report_process** — A vulnerability reporting process is documented.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/SECURITY.md

- [x] 🟡 **vulnerability_report_private** — If private vulnerability reporting is supported, the method for private submission is documented.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/SECURITY.md#reporting-a-vulnerability (GitHub private advisories or email)

- [-] 🔴 **vulnerability_report_response** — Initial response to any vulnerability report received in the last 6 months was within 14 days.
  - *Note:* `[~]` N/A: no vulnerability reports received in the last 6 months. SECURITY.md commits to acknowledging within 7 days.

---

## ✅ Quality

### Build System

- [x] 🔴 **build** — If the project requires building, a working build system exists that can auto-rebuild from source.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/workflows/ci.yml

- [x] 🔵 **build_common_tools** — Common build tools are used (npm, Next.js). *(SUGGESTED)*
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/package.json

- [x] 🟡 **build_floss_tools** — The project can be built using only FLOSS tools.
  - *Note:* Node.js, pnpm/npm, Vitest, Next.js, Tailwind CSS: all FLOSS.

### Automated Testing

- [x] 🔵 **test_invocation** — The test suite can be invoked in a standard way. *(SUGGESTED)*
  - *Evidence URL:* `npm test` / `npm run test:coverage` at the repo root (https://github.com/AOSSIE-Org/SocialShareButton/blob/main/package.json)

- [x] 🔵 **test_most** — The test suite covers most code branches and functionality. *(SUGGESTED)*
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/vitest.config.js (90% thresholds on the published library files, enforced in CI and before every npm release)

### New Functionality Testing Policy

- [x] 🔴 **test_policy** — The project has a general policy that new functionality must include tests in the automated test suite.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md#-pull-request-guidelines

- [x] 🔴 **tests_are_added** — Evidence exists that the test policy has been followed in recent major changes.
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/tree/main/tests

- [x] 🔵 **tests_documented_added** — The test policy is documented in contribution instructions. *(SUGGESTED)*
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md#-pull-request-guidelines

### Linting / Warning Flags

- [x] 🔴 **warnings** — At least one linter or compiler warning flag is enabled.
  - *Tool used:* ESLint 9 with `eslint-config-next` (core-web-vitals + TypeScript), TypeScript `strict` mode.

- [x] 🔴 **warnings_fixed** — Warnings from the linter are addressed.
  - *Note:* Library tests and the website `npm run lint` + `npm run build` run in CI on every PR and complete without warnings.

- [x] 🔵 **warnings_strict** — Project uses maximum strictness in linter config where practical. *(SUGGESTED)*
  - *Note:* TypeScript `strict: true`; Next.js recommended + core-web-vitals rule sets.

---

## 🔐 Security

### Secure Development Knowledge

- [x] 🔴 **know_secure_design** — Primary developer knows how to design secure software.
  - *Self-certification note:* The library opens share intents with `noopener,noreferrer`, never collects or sends data, and has zero runtime dependencies; the website is a static export with no server or cookies.

- [x] 🔴 **know_common_errors** — Primary developer knows common vulnerability types (XSS, CSRF, SSRF) and mitigations.
  - *Self-certification note:* No `dangerouslySetInnerHTML` with user data; React escapes output; dependencies pinned via lockfile.

### Cryptography

- [-] 🔴 **crypto_published** — Only publicly reviewed cryptographic protocols/algorithms are used by default.
  - *Note:* `[~]` N/A: client-side share widget and static website; no cryptography, accounts or secrets in the code. Transport security (HTTPS/TLS) is provided by GitHub Pages and the npm/jsDelivr CDNs.

- [-] 🟡 **crypto_call** — Project calls an established crypto library rather than reimplementing crypto functions.
  - *Note:* `[~]` N/A: client-side share widget and static website; no cryptography, accounts or secrets in the code. Transport security (HTTPS/TLS) is provided by GitHub Pages and the npm/jsDelivr CDNs.

- [-] 🔴 **crypto_working** — No broken algorithms used.
  - *Note:* `[~]` N/A: client-side share widget and static website; no cryptography, accounts or secrets in the code. Transport security (HTTPS/TLS) is provided by GitHub Pages and the npm/jsDelivr CDNs.

- [-] 🔴 **crypto_keylength** — Key lengths meet NIST 2030 minimums by default.
  - *Note:* `[~]` N/A: client-side share widget and static website; no cryptography, accounts or secrets in the code. Transport security (HTTPS/TLS) is provided by GitHub Pages and the npm/jsDelivr CDNs.

- [-] 🔴 **crypto_password_storage** — Passwords for external users are stored as iterated salted hashes.
  - *Note:* `[~]` N/A: client-side share widget and static website; no cryptography, accounts or secrets in the code. Transport security (HTTPS/TLS) is provided by GitHub Pages and the npm/jsDelivr CDNs.

- [-] 🔴 **crypto_random** — Cryptographic keys and nonces are generated using a CSPRNG.
  - *Note:* `[~]` N/A: client-side share widget and static website; no cryptography, accounts or secrets in the code. Transport security (HTTPS/TLS) is provided by GitHub Pages and the npm/jsDelivr CDNs.

- [x] 🟡 **delivery_unsigned** — Cryptographic hashes are NOT retrieved over plain HTTP without a signature check.
  - *Note:* Site served only over HTTPS; npm packages are verified against `package-lock.json` integrity hashes.

---

## 🔬 Analysis

### Static Code Analysis

- [x] 🔴 **static_analysis_fixed** — All medium+ severity vulnerabilities found by static analysis are fixed in a timely manner.
  - *Note:* CodeRabbit reviews every PR (security findings are resolved before merge); OpenSSF Scorecard runs weekly.

- [x] 🔵 **static_analysis_common_vulnerabilities** — The static analysis tool includes checks for common vulnerabilities. *(SUGGESTED)*
  - *Tool + ruleset:* CodeRabbit security review (https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.coderabbit.yaml) and OpenSSF Scorecard (https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/workflows/scorecard.yml).

- [x] 🔵 **static_analysis_often** — Static analysis runs on every commit or at least daily. *(SUGGESTED)*
  - *Evidence URL:* https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/workflows/ci.yml (ESLint on every PR and push to main)

### Dynamic Code Analysis

- [x] 🔵 **dynamic_analysis** — Dynamic analysis applied before major releases. *(SUGGESTED)*
  - *Evidence:* the published library is exercised in jsdom before every npm release (`version-release.yml` runs `pnpm run test:coverage`): fast-check property tests vary the inputs, and branch coverage of `src/` is above 90%, enforced by https://github.com/AOSSIE-Org/SocialShareButton/blob/main/vitest.config.js.

- [x] 🔵 **dynamic_analysis_enable_assertions** — Dynamic analysis runs with assertions enabled. *(SUGGESTED)*
  - *Note:* Vitest drives the real library in jsdom (DOM events, timers, clipboard, MutationObserver) with assertions on every interaction.

- [-] 🔴 **dynamic_analysis_fixed** — Medium+ severity vulnerabilities fixed in a timely manner.
  - *Note:* `[~]` N/A: dynamic analysis has not found medium or higher severity vulnerabilities.

- [-] 🔵 **dynamic_analysis_unsafe** — Memory safety tools used. *(SUGGESTED)*
  - *Note:* `[~]` N/A: memory-safe TypeScript/JavaScript; no native code.
