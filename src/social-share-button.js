/**
 * SocialShareButton - A lightweight, customizable social sharing component
 * @version 1.0.4
 * @license GPL-3.0
 */

class SocialShareButton {
  constructor(options = {}) {
    this.options = {
      url: options.url || (typeof window !== 'undefined' ? window.location.href : ''),
      title: options.title || (typeof document !== 'undefined' ? document.title : ''),
      description: options.description || '',
      hashtags: options.hashtags || [],
      via: options.via || '',
      platforms: options.platforms || ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'],
      theme: options.theme || 'dark',
      buttonText: options.buttonText || 'Share',
      customClass: options.customClass || '',
      buttonColor: options.buttonColor || '',
      buttonHoverColor: options.buttonHoverColor || '',
      onShare: options.onShare || null,
      onCopy: options.onCopy || null,
      container: options.container || null,
      showButton: options.showButton !== false,
      buttonStyle: options.buttonStyle || 'default',
      modalPosition: options.modalPosition || 'center'
    };

    this.isModalOpen = false;
    this.modal = null;
    this.button = null;
    this._listeners = []; // Track event listeners

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
    const button = document.createElement('button');
    button.className = `social-share-btn ${this.options.buttonStyle} ${this.options.customClass}`;
    button.setAttribute('aria-label', 'Share');
    button.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="share-icon">
        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08Z" fill="currentColor"/>
      </svg>
      <span>${this.options.buttonText}</span>
    `;

    this.button = button;
    if (this.options.container) {
      const container = typeof this.options.container === 'string' 
        ? document.querySelector(this.options.container)
        : this.options.container;
      
      if (container) {
        container.appendChild(button);
      }
    }
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = `social-share-modal-overlay ${this.options.theme}`;
    modal.style.display = 'none';
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

    const urlInputContainer = modal.querySelector('.social-share-link-input');
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = this.options.url;
    urlInput.readOnly = true;
    urlInput.setAttribute('aria-label', 'URL to share');
    urlInputContainer.appendChild(urlInput);

    this.modal = modal;
    document.body.appendChild(modal);
  }

  getPlatformsHTML() {
    const platforms = {
      whatsapp: { name: 'WhatsApp', color: '#25D366', icon: '<path .../>' },
      facebook: { name: 'Facebook', color: '#1877F2', icon: '<path .../>' },
      twitter: { name: 'X', color: '#000000', icon: '<path .../>' },
      linkedin: { name: 'LinkedIn', color: '#0A66C2', icon: '<path .../>' },
      telegram: { name: 'Telegram', color: '#0088cc', icon: '<path .../>' },
      reddit: { name: 'Reddit', color: '#FF4500', icon: '<path .../>' },
      email: { name: 'Email', color: '#7f7f7f', icon: '<path .../>' }
    };

    return this.options.platforms
      .filter(platform => platforms[platform])
      .map(platform => {
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
      .join('');
  }

  getShareURL(platform) {
    const { url, title, description, hashtags, via } = this.options;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);
    const hashtagString = hashtags.length ? '#' + hashtags.join(' #') : '';

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`🚀 ${title}${description ? '\n\n' + description : ''}${hashtagString ? '\n\n' + hashtagString : ''}\n\nLive on the site 👀\nClean UI, smooth flow — worth peeking\n👇`)}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(title + (description ? '\n\n' + description : '') + (hashtagString ? '\n\n' + hashtagString : ''))}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + (description ? '\n\n' + description : '') + (hashtagString ? '\n' + hashtagString : ''))}&url=${encodedUrl}${via ? '&via=' + encodeURIComponent(via) : ''}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`🔗 ${title}${description ? '\n\n' + description : ''}${hashtagString ? '\n\n' + hashtagString : ''}\n\nLive + working\nClean stuff, take a look 👇`)}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent(title + (description ? ' - ' + description : ''))}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`Hey 👋\n\nSharing a clean project I came across:\n${title}${description ? '\n\n' + description : ''}\n\nLive, simple, and usable — take a look 👇`)}%20${encodedUrl}`
    };

