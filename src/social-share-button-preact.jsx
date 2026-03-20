import { useEffect, useRef } from "preact/hooks";

export default function SocialShareButton({
  url = "",
  title = "",
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
  buttonColor = "",
  buttonHoverColor = "",
  showButton = true,
  onShare = null,
  onCopy = null,
  buttonStyle = "default",
  modalPosition = "center",
  analytics = true,
  onAnalytics = null,
  analyticsPlugins = [],
  componentId = null,
  debug = false,
}) {
  const containerRef = useRef(null);
  const shareButtonRef = useRef(null);
  const latestOptionsRef = useRef(null);

  const resolvedUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const resolvedTitle =
    title || (typeof document !== "undefined" ? document.title : "");

  // Keep latest props so delayed init doesn't use stale values.
  latestOptionsRef.current = {
    url: resolvedUrl,
    title: resolvedTitle,
    description,
    hashtags,
    via,
    platforms,
    theme,
    buttonText,
    customClass,
    buttonColor,
    buttonHoverColor,
    showButton,
    onShare,
    onCopy,
    buttonStyle,
    modalPosition,
    analytics,
    onAnalytics,
    analyticsPlugins,
    componentId,
    debug,
  };

  useEffect(() => {
    let checkInterval = null;
    let attempts = 0;
    const MAX_POLL_ATTEMPTS = 300; // ~30s at 100ms

    const initButton = () => {
      if (shareButtonRef.current) return;
      if (containerRef.current) {
        shareButtonRef.current = new window.SocialShareButton({
          container: containerRef.current,
          ...latestOptionsRef.current,
        });
      }
    };

    // SSR guard: window is undefined during server render.
    if (typeof window === "undefined") return () => {};

    if (window.SocialShareButton) {
      initButton();
    } else {
      // Poll until the script registers the global, then initialize once.
      checkInterval = setInterval(() => {
        attempts += 1;

        if (window.SocialShareButton) {
          // Stop polling as soon as the library is available.
          clearInterval(checkInterval);
          checkInterval = null;
          initButton();
        } else if (attempts >= MAX_POLL_ATTEMPTS) {
          // Stop polling after max attempts to avoid infinite loop.
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (shareButtonRef.current) {
        shareButtonRef.current.destroy();
        shareButtonRef.current = null;
      }
    };
  }, []);

  // Normalize array deps to avoid re-running updateOptions on new array references with same values.
  const hashtagsDep = JSON.stringify(hashtags);
  const platformsDep = JSON.stringify(platforms);

  useEffect(() => {
    if (shareButtonRef.current) {
      shareButtonRef.current.updateOptions({
        url: resolvedUrl,
        title: resolvedTitle,
        description,
        hashtags,
        via,
        platforms,
        theme,
        buttonText,
        customClass,
        buttonColor,
        buttonHoverColor,
        showButton,
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
    resolvedUrl,
    resolvedTitle,
    description,
    hashtagsDep,
    via,
    platformsDep,
    theme,
    buttonText,
    customClass,
    buttonColor,
    buttonHoverColor,
    showButton,
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
}
