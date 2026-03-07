import React, { useEffect, useRef } from "react";

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
  ],
  theme = "dark",
  buttonText = "Share",
  customClass = "",
  onShare = null,
  onCopy = null,
  buttonStyle = "default",
  modalPosition = "center",
  // Analytics props — the library itself never collects data.
  // Provide any combination to connect your own analytics tools.
  analytics = true,        // set to false to disable all event emission
  onAnalytics = null,      // (payload) => void — direct callback hook
  analyticsPlugins = [],   // array of adapter instances (see social-share-analytics.js)
  componentId = null,      // optional string identifier for this instance
  debug = false,           // log events to console during development
}) => {
  const containerRef = useRef(null);
  const shareButtonRef = useRef(null);

  // Auto-detect current URL and title if not provided
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const currentTitle =
    title || (typeof document !== "undefined" ? document.title : "");

  useEffect(() => {
    if (containerRef.current && !shareButtonRef.current) {
      if (typeof window !== "undefined" && window.SocialShareButton) {
        shareButtonRef.current = new window.SocialShareButton({
          container: containerRef.current,
          url: currentUrl,
          title: currentTitle,
          description,
          hashtags,
          via,
          platforms,
          theme,
          buttonText,
          customClass,
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
  }, []);

  // Update options when props change (including URL from route changes)
  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: currentUrl,
        title: currentTitle,
        description,
        hashtags,
        via,
        platforms,
        theme,
        buttonText,
        customClass,
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
    currentUrl,
    currentTitle,
    description,
    hashtags,
    via,
    platforms,
    theme,
    buttonText,
    customClass,
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

  return <div ref={containerRef}></div>;
};

export default SocialShareButton;
