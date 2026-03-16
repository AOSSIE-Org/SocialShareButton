import { useEffect, useRef } from 'react';

/**
 * SocialShareButton — Remix-compatible React component.
 *
 * Remix is SSR-first and has no `'use client'` directive, so all browser-API
 * access must be gated inside a `useEffect` hook.  This component:
 *   1. Initialises the vanilla `window.SocialShareButton` in the first effect
 *      (runs only in the browser, never on the server).
 *   2. Calls `destroy()` on unmount to prevent memory leaks.
 *   3. Calls `updateOptions()` whenever any prop changes so the button always
 *      reflects the current route URL / page title without a full re-mount.
 *
 * @example
 * // app/routes/_index.tsx
 * import SocialShareButton from '~/components/social-share-button-remix';
 *
 * export default function Index() {
 *   return (
 *     <SocialShareButton
 *       url="https://your-website.com"
 *       title="Check this out!"
 *       description="An amazing website"
 *       theme="dark"
 *       buttonText="Share"
 *     />
 *   );
 * }
 */
export default function SocialShareButton({
  url = '',
  title = '',
  description = '',
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
}) {
  const containerRef = useRef(null);
  const shareButtonRef = useRef(null);

  // ── Mount: initialise once in the browser ──────────────────────────────
  useEffect(() => {
    // SSR guard — Remix always server-renders; browser APIs only available here.
    if (typeof window === 'undefined' || !window.SocialShareButton) return;

    shareButtonRef.current = new window.SocialShareButton({
      container: containerRef.current,
      url: url || window.location.href,
      title: title || document.title,
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
    });

    // Cleanup on unmount
    return () => {
      if (shareButtonRef.current) {
        shareButtonRef.current.destroy();
        shareButtonRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Prop updates: keep the button in sync without re-mounting ──────────
  useEffect(() => {
    if (!shareButtonRef.current) return;

    shareButtonRef.current.updateOptions({
      url,
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
    });
  }, [
    url,
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
  ]);

  return <div ref={containerRef}></div>;
}
