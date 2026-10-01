/**
 * TypeScript definitions for SocialShareButton React Wrapper
 * @license GPL-3.0
 */

import * as React from "react";
import {
  SocialShareButtonStyle,
  SocialShareModalPosition,
  SocialSharePlatform,
  SocialShareTheme,
} from "./social-share-button";
import { SocialShareAnalyticsPayload, SocialShareAnalyticsPlugin } from "./social-share-analytics";

export interface SocialShareButtonProps {
  /** Target URL to share. Defaults to current window.location.href. */
  url?: string;
  /** Title of the shared content. Defaults to document.title. */
  title?: string;
  /** Optional description text included in platform shares. */
  description?: string;
  /** Hashtags to append to the share message (without #). */
  hashtags?: string[];
  /** Via/attribution handle (e.g. for Twitter/X). */
  via?: string;
  /** List of platform identifiers to display in the modal. */
  platforms?: SocialSharePlatform[];
  /** Visual theme for the share modal. Default is 'dark'. */
  theme?: SocialShareTheme;
  /** Label for the trigger button. Default is 'Share'. */
  buttonText?: string;
  /** Additional CSS class names to apply to the button. */
  customClass?: string;
  /** Custom background color for the button. */
  buttonColor?: string;
  /** Custom hover background color for the button. */
  buttonHoverColor?: string;
  /** Callback fired when a platform share action is triggered. */
  onShare?: ((platform: string, url: string) => void) | null;
  /** Callback fired when the copy link action succeeds. */
  onCopy?: ((url: string) => void) | null;
  /** Visual variant style for the trigger button. Default is 'default'. */
  buttonStyle?: SocialShareButtonStyle;
  /** Positioning mode for the share modal dialog. Default is 'center'. */
  modalPosition?: SocialShareModalPosition;
  /** Whether analytics event emission is enabled. Default is true. */
  analytics?: boolean;
  /** Callback invoked on any interaction analytics event. */
  onAnalytics?: ((payload: SocialShareAnalyticsPayload) => void) | null;
  /** Array of analytics plugin adapters to notify on events. */
  analyticsPlugins?: SocialShareAnalyticsPlugin[];
  /** Optional identifier distinguishing this widget instance. */
  componentId?: string | null;
  /** Whether to log diagnostic messages and events to the console. */
  debug?: boolean;
  /** Optional React children. */
  children?: React.ReactNode;
}

export declare const SocialShareButton: React.FC<SocialShareButtonProps>;

export default SocialShareButton;