    return urls[platform] || '';
  }

  attachEvents() {
    if (this.button) {
      const buttonClick = () => this.openModal();
      this.button.addEventListener('click', buttonClick);
      this._listeners.push({ element: this.button, type: 'click', handler: buttonClick });
    }

    const modalClick = (e) => { if (e.target === this.modal) this.closeModal(); };
    this.modal.addEventListener('click', modalClick);
    this._listeners.push({ element: this.modal, type: 'click', handler: modalClick });

    const closeBtn = this.modal.querySelector('.social-share-modal-close');
    const closeClick = () => this.closeModal();
    closeBtn.addEventListener('click', closeClick);
    this._listeners.push({ element: closeBtn, type: 'click', handler: closeClick });

    const platformBtns = this.modal.querySelectorAll('.social-share-platform-btn');
    platformBtns.forEach(btn => {
      const platformClick = () => this.share(btn.dataset.platform);
      btn.addEventListener('click', platformClick);
      this._listeners.push({ element: btn, type: 'click', handler: platformClick });
    });

    const copyBtn = this.modal.querySelector('.social-share-copy-btn');
    const copyClick = () => this.copyLink();
    copyBtn.addEventListener('click', copyClick);
    this._listeners.push({ element: copyBtn, type: 'click', handler: copyClick });

    const input = this.modal.querySelector('.social-share-link-input input');
    const inputClick = (e) => e.target.select();
    input.addEventListener('click', inputClick);
    this._listeners.push({ element: input, type: 'click', handler: inputClick });

    const escKeydown = (e) => { if (e.key === 'Escape' && this.isModalOpen) this.closeModal(); };
    document.addEventListener('keydown', escKeydown);
    this._listeners.push({ element: document, type: 'keydown', handler: escKeydown });
  }

  openModal() {
    this.isModalOpen = true;
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => this.modal.classList.add('active'), 10);
  }

  closeModal() {
    this.modal.classList.remove('active');
    setTimeout(() => {
      this.isModalOpen = false;
      this.modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 200);
  }

  share(platform) {
    const shareUrl = this.getShareURL(platform);
    if (shareUrl) {
      if (platform === 'email') window.location.href = shareUrl;
      else window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');

      if (this.options.onShare) this.options.onShare(platform, this.options.url);
    }
  }

  copyLink() {
    const input = this.modal.querySelector('.social-share-link-input input');
    const copyBtn = this.modal.querySelector('.social-share-copy-btn');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.options.url).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        if (this.options.onCopy) this.options.onCopy(this.options.url);
        setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
      }).catch(() => this.fallbackCopy(input, copyBtn));
    } else this.fallbackCopy(input, copyBtn);
  }

  fallbackCopy(input, copyBtn) {
    try {
      input.select();
      input.setSelectionRange(0, 99999);
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      if (this.options.onCopy) this.options.onCopy(this.options.url);
      setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
    } catch {
      copyBtn.textContent = 'Failed';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
    }
  }

  destroy() {
    // Remove all event listeners
    this._listeners.forEach(({ element, type, handler }) => element.removeEventListener(type, handler));
    this._listeners = [];

    // Remove DOM elements
    if (this.button && this.button.parentNode) this.button.parentNode.removeChild(this.button);
    if (this.modal && this.modal.parentNode) this.modal.parentNode.removeChild(this.modal);
    document.body.style.overflow = '';
  }

  updateOptions(options) {
    this.options = { ...this.options, ...options };
    if (this.modal) {
      const input = this.modal.querySelector('.social-share-link-input input');
      if (input) input.value = this.options.url;
    }
    if (options.buttonColor || options.buttonHoverColor) this.applyCustomColors();
  }

  applyCustomColors() {
    if (!this.options.buttonColor && !this.options.buttonHoverColor) return;
    let styleTag = document.getElementById('social-share-custom-colors');
    if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'social-share-custom-colors'; document.head.appendChild(styleTag); }
    let css = '';
    const buttonClass = this.options.customClass ? `.${this.options.customClass}.social-share-btn` : '.social-share-btn';
    if (this.options.buttonColor) css += `${buttonClass} { background-color: ${this.options.buttonColor} !important; background-image: none !important; }\n`;
    if (this.options.buttonHoverColor) css += `${buttonClass}:hover { background-color: ${this.options.buttonHoverColor} !important; }\n`;
    styleTag.textContent = css;
  }
}

// Export for different module system
if (typeof module !== 'undefined' && module.exports){
  module.exports = SocialShareButton;
}
if (typeof window !== 'undefined'){
  window.SocialShareButton = SocialShareButton;
}
