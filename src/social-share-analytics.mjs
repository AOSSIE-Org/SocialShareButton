/**
 * ES module entry point for the analytics adapters.
 *
 * social-share-analytics.js is also usable as a classic <script> tag, so it
 * cannot contain `export` syntax. This file is the module entry instead.
 */
import adapters from "./social-share-analytics.js";

export default adapters;
export const {
  SocialShareAnalyticsPlugin,
  GoogleAnalyticsAdapter,
  MixpanelAdapter,
  SegmentAdapter,
  PlausibleAdapter,
  PostHogAdapter,
  CustomAdapter,
} = adapters;
