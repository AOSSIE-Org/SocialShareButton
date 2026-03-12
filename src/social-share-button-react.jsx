import { useEffect, useRef } from 'react';

/**
 * SocialShareButton - React wrapper for the SocialShareButton vanilla-JS library.
 *
 * Mounts the imperative {@link window.SocialShareButton} instance into a `<div>`
 * ref on first render, syncs all prop changes to the underlying instance via
 * `updateOptions()`, and calls `destroy()` on unmount to clean up listeners and
 * DOM nodes.
 *
 * @param {Object}    props                       - Component props.
 * @param {string}    [props.url]                 - URL to share; defaults to `window.location.href`.
 * @param {string}    [props.title]               - Share title; defaults to `document.title`.
 * @param {string}    [props.description]         - Optional description appended to share text.
 * @param {string[]}  [props.hashtags=[]]         - Hashtags (without '#') for supported platforms.
 * @param {string}    [props.via='']              - Twitter @username to attribute the tweet to.
 * @param {string[]}  [props.platforms]           - Platforms to display; defaults to all six built-ins.
 * @param {string}    [props.theme='dark']        - Modal colour theme: `'dark'` or `'light'`.
 * @param {string}    [props.buttonText='Share']  - Label rendered inside the share button.
 * @param {string}    [props.customClass='']      - Extra CSS class(es) added to the share button.
 * @param {Function}  [props.onShare=null]        - Callback fired after a platform link is opened.
 * @param {Function}  [props.onCopy=null]         - Callback fired after the URL is copied to clipboard.
 * @param {string}    [props.buttonStyle='default'] - Visual variant of the trigger button (e.g. `'pill'`).
 * @param {string}    [props.modalPosition='center'] - Where the share modal appears: `'center'`, `'bottom'`, etc.
 * @returns {JSX.Element} A single `<div>` container element into which the share button is mounted.
 */
export const SocialShareButton = ({
  url,
  title,
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
}) => {
  /** @type {React.RefObject<HTMLDivElement>} Ref attached to the host `<div>` that the library mounts into. */
  const containerRef = useRef(null);

  /** @type {React.RefObject<InstanceType<window.SocialShareButton>|null>} Ref holding the active library instance. */
  const shareButtonRef = useRef(null);

  // Auto-detect current URL and title if not provided by the caller.
  /** @type {string} Resolved share URL: prop value or current page href. */
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  /** @type {string} Resolved share title: prop value or current document title. */
  const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');

  /**
   * Mount effect: creates a new SocialShareButton instance when the component
   * mounts and `window.SocialShareButton` is available. Runs only once (empty
   * dependency array). The cleanup function calls `destroy()` on unmount to
   * remove event listeners and DOM nodes, preventing memory leaks.
   */
  useEffect(() => {
    if (containerRef.current && !shareButtonRef.current) {
      if (typeof window !== 'undefined' && window.SocialShareButton) {
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

  /**
   * Sync effect: forwards updated prop values to the underlying library instance
   * via `updateOptions()` whenever any prop (or derived URL/title) changes.
   * This handles SPA route changes where `url` or `title` may update without
   * remounting the component.
   */
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
  ]);

  /** Render a plain container div; the library populates its contents imperatively. */
  return <div ref={containerRef}></div>;
};

export default SocialShareButton;
