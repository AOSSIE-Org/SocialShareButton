/**
 * SocialShareButton - A lightweight, customizable social sharing component
 * @version 1.0.3
 * @license GPL-3.0
 */

/** Analytics event schema version. Increment when the payload shape changes. */
const ANALYTICS_SCHEMA_VERSION = "1.0";

class SocialShareButton {
  constructor(options = {}) {
    this.options = {
      url: options.url || (typeof window !== "undefined" ? window.location.href : ""),
      title: options.title || (typeof document !== "undefined" ? document.title : ""),
      description: options.description || "",
      hashtags: options.hashtags || [],
      via: options.via || "",
      platforms: options.platforms || [
        "whatsapp",
        "facebook",
        "twitter",
        "linkedin",
        "telegram",
        "reddit",
        "pinterest",
      ],
      theme: options.theme || "dark",
      buttonText: options.buttonText || "Share",
      customClass: options.customClass || "",
      buttonColor: options.buttonColor || "",
      buttonHoverColor: options.buttonHoverColor || "",
      onShare: options.onShare || null,
      onCopy: options.onCopy || null,
      container: options.container || null,
      showButton: options.showButton !== false,
      buttonStyle: options.buttonStyle || "default",
      modalPosition: options.modalPosition || "center",
      // Analytics — the library emits events but never collects or sends data itself.
      // Website owners wire up their own analytics tools via these options.
      analytics: options.analytics !== false, // set to false to disable all event emission
      onAnalytics: options.onAnalytics || null, // callback: (payload) => void
      analyticsPlugins: options.analyticsPlugins || [], // array of { track(payload) } adapters
      componentId: options.componentId || null, // optional identifier for this instance
      debug: options.debug || false, // log emitted events to console in development
    };

    this.isModalOpen = false;
    this.modal = null;
    this.button = null;
    this.customColorMouseEnterHandler = null;
    this.customColorMouseLeaveHandler = null;
    this.handleKeydown = null;
    this.listeners = []; // Central registry for all event listeners

    this.openTimeout = null; // Track setTimeout for openModal animation
    this.closeTimeout = null; // Track setTimeout for closeModal animation
    this.feedbackTimeout = null; // Track setTimeout for copy feedback reset
    this.ownsBodyLock = false; // Track if this instance owns the body overflow lock
    this.eventsAttached = false; // Guard against multiple attachEvents() calls
    this.isDestroyed = false; // Track if instance has been destroyed (prevents async callbacks)

    if (this.options.container) {
      this.init();
    }
  }

  init() {
    if (this.options.showButton) {
      this.createButton();
    }
    this.createModal();
    this.attachEvents();
    this.applyCustomColors();
  }

