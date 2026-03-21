<!-- Svelte 4 + 5 compat: disable runes so export-let props work in both versions -->
<svelte:options runes={false} />

<script>
  import { onMount, onDestroy } from 'svelte';

  export let url = '';
  export let title = '';
  export let description = '';
  export let hashtags = [];
  export let via = '';
  export let platforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit', 'pinterest'];
  export let theme = 'dark';
  export let buttonText = 'Share';
  export let customClass = '';
  export let onShare = null;
  export let onCopy = null;
  export let buttonStyle = 'default';
  export let modalPosition = 'center';
  // Analytics — the library itself never collects data.
  // Provide any combination to connect your own analytics tools.
  export let analytics = true;       // set to false to disable all event emission
  export let onAnalytics = null;     // (payload) => void — direct callback hook
  export let analyticsPlugins = [];  // array of adapter instances (see social-share-analytics.js)
  export let componentId = null;     // optional string identifier for this instance
  export let debug = false;          // log events to console during development

  let container;
  let shareButton = null;

  onMount(() => {
    // SSR guard — SvelteKit pre-renders on the server where window is undefined
    if (typeof window !== 'undefined' && window.SocialShareButton && container) {
      shareButton = new window.SocialShareButton({
        container,
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
        analytics,
        onAnalytics,
        analyticsPlugins,
        componentId,
        debug,
      });
    }
  });

  onDestroy(() => {
    if (shareButton) {
      shareButton.destroy();
      shareButton = null;
    }
  });

  // Reactive update — re-runs whenever any prop changes (e.g. SvelteKit route transitions).
  // Without this, the share URL stays stale after client-side navigation.
  $: if (shareButton) {
    shareButton.updateOptions({
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
      title: title || (typeof document !== 'undefined' ? document.title : ''),
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
</script>

<div bind:this={container}></div>
