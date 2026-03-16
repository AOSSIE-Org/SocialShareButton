<script>
  import { onMount, onDestroy } from 'svelte';

  export let url = '';
  export let title = '';
  export let description = '';
  export let hashtags = [];
  export let via = '';
  export let platforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'];
  export let theme = 'dark';
  export let buttonText = 'Share';
  export let customClass = '';
  export let onShare = null;
  export let onCopy = null;
  export let buttonStyle = 'default';
  export let modalPosition = 'center';

  let container;
  let shareButton = null;

  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');

  onMount(() => {
    if (typeof window !== 'undefined' && window.SocialShareButton && container) {
      shareButton = new window.SocialShareButton({
        container,
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
  });

  onDestroy(() => {
    if (shareButton && typeof shareButton.destroy === 'function') {
      shareButton.destroy();
      shareButton = null;
    }
  });
</script>

<div bind:this={container} class={`social-share-button-svelte ${customClass}`}></div>
