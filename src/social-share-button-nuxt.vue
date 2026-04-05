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
  // Analytics
  analytics:        { type: Boolean,  default: true },
  onAnalytics:      { type: Function, default: null },
  analyticsPlugins: { type: Array,    default: () => [] },
  componentId:      { type: String,   default: null },
  debug:            { type: Boolean,  default: false }
});

const container = ref(null);
let shareButton = null;

onMounted(() => {
  // SSR guard — Nuxt pre-renders on the server
  if (typeof window !== 'undefined' && window.SocialShareButton) {
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
      analytics:     props.analytics,
      onAnalytics:   props.onAnalytics,
      analyticsPlugins: props.analyticsPlugins,
      componentId:   props.componentId,
      debug:         props.debug
    });
  }
});

onBeforeUnmount(() => {
  if (shareButton) {
    shareButton.destroy();
    shareButton = null;
  }
});

// Sync prop changes to the underlying vanilla JS instance (e.g. Nuxt route changes)
watch(props, (newProps) => {
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
