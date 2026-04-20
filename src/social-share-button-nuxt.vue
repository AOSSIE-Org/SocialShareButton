<!--
  SocialShareButton Nuxt/Vue 3 Wrapper

  This component provides a Vue 3 Composition API wrapper for the core vanilla JS
  SocialShareButton library. It is designed to be SSR-safe and handles the lifecycle 
  (mount/unmount) of the sharing instance.

  NOTE: This wrapper file is currently distributed manually and is not available via CDN.
  Consumers should copy this file into their project's `components/` directory.
-->
<template>
  <div ref="container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  url:           { type: String,   default: '' },
  title:         { type: String,   default: '' },
  description:   { type: String,   default: '' },
  hashtags:      { type: Array,    default: () => [] },
  via:           { type: String,   default: '' },
  platforms:     { type: Array,    default: () => ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit', 'pinterest'] },
  theme:         { type: String,   default: 'dark' },
  buttonText:    { type: String,   default: 'Share' },
  customClass:   { type: String,   default: '' },
  onShare:       { type: Function, default: null },
  onCopy:        { type: Function, default: null },
  buttonStyle:   { type: String,   default: 'default' },
  modalPosition: { type: String,   default: 'center' },
  buttonColor:   { type: String,   default: '' },
  buttonHoverColor: { type: String, default: '' },
  showButton:    { type: Boolean,  default: true },
  // Analytics
  analytics:        { type: Boolean,  default: true },
  onAnalytics:      { type: Function, default: null },
  analyticsPlugins: { type: Array,    default: () => [] },
  componentId:      { type: String,   default: null },
  debug:            { type: Boolean,  default: false }
});

const container = ref(null);
let shareButton = null;
let pollInterval = null;

const initButton = () => {
  if (shareButton || !container.value) return;
  
  shareButton = new window.SocialShareButton({
    container: container.value,
    url:           props.url || window.location.href,
    title:         props.title || document.title,
    description:   props.description,
    hashtags:      props.hashtags,
    via:           props.via,
    platforms:     props.platforms,
    theme:         props.theme,
    buttonText:    props.buttonText,
    customClass:   props.customClass,
    onShare:       props.onShare,
    onCopy:        props.onCopy,
    buttonStyle:   props.buttonStyle,
    modalPosition: props.modalPosition,
    buttonColor:   props.buttonColor,
    buttonHoverColor: props.buttonHoverColor,
    showButton:    props.showButton,
    analytics:     props.analytics,
    onAnalytics:   props.onAnalytics,
    analyticsPlugins: props.analyticsPlugins,
    componentId:   props.componentId,
    debug:         props.debug
  });
};

onMounted(() => {
  // SSR guard — Nuxt pre-renders on the server
  if (typeof window === 'undefined') return;

  if (window.SocialShareButton) {
    initButton();
  } else {
    let attempts = 0;
    const MAX_ATTEMPTS = 300; // ~30 seconds

    pollInterval = setInterval(() => {
      attempts++;
      if (window.SocialShareButton) {
        clearInterval(pollInterval);
        pollInterval = null;
        initButton();
      } else if (attempts >= MAX_ATTEMPTS) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    }, 100);
  }
});

onBeforeUnmount(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  if (shareButton) {
    shareButton.destroy();
    shareButton = null;
  }
});

// Sync prop changes to the underlying vanilla JS instance (e.g. Nuxt route changes)
watch(() => ({ ...props }), (newProps) => {
  if (shareButton) {
    const currentUrl = newProps.url || (typeof window !== 'undefined' ? window.location.href : '');
    const currentTitle = newProps.title || (typeof document !== 'undefined' ? document.title : '');
    
    shareButton.updateOptions({
      ...newProps,
      url: currentUrl,
      title: currentTitle
    });
  }
}, { deep: true });
</script>
