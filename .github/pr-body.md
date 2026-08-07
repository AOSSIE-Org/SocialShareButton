# Enterprise-Grade Modal Refactor: Security, Accessibility & Performance

## Summary

This PR refactors the modal implementation to improve **security**, **accessibility**, and **performance** while maintaining full backward compatibility with the existing `SocialShareButton` API.

## Changes

### Security

* Removed all `innerHTML` usage.
* Replaced string-based DOM generation with native DOM APIs (`createElement`, `createElementNS`, `textContent`).
* Added `DocumentFragment` for secure and efficient DOM construction.
* Improved compatibility with Trusted Types and strict Content Security Policy (CSP).

### Accessibility

* Added `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
* Implemented keyboard focus trapping within the modal.
* Restored focus to the triggering element when the modal closes.
* Preserved Escape key support for closing the modal.
* Improved keyboard navigation in line with WCAG 2.1 AA recommendations.

### Performance

* Replaced multiple platform-specific event listeners with a single delegated event listener.
* Reduced memory usage by eliminating unnecessary listeners.
* Optimized DOM rendering using `DocumentFragment`.

## Testing

* Verified the Share modal opens and closes correctly.
* Verified all sharing platforms continue to function as expected.
* Tested keyboard navigation, focus trapping, and focus restoration.
* Confirmed Escape key closes the modal.
* Verified no visual or API regressions.

## Backward Compatibility

* No breaking API changes.
* Existing styling and functionality remain unchanged.
* Fully backward compatible with previous implementations.

This refactor improves the library's security, accessibility, maintainability, and runtime efficiency while preserving its existing behavior.
