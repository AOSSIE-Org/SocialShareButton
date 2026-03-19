import { component$, useVisibleTask$, useSignal, type QRL } from '@builder.io/qwik';

// Props for the SocialShareButton component
interface Props {
  url?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  via?: string;
  platforms?: string[];
  theme?: string;
  buttonText?: string;
  customClass?: string;
  buttonStyle?: string;
  modalPosition?: string;
  onShare?: QRL<() => void>;
  onCopy?: QRL<() => void>;
}

// Extend Window type so TypeScript knows SocialShareButton exists
declare global {
  interface Window {
    SocialShareButton: any;
  }
}

export const SocialShareButton = component$<Props>((props) => {
  // Use null instead of undefined to satisfy ref typing
  const container = useSignal<HTMLDivElement | null>(null);

  useVisibleTask$(({ cleanup }) => {
    if (typeof window !== 'undefined' && window.SocialShareButton && container.value) {
      const shareButton = new window.SocialShareButton({
        container: container.value,
        url: props.url || window.location.href,
        title: props.title || document.title,
        description: props.description || '',
        hashtags: props.hashtags || [],
        via: props.via || '',
        platforms:
          props.platforms || [
            'whatsapp',
            'facebook',
            'twitter',
            'linkedin',
            'telegram',
            'reddit',
          ],
        theme: props.theme || 'dark',
        buttonText: props.buttonText || 'Share',
        customClass: props.customClass || '',
        buttonStyle: props.buttonStyle || 'default',
        modalPosition: props.modalPosition || 'center',
      });

      cleanup(() => shareButton.destroy());
    }
  });

  return <div ref={container}></div>;
});