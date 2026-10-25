# AOSSIE Best Practices Checklist

> Criteria adapted from the [OpenSSF Best Practices Badge](https://github.com/coreinfrastructure/best-practices-badge)
> (MIT / CC BY 3.0) by OpenSSF contributors. Modified for AOSSIE multi-repo template use.

> **Purpose:** Covers OpenSSF Best Practices criteria that are NOT auto-detected by OpenSSF Scorecard.
> Scorecard already handles: License, SAST tools, CI tests, Security Policy file, Branch Protection,
> Pinned Dependencies, Signed Releases, Maintained status, and Known Vulnerabilities.
>
> **How to use:**
>
> 1. Fill in checkboxes below — tick `[x]` for Met, leave `[ ]` for Unmet, use `[~]` for N/A
> 2. Add a brief note or URL after each item as evidence
> 3. Update the Score Summary table below whenever you tick or untick an item
>
> **Legend:**
>
> - 🔴 MUST — Required for passing
> - 🟡 SHOULD — Required unless documented rationale given
> - 🔵 SUGGESTED — Optional but recommended
> - ⚪ N/A — Mark `[~]` if not applicable, add justification

---

## Score Summary

<!-- Update manually when items change -->

| Category       | Met    | Total  | Status  |
| -------------- | ------ | ------ | ------- |
| Basics         | 8      | 8      | 🟢      |
| Change Control | 4      | 6      | 🟡      |
| Reporting      | 5      | 8      | 🟡      |
| Quality        | 4      | 11     | 🔴      |
| Security       | 0      | 9      | 🔴      |
| Analysis       | 1      | 7      | 🔴      |
| **Total**      | **22** | **49** | **45%** |

---

## 🏗️ Basics

### Project Website & Documentation

- [x] 🔴 **description_good** — The project README/website clearly describes what the software does and what problem it solves.
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton#readme

- [x] 🔴 **interact** — The project provides information on how to obtain the software, submit bug reports, and contribute.
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton#readme (Installation, Contributing sections) · https://social-share-button.aossie.org

- [x] 🔴 **contribution** — `CONTRIBUTING.md` explains the contribution process (e.g., PRs are used, how to open one).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md

- [x] 🟡 **contribution_requirements** — `CONTRIBUTING.md` references acceptable contribution standards (coding style, tests required, etc.).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/blob/main/CONTRIBUTING.md (code style, ESLint/Prettier, PR guidelines)

- [x] 🔴 **documentation_basics** — Basic documentation exists for the software (README, Wiki, or docs folder).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton#readme

- [x] 🔴 **documentation_interface** — Reference documentation describes the external interface (API inputs/outputs, CLI flags, config schema, etc.).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton#configuration (options table, callbacks, analytics)

### Other Basics

- [x] 🔴 **discussion** — Project has a searchable, URL-addressable discussion mechanism (GitHub Issues, Discord with archive, mailing list, etc.) that doesn't require proprietary client software.
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/issues

- [x] 🟡 **english** — Documentation is provided in English and English bug reports/comments are accepted.
  - _Note:_ All documentation is written in English; the website is also localized to Hindi.

---

## 🔄 Change Control

### Version Control

- [x] 🔵 **repo_distributed** — Project uses a distributed VCS (e.g., git). _(SUGGESTED)_
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton

### Version Numbering

- [x] 🔴 **version_unique** — Each release has a unique version identifier (e.g., v1.0.0).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/tags (v1.0.3, v1.0.4)

- [x] 🔵 **version_semver** — Project uses [SemVer](https://semver.org) or [CalVer](https://calver.org/) format. _(SUGGESTED)_
  - _Note:_ SemVer — see package.json and VERSION.

- [x] 🔵 **version_tags** — Releases are tagged in the VCS (e.g., `git tag v1.0.0`). _(SUGGESTED)_
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/tags

### Release Notes

- [ ] 🔴 **release_notes** — Each release includes human-readable release notes summarizing major changes. Raw `git log` output is NOT acceptable.
  - _Evidence URL:_ `[ ]` N/A — _Justification (continuous delivery / no external reuse):_

- [ ] 🔴 **release_notes_vulns** — Release notes identify every publicly known vulnerability (with CVE) fixed in that release.
  - _Evidence URL:_ `[ ]` N/A — _Justification (no publicly known vulns / users can't self-update):_

---

## 🐛 Reporting

### Bug Reporting

- [x] 🔴 **report_process** — A bug-reporting process exists (e.g., GitHub Issues link in README).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/issues/new/choose

- [x] 🟡 **report_tracker** — An issue tracker (e.g., GitHub Issues) is used to track individual bugs.
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/issues

- [ ] 🔴 **report_responses** — A majority of bug reports submitted in the last 2–12 months have been acknowledged (response ≠ fix).
  - _Self-certification note:_

- [ ] 🟡 **enhancement_responses** — More than 50% of enhancement requests in the last 2–12 months have received a response.
  - _Self-certification note:_

- [x] 🔴 **report_archive** — Reports and responses are publicly archived and searchable (GitHub Issues satisfies this).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/issues?q=is%3Aissue

### Vulnerability Reporting

- [x] 🔴 **vulnerability_report_process** — A vulnerability reporting process is documented (e.g., `SECURITY.md`).
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/blob/main/SECURITY.md

- [x] 🟡 **vulnerability_report_private** — If private vulnerability reporting is supported, the method for private submission is documented.
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/security/advisories/new (documented in SECURITY.md)

- [ ] 🔴 **vulnerability_report_response** — Initial response to any vulnerability report received in the last 6 months was within 14 days.
  - _Self-certification note:_ `[ ]` N/A — _Justification (no reports received):_

---

## ✅ Quality

### Build System

- [x] 🔴 **build** — If the project requires building, a working build system exists that can auto-rebuild from source.
  - _Evidence URL:_ Website: `npm run build` in landing-page/ (Next.js static export). The library itself has no build step.

- [x] 🔵 **build_common_tools** — Common build tools are used (npm, pip, cargo, make, gradle, etc.). _(SUGGESTED)_
  - _Evidence URL:_ npm

- [x] 🟡 **build_floss_tools** — The project can be built using only FLOSS tools.
  - _Note:_ Node.js, npm, Next.js, Tailwind CSS — all FLOSS.

### Automated Testing

- [ ] 🔵 **test_invocation** — The test suite can be invoked in a standard way for the language (e.g., `npm test`, `pytest`, `cargo test`). _(SUGGESTED)_
  - _Evidence URL:_

- [ ] 🔵 **test_most** — The test suite covers most code branches, input fields, and functionality. _(SUGGESTED)_
  - _Estimated coverage %:_

### New Functionality Testing Policy

- [ ] 🔴 **test_policy** — The project has a general policy that new functionality must include tests in the automated test suite.
  - _Evidence (CONTRIBUTING reference or informal policy):_

- [ ] 🔴 **tests_are_added** — Evidence exists that the test policy has been followed in recent major changes (e.g., PRs include tests).
  - _Evidence URL (recent PR with tests):_

- [ ] 🔵 **tests_documented_added** — The test policy is documented in contribution instructions. _(SUGGESTED)_
  - _Evidence URL:_

### Linting / Warning Flags

- [x] 🔴 **warnings** — At least one linter or compiler warning flag is enabled (ESLint, Pylint, clippy, golangci-lint, Slither for Solidity, etc.).
  - _Tool used:_ ESLint (eslint-config-next core-web-vitals + typescript) for landing-page/, run in CI.

- [ ] 🔴 **warnings_fixed** — Warnings from the linter are addressed (not suppressed without reason).
  - _Note:_

- [ ] 🔵 **warnings_strict** — Project uses maximum strictness in linter config where practical. _(SUGGESTED)_
  - _Note:_

---

## 🔐 Security

### Secure Development Knowledge

- [ ] 🔴 **know_secure_design** — At least one primary developer knows how to design secure software (familiar with OWASP, threat modeling, secure-by-default principles).
  - _Self-certification note:_

- [ ] 🔴 **know_common_errors** — At least one primary developer knows common vulnerability types for this software's category and how to mitigate them (e.g., injection, XSS, reentrancy for Solidity, prompt injection for AI).
  - _Self-certification note:_

### Cryptography (mark N/A if project does not handle cryptography)

- [ ] 🔴 **crypto_published** — Only publicly reviewed cryptographic protocols/algorithms are used by default.
  - _Note:_ `[ ]` N/A

- [ ] 🟡 **crypto_call** — Project calls an established crypto library rather than reimplementing crypto functions.
  - _Library used:_ `[ ]` N/A

- [ ] 🔴 **crypto_working** — No broken algorithms (MD4, MD5, single DES, RC4, Dual_EC_DRBG) used unless required for interoperability (must be documented).
  - _Note:_ `[ ]` N/A

- [ ] 🔴 **crypto_keylength** — Key lengths meet [NIST 2030 minimums](https://www.keylength.com/en/4/) by default.
  - _Note:_ `[ ]` N/A

- [ ] 🔴 **crypto_password_storage** — Passwords for external users are stored as iterated salted hashes (Argon2id, bcrypt, scrypt, PBKDF2).
  - _Note:_ `[ ]` N/A — _Justification (project doesn't store passwords):_

- [ ] 🔴 **crypto_random** — Cryptographic keys and nonces are generated using a CSPRNG; insecure generators (Math.random, rand()) are NOT used for security purposes.
  - _Note:_ `[ ]` N/A

- [ ] 🟡 **delivery_unsigned** — Cryptographic hashes are NOT retrieved over plain HTTP without a signature check.
  - _Note:_

---

## 🔬 Analysis

### Static Code Analysis

- [ ] 🔴 **static_analysis_fixed** — All medium+ severity vulnerabilities found by static analysis are fixed in a timely manner after confirmation.
  - _Note:_ `[ ]` N/A

- [ ] 🔵 **static_analysis_common_vulnerabilities** — The static analysis tool includes checks for common vulnerabilities in the language/environment (e.g., eslint-plugin-security, bandit, Slither). _(SUGGESTED)_
  - _Tool + ruleset:_ `[ ]` N/A

- [x] 🔵 **static_analysis_often** — Static analysis runs on every commit or at least daily (CI integration). _(SUGGESTED)_
  - _Evidence URL:_ https://github.com/AOSSIE-Org/SocialShareButton/blob/main/.github/workflows/ci.yml (lint on every push/PR to main)

### Dynamic Code Analysis

- [ ] 🔵 **dynamic_analysis** — At least one dynamic analysis tool is applied before major releases (fuzzer, web app scanner like OWASP ZAP, etc.). _(SUGGESTED)_
  - _Tool used:_ `[ ]` N/A — _Justification:_

- [ ] 🔵 **dynamic_analysis_enable_assertions** — Dynamic analysis / testing runs with assertions enabled (not just production mode). _(SUGGESTED)_
  - _Note:_

- [ ] 🔴 **dynamic_analysis_fixed** — Medium+ severity vulnerabilities found by dynamic analysis are fixed in a timely manner.
  - _Note:_ `[ ]` N/A

- [ ] 🔵 **dynamic_analysis_unsafe** — If the project uses memory-unsafe languages (C/C++), memory safety tools (Valgrind, AddressSanitizer) are used. _(SUGGESTED)_
  - _Note:_ `[ ]` N/A — _Justification (project uses memory-safe languages):_

---

## 📎 Project-Specific Notes

> Add domain-specific notes here for Web3, Full-Stack, or AI projects.

### Web3 / Solidity Notes

- Scorecard does not audit Solidity-specific security. Use [Slither](https://github.com/crytic/slither) for `static_analysis` and `warnings` criteria.
- For `crypto_*` criteria, document which cryptographic primitives your contracts rely on (e.g., ECDSA in EVM is standard).
- Smart contract audit reports count as evidence for `know_secure_design`.

### Full-Stack / Next.js Notes

- For `crypto_password_storage`: document which auth library handles hashing (e.g., NextAuth + bcrypt).
- For `dynamic_analysis`: [OWASP ZAP](https://www.zaproxy.org/) can be run as a GitHub Action.

### AI / LLM Notes

- For `know_common_errors`: include awareness of prompt injection, data leakage, and model output validation.
- For `dynamic_analysis`: consider adversarial input testing as a form of dynamic analysis.

---

_This checklist complements [OpenSSF Scorecard](https://scorecard.dev/) (auto-detected checks) and is
inspired by the [OpenSSF Best Practices Badge](https://www.bestpractices.dev/en/criteria/0) passing criteria._