  createButton() {
    const button = document.createElement("button");
    button.className = `social-share-btn ${this.options.buttonStyle} ${this.options.customClass}`;
    button.setAttribute("aria-label", "Share");
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="share-icon">
        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
      </svg>
      <span>${this.options.buttonText}</span>
    `;

    this.button = button;
    if (this.options.container) {
      const container =
        typeof this.options.container === "string"
          ? document.querySelector(this.options.container)
          : this.options.container;

      if (container) {
        container.appendChild(button);
      }
    }
  }

  createModal() {
    const modal = document.createElement("div");
    modal.className = `social-share-modal-overlay ${this.options.theme}`;
    modal.style.display = "none";
    modal.innerHTML = `
      <div class="social-share-modal-content ${this.options.modalPosition}">
        <div class="social-share-modal-header">
          <h3>Share</h3>
          <button class="social-share-modal-close" aria-label="Close">✕</button>
        </div>
        <div class="social-share-platforms">
          ${this.getPlatformsHTML()}
        </div>
        <div class="social-share-link-container">
          <div class="social-share-link-input">
          </div>
          <button class="social-share-copy-btn">Copy</button>
        </div>
      </div>
    `;

    const urlInputContainer = modal.querySelector(".social-share-link-input");
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.value = this.options.url;
    urlInput.readOnly = true;
    urlInput.setAttribute("aria-label", "URL to share");
    urlInputContainer.appendChild(urlInput);

    this.modal = modal;
    document.body.appendChild(modal);
  }

  getPlatformsHTML() {
    const platforms = {
      whatsapp: {
        name: "WhatsApp",
        color: "#25D366",
        icon: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>',
      },
      facebook: {
        name: "Facebook",
        color: "#1877F2",
        icon: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
      },
      twitter: {
        name: "X",
        color: "#000000",
        icon: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
      },
      linkedin: {
        name: "LinkedIn",
        color: "#0A66C2",
        icon: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
      },
      telegram: {
        name: "Telegram",
        color: "#0088cc",
        icon: '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>',
      },
      reddit: {
        name: "Reddit",
        color: "#FF4500",
        icon: '<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>',
      },
      email: {
        name: "Email",
        color: "#7f7f7f",
        icon: '<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>',
      },
      pinterest: {
        name: "Pinterest",
        color: "#E60023",
        icon: '<path d="M12 0C5.372 0 0 5.373 0 12c0 4.99 3.052 9.267 7.386 11.059-.102-.94-.194-2.385.04-3.413.211-.904 1.356-5.752 1.356-5.752s-.346-.693-.346-1.717c0-1.608.932-2.808 2.093-2.808.987 0 1.463.741 1.463 1.63 0 .993-.632 2.476-.958 3.853-.273 1.155.58 2.098 1.718 2.098 2.062 0 3.646-2.174 3.646-5.31 0-2.778-1.997-4.722-4.847-4.722-3.304 0-5.242 2.478-5.242 5.039 0 .997.384 2.066.865 2.647.095.115.109.215.08.331-.088.365-.282 1.155-.321 1.316-.05.212-.165.257-.381.155-1.418-.66-2.305-2.733-2.305-4.397 0-3.579 2.601-6.867 7.497-6.867 3.936 0 6.998 2.805 6.998 6.557 0 3.91-2.466 7.058-5.892 7.058-1.15 0-2.232-.597-2.6-1.302l-.707 2.692c-.255.983-.946 2.215-1.408 2.966A12.002 12.002 0 0024 12C24 5.373 18.627 0 12 0z"/>',
      },
    };

    return this.options.platforms
      .filter((platform) => platforms[platform])
      .map((platform) => {
        const { name, color, icon } = platforms[platform];
        return `
          <button class="social-share-platform-btn" data-platform="${platform}" style="--platform-color: ${color}">
            <div class="social-share-platform-icon" style="background-color: ${color}">
              <svg viewBox="0 0 24 24" fill="white">${icon}</svg>
            </div>
            <span>${name}</span>
          </button>
        `;
      })
      .join("");
  }

  getShareURL(platform) {
    const { url, title, description, hashtags, via } = this.options;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    // const encodedDesc = encodeURIComponent(description);
    const hashtagString = hashtags.length ? "#" + hashtags.join(" #") : "";

    // Build platform-specific messages with customizable parameters
    let whatsappMessage,
      facebookMessage,
      twitterMessage,
      telegramMessage,
      redditTitle,
      emailBody,
      pinterestText;

    // WhatsApp: Casual with emoji
    whatsappMessage = `\u{1F680} ${title}${description ? "\n\n" + description : ""}${hashtagString ? "\n\n" + hashtagString : ""}\n\nLive on the site \u{1F440}\nClean UI, smooth flow \u{2014} worth peeking\n\u{1F447}`;

    // Facebook: Title + Description
    facebookMessage = `${title}${description ? "\n\n" + description : ""}${hashtagString ? "\n\n" + hashtagString : ""}`;

    // Twitter: Title + Description + Hashtags + Via
    twitterMessage = `${title}${description ? "\n\n" + description : ""}${hashtagString ? "\n" + hashtagString : ""}`;

    // Telegram: Casual with emoji
    telegramMessage = `\u{1F517} ${title}${description ? "\n\n" + description : ""}${hashtagString ? "\n\n" + hashtagString : ""}\n\nLive + working\nClean stuff, take a look \u{1F447}`;

    // Reddit: Title + Description
    redditTitle = `${title}${description ? " - " + description : ""}`;

    // Email: Friendly greeting
    emailBody = `Hey \u{1F44B}\n\nSharing a clean project I came across:\n${title}${description ? "\n\n" + description : ""}\n\nLive, simple, and usable \u{2014} take a look \u{1F447}`;

    // Pinterest: Title + Description
    pinterestText = `${title || ""}${description ? " - " + description : ""}`;

    const encodedWhatsapp = encodeURIComponent(whatsappMessage);
    const encodedFacebook = encodeURIComponent(facebookMessage);
    const encodedTwitter = encodeURIComponent(twitterMessage);
    const encodedTelegram = encodeURIComponent(telegramMessage);
    const encodedReddit = encodeURIComponent(redditTitle);
    const encodedEmail = encodeURIComponent(emailBody);
    const encodedPinterest = encodeURIComponent(pinterestText);

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedWhatsapp}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedFacebook}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTwitter}&url=${encodedUrl}${via ? "&via=" + encodeURIComponent(via) : ""}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTelegram}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedReddit}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedEmail}%20${encodedUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedPinterest}`,
    };

