/**
 * SocialShareButton Web Component
 *
 * A native Web Component wrapper for SocialShareButton that can be used
 * in any HTML page or framework without dependencies.
 *
 * Usage:
 * <social-share-button url="https://example.com" title="My Page" platforms="whatsapp,facebook,twitter"></social-share-button>
 *
 * Or with JavaScript:
 * const btn = document.querySelector('social-share-button');
 * btn.url = 'https://new-url.com';
 */

class SocialShareButtonElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'url',
      'title',
      'description',
      'hashtags',
      'via',
      'platforms',
      'theme',
      'button-text',
      'button-style',
      'modal-position',
      'auto-detect',
    ];
  }

  constructor() {
    super();
    this._instance = null;
    this._shadow = null;
  }

  connectedCallback() {
    if (!this._shadow) {
      this._shadow = this.attachShadow({ mode: 'open' });
      this._shadow.innerHTML = '<div id="container"></div>';
    }
    this._initSocialShareButton();
  }

  disconnectedCallback() {
    this._destroySocialShareButton();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (this._instance) {
      this._updateOptions();
    }
  }

  get url() {
    return this.getAttribute('url') || (typeof window !== 'undefined' ? window.location.href : '');
  }

  set url(value) {
    this.setAttribute('url', value);
  }

  get title() {
    return this.getAttribute('title') || (typeof document !== 'undefined' ? document.title : '');
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get description() {
    return this.getAttribute('description') || '';
  }

  set description(value) {
    this.setAttribute('description', value);
  }

  get hashtags() {
    const attr = this.getAttribute('hashtags');
    return attr
      ? attr
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
  }

  set hashtags(value) {
    this.setAttribute('hashtags', Array.isArray(value) ? value.join(',') : value);
  }

  get via() {
    return this.getAttribute('via') || '';
  }

  set via(value) {
    this.setAttribute('via', value);
  }

  get platforms() {
    const attr = this.getAttribute('platforms');
    return attr
      ? attr
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
      : ['whatsapp', 'facebook', 'twitter', 'linkedin', 'telegram', 'reddit'];
  }

  set platforms(value) {
    this.setAttribute('platforms', Array.isArray(value) ? value.join(',') : value);
  }

  get theme() {
    return this.getAttribute('theme') || 'dark';
  }

  set theme(value) {
    this.setAttribute('theme', value);
  }

  get buttonText() {
    return this.getAttribute('button-text') || 'Share';
  }

  set buttonText(value) {
    this.setAttribute('button-text', value);
  }

  get buttonStyle() {
    return this.getAttribute('button-style') || 'default';
  }

  set buttonStyle(value) {
    this.setAttribute('button-style', value);
  }

  get modalPosition() {
    return this.getAttribute('modal-position') || 'center';
  }

  set modalPosition(value) {
    this.setAttribute('modal-position', value);
  }

  get autoDetect() {
    return this.getAttribute('auto-detect') === 'true';
  }

  set autoDetect(value) {
    this.setAttribute('auto-detect', String(value));
  }

  get analytics() {
    return this.getAttribute('analytics') !== 'false';
  }

  set analytics(value) {
    this.setAttribute('analytics', String(value));
  }

  get componentId() {
    return this.getAttribute('component-id') || null;
  }

  set componentId(value) {
    if (value === null) {
      this.removeAttribute('component-id');
    } else {
      this.setAttribute('component-id', value);
    }
  }

  get debug() {
    return this.getAttribute('debug') === 'true';
  }

  set debug(value) {
    this.setAttribute('debug', String(value));
  }

  _getOptions() {
    return {
      container: this._shadow.getElementById('container'),
      url: this.url,
      title: this.title,
      description: this.description,
      hashtags: this.hashtags,
      via: this.via,
      platforms: this.platforms,
      theme: this.theme,
      buttonText: this.buttonText,
      buttonStyle: this.buttonStyle,
      modalPosition: this.modalPosition,
      autoDetect: this.autoDetect,
      analytics: this.analytics,
      componentId: this.componentId,
      debug: this.debug,
    };
  }

  _initSocialShareButton() {
    if (typeof window !== 'undefined' && window.SocialShareButton) {
      this._instance = new window.SocialShareButton(this._getOptions());
    } else if (typeof window !== 'undefined') {
      const checkLib = setInterval(() => {
        if (window.SocialShareButton) {
          clearInterval(checkLib);
          this._instance = new window.SocialShareButton(this._getOptions());
        }
      }, 100);
    }
  }

  _updateOptions() {
    if (this._instance && typeof this._instance.updateOptions === 'function') {
      this._instance.updateOptions(this._getOptions());
    }
  }

  _destroySocialShareButton() {
    if (this._instance && typeof this._instance.destroy === 'function') {
      this._instance.destroy();
      this._instance = null;
    }
  }

  openModal() {
    if (this._instance && typeof this._instance.openModal === 'function') {
      this._instance.openModal();
    }
  }

  closeModal() {
    if (this._instance && typeof this._instance.closeModal === 'function') {
      this._instance.closeModal();
    }
  }
}

if (typeof window !== 'undefined' && !customElements.get('social-share-button')) {
  customElements.define('social-share-button', SocialShareButtonElement);
}

export { SocialShareButtonElement };
