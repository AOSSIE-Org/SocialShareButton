# SocialShareButton — Peer Review Report

**Repository:** [AOSSIE-Org/SocialShareButton](https://github.com/AOSSIE-Org/SocialShareButton)  
**Reviewed revision:** `main` (`1ae36e907d2c85bf5fce194bc56f76a1fe0f8e51`)  
**Review area:** Published JavaScript share widget, framework adapters, analytics callbacks, and the companion landing page.

## Overall assessment

This repository contains both a reusable JavaScript sharing library and a Next.js landing page. The share widget builds its interface in the DOM and opens platform share URLs in new windows. One conditional medium-severity DOM injection issue was identified in the widget’s button rendering. The companion landing page source reviewed did not reveal a separate material finding.

## Finding 1 — `buttonText` is inserted into HTML without escaping

**Severity:** Potential Medium — depends on whether callers pass untrusted text  
**Location:** `src/social-share-button.js:104–115`.

**Observation:** `createButton()` assigns `button.innerHTML` to a template string containing `this.options.buttonText`. The value is configurable through constructor options and the `data-button-text` auto-initialization attribute. Because this uses an HTML parsing sink rather than a text node, markup in the value is interpreted by the browser.

**Potential impact:** If an integrating site derives the button label from user-controlled content, an attacker may inject markup or script into the host page’s origin. The risk is conditional on the integrator allowing untrusted data into this option; ordinary fixed labels do not trigger it.

**Suggested resolution:** Construct the button’s SVG and span as DOM nodes and set the label with `textContent`. Apply the same rule to any future option values inserted into HTML templates.

## Review checklist

| Area | Result |
|---|---|
| Dynamic HTML insertion | `buttonText` interpolation issue reported above. |
| Social share URL parameter encoding | Inspected share URL values are encoded before being assembled. |
| New-window handling | Share windows are opened with `noopener,noreferrer`. |
| Analytics behavior | The library exposes callbacks/adapters and does not itself transmit analytics events. |
| Landing page links and locale metadata | Inspected configuration uses centralized site/repository links; no separate material issue identified. |
| Responsive presentation | I installed the project dependencies and checked the landing page in a browser across screen sizes; it displayed correctly. |

## Validation

I installed the project dependencies and checked the landing page in a browser across screen sizes; it was responsive and displayed correctly. I did not execute a browser proof of concept for the DOM injection finding, which follows from the dynamic value reaching `innerHTML`; exploitability depends on the integrator’s data flow.

## Conclusion

One conditional medium-severity DOM injection issue is reported in the reusable share widget. No separate material issue was substantiated in the inspected landing page source. This source-only review does not establish that issues are absent in uninspected code or runtime integrations.
