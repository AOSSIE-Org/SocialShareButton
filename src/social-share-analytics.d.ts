/**
 * TypeScript definitions for SocialShareButton Analytics Adapters
 * @license GPL-3.0
 */

export interface SocialShareAnalyticsPayload {
  /** Schema version, e.g. '1.0' */
  version: string;
  /** Fixed identifier for the component: 'social-share-button' */
  source: string;
  /** Event name, e.g. 'social_share_click', 'social_share_copy', etc. */
  eventName:
    | "social_share_click"
    | "social_share_success"
    | "social_share_copy"
    | "social_share_popup_open"
    | "social_share_popup_close"
    | "social_share_error"
    | (string & {});
  /** Interaction category */
  interactionType: "share" | "copy" | "popup_open" | "popup_close" | "error" | (string & {});
  /** Target platform name or null for non-platform interactions */
  platform: string | null;
  /** Canonical share target URL */
  url: string;
  /** Share title */
  title: string;
  /** Millisecond timestamp */
  timestamp: number;
  /** Optional identifier for the button instance */
  componentId: string | null;
  /** Error message string, present on error interactions */
  errorMessage?: string;
}

export abstract class SocialShareAnalyticsPlugin {
  constructor();
  abstract track(payload: SocialShareAnalyticsPayload): void;
}

export class GoogleAnalyticsAdapter extends SocialShareAnalyticsPlugin {
  constructor(eventName?: string);
  track(payload: SocialShareAnalyticsPayload): void;
}

export class MixpanelAdapter extends SocialShareAnalyticsPlugin {
  constructor(eventName?: string);
  track(payload: SocialShareAnalyticsPayload): void;
}

export class SegmentAdapter extends SocialShareAnalyticsPlugin {
  constructor(eventName?: string);
  track(payload: SocialShareAnalyticsPayload): void;
}

export class PlausibleAdapter extends SocialShareAnalyticsPlugin {
  constructor(eventName?: string);
  track(payload: SocialShareAnalyticsPayload): void;
}

export class PostHogAdapter extends SocialShareAnalyticsPlugin {
  constructor(eventName?: string);
  track(payload: SocialShareAnalyticsPayload): void;
}

export class CustomAdapter extends SocialShareAnalyticsPlugin {
  constructor(onTrack: (payload: SocialShareAnalyticsPayload) => void);
  track(payload: SocialShareAnalyticsPayload): void;
}

export interface SocialShareAnalyticsAdapters {
  SocialShareAnalyticsPlugin: typeof SocialShareAnalyticsPlugin;
  GoogleAnalyticsAdapter: typeof GoogleAnalyticsAdapter;
  MixpanelAdapter: typeof MixpanelAdapter;
  SegmentAdapter: typeof SegmentAdapter;
  PlausibleAdapter: typeof PlausibleAdapter;
  PostHogAdapter: typeof PostHogAdapter;
  CustomAdapter: typeof CustomAdapter;
}

declare const adapters: SocialShareAnalyticsAdapters;

export default adapters;

declare global {
  interface Window {
    SocialShareAnalytics?: SocialShareAnalyticsAdapters;
  }
}
