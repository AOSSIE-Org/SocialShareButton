/**
 * Type-level regression tests for SocialShareButton TypeScript declarations
 */

import SocialShareButton, {
  SocialShareButtonOptions,
  SocialSharePlatform,
  SocialShareTheme,
  SocialShareButtonStyle,
} from "../src/social-share-button";

import {
  GoogleAnalyticsAdapter,
  MixpanelAdapter,
  CustomAdapter,
  SocialShareAnalyticsPayload,
} from "../src/social-share-analytics";

import { SocialShareButton as ReactSocialShareButton } from "../src/social-share-button-react";
import * as React from "react";

// Test 1: Config options assignability
const validOptions: SocialShareButtonOptions = {
  url: "https://aossie.org",
  title: "AOSSIE Open Source",
  description: "Check out this project",
  hashtags: ["opensource", "gsoc"],
  via: "aossie_org",
  platforms: ["whatsapp", "twitter", "linkedin", "reddit"],
  theme: "dark",
  buttonText: "Share Now",
  customClass: "my-custom-share-btn",
  buttonColor: "#1877F2",
  buttonHoverColor: "#0d65d9",
  buttonStyle: "compact",
  modalPosition: "center",
  showButton: true,
  analytics: true,
  debug: false,
  componentId: "nav-share-button",
  onShare: (platform: string, url: string) => {
    console.log(`Shared to ${platform}: ${url}`);
  },
  onCopy: (url: string) => {
    console.log(`Copied URL: ${url}`);
  },
  onAnalytics: (payload: SocialShareAnalyticsPayload) => {
    console.log("Analytics event:", payload.eventName, payload.interactionType);
  },
  analyticsPlugins: [
    new GoogleAnalyticsAdapter("share_action"),
    new MixpanelAdapter(),
    new CustomAdapter((payload) => {
      console.log("Custom tracker payload:", payload);
    }),
  ],
};

// Test 2: Instantiation & method calls
const instance = new SocialShareButton(validOptions);

instance.init();
instance.openModal();
instance.closeModal();
instance.share("whatsapp");
instance.copyLink();
instance.destroy();

// Test 3: Static properties & methods
const hasInstance: boolean = SocialShareButton.instances.has(instance);
SocialShareButton.updateCurrentPage();
SocialShareButton.autoInit();

// Test 4: Union type narrowing
const platform: SocialSharePlatform = "whatsapp";
const theme: SocialShareTheme = "dark";
const style: SocialShareButtonStyle = "primary";

// @ts-expect-error numbers are not valid themes
const invalidTheme: SocialShareTheme = 123;

// @ts-expect-error CustomAdapter requires an onTrack callback
const invalidCustomAdapter = new CustomAdapter();

// Test 5: React component usage
export function TestReactComponent() {
  return React.createElement(ReactSocialShareButton, {
    url: "https://aossie.org",
    title: "AOSSIE",
    buttonStyle: "primary",
    theme: "light",
    platforms: ["whatsapp", "twitter", "linkedin"],
    onShare: (platform, url) => {
      console.log(platform, url);
    },
  });
}
