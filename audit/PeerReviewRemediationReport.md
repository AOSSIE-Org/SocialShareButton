# Social Share Button: Peer Review Remediation Report

| | |
|---|---|
| **Peer review** | [`audit/PeerReviewReport.md`](PeerReviewReport.md) (merged in [PR #259](https://github.com/AOSSIE-Org/SocialShareButton/pull/259)) |
| **Reviewer** | Piyush ([@Piyushbijarania](https://github.com/Piyushbijarania)) |
| **Reviewed revision** | `main` @ [`1ae36e9`](https://github.com/AOSSIE-Org/SocialShareButton/commit/1ae36e907d2c85bf5fce194bc56f76a1fe0f8e51) |
| **Remediated by** | Saksham Jain ([@reach2saksham](https://github.com/reach2saksham)) |
| **Date** | 1 November 2026 |

## Summary

| Finding | Severity | Status |
|---|---|---|
| Finding 1: `buttonText` is inserted into HTML without escaping | Potential Medium | ✅ Fixed in this PR |

## Finding 1: `buttonText` is inserted into HTML without escaping

**Severity:** Potential Medium · **Status:** Fixed

**Cause.** `createButton()` in `src/social-share-button.js` put `this.options.buttonText` (settable through `data-button-text`) into `button.innerHTML`.

**Fix.**

- The label is now a `<span>` created with `document.createElement` and filled with `textContent`, so it is never parsed as HTML. Only the static share icon stays in the template.
- The same pass found a second option inserted into markup, `modalPosition`. It is now restricted to the known values `center` and `bottom` (anything else falls back to `center`).

**Regression tests.** `tests/social-share-button.test.js`: `renders buttonText as text, never as HTML` uses an `<img onerror>` payload; a fast-check property test checks that no generated `buttonText` string ends up in the markup; `does not inject markup from data-button-text or data-modal-position` covers the same payloads through auto-init from `data-*` attributes.

**Note.** This issue was also found by the AI security review run on this repository, so the fix is in the same branch as that remediation (see the AI security-review report in this repository).

## Verification

`npx vitest run` ✅ 66/66 (coverage 98.8% lines) · landing page `npm run lint` ✅ · `npm run build` ✅
