import { component$, useVisibleTask$, useSignal, type QRL } from '@builder.io/qwik';

interface Props {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  platforms?: string[];
  theme?: 'dark' | 'light';
  buttonText?: string;
  customClass?: string;
  buttonStyle?: 'default' | 'primary' | 'compact' | 'icon-only';
  modalPosition?: 'center' | 'top' | 'bottom';
  onShare?: QRL<(platform: string, url: string) => void>;
  onCopy?: QRL<(url: string) => void>;
}

export const SocialShareButton = component$<Props>((props) => {
  const containerRef = useSignal<HTMLDivElement>();

  
  useVisibleTask$(({ cleanup }) => {
    if (typeof window !== 'undefined' && (window as any).SocialShareButton && containerRef.value) {
      const shareButton = new (window as any).SocialShareButton({
        container: containerRef.value,
        url: props.url || window.location.href,
        title: props.title || document.title,
        description: props.description || '',
        hashtags: props.hashtags || [],
        via: props.via || '',
        platforms: props.platforms || ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'],
        theme: props.theme || 'dark',
        buttonText: props.buttonText || 'Share',
        customClass: props.customClass || '',
        buttonStyle: props.buttonStyle || 'default',
        modalPosition: props.modalPosition || 'center',
        onShare: props.onShare,
        onCopy: props.onCopy,
      });


      cleanup(() => {
        if (shareButton && typeof shareButton.destroy === 'function') {
          shareButton.destroy();
        }
      });
    }
  });

  return <div ref={containerRef} class="qwik-social-share-wrapper"></div>;
});