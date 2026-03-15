import { useEffect, useRef } from 'react';

// Import SocialShareButton directly for ESM bundles, fall back to window for CDN
import SocialShareButtonCore from './social-share-button.js';

export const SocialShareButton = ({
  url,
  title,
  description,
  hashtags = [],
  via = '',
  platforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'],
  theme = 'dark',
  buttonText = 'Share',
  customClass = '',
  onShare = null,
  onCopy = null,
  buttonStyle = 'default',
  modalPosition = 'center',
  // Content auto-detection — set to false when all props are always provided.
  autoDetect = true,
  // Analytics props — the library itself never collects data.
  // Provide any combination to connect your own analytics tools.
  analytics = true, // set to false to disable all event emission
  onAnalytics = null, // (payload) => void — direct callback hook
  analyticsPlugins = [], // array of adapter instances (see social-share-analytics.js)
  componentId = null, // optional string identifier for this instance
  debug = false, // log events to console during development
}) => {
  const containerRef = useRef(null);
  const shareButtonRef = useRef(null);

  // Resolve URL — fall back to current page URL but leave title/description
  // undefined when not provided so the core SocialShareButton auto-detection
  // priority chain (og:title → twitter:title → h1 → document.title etc.) runs.
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    if (containerRef.current && !shareButtonRef.current) {
      // Use imported class for ESM bundles, fall back to window for CDN script tags
      const ShareButtonConstructor =
        SocialShareButtonCore || (typeof window !== 'undefined' ? window.SocialShareButton : null);

      if (ShareButtonConstructor) {
        // Only include title/description in the options object when explicitly
        // provided — omitting them lets the core detector's priority chain run.
        const initOptions = {
          container: containerRef.current,
          url: currentUrl,
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
          autoDetect,
          analytics,
          onAnalytics,
          analyticsPlugins,
          componentId,
          debug,
        };
        if (title !== undefined) initOptions.title = title;
        if (description !== undefined) initOptions.description = description;
        shareButtonRef.current = new ShareButtonConstructor(initOptions);
      }
    }

    return () => {
      if (shareButtonRef.current) {
        shareButtonRef.current.destroy();
        shareButtonRef.current = null;
      }
    };
  }, []);

  // Update options when props change (including URL from route changes).
  // Also bust the content-detection cache so the new page's metadata is used.
  useEffect(() => {
    if (shareButtonRef.current) {
      // Invalidate detection cache on every route/prop change so the new
      // page content is picked up when autoDetect is enabled.
      if (autoDetect) {
        const ShareButtonConstructor =
          SocialShareButtonCore ||
          (typeof window !== 'undefined' ? window.SocialShareButton : null);

        if (
          ShareButtonConstructor &&
          typeof ShareButtonConstructor.clearContentCache === 'function'
        ) {
          ShareButtonConstructor.clearContentCache();
        }
      }

      const updateOpts = {
        url: currentUrl,
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
        autoDetect,
        analytics,
        onAnalytics,
        analyticsPlugins,
        componentId,
        debug,
      };
      if (title !== undefined) updateOpts.title = title;
      if (description !== undefined) updateOpts.description = description;
      shareButtonRef.current.updateOptions(updateOpts);
    }
  }, [
    currentUrl,
    title,
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
    autoDetect,
    analytics,
    onAnalytics,
    analyticsPlugins,
    componentId,
    debug,
  ]);

  return <div ref={containerRef}></div>;
};

export default SocialShareButton;
