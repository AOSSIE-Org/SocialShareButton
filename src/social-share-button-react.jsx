import { useEffect, useRef } from "react";

/**
 * SocialShareButton React Wrapper
 *
 * Provides a React functional component that wraps the core SocialShareButton
 * vanilla JS library. Handles lifecycle, dynamic updates, and provides
 * sensible defaults for all sharing options.
 */
export const SocialShareButton = ({
  url,
  title,
  description = "",
  hashtags = [],
  via = "",
  platforms = [
    "whatsapp",
    "facebook",
    "twitter",
    "linkedin",
    "telegram",
    "reddit",
    "pinterest",
    "discord",
  ],
  theme = "dark",
  buttonText = "Share",
  labels, // Translated UI text, e.g. { share, close, copy, copied, copyFailed, urlLabel }
  customClass = "",
  buttonColor = "",
  buttonHoverColor = "",
  onShare = null,
  onCopy = null,
  buttonStyle = "default",
  modalPosition = "center",

  // Analytics: library emits events but never collects data
  analytics = true,
  onAnalytics = null, // Event callback
  analyticsPlugins = [], // Event adapters (see social-share-analytics.js)
  componentId = null, // Instance identifier
  debug = false, // Log events to console during development
}) => {
  // DOM reference for the injection target
  const containerRef = useRef(null);

  // Reference to the vanilla JS class instance
  const shareButtonRef = useRef(null);

  // Pass url/title only when set. Without them the library shares the current page
  // and keeps following client-side route changes.
  const pageOptions = {
    ...(url ? { url } : {}),
    ...(title ? { title } : {}),
  };
  const hasUrl = Boolean(url);
  const hasTitle = Boolean(title);

  /**
   * Initialization Effect
   *
   * Sets up the vanilla JS component once the React component mounts.
   * Includes a safe check for the global SocialShareButton class.
   * Re-created when url/title switch between set and unset, because
   * updateOptions() cannot switch the library back to following the page.
   */
  useEffect(() => {
    if (containerRef.current && !shareButtonRef.current) {
      if (typeof window !== "undefined" && window.SocialShareButton) {
        shareButtonRef.current = new window.SocialShareButton({
          container: containerRef.current,
          ...pageOptions,
          description,
          hashtags,
          via,
          platforms,
          theme,
          buttonText,
          labels,
          customClass,
          buttonColor,
          buttonHoverColor,
          onShare,
          onCopy,
          buttonStyle,
          modalPosition,
          analytics,
          onAnalytics,
          analyticsPlugins,
          componentId,
          debug,
        });
      }
    }

    return () => {
      if (shareButtonRef.current) {
        shareButtonRef.current.destroy();
        shareButtonRef.current = null;
      }
    };
  }, [hasUrl, hasTitle]);

  /**
   * Update Effect
   *
   * Synchronizes React prop changes with the underlying vanilla JS instance
   * without re-mounting the entire component.
   */

  useEffect(() => {
    if (shareButtonRef.current) {
      // Use the library's built-in update method
      shareButtonRef.current.updateOptions({
        ...pageOptions,
        description,
        hashtags,
        via,
        platforms,
        theme,
        buttonText,
        labels,
        customClass,
        buttonColor,
        buttonHoverColor,
        onShare,
        onCopy,
        buttonStyle,
        modalPosition,
        analytics,
        onAnalytics,
        analyticsPlugins,
        componentId,
        debug,
      });
    }
  }, [
    url,
    title,
    description,
    hashtags,
    via,
    platforms,
    theme,
    buttonText,
    labels,
    customClass,
    buttonColor,
    buttonHoverColor,
    onShare,
    onCopy,
    buttonStyle,
    modalPosition,
    analytics,
    onAnalytics,
    analyticsPlugins,
    componentId,
    debug,
  ]);
  // Provide the mount point for the vanilla JS logic
  return <div ref={containerRef}></div>;
};

export default SocialShareButton;
