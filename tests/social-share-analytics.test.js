import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import fc from "fast-check";

/** @type {any} */
let A;

beforeAll(async () => {
  await import("../src/social-share-analytics.js");
  A = window.SocialShareAnalytics;
});

afterEach(() => {
  for (const key of [
    "gtag",
    "mixpanel",
    "analytics",
    "plausible",
    "posthog",
    "dataLayer",
    "customLayer",
  ])
    delete window[key];
});

const payload = {
  version: "1.0",
  source: "social-share-button",
  eventName: "social_share_click",
  interactionType: "share",
  platform: "linkedin",
  url: "https://example.org",
  title: "Example",
  timestamp: 1700000000000,
  componentId: "hero",
};

describe("analytics adapters", () => {
  it("GoogleAnalyticsAdapter sends a GA4 event with the configured category", () => {
    window.gtag = vi.fn();
    new A.GoogleAnalyticsAdapter({ eventCategory: "share_widget" }).track(payload);
    expect(window.gtag).toHaveBeenCalledWith(
      "event",
      "social_share_click",
      expect.objectContaining({
        event_category: "share_widget",
        share_platform: "linkedin",
        share_url: "https://example.org",
        component_id: "hero",
      })
    );
  });

  it("GoogleAnalyticsAdapter defaults the category and forwards error messages", () => {
    window.gtag = vi.fn();
    new A.GoogleAnalyticsAdapter().track({ ...payload, errorMessage: "boom" });
    expect(window.gtag.mock.calls[0][2]).toMatchObject({
      event_category: "social_share",
      error_message: "boom",
    });
  });

  it("GoogleTagManagerAdapter pushes events with default dataLayer and category", () => {
    window.dataLayer = [];
    new A.GoogleTagManagerAdapter().track(payload);
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0]).toMatchObject({
      event: "social_share_click",
      event_category: "social_share",
      share_platform: "linkedin",
      share_url: "https://example.org",
      share_title: "Example",
      interaction_type: "share",
      component_id: "hero",
      timestamp: 1700000000000,
    });
  });

  it("GoogleTagManagerAdapter auto-initializes window.dataLayer if undefined", () => {
    delete window.dataLayer;
    const adapter = new A.GoogleTagManagerAdapter();
    expect(Array.isArray(window.dataLayer)).toBe(true);
    adapter.track(payload);
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer[0].event).toBe("social_share_click");
  });

  it("GoogleTagManagerAdapter forwards custom category and error message", () => {
    window.dataLayer = [];
    new A.GoogleTagManagerAdapter({ eventCategory: "custom_share" }).track({
      ...payload,
      errorMessage: "boom",
    });
    expect(window.dataLayer[0]).toMatchObject({
      event: "social_share_click",
      event_category: "custom_share",
      error_message: "boom",
    });
  });

  it("GoogleTagManagerAdapter supports a custom dataLayerName", () => {
    window.customLayer = [];
    new A.GoogleTagManagerAdapter({ dataLayerName: "customLayer" }).track(payload);
    expect(window.customLayer).toHaveLength(1);
    expect(window.customLayer[0].event).toBe("social_share_click");
  });

  it.each([
    ["MixpanelAdapter", "mixpanel", "track"],
    ["SegmentAdapter", "analytics", "track"],
    ["PostHogAdapter", "posthog", "capture"],
  ])("%s forwards the event name and properties", (name, global, method) => {
    window[global] = { [method]: vi.fn() };
    new A[name]().track({ ...payload, errorMessage: "e" });
    const [eventName, props] = window[global][method].mock.calls[0];
    expect(eventName).toBe("social_share_click");
    expect(props).toMatchObject({
      platform: "linkedin",
      url: "https://example.org",
      error_message: "e",
    });
  });

  it("PlausibleAdapter nests properties under props", () => {
    window.plausible = vi.fn();
    new A.PlausibleAdapter().track(payload);
    expect(window.plausible).toHaveBeenCalledWith("social_share_click", {
      props: {
        platform: "linkedin",
        url: "https://example.org",
        interaction_type: "share",
        component_id: "hero",
      },
    });
  });

  it("every adapter is a silent no-op when its analytics tool is not loaded", () => {
    for (const name of [
      "GoogleAnalyticsAdapter",
      "GoogleTagManagerAdapter",
      "MixpanelAdapter",
      "SegmentAdapter",
      "PlausibleAdapter",
      "PostHogAdapter",
    ]) {
      expect(() => new A[name]().track(payload), name).not.toThrow();
    }
    expect(() => new A.SocialShareAnalyticsPlugin().track(payload)).not.toThrow();
  });

  it("CustomAdapter calls the supplied function and rejects non-functions", () => {
    const fn = vi.fn();
    new A.CustomAdapter(fn).track(payload);
    expect(fn).toHaveBeenCalledWith(payload);
    expect(() => new A.CustomAdapter("nope")).toThrow(TypeError);
  });

  it("property: adapters never mutate the payload they receive", () => {
    window.gtag = vi.fn();
    window.dataLayer = [];
    window.posthog = { capture: vi.fn() };
    fc.assert(
      fc.property(fc.string(), fc.option(fc.string(), { nil: null }), (eventName, platform) => {
        const p = { ...payload, eventName, platform };
        const snapshot = structuredClone(p);
        new A.GoogleAnalyticsAdapter().track(p);
        new A.GoogleTagManagerAdapter().track(p);
        new A.PostHogAdapter().track(p);
        expect(p).toEqual(snapshot);
      })
    );
  });
});
