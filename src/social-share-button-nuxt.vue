<template>
  <div ref="container" :class="`social-share-button-nuxt ${customClass}`"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';

const props = defineProps({
  url: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  hashtags: { type: Array, default: () => [] },
  via: { type: String, default: '' },
  platforms: {
    type: Array,
    default: () => ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'],
  },
  theme: { type: String, default: 'dark' },
  buttonText: { type: String, default: 'Share' },
  customClass: { type: String, default: '' },
  onShare: { type: Function, default: null },
  onCopy: { type: Function, default: null },
  buttonStyle: { type: String, default: 'default' },
  modalPosition: { type: String, default: 'center' },
  analytics: { type: Boolean, default: false },
  onAnalytics: { type: Function, default: null },
  analyticsPlugins: { type: Array, default: () => [] },
  componentId: { type: String, default: null },
  debug: { type: Boolean, default: false },
});

const container = ref(null);
let shareButton = null;

const currentUrl = computed(
  () => props.url || (typeof window !== 'undefined' ? window.location.href : '')
);
const currentTitle = computed(
  () => props.title || (typeof document !== 'undefined' ? document.title : '')
);

const initShareButton = () => {
  if (typeof window === 'undefined' || !window.SocialShareButton || !container.value) {
    return;
  }

  shareButton = new window.SocialShareButton({
    container: container.value,
    url: currentUrl.value,
    title: currentTitle.value,
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
    analytics: props.analytics,
    onAnalytics: props.onAnalytics,
    analyticsPlugins: props.analyticsPlugins,
    componentId: props.componentId,
    debug: props.debug,
  });
};

const destroyShareButton = () => {
  if (shareButton && typeof shareButton.destroy === 'function') {
    shareButton.destroy();
    shareButton = null;
  }
};

onMounted(() => {
  initShareButton();
});

onBeforeUnmount(() => {
  destroyShareButton();
});

watch(
  () => [
    props.url,
    props.title,
    props.description,
    props.hashtags,
    props.via,
    props.platforms,
    props.theme,
    props.buttonText,
  ],
  () => {
    if (shareButton && typeof shareButton.updateOptions === 'function') {
      shareButton.updateOptions({
        url: currentUrl.value,
        title: currentTitle.value,
        description: props.description,
        hashtags: props.hashtags,
        via: props.via,
        platforms: props.platforms,
        theme: props.theme,
        buttonText: props.buttonText,
      });
    }
  }
);
</script>
