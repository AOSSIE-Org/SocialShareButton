import React, { useEffect, useRef } from "react";

export const SocialShareButton = ({
  url,
  title,
  description = "",
  hashtags = [],
via = "",
  platforms = [
    "whatsapp",
    "facebook",
    "twitter",
    "linkedin",
    "telegram",
    "reddit",
    "email"
  ],
  theme = "dark",
  buttonText = "Share",
  customClass = "",
  onShare = null,
  onCopy = null,
  buttonStyle = "default",
  modalPosition = "center",
}) => {
  const containerRef = useRef(null);
  const shareButtonRef = useRef(null);

  // Auto-detect current URL and title if not provided
  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const currentTitle =
    title || (typeof document !== "undefined" ? document.title : "");

  useEffect(() => {
    if (containerRef.current && !shareButtonRef.current) {
      if (typeof window !== "undefined" && window.SocialShareButton) {
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

  // Update options when props change (including URL from route changes)
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

  return <div ref={containerRef}></div>;
};

export default SocialShareButton;
