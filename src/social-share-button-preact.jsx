import { useEffect, useRef } from "preact/hooks";

 /**
 * SocialShareButton Preact Wrapper
 *
 * Provides a lightweight Preact functional component that wraps the core
 * SocialShareButton vanilla JS library. Handles lifecycle, dynamic updates,
 * and browser-only initialization.
 *
 */

export default function SocialShareButton({
  url = "",
  title = "",
  description = "",
  hashtags = [],
  via = "",
  platforms = ["whatsapp", "facebook", "twitter", "linkedin", "telegram", "reddit"],
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
  
  // Analytics props — the library emits events but never collects data itself.
  analytics = true,
  onAnalytics = null, // (payload) => void hook
  analyticsPlugins = [], // Array of adapter instances
  componentId = null, // Unique ID for this instance
  debug = false, // Log events to console in dev
}) {
  // DOM reference to the container where the button will be injected
  const containerRef = useRef(null);
  
  // Reference to the vanilla JS class instance
  const shareButtonRef = useRef(null);
  
  // Storage for the latest options to avoid stale closures during async initialization
  const latestOptionsRef = useRef(null);

  // Fallback to current browser location/title if not explicitly provided
  const resolvedUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const resolvedTitle = title || (typeof document !== "undefined" ? document.title : "");

  // Update latestOptionsRef on every render so the async init loop uses current values
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

  /**
   * Initialization Effect
   * 
   * Handles the setup of the vanilla JS instance once the component mounts.
   * Includes a polling mechanism to wait for the core library if it's loaded 
   * asynchronously (e.g., via a CDN script tag).
   */
  useEffect(() => {
    let checkInterval = null;
    let attempts = 0;
    const MAX_POLL_ATTEMPTS = 300; // Stop polling after ~30s (100ms intervals)

    const initButton = () => {
      // Guard: Don't initialize twice or if container is missing
      if (shareButtonRef.current) return;
      if (containerRef.current) {
        // Instantiate the core class using the global reference
        shareButtonRef.current = new window.SocialShareButton({
          container: containerRef.current,
          ...latestOptionsRef.current,
        });
      }
    };

    // SSR Check: Ensure we're in a browser environment
    if (typeof window === "undefined") return () => {};

    if (window.SocialShareButton) {
      // Core library is already loaded
      initButton();
    } else {
      // Core library might be loading; poll until window.SocialShareButton is available
      checkInterval = setInterval(() => {
        attempts += 1;

        if (window.SocialShareButton) {
          clearInterval(checkInterval);
          checkInterval = null;
          initButton();
        } else if (attempts >= MAX_POLL_ATTEMPTS) {
          // Failure: Library didn't load in time
          clearInterval(checkInterval);
          checkInterval = null;
        }
      }, 100);
    }

    // Cleanup: Destroy the instance and stop any pending intervals when unmounting
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (shareButtonRef.current) {
        shareButtonRef.current.destroy();
        shareButtonRef.current = null;
      }
    };
  }, []);

  /**
   * Update Effect
   * 
   * Synchronizes prop changes from Preact down to the vanilla JS instance 
   * without re-mounting the entire component.
   */
  
  // Stringify array dependencies to prevent unnecessary re-runs when 
  // parent components pass fresh array literals on every render.
  const hashtagsDep = JSON.stringify(hashtags);
  const platformsDep = JSON.stringify(platforms);

  useEffect(() => {
    if (shareButtonRef.current) {
      // Pass all updated props into the updateOptions method
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

  // The wrapper simply provides a mount point for the library
  return <div ref={containerRef}></div>;
}