    return urls[platform] || "";
  }

  addEventListener(element, type, handler, options = false) {
    if (!element) return;
    element.addEventListener(type, handler, options);
    this.listeners.push({ element, type, handler, options });
  }

  //Remove all tracked event listeners (used in destroy to prevent memory leaks)
  removeAllListeners() {
    this.listeners.forEach(({ element, type, handler, options }) => {
      if (element) {
        element.removeEventListener(type, handler, options);
      }
    });
    this.listeners = [];
  }

  attachEvents() {
    // Re-entrancy guard: prevent double-registration if called multiple times
    if (this.eventsAttached) return;

    // Button click to open modal
    if (this.button) {
      const openModalHandler = () => this.openModal();
      this.addEventListener(this.button, "click", openModalHandler);
    }

    // Modal overlay click to close
    const modalClickHandler = (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    };
    this.addEventListener(this.modal, "click", modalClickHandler);

    // Close button
    const closeBtn = this.modal.querySelector(".social-share-modal-close");
    const closeBtnHandler = () => this.closeModal();
    this.addEventListener(closeBtn, "click", closeBtnHandler);

    // Platform buttons
    const platformBtns = this.modal.querySelectorAll(".social-share-platform-btn");
    platformBtns.forEach((btn) => {
      const platformHandler = () => {
        const platform = btn.dataset.platform;
        this.share(platform);
      };
      this.addEventListener(btn, "click", platformHandler);
    });

    // Copy button
    const copyBtn = this.modal.querySelector(".social-share-copy-btn");
    const copyBtnHandler = () => this.copyLink();
    this.addEventListener(copyBtn, "click", copyBtnHandler);

    // Input click to select
    const input = this.modal.querySelector(".social-share-link-input input");
    const inputSelectHandler = (e) => e.target.select();
    this.addEventListener(input, "click", inputSelectHandler);

    // ESC key to close
    this.handleKeydown = (e) => {
      if (e.key === "Escape" && this.isModalOpen) {
        this.closeModal();
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", this.handleKeydown);
    }

    this.eventsAttached = true; // Mark as attached
  }
  openModal() {
    // Safety check: prevent errors if modal was destroyed
    if (!this.modal) return;

    this.isModalOpen = true;
    this.modal.style.display = "flex";
    this._emit("social_share_popup_open", "popup_open");

    // Shared body overflow management: only increment counter if this instance doesn't already own the lock
    if (typeof document !== "undefined" && document.body) {
      if (!this.ownsBodyLock) {
        // Only increment if this instance doesn't already own a lock
        if (SocialShareButton.openModalCount === 0) {
          // Save original overflow before first modal opens
          SocialShareButton.originalBodyOverflow = document.body.style.overflow;
        }
        SocialShareButton.openModalCount++;
        this.ownsBodyLock = true; // Mark that this instance owns a lock
      }
      document.body.style.overflow = "hidden";
    }

    // Clear any pending animations (both open and close to prevent race conditions)
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }

    // Animate in
    this.openTimeout = setTimeout(() => {
      if (this.modal) {
        // Safety check in case destroy() was called
        this.modal.classList.add("active");
      }
      this.openTimeout = null;
    }, 10);
  }

  closeModal() {
    if (!this.modal) return; // Safety check

    this.modal.classList.remove("active");
    this._emit("social_share_popup_close", "popup_close");

    // Clear any pending animations (both open and close to prevent race conditions)
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }

    this.closeTimeout = setTimeout(() => {
      if (this.modal) {
        // Safety check in case destroy() was called
        this.isModalOpen = false;
        this.modal.style.display = "none";

        // Shared body overflow management: only decrement if this instance owns the lock
        if (this.ownsBodyLock && typeof document !== "undefined" && document.body) {
          // Decrement counter (guard against negative)
          if (SocialShareButton.openModalCount > 0) {
            SocialShareButton.openModalCount--;
          }
          this.ownsBodyLock = false; // Release the lock

          // Restore original overflow only when all modals are closed
          if (SocialShareButton.openModalCount === 0) {
            document.body.style.overflow = SocialShareButton.originalBodyOverflow || "";
            SocialShareButton.originalBodyOverflow = null;
          }
        }
      }
      this.closeTimeout = null;
    }, 200);
  }

  share(platform) {
    const shareUrl = this.getShareURL(platform);

    if (shareUrl) {
      this._emit("social_share_click", "share", { platform });

      if (platform === "email") {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=600");
      }

      this._emit("social_share_success", "share", { platform });

      if (this.options.onShare) {
        this.options.onShare(platform, this.options.url);
      }
    } else {
      this._emit("social_share_error", "error", {
        platform,
        errorMessage: `No share URL configured for platform: ${platform}`,
      });
    }
  }

  copyLink() {
    const input = this.modal.querySelector(".social-share-link-input input");
    const copyBtn = this.modal.querySelector(".social-share-copy-btn");

    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(this.options.url)
        .then(() => {
          // Guard against async callback after destroy
          if (this.isDestroyed) return;

          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("copied");
          this._emit("social_share_copy", "copy");

          if (this.options.onCopy) {
            this.options.onCopy(this.options.url);
          }

          // Clear any existing feedback timeout
          if (this.feedbackTimeout) {
            clearTimeout(this.feedbackTimeout);
          }

          // Track feedback timeout to prevent callback after destroy
          this.feedbackTimeout = setTimeout(() => {
            if (this.isDestroyed || !copyBtn) return; // Safety check
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
            this.feedbackTimeout = null;
          }, 2000);
        })
        .catch(() => {
          // Fallback to manual selection
          this.fallbackCopy(input, copyBtn);
        });
    } else {
      // Fallback for browsers without clipboard API
      this.fallbackCopy(input, copyBtn);
    }
  }

  fallbackCopy(input, copyBtn) {
    // Guard against execution after destroy
    if (this.isDestroyed) return;

    try {
      input.select();
      input.setSelectionRange(0, 99999); // For mobile devices
      document.execCommand("copy");

      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      this._emit("social_share_copy", "copy");

      if (this.options.onCopy) {
        this.options.onCopy(this.options.url);
      }

      // Clear any existing feedback timeout
      if (this.feedbackTimeout) {
        clearTimeout(this.feedbackTimeout);
      }

      // Track feedback timeout to prevent callback after destroy
      this.feedbackTimeout = setTimeout(() => {
        if (this.isDestroyed || !copyBtn) return; // Safety check
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
        this.feedbackTimeout = null;
      }, 2000);
    } catch (_err) {
      copyBtn.textContent = "Failed";

      // Clear any existing feedback timeout
      if (this.feedbackTimeout) {
        clearTimeout(this.feedbackTimeout);
      }

      // Track feedback timeout to prevent callback after destroy
      this.feedbackTimeout = setTimeout(() => {
        if (this.isDestroyed || !copyBtn) return; // Safety check
        copyBtn.textContent = "Copy";
        this.feedbackTimeout = null;
      }, 2000);
    }
  }

  destroy() {
    if (this.handleKeydown) {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", this.handleKeydown);
      }
      this.handleKeydown = null;
    }
    // Mark as destroyed to prevent async callbacks
    this.isDestroyed = true;

    // Remove all tracked event listeners (prevents memory leaks)
    this.removeAllListeners();

    // Clear any pending animation timeouts to prevent accessing null references
    if (this.openTimeout) {
      clearTimeout(this.openTimeout);
      this.openTimeout = null;
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
      this.feedbackTimeout = null;
    }

    // Remove custom color handlers
    if (this.button && this.customColorMouseEnterHandler) {
      this.button.removeEventListener("mouseenter", this.customColorMouseEnterHandler);
      this.customColorMouseEnterHandler = null;
    }
    if (this.button && this.customColorMouseLeaveHandler) {
      this.button.removeEventListener("mouseleave", this.customColorMouseLeaveHandler);
      this.customColorMouseLeaveHandler = null;
    }

    // Remove DOM elements
    if (this.button && this.button.parentNode) {
      this.button.parentNode.removeChild(this.button);
    }
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }

    // Shared body overflow management: only decrement if this instance owns the lock
    if (this.ownsBodyLock && typeof document !== "undefined" && document.body) {
      // Decrement counter (guard against negative)
      if (SocialShareButton.openModalCount > 0) {
        SocialShareButton.openModalCount--;
      }
      this.ownsBodyLock = false; // Release the lock

      // Restore original overflow only when all modals are closed
      if (SocialShareButton.openModalCount === 0) {
        document.body.style.overflow = SocialShareButton.originalBodyOverflow || "";
        SocialShareButton.originalBodyOverflow = null;
      }
    }

    // Clear references (makes destroy idempotent)
    this.button = null;
    this.modal = null;
    this.isModalOpen = false;
    this.eventsAttached = false; // Reset re-entrancy guard
  }

  updateOptions(options) {
    this.options = { ...this.options, ...options };

    // Update URL in modal if it exists
    if (this.modal) {
      const input = this.modal.querySelector(".social-share-link-input input");
      if (input) {
        input.value = this.options.url;
      }
    }

    // Reapply custom colors if color option changed
    if ("buttonColor" in options || "buttonHoverColor" in options) {
      this.applyCustomColors();
    }
  }

  applyCustomColors() {
    if (!this.button) return;

    // Remove legacy global style tag to prevent cross-instance color bleed.
    const styleTag = document.getElementById("social-share-custom-colors");
    if (styleTag && styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
    }

    if (this.customColorMouseEnterHandler) {
      this.button.removeEventListener("mouseenter", this.customColorMouseEnterHandler);
      this.customColorMouseEnterHandler = null;
    }
    if (this.customColorMouseLeaveHandler) {
      this.button.removeEventListener("mouseleave", this.customColorMouseLeaveHandler);
      this.customColorMouseLeaveHandler = null;
    }

    this.button.style.removeProperty("background-color");
    this.button.style.removeProperty("background-image");
    this.button.style.removeProperty("border-color");

    const baseColor = this.options.buttonColor || "";
    const hoverColor = this.options.buttonHoverColor || baseColor;

    if (!baseColor && !hoverColor) return;

    if (baseColor) {
      this.button.style.backgroundImage = "none";
      this.button.style.backgroundColor = baseColor;
      this.button.style.borderColor = baseColor;
    }

    this.customColorMouseEnterHandler = () => {
      if (hoverColor) {
        this.button.style.backgroundImage = "none";
        this.button.style.backgroundColor = hoverColor;
        this.button.style.borderColor = hoverColor;
      }
    };

    this.customColorMouseLeaveHandler = () => {
      if (baseColor) {
        this.button.style.backgroundImage = "none";
        this.button.style.backgroundColor = baseColor;
        this.button.style.borderColor = baseColor;
      } else {
        this.button.style.removeProperty("background-color");
        this.button.style.removeProperty("background-image");
        this.button.style.removeProperty("border-color");
      }
    };

    // Note: Custom color handlers are managed separately (not in listeners)
    // because they need to be removed/reapplied when colors change
    this.button.addEventListener("mouseenter", this.customColorMouseEnterHandler);
    this.button.addEventListener("mouseleave", this.customColorMouseLeaveHandler);
  }

  // ---------------------------------------------------------------------------
  // Analytics event system
  //
  // The library is privacy-by-design: it never collects, stores, or transmits
  // user data. _emit() only dispatches interaction events locally so that the
  // host website can forward them to whichever analytics tool they choose.
  //
  // Three delivery paths run in parallel for maximum flexibility:
  //   1. DOM CustomEvent  — works with CDN drops, vanilla JS, and any framework.
  //                         Multiple independent listeners can subscribe with
  //                         document.addEventListener('social-share', handler).
  //   2. onAnalytics hook — single direct callback, useful for inline setups.
  //   3. analyticsPlugins — adapter registry; each adapter's track() method is
  //                         called in turn, allowing GA4 + Mixpanel + custom
  //                         systems to all receive the same event simultaneously.
  // ---------------------------------------------------------------------------

  /**
   * Returns the host container element, or null when no container is configured.
   * @returns {Element|null}
   */
  _getContainer() {
    if (!this.options.container) return null;
    if (typeof document === "undefined") return null;
    return typeof this.options.container === "string"
      ? document.querySelector(this.options.container)
      : this.options.container;
  }

  /**
   * Logs analytics warnings only when debug mode is enabled.
   * @param {string} message - Description of the failed analytics path.
   * @param {Error} err - The caught error instance.
   */
  _debugWarn(message, err) {
    // _debugWarn: emit analytics warnings only in debug mode for visibility.
    if (!this.options.debug) return;
    // eslint-disable-next-line no-console
    console.warn("[SocialShareButton Analytics]", message, err);
  }

  /**
   * Emits an analytics event through all configured delivery paths.
   *
   * Standard payload schema
   * ─────────────────────────────────────────────────────────────────────────
   * {
   *   eventName      : string   — e.g. 'social_share_click'
   *   interactionType: string   — 'share' | 'copy' | 'popup_open' |
   *                               'popup_close' | 'error'
   *   platform       : string|null — 'twitter', 'facebook', etc.
   *   url            : string   — URL being shared
   *   title          : string   — page title
   *   timestamp      : number   — Unix ms (Date.now())
   *   componentId    : string|null — value of the componentId option
   *   errorMessage   : string   — only present on social_share_error events
   * }
   *
   * @param {string} eventName       - snake_case event identifier
   * @param {string} interactionType - broad interaction category
   * @param {Object} [extra]         - optional extra fields (platform, errorMessage)
   */
  _emit(eventName, interactionType, extra = {}) {
    if (this.options.analytics === false) return;

    const payload = {
      version: ANALYTICS_SCHEMA_VERSION,
      source: "social-share-button",
      eventName,
      interactionType,
      platform: extra.platform || null,
      url: this.options.url,
      title: this.options.title,
      timestamp: Date.now(),
      componentId: this.options.componentId,
    };

    if (extra.errorMessage) {
      payload.errorMessage = extra.errorMessage;
    }

    // Optional console output for development / debugging
    if (this.options.debug) {
      // eslint-disable-next-line no-console
      console.log("[SocialShareButton Analytics]", payload);
    }

    // Path 1 — DOM CustomEvent (framework-agnostic, CDN-friendly)
    // Bubbles from the container element so delegated listeners work naturally.
    if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") {
      try {
        const domEvent = new CustomEvent("social-share", {
          bubbles: true,
          cancelable: false,
          composed: true, // crosses shadow-DOM boundaries; safe to set in all envs
          detail: payload,
        });
        const el = this._getContainer();
        (el || document).dispatchEvent(domEvent);
      } catch (err) {
        this._debugWarn("DOM event dispatch failed", err);
      }
    }

    // Path 2 — onAnalytics callback (direct, single-consumer hook)
    if (typeof this.options.onAnalytics === "function") {
      try {
        this.options.onAnalytics(payload);
      } catch (err) {
        this._debugWarn("onAnalytics callback failed", err);
      }
    }

    // Path 3 — plugin / adapter registry (supports multiple simultaneous consumers)
    if (Array.isArray(this.options.analyticsPlugins)) {
      for (const plugin of this.options.analyticsPlugins) {
        if (plugin && typeof plugin.track === "function") {
          try {
            plugin.track(payload);
          } catch (err) {
            this._debugWarn("plugin.track() failed", err);
          }
        }
      }
    }
  }
}

// Static properties for shared body overflow management across all instances
SocialShareButton.openModalCount = 0;
SocialShareButton.originalBodyOverflow = null;

// Export for different module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = SocialShareButton;
}

if (typeof window !== "undefined") {
  window.SocialShareButton = SocialShareButton;
}