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

  const defaultPlatforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'];

  const buildOptions = () => ({
    container,
    url: currentUrl(),
    title: currentTitle(),
    description: props.description ?? '',
    hashtags: props.hashtags ?? [],
    via: props.via ?? '',
    platforms: props.platforms ?? defaultPlatforms,
    theme: props.theme ?? 'dark',
    buttonText: props.buttonText ?? 'Share',
    customClass: props.customClass ?? '',
    buttonColor: props.buttonColor ?? '',
    buttonHoverColor: props.buttonHoverColor ?? '',
    onShare: props.onShare ?? null,
    onCopy: props.onCopy ?? null,
    buttonStyle: props.buttonStyle ?? 'default',
    modalPosition: props.modalPosition ?? 'center',
  });

  onMount(() => {
    // Guard: only run in the browser (SolidStart SSR safety).
    // If the CDN script has not yet executed, retry on a short interval
    // until window.SocialShareButton becomes available.
    if (typeof window === 'undefined') return;

    if (window.SocialShareButton) {
      shareButton = new window.SocialShareButton(buildOptions());
      return;
    }

    // CDN not yet loaded — poll until it is, then initialise
    const intervalId = setInterval(() => {
      if (window.SocialShareButton) {
        clearInterval(intervalId);
        shareButton = new window.SocialShareButton(buildOptions());
      }
    }, 50);

    // Safety: stop polling on cleanup if it never loaded
    onCleanup(() => clearInterval(intervalId));
  });

  // Re-apply options whenever any reactive prop changes.
  // Mirrors the same defaults used at mount so a first reactive flush
  // never overwrites initialised values with undefined.
  createEffect(() => {
    if (shareButton) {
      shareButton.updateOptions({
        url: currentUrl(),
        title: currentTitle(),
        description: props.description ?? '',
        hashtags: props.hashtags ?? [],
        via: props.via ?? '',
        platforms: props.platforms ?? defaultPlatforms,
        theme: props.theme ?? 'dark',
        buttonText: props.buttonText ?? 'Share',
        customClass: props.customClass ?? '',
        buttonColor: props.buttonColor ?? '',
        buttonHoverColor: props.buttonHoverColor ?? '',
        onShare: props.onShare ?? null,
        onCopy: props.onCopy ?? null,
        buttonStyle: props.buttonStyle ?? 'default',
        modalPosition: props.modalPosition ?? 'center',
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
