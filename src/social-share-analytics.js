/**
 * SocialShareButton — Analytics Adapters
 * @version 1.0.0
 * @license GPL-3.0
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE OVERVIEW
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Privacy by Design
 * ─────────────────
 * This library NEVER collects, stores, or transmits user data on its own.
 * It only emits interaction events locally inside the browser. All data
 * forwarding to external analytics services is performed exclusively by the
 * host website through the mechanisms described below. This keeps the library
 * compliant with GDPR, CCPA, and similar privacy regulations, and ensures that
 * the host website (not this library) is the data controller.
 *
 * Event Delivery Paths (three paths run simultaneously)
 * ──────────────────────────────────────────────────────
 *
 *  1. DOM CustomEvent  ──  document.dispatchEvent(new CustomEvent('social-share', { detail: payload }))
 *     Best for: CDN / vanilla JS, multiple independent consumers, framework-
 *     agnostic environments. Any number of listeners can subscribe with:
 *
 *       document.addEventListener('social-share', (e) => console.log(e.detail));
 *
 *  2. onAnalytics callback  ──  new SocialShareButton({ onAnalytics: (payload) => ... })
 *     Best for: single-consumer inline setups where a direct function reference
 *     is more ergonomic than a DOM listener.
 *
 *  3. Plugin / adapter registry  ──  new SocialShareButton({ analyticsPlugins: [...] })
 *     Best for: multiple analytics providers simultaneously. Each adapter
 *     implements a single track(payload) method and is held in an array.
 *     Provided built-in adapters are listed at the bottom of this file.
 *
 * Standard Event Payload Schema
 * ──────────────────────────────
 * Every event carries a consistent payload so any analytics provider can map
 * fields without custom transformation:
 *
 *   {
 *     version        : string      — schema version, e.g. '1.0'. Increment
 *                                    when the payload shape changes so
 *                                    consumers can handle migrations.
 *     source         : string      — always 'social-share-button'. Useful for
 *                                    segmentation when multiple widgets send
 *                                    events to the same analytics stream.
 *     eventName      : string      — snake_case name, e.g. 'social_share_click'
 *     interactionType: string      — 'share' | 'copy' | 'popup_open' |
 *                                    'popup_close' | 'error'
 *     platform       : string|null — sharing platform ('twitter', 'facebook', …)
 *     url            : string      — URL being shared
 *     title          : string      — page title at share time
 *     timestamp      : number      — Unix milliseconds (Date.now())
 *     componentId    : string|null — optional identifier set by the host
 *     errorMessage   : string      — only present on social_share_error events
 *   }
 *
 * Core Events
 * ────────────
 *   social_share_popup_open   — User opened the share modal/popup.
 *   social_share_popup_close  — User closed the modal (button, overlay, or Esc).
 *   social_share_click        — User clicked a platform button (intent to share).
 *   social_share_success      — Platform share window opened successfully.
 *   social_share_copy         — User copied the link to their clipboard.
 *   social_share_error        — An error prevented sharing or copying.
 *
 * Naming Convention
 * ──────────────────
 * All events follow the `social_<object>_<action>` pattern which aligns with
 * GA4's recommended event naming scheme and is compatible with Segment,
 * Mixpanel, and PostHog out of the box.
 *
 * Debug Mode
 * ───────────
 * Pass `debug: true` to the SocialShareButton constructor and every emitted
 * event will be logged to the browser console:
 *
 *   new SocialShareButton({ debug: true, ... });
 *   // → [SocialShareButton Analytics] { eventName: 'social_share_click', ... }
 */

// =============================================================================
// BASE ADAPTER INTERFACE
// =============================================================================

/**
 * Base class that all analytics adapters should extend.
 * Provides a no-op track() so subclasses only need to override what they use.
 *
 * Subclass contract:
 *   class MyAdapter extends SocialShareAnalyticsPlugin {
 *     track(payload) { ... }
 *   }
 */
class SocialShareAnalyticsPlugin {
  /**
   * Called by SocialShareButton for every analytics event.
   * @param {Object} payload - Standard event payload (see schema above).
   */
  // eslint-disable-next-line no-unused-vars
  track(payload) {}
}

// =============================================================================
// BUILT-IN ADAPTERS
// =============================================================================
// Each adapter is intentionally thin — it maps the standard payload to the
// provider's SDK without bundling or loading any external scripts. The host
// website is responsible for loading (and obtaining consent for) each SDK.
// =============================================================================

// -----------------------------------------------------------------------------
// Google Analytics 4 (GA4)
// Requires: window.gtag loaded by the host via the GA4 snippet.
// Docs: https://developers.google.com/analytics/devguides/collection/ga4/events
// -----------------------------------------------------------------------------
class GoogleAnalyticsAdapter extends SocialShareAnalyticsPlugin {
  /**
   * @param {Object} [config]
   * @param {string} [config.eventCategory='social_share'] - GA4 event_category value.
   */
  constructor(config = {}) {
    super();
    this.eventCategory = config.eventCategory || "social_share";
  }

