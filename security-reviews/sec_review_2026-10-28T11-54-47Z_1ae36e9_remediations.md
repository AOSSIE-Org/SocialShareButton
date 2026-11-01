# Remediations of Security Review Findings

Review date and time: 2026-10-28T11:54:47Z (UTC)

## Remediations

### Remediation of Finding 1: Unescaped `buttonText` and `modalPosition` interpolated into `innerHTML` (XSS, reachable via `data-*` auto-init)

- [ ] This remediation implements the security review's recommendation for this finding.
- [x] This remediation addresses the finding in a way that differs from the security review's recommendation.

Remediation commits:
- [42332e3](https://github.com/reach2saksham/SocialShareButton/commit/42332e38556ab326cb729acffa34ec67fa7c66a5)

Description: buttonText is set with textContent instead of innerHTML. modalPosition is checked against an allow-list (center, bottom; the only positions with CSS) before it reaches the template, falling back to center, rather than being added with classList. theme and buttonStyle were not allow-listed. Regression and fast-check property tests cover both.

## Non-remediated findings

None.
