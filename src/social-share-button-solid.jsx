import { onMount, onCleanup, createEffect } from 'solid-js';

/**
 * Solid.js wrapper for SocialShareButton.
 *
 * Mirrors the React wrapper (social-share-button-react.jsx) using Solid.js
 * primitives: onMount / onCleanup for lifecycle and createEffect for reactive
 * prop updates.
 *
 * SSR Safety
 * ----------
 * SolidStart pre-renders on the server, so all browser-API access is guarded
 * with `typeof window !== 'undefined'` inside onMount (which only runs on the
 * client).
 *
 * Usage
 * -----
 * import SocialShareButton from './social-share-button-solid';
 *
 * <SocialShareButton
 *   url="https://your-website.com"
 *   title="Check this out!"
 *   description="An amazing website"
 *   theme="dark"
 *   buttonText="Share"
 * />
 */
export default function SocialShareButton(props) {
  let container;
  let shareButton;

  // Resolve URL and title once, with SSR-safe fallbacks
  const currentUrl = () => props.url || (typeof window !== 'undefined' ? window.location.href : '');
  const currentTitle = () => props.title || (typeof document !== 'undefined' ? document.title : '');

  onMount(() => {
    // Guard: only run in the browser (SolidStart SSR safety)
    if (typeof window !== 'undefined' && window.SocialShareButton) {
      shareButton = new window.SocialShareButton({
        container,
        url: currentUrl(),
        title: currentTitle(),
        description: props.description ?? '',
        hashtags: props.hashtags ?? [],
        via: props.via ?? '',
        platforms: props.platforms ?? [
          'whatsapp',
          'facebook',
          'twitter',
          'linkedin',
          'telegram',
          'reddit',
        ],
        theme: props.theme ?? 'dark',
        buttonText: props.buttonText ?? 'Share',
        customClass: props.customClass ?? '',
        onShare: props.onShare ?? null,
        onCopy: props.onCopy ?? null,
        buttonStyle: props.buttonStyle ?? 'default',
        modalPosition: props.modalPosition ?? 'center',
      });
    }
  });

  // Re-apply options whenever any reactive prop changes
  createEffect(() => {
    if (shareButton) {
      shareButton.updateOptions({
        url: currentUrl(),
        title: currentTitle(),
        description: props.description,
        hashtags: props.hashtags,
        via: props.via,
        platforms: props.platforms,
        theme: props.theme,
        buttonText: props.buttonText,
        customClass: props.customClass,
        onShare: props.onShare,
        onCopy: props.onCopy,
        buttonStyle: props.buttonStyle,
        modalPosition: props.modalPosition,
      });
    }
  });

  // Clean up the instance and its DOM nodes on component removal
  onCleanup(() => {
    if (shareButton) {
      shareButton.destroy();
      shareButton = null;
    }
  });

  // The vanilla library mounts inside this <div>
  return <div ref={container}></div>;
}
