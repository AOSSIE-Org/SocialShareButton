/**
 * TypeScript definitions for SocialShareButton
 * @version 1.0.4
 * @license GPL-3.0
 */

import { SocialShareAnalyticsPayload, SocialShareAnalyticsPlugin } from "./social-share-analytics";

export type SocialSharePlatform =
  | "whatsapp"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "telegram"
  | "reddit"
  | "pinterest"
  | "discord"
  | "email"
  | (string & {});

export type SocialShareTheme = "dark" | "light" | (string & {});

export type SocialShareButtonStyle =
  "default" | "primary" | "compact" | "icon-only" | (string & {});

export type SocialShareModalPosition = "center" | "top" | "bottom" | (string & {});

export interface SocialShareButtonOptions {
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
  /** DOM element or selector string to append the button to. */
  container?: HTMLElement | string | null;
  /** Whether to render the default trigger button. Default is true. */
  showButton?: boolean;
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
}

export class SocialShareButton {
  /** Active options configuration for this instance. */
  options: SocialShareButtonOptions;
  /** Whether the share dialog modal is currently open. */
  isModalOpen: boolean;
  /** Root DOM element of the modal overlay. */
  modal: HTMLDivElement | null;
  /** Root DOM element of the trigger button. */
  button: HTMLButtonElement | null;

  constructor(options?: SocialShareButtonOptions);

  /** Initializes the button and modal in the DOM. */
  init(): void;
  /** Creates and appends the trigger button to the container. */
  createButton(): HTMLButtonElement | void;
  /** Creates and appends the share modal dialog to the document body. */
  createModal(): HTMLDivElement | void;
  /** Generates the HTML markup for configured platform buttons. */
  getPlatformsHTML(): string;
  /** Returns the formatted share URL for a given platform. */
  getShareURL(platform: string): string;
  /** Safely adds a managed event listener removed on destroy. */
  addEventListener(
    element: EventTarget,
    type: string,
    handler: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  /** Removes all registered listeners attached by this instance. */
  removeAllListeners(): void;
  /** Binds DOM interactions for button clicks, modal closing, and key shortcuts. */
  attachEvents(): void;
  /** Opens the share modal with transition animations. */
  openModal(): void;
  /** Closes the share modal with transition animations. */
  closeModal(): void;
  /** Initiates sharing for a specific platform. */
  share(platform: string): void;
  /** Copies the current share URL to the system clipboard. */
  copyLink(): Promise<boolean> | void;
  /** Fallback clipboard copying mechanism for older environments. */
  fallbackCopy(input: HTMLInputElement, copyBtn: HTMLButtonElement): void;
  /** Destroys the instance, removing DOM elements and listeners. */
  destroy(): void;
  /** Updates options dynamically without unmounting the component. */
  updateOptions(options: Partial<SocialShareButtonOptions>, isInternalRefresh?: boolean): void;
  /** Applies custom inline styling for button and hover colors. */
  applyCustomColors(): void;

  /** Global set of active SocialShareButton instances. */
  static instances: Set<SocialShareButton>;
  /** Safely resolves a DOM element from a selector or node. */
  static _resolveContainer(raw: unknown): HTMLElement | null;
  /** Updates URL and title across all active dynamic instances on route change. */
  static updateCurrentPage(): void;
  /** Auto-initializes instances for markup using data-social-share attributes. */
  static autoInit(root?: Document | HTMLElement): void;
}

export default SocialShareButton;

declare global {
  interface Window {
    SocialShareButton: typeof SocialShareButton;
  }
}