  track(payload) {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }
    window.gtag("event", payload.eventName, {
      event_category: this.eventCategory,
      event_label: payload.platform,
      share_platform: payload.platform,
      share_url: payload.url,
      share_title: payload.title,
      interaction_type: payload.interactionType,
      component_id: payload.componentId,
      ...(payload.errorMessage ? { error_message: payload.errorMessage } : {}),
    });
  }
}

// -----------------------------------------------------------------------------
// Mixpanel
// Requires: window.mixpanel loaded by the host.
// Docs: https://developer.mixpanel.com/docs/javascript
// -----------------------------------------------------------------------------
class MixpanelAdapter extends SocialShareAnalyticsPlugin {
  track(payload) {
    if (
      typeof window === "undefined" ||
      typeof window.mixpanel === "undefined" ||
      typeof window.mixpanel.track !== "function"
    ) {
      return;
    }
    window.mixpanel.track(payload.eventName, {
      platform: payload.platform,
      url: payload.url,
      title: payload.title,
      interaction_type: payload.interactionType,
      component_id: payload.componentId,
      timestamp: payload.timestamp,
      ...(payload.errorMessage ? { error_message: payload.errorMessage } : {}),
    });
  }
}

// -----------------------------------------------------------------------------
// Segment (Analytics.js / analytics-next)
// Requires: window.analytics loaded by the host.
// Docs: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/
// -----------------------------------------------------------------------------
class SegmentAdapter extends SocialShareAnalyticsPlugin {
  track(payload) {
    if (
      typeof window === "undefined" ||
      typeof window.analytics === "undefined" ||
      typeof window.analytics.track !== "function"
    ) {
      return;
    }
    window.analytics.track(payload.eventName, {
      platform: payload.platform,
      url: payload.url,
      title: payload.title,
      interaction_type: payload.interactionType,
      component_id: payload.componentId,
      ...(payload.errorMessage ? { error_message: payload.errorMessage } : {}),
    });
  }
}

// -----------------------------------------------------------------------------
// Plausible Analytics
// Requires: window.plausible loaded by the host (script.js with custom events).
// Docs: https://plausible.io/docs/custom-event-goals
// -----------------------------------------------------------------------------
class PlausibleAdapter extends SocialShareAnalyticsPlugin {
  track(payload) {
    if (typeof window === "undefined" || typeof window.plausible !== "function") {
      return;
    }
    window.plausible(payload.eventName, {
      props: {
        platform: payload.platform,
        url: payload.url,
        interaction_type: payload.interactionType,
        component_id: payload.componentId,
      },
    });
  }
}

// -----------------------------------------------------------------------------
// PostHog
// Requires: window.posthog loaded by the host.
// Docs: https://posthog.com/docs/libraries/js
// -----------------------------------------------------------------------------
class PostHogAdapter extends SocialShareAnalyticsPlugin {
  track(payload) {
    if (
      typeof window === "undefined" ||
      typeof window.posthog === "undefined" ||
      typeof window.posthog.capture !== "function"
    ) {
      return;
    }
    window.posthog.capture(payload.eventName, {
      platform: payload.platform,
      url: payload.url,
      title: payload.title,
      interaction_type: payload.interactionType,
      component_id: payload.componentId,
      timestamp: payload.timestamp,
      ...(payload.errorMessage ? { error_message: payload.errorMessage } : {}),
    });
  }
}

// -----------------------------------------------------------------------------
// Custom / Callback Adapter
// Use this adapter to wrap any inline function without subclassing.
//
// Example:
//   new CustomAdapter((payload) => {
//     fetch('/api/analytics', { method: 'POST', body: JSON.stringify(payload) });
//   })
// -----------------------------------------------------------------------------
class CustomAdapter extends SocialShareAnalyticsPlugin {
  /**
   * @param {function(Object): void} onTrack - Called with the event payload.
   */
  constructor(onTrack) {
    super();
    if (typeof onTrack !== "function") {
      throw new TypeError("CustomAdapter expects a function argument.");
    }
    this._onTrack = onTrack;
  }

  track(payload) {
    this._onTrack(payload);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

const adapters = {
  SocialShareAnalyticsPlugin,
  GoogleAnalyticsAdapter,
  MixpanelAdapter,
  SegmentAdapter,
  PlausibleAdapter,
  PostHogAdapter,
  CustomAdapter,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = adapters;
}

if (typeof window !== "undefined") {
  window.SocialShareAnalytics = adapters;
}
