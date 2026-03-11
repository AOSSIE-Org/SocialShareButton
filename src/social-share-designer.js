/**
 * SocialShareDesigner
 * Visual customization panel for SocialShareButton via CSS custom properties
 * @version 1.0.0
 * @license GPL-3.0
 */

(function (root) {
  'use strict';

  /* ── Platform registry ───────────────────────────────────── */
  const PLATFORMS = {
    whatsapp:  { name: 'WhatsApp',  color: '#25D366', emoji: '💬' },
    facebook:  { name: 'Facebook',  color: '#1877F2', emoji: 'f'  },
    twitter:   { name: 'X',         color: '#000000', emoji: 'X'  },
    linkedin:  { name: 'LinkedIn',  color: '#0A66C2', emoji: 'in' },
    telegram:  { name: 'Telegram',  color: '#0088cc', emoji: '✈'  },
    reddit:    { name: 'Reddit',    color: '#FF4500', emoji: 'r'  },
    email:     { name: 'Email',     color: '#7f7f7f', emoji: '✉'  },
  };

  const ALL_PLATFORMS = Object.keys(PLATFORMS);

  /* ── CSS variable defaults (mirrors social-share-button.css) ─ */
  const DEFAULTS = {
    '--ssb-btn-bg':             '',
    '--ssb-btn-radius':         '8px',
    '--ssb-btn-font-size':      '14px',
    '--ssb-btn-font-weight':    '500',
    '--ssb-btn-border-width':   '1px',
    '--ssb-btn-border-color':   'rgba(255,255,255,0.2)',
    '--ssb-btn-gradient-start': '',
    '--ssb-btn-gradient-end':   '',
    '--ssb-modal-bg':           '#282828',
    '--ssb-modal-width':        '540px',
    '--ssb-modal-radius':       '12px',
    '--ssb-modal-speed':        '0.3s',
    '--ssb-icon-size':          '56px',
    '--ssb-icon-shape':         '50%',
    '--ssb-accent':             '#3ea6ff',
    '--ssb-hover-scale':        '1.05',
    '--ssb-font-family':        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    '--ssb-shadow-intensity':   '0',
  };

  /* ── Shadow map ──────────────────────────────────────────── */
  const SHADOW_MAP = {
    none:   'none',
    low:    '0 2px 8px rgba(0,0,0,0.25)',
    medium: '0 4px 16px rgba(0,0,0,0.4)',
    high:   '0 8px 32px rgba(0,0,0,0.65)',
  };

  /* ── Preset button colors ─────────────────────────────────── */
  const PRESET_COLORS = [
    { label: 'Default', value: '' },
    { label: 'Blue',    value: '#3ea6ff' },
    { label: 'Purple',  value: '#764ba2' },
    { label: 'Green',   value: '#25D366' },
    { label: 'Red',     value: '#FF4500' },
    { label: 'Orange',  value: '#f5c518' },
    { label: 'Dark',    value: '#1a1a1a' },
  ];

  /* ================================================================
     SocialShareDesigner
  ================================================================ */
  class SocialShareDesigner {
    constructor(options = {}) {
      this._panelContainer =
        typeof options.panelContainer === 'string'
          ? document.querySelector(options.panelContainer)
          : options.panelContainer;

      /* targetButton: string selector → CSS-vars only
                       instance       → full control  */
      this._targetSelector =
        typeof options.targetButton === 'string' ? options.targetButton : null;
      this._instance =
        typeof options.targetButton === 'object' && options.targetButton !== null
          ? options.targetButton
          : null;

      /* Internal state */
      this._state = {
        theme:           'dark',
        buttonStyle:     'default',
        platforms:       [...ALL_PLATFORMS],
        buttonColor:     '',
        gradientEnabled: false,
        gradientStart:   '#667eea',
        gradientEnd:     '#764ba2',
        platformColors:  {},  // { whatsapp: '#ff0000', ... }
      };

      this._modifiedVars = {}; // tracks which CSS vars were changed
      this._observer    = null;

      if (!this._panelContainer) {
        console.warn('[SocialShareDesigner] panelContainer not found.');
        return;
      }

      this._render();
      this._setupMutationObserver();
    }

    /* ── CSS var helpers ───────────────────────────────────── */
    _setCSSVar(name, value) {
      if (value === '' || value === null || value === undefined) {
        document.documentElement.style.removeProperty(name);
        delete this._modifiedVars[name];
      } else {
        document.documentElement.style.setProperty(name, value);
        this._modifiedVars[name] = value;
      }

      /* Also set background directly on the button element for gradient/solid conflict */
      if (name === '--ssb-btn-bg') {
        const el = this._getButtonEl();
        if (el) {
          if (value) {
            el.style.setProperty('background', value);
          } else {
            el.style.removeProperty('background');
          }
        }
      }
    }

    _resetAllVars() {
      Object.keys(this._modifiedVars).forEach(name => {
        document.documentElement.style.removeProperty(name);
      });
      this._modifiedVars = {};

      /* Remove direct element background override */
      const el = this._getButtonEl();
      if (el) el.style.removeProperty('background');
    }

    /* ── DOM helpers ───────────────────────────────────────── */
    _getButtonEl() {
      if (this._targetSelector) {
        const container = document.querySelector(this._targetSelector);
        return container ? container.querySelector('.social-share-btn') : null;
      }
      if (this._instance && this._instance.button) return this._instance.button;
      return null;
    }

    _getOverlayEl() {
      if (this._instance && this._instance.modal) return this._instance.modal;
      return document.querySelector('.social-share-modal-overlay');
    }

    _getPlatformsContainerEl() {
      const overlay = this._getOverlayEl();
      return overlay ? overlay.querySelector('.social-share-platforms') : null;
    }

    /* ── MutationObserver for per-platform colors ──────────── */
    _setupMutationObserver() {
      const overlay = this._getOverlayEl();
      if (!overlay) return;

      this._observer = new MutationObserver(() => {
        if (overlay.classList.contains('active')) {
          this._applyPlatformColors();
        }
      });
      this._observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    }

    _applyPlatformColors() {
      const overlay = this._getOverlayEl();
      if (!overlay) return;
      Object.entries(this._state.platformColors).forEach(([platform, color]) => {
        const icon = overlay.querySelector(
          `.social-share-platform-btn[data-platform="${platform}"] .social-share-platform-icon`
        );
        if (icon) icon.style.backgroundColor = color;
      });
    }

    /* ── Instance control helpers ─────────────────────────── */
    _applyTheme(theme) {
      this._state.theme = theme;

      /* Update real modal overlay */
      const overlay = this._getOverlayEl();
      if (overlay) {
        overlay.className = overlay.className
          .replace(/\b(light|dark)\b/g, '')
          .trim() + ' ' + theme;
      }

      /* Update preview overlay */
      const previewOverlay = document.getElementById('ssb-preview-overlay');
      if (previewOverlay) {
        previewOverlay.className = 'social-share-modal-overlay ' + theme;
      }

      /* If we have a full instance, also update its options record */
      if (this._instance) {
        this._instance.options.theme = theme;
      }
    }

    _buildPlatformHTML(activePlatforms) {
      return activePlatforms
        .filter(p => PLATFORMS[p])
        .map(p => {
          const { name, color, emoji } = PLATFORMS[p];
          const customColor = this._state.platformColors[p] || color;
          return `
            <button class="social-share-platform-btn" data-platform="${p}" style="--platform-color:${customColor}">
              <div class="social-share-platform-icon" style="background-color:${customColor}">
                <span style="color:#fff;font-size:18px;font-weight:700;line-height:1;font-family:sans-serif;">${emoji}</span>
              </div>
              <span>${name}</span>
            </button>`;
        })
        .join('');
    }

    _applyPlatforms(activePlatforms) {
      this._state.platforms = activePlatforms;

      /* Update preview */
      const previewPlatforms = document.getElementById('ssb-preview-platforms');
      if (previewPlatforms) {
        previewPlatforms.innerHTML = this._buildPlatformHTML(activePlatforms);
      }

      /* Update real modal */
      const container = this._getPlatformsContainerEl();
      if (container) {
        container.innerHTML = this._buildPlatformHTML(activePlatforms);
        /* Re-attach share listeners on real modal buttons */
        container.querySelectorAll('.social-share-platform-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            if (this._instance) {
              this._instance.share(platform);
            }
          });
        });
      }
    }

    /* ── Toast notification ────────────────────────────────── */
    _showToast(msg) {
      let toast = document.getElementById('ssb-designer-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ssb-designer-toast';
        toast.className = 'ssb-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
    }

    /* ── Export theme ──────────────────────────────────────── */
    _exportTheme() {
      const entries = Object.entries(this._modifiedVars);
      if (!entries.length) {
        this._showToast('No custom vars set yet');
        return;
      }
      const lines = entries.map(([k, v]) => `  ${k}: ${v};`).join('\n');
      const css = `:root {\n${lines}\n}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(css).then(() => this._showToast('Copied to clipboard!'));
      } else {
        const ta = document.createElement('textarea');
        ta.value = css;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this._showToast('Copied to clipboard!');
      }
    }

    /* ── Reset ─────────────────────────────────────────────── */
    _reset() {
      this._resetAllVars();
      this._state.platformColors = {};

      /* Reset state */
      this._state.theme           = 'dark';
      this._state.buttonStyle     = 'default';
      this._state.platforms       = [...ALL_PLATFORMS];
      this._state.buttonColor     = '';
      this._state.gradientEnabled = false;
      this._state.gradientStart   = '#667eea';
      this._state.gradientEnd     = '#764ba2';

      /* Re-apply theme + platforms */
      this._applyTheme('dark');
      this._applyPlatforms([...ALL_PLATFORMS]);

      /* Reset real modal to dark */
      const overlay = this._getOverlayEl();
      if (overlay) overlay.className = 'social-share-modal-overlay dark';

      /* Re-render panel so controls reflect defaults */
      this._render();
      this._setupMutationObserver();
    }

    /* ================================================================
       RENDER
    ================================================================ */
    _render() {
      const s = this._state;
      this._panelContainer.innerHTML = '';

      const panel = document.createElement('div');
      panel.className = 'ssb-designer';
      panel.innerHTML = this._buildPanelHTML(s);
      this._panelContainer.appendChild(panel);

      this._bindEvents(panel);
    }

    _buildPanelHTML(s) {
      return `
        <div class="ssb-designer-header">
          <h2>Theme Designer</h2>
          <span class="ssb-designer-badge">LIVE</span>
        </div>

        <div class="ssb-designer-body">

          <!-- SECTION 1: THEME -->
          <div class="ssb-section" data-section="theme">
            <span class="ssb-section-label">Theme</span>
            <div class="ssb-toggle-group">
              <button data-theme="light" class="${s.theme === 'light' ? 'active' : ''}">Light</button>
              <button data-theme="dark"  class="${s.theme === 'dark'  ? 'active' : ''}">Dark</button>
            </div>
          </div>

          <!-- SECTION 2: BUTTON STYLE -->
          <div class="ssb-section" data-section="buttonstyle">
            <span class="ssb-section-label">Button Style</span>
            <div class="ssb-toggle-group">
              <button data-style="default"   class="${s.buttonStyle === 'default'   ? 'active' : ''}">Default</button>
              <button data-style="primary"   class="${s.buttonStyle === 'primary'   ? 'active' : ''}">Primary</button>
              <button data-style="compact"   class="${s.buttonStyle === 'compact'   ? 'active' : ''}">Compact</button>
              <button data-style="icon-only" class="${s.buttonStyle === 'icon-only' ? 'active' : ''}">Icon</button>
            </div>
          </div>

          <!-- SECTION 3: PLATFORMS -->
          <div class="ssb-section" data-section="platforms">
            <span class="ssb-section-label">Platforms</span>
            <div class="ssb-platform-list">
              ${ALL_PLATFORMS.map(p => {
                const active = s.platforms.includes(p);
                return `
                  <div class="ssb-platform-row">
                    <label class="ssb-platform-row-label">
                      <span class="ssb-platform-dot" style="background:${PLATFORMS[p].color}"></span>
                      ${PLATFORMS[p].name}
                    </label>
                    <label class="ssb-switch">
                      <input type="checkbox" data-platform="${p}" ${active ? 'checked' : ''}>
                      <span class="ssb-switch-track"></span>
                    </label>
                  </div>`;
              }).join('')}
            </div>
          </div>

          <!-- SECTION 4: BUTTON COLOR -->
          <div class="ssb-section" data-section="btncolor">
            <span class="ssb-section-label">Button Color</span>
            <div class="ssb-swatch-row">
              ${PRESET_COLORS.map(c => `
                <button
                  class="ssb-swatch${s.buttonColor === c.value && !s.gradientEnabled ? ' active' : ''}"
                  data-preset="${c.value}"
                  style="${c.value ? 'background:' + c.value : ''}"
                  title="${c.label}"
                >${c.value ? '' : '✕'}</button>
              `).join('')}
            </div>
            <div class="ssb-color-row">
              <label>Custom</label>
              <div class="ssb-color-wrap">
                <input type="color" id="ssb-btn-color-picker" value="${s.buttonColor || '#3ea6ff'}">
                <input type="text"  id="ssb-btn-color-text"   value="${s.buttonColor || ''}" placeholder="#3ea6ff" maxlength="22">
              </div>
            </div>

            <!-- Gradient -->
            <div class="ssb-gradient-row">
              <span>Gradient</span>
              <label class="ssb-switch">
                <input type="checkbox" id="ssb-gradient-toggle" ${s.gradientEnabled ? 'checked' : ''}>
                <span class="ssb-switch-track"></span>
              </label>
            </div>
            <div id="ssb-gradient-pickers" style="${s.gradientEnabled ? '' : 'display:none'}">
              <div class="ssb-gradient-pickers">
                <div class="ssb-color-row">
                  <label>Start</label>
                  <div class="ssb-color-wrap">
                    <input type="color" id="ssb-grad-start-picker" value="${s.gradientStart}">
                    <input type="text"  id="ssb-grad-start-text"   value="${s.gradientStart}" maxlength="22">
                  </div>
                </div>
                <div class="ssb-color-row">
                  <label>End</label>
                  <div class="ssb-color-wrap">
                    <input type="color" id="ssb-grad-end-picker" value="${s.gradientEnd}">
                    <input type="text"  id="ssb-grad-end-text"   value="${s.gradientEnd}" maxlength="22">
                  </div>
                </div>
              </div>
              <div class="ssb-gradient-preview" id="ssb-gradient-preview"
                style="background:linear-gradient(135deg,${s.gradientStart},${s.gradientEnd})"></div>
            </div>
          </div>

          <!-- SECTION 5: BUTTON SHAPE -->
          <div class="ssb-section" data-section="btnshape">
            <span class="ssb-section-label">Button Shape</span>

            <div class="ssb-slider-row">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Border Radius</span>
                <span class="ssb-slider-value" id="val-btn-radius">8px</span>
              </div>
              <input type="range" id="ssb-btn-radius" min="0" max="50" value="8" step="1">
            </div>

            <div class="ssb-slider-row">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Border Width</span>
                <span class="ssb-slider-value" id="val-btn-border-width">1px</span>
              </div>
              <input type="range" id="ssb-btn-border-width" min="0" max="4" value="1" step="0.5">
            </div>

            <div class="ssb-color-row" style="margin-top:8px">
              <label>Border Color</label>
              <div class="ssb-color-wrap">
                <input type="color" id="ssb-border-color-picker" value="#ffffff">
                <input type="text"  id="ssb-border-color-text"   value="" placeholder="rgba(...)" maxlength="30">
              </div>
            </div>

            <div class="ssb-slider-row" style="margin-top:12px">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Font Size</span>
                <span class="ssb-slider-value" id="val-btn-font-size">14px</span>
              </div>
              <input type="range" id="ssb-btn-font-size" min="12" max="18" value="14" step="1">
            </div>

            <span class="ssb-sub-label" style="margin-top:4px">Font Weight</span>
            <div class="ssb-toggle-group" id="ssb-font-weight-group">
              <button data-fw="400" class="">400</button>
              <button data-fw="500" class="active">500</button>
              <button data-fw="600" class="">600</button>
              <button data-fw="700" class="">700</button>
            </div>

            <div class="ssb-input-row" style="margin-top:12px">
              <label>Button Label</label>
              <input type="text" id="ssb-btn-label" value="Share" placeholder="Share">
            </div>
          </div>

          <!-- SECTION 6: MODAL -->
          <div class="ssb-section" data-section="modal">
            <span class="ssb-section-label">Modal</span>

            <div class="ssb-color-row" style="margin-top:0">
              <label>Background</label>
              <div class="ssb-color-wrap">
                <input type="color" id="ssb-modal-bg-picker" value="#282828">
                <input type="text"  id="ssb-modal-bg-text"   value="#282828" maxlength="22">
              </div>
            </div>

            <div class="ssb-slider-row" style="margin-top:12px">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Width</span>
                <span class="ssb-slider-value" id="val-modal-width">540px</span>
              </div>
              <input type="range" id="ssb-modal-width" min="400" max="700" value="540" step="10">
            </div>

            <span class="ssb-sub-label">Position</span>
            <div class="ssb-toggle-group" id="ssb-modal-position-group">
              <button data-pos="center" class="active">Center</button>
              <button data-pos="bottom" class="">Bottom</button>
            </div>

            <div class="ssb-slider-row" style="margin-top:12px">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Animation Speed</span>
                <span class="ssb-slider-value" id="val-modal-speed">0.3s</span>
              </div>
              <input type="range" id="ssb-modal-speed" min="0.1" max="0.8" value="0.3" step="0.05">
            </div>
          </div>

          <!-- SECTION 7: PLATFORM ICONS -->
          <div class="ssb-section" data-section="icons">
            <span class="ssb-section-label">Platform Icons</span>

            <div class="ssb-slider-row">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Size</span>
                <span class="ssb-slider-value" id="val-icon-size">56px</span>
              </div>
              <input type="range" id="ssb-icon-size" min="40" max="72" value="56" step="2">
            </div>

            <span class="ssb-sub-label">Shape</span>
            <div class="ssb-toggle-group" id="ssb-icon-shape-group">
              <button data-shape="50%"  class="active">Circle</button>
              <button data-shape="12px" class="">Rounded Sq</button>
            </div>

            <span class="ssb-sub-label" style="margin-top:12px">Per-Platform Color</span>
            <div class="ssb-icon-colors" id="ssb-icon-colors">
              ${this._buildIconColorRows(s.platforms, s.platformColors)}
            </div>
          </div>

          <!-- SECTION 8: ADVANCED -->
          <div class="ssb-section" data-section="advanced">
            <span class="ssb-section-label">Advanced</span>

            <div class="ssb-input-row">
              <label>Font Family</label>
              <select id="ssb-font-family">
                <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'>System UI</option>
                <option value='"Inter", sans-serif'>Inter</option>
                <option value='"Roboto", sans-serif'>Roboto</option>
                <option value='"Poppins", sans-serif'>Poppins</option>
                <option value='"Courier New", Courier, monospace'>Monospace</option>
              </select>
            </div>

            <div class="ssb-slider-row">
              <div class="ssb-slider-header">
                <span class="ssb-slider-label">Hover Scale</span>
                <span class="ssb-slider-value" id="val-hover-scale">1.05</span>
              </div>
              <input type="range" id="ssb-hover-scale" min="1.0" max="1.2" value="1.05" step="0.01">
            </div>

            <span class="ssb-sub-label">Shadow Intensity</span>
            <div class="ssb-toggle-group" id="ssb-shadow-group">
              <button data-shadow="none"   class="active">None</button>
              <button data-shadow="low"    class="">Low</button>
              <button data-shadow="medium" class="">Med</button>
              <button data-shadow="high"   class="">High</button>
            </div>

            <div class="ssb-color-row" style="margin-top:12px">
              <label>Copy Accent</label>
              <div class="ssb-color-wrap">
                <input type="color" id="ssb-accent-picker" value="#3ea6ff">
                <input type="text"  id="ssb-accent-text"   value="#3ea6ff" maxlength="22">
              </div>
            </div>
          </div>

        </div><!-- /.ssb-designer-body -->

        <div class="ssb-designer-footer">
          <button class="ssb-btn-export" id="ssb-btn-export">Export Theme</button>
          <button class="ssb-btn-reset"  id="ssb-btn-reset">Reset</button>
        </div>
      `;
    }

    _buildIconColorRows(activePlatforms, platformColors) {
      return activePlatforms
        .filter(p => PLATFORMS[p])
        .map(p => {
          const current = platformColors[p] || PLATFORMS[p].color;
          return `
            <div class="ssb-icon-color-row">
              <span class="ssb-icon-color-label">
                <span class="ssb-platform-dot" style="background:${current}"></span>
                ${PLATFORMS[p].name}
              </span>
              <div class="ssb-color-wrap" style="max-width:110px">
                <input type="color" data-icon-platform="${p}" value="${current}">
                <input type="text"  data-icon-color-text="${p}" value="${current}" maxlength="22">
              </div>
            </div>`;
        })
        .join('');
    }

    /* ================================================================
       EVENT BINDING
    ================================================================ */
    _bindEvents(panel) {
      const $ = id => document.getElementById(id);

      /* ── Section 1: Theme ─────────────────────────────────── */
      panel.querySelector('[data-section="theme"]')
        .querySelectorAll('button[data-theme]')
        .forEach(btn => {
          btn.addEventListener('click', () => {
            panel.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this._applyTheme(btn.dataset.theme);
          });
        });

      /* ── Section 2: Button Style ──────────────────────────── */
      panel.querySelector('[data-section="buttonstyle"]')
        .querySelectorAll('button[data-style]')
        .forEach(btn => {
          btn.addEventListener('click', () => {
            panel.querySelectorAll('[data-style]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this._state.buttonStyle = btn.dataset.style;
            const el = this._getButtonEl();
            if (el) {
              el.className = el.className
                .replace(/\b(default|primary|compact|icon-only)\b/g, '')
                .trim();
              if (btn.dataset.style !== 'default') el.classList.add(btn.dataset.style);
            }
            if (this._instance) {
              this._instance.options.buttonStyle = btn.dataset.style;
            }
          });
        });

      /* ── Section 3: Platforms ─────────────────────────────── */
      panel.querySelectorAll('input[data-platform]').forEach(chk => {
        chk.addEventListener('change', () => {
          const active = Array.from(panel.querySelectorAll('input[data-platform]'))
            .filter(c => c.checked)
            .map(c => c.dataset.platform);
          this._applyPlatforms(active);
          /* Refresh icon-color rows */
          const iconColors = $('ssb-icon-colors');
          if (iconColors) {
            iconColors.innerHTML = this._buildIconColorRows(active, this._state.platformColors);
            this._bindIconColorEvents(panel);
          }
        });
      });

      /* ── Section 4: Button Color ──────────────────────────── */
      /* Preset swatches */
      panel.querySelectorAll('.ssb-swatch[data-preset]').forEach(sw => {
        sw.addEventListener('click', () => {
          const val = sw.dataset.preset;
          this._state.buttonColor = val;
          this._state.gradientEnabled = false;
          $('ssb-gradient-toggle').checked = false;
          $('ssb-gradient-pickers').style.display = 'none';
          panel.querySelectorAll('.ssb-swatch').forEach(s => s.classList.remove('active'));
          sw.classList.add('active');
          $('ssb-btn-color-text').value = val;
          if (val) $('ssb-btn-color-picker').value = val;
          this._setCSSVar('--ssb-btn-bg', val || '');
          this._setCSSVar('--ssb-btn-gradient-start', '');
          this._setCSSVar('--ssb-btn-gradient-end', '');
        });
      });

      /* Custom color picker */
      const syncBtnColor = (value) => {
        if (!value) return;
        this._state.buttonColor = value;
        this._state.gradientEnabled = false;
        $('ssb-gradient-toggle').checked = false;
        $('ssb-gradient-pickers').style.display = 'none';
        $('ssb-btn-color-picker').value = value;
        $('ssb-btn-color-text').value = value;
        panel.querySelectorAll('.ssb-swatch').forEach(s => s.classList.remove('active'));
        this._setCSSVar('--ssb-btn-bg', value);
        this._setCSSVar('--ssb-btn-gradient-start', '');
        this._setCSSVar('--ssb-btn-gradient-end', '');
      };

      $('ssb-btn-color-picker').addEventListener('input', e => syncBtnColor(e.target.value));
      $('ssb-btn-color-text').addEventListener('change', e => {
        const v = e.target.value.trim();
        if (v) syncBtnColor(v);
      });

      /* Gradient toggle */
      $('ssb-gradient-toggle').addEventListener('change', e => {
        this._state.gradientEnabled = e.target.checked;
        $('ssb-gradient-pickers').style.display = e.target.checked ? '' : 'none';
        if (e.target.checked) {
          this._applyGradient();
        } else {
          this._setCSSVar('--ssb-btn-gradient-start', '');
          this._setCSSVar('--ssb-btn-gradient-end', '');
          this._setCSSVar('--ssb-btn-bg', this._state.buttonColor || '');
        }
      });

      /* Gradient pickers */
      const applyGrad = () => this._applyGradient();
      const syncGradStart = v => {
        if (!v) return;
        this._state.gradientStart = v;
        $('ssb-grad-start-picker').value = v;
        $('ssb-grad-start-text').value = v;
        applyGrad();
      };
      const syncGradEnd = v => {
        if (!v) return;
        this._state.gradientEnd = v;
        $('ssb-grad-end-picker').value = v;
        $('ssb-grad-end-text').value = v;
        applyGrad();
      };

      $('ssb-grad-start-picker').addEventListener('input', e => syncGradStart(e.target.value));
      $('ssb-grad-start-text').addEventListener('change', e => syncGradStart(e.target.value.trim()));
      $('ssb-grad-end-picker').addEventListener('input', e => syncGradEnd(e.target.value));
      $('ssb-grad-end-text').addEventListener('change', e => syncGradEnd(e.target.value.trim()));

      /* ── Section 5: Button Shape ──────────────────────────── */
      this._bindSlider(panel, 'ssb-btn-radius',      'val-btn-radius',       v => v + 'px',  v => this._setCSSVar('--ssb-btn-radius', v + 'px'));
      this._bindSlider(panel, 'ssb-btn-border-width','val-btn-border-width',  v => v + 'px',  v => this._setCSSVar('--ssb-btn-border-width', v + 'px'));
      this._bindSlider(panel, 'ssb-btn-font-size',   'val-btn-font-size',     v => v + 'px',  v => this._setCSSVar('--ssb-btn-font-size', v + 'px'));

      const syncBorderColor = v => {
        if (!v) return;
        $('ssb-border-color-picker').value = v.startsWith('#') ? v : '#ffffff';
        $('ssb-border-color-text').value = v;
        this._setCSSVar('--ssb-btn-border-color', v);
      };
      $('ssb-border-color-picker').addEventListener('input', e => syncBorderColor(e.target.value));
      $('ssb-border-color-text').addEventListener('change', e => syncBorderColor(e.target.value.trim()));

      /* Font weight toggle */
      panel.querySelectorAll('#ssb-font-weight-group button[data-fw]').forEach(btn => {
        btn.addEventListener('click', () => {
          panel.querySelectorAll('#ssb-font-weight-group button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._setCSSVar('--ssb-btn-font-weight', btn.dataset.fw);
        });
      });

      /* Button label */
      $('ssb-btn-label').addEventListener('input', e => {
        const val = e.target.value || 'Share';
        const el = this._getButtonEl();
        if (el) {
          const span = el.querySelector('span');
          if (span) span.textContent = val;
        }
        /* Update preview button label */
        const previewBtn = document.getElementById('ssb-preview-btn-label');
        if (previewBtn) previewBtn.textContent = val;
        if (this._instance) this._instance.options.buttonText = val;
      });

      /* ── Section 6: Modal ─────────────────────────────────── */
      const syncModalBg = v => {
        if (!v) return;
        $('ssb-modal-bg-picker').value = v.startsWith('#') ? v : '#282828';
        $('ssb-modal-bg-text').value = v;
        this._setCSSVar('--ssb-modal-bg', v);
        /* live update preview card bg */
        const card = document.getElementById('ssb-preview-card');
        if (card) card.style.background = v;
      };
      $('ssb-modal-bg-picker').addEventListener('input', e => syncModalBg(e.target.value));
      $('ssb-modal-bg-text').addEventListener('change', e => syncModalBg(e.target.value.trim()));

      this._bindSlider(panel, 'ssb-modal-width', 'val-modal-width', v => v + 'px', v => {
        this._setCSSVar('--ssb-modal-width', v + 'px');
        const card = document.getElementById('ssb-preview-card');
        if (card) card.style.maxWidth = v + 'px';
      });

      this._bindSlider(panel, 'ssb-modal-speed', 'val-modal-speed', v => parseFloat(v).toFixed(2) + 's',
        v => this._setCSSVar('--ssb-modal-speed', parseFloat(v).toFixed(2) + 's'));

      panel.querySelectorAll('#ssb-modal-position-group button[data-pos]').forEach(btn => {
        btn.addEventListener('click', () => {
          panel.querySelectorAll('#ssb-modal-position-group button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const pos = btn.dataset.pos;
          if (this._instance) {
            this._instance.options.modalPosition = pos;
            const content = this._getOverlayEl()
              ? this._getOverlayEl().querySelector('.social-share-modal-content')
              : null;
            if (content) {
              content.classList.remove('center', 'bottom');
              content.classList.add(pos);
            }
          }
          const previewCard = document.getElementById('ssb-preview-card');
          if (previewCard) {
            previewCard.classList.remove('center', 'bottom');
            previewCard.classList.add(pos);
          }
        });
      });

      /* ── Section 7: Platform Icons ────────────────────────── */
      this._bindSlider(panel, 'ssb-icon-size', 'val-icon-size', v => v + 'px', v => {
        this._setCSSVar('--ssb-icon-size', v + 'px');
        /* Also update preview icons directly */
        document.querySelectorAll('.social-share-platform-icon').forEach(icon => {
          icon.style.width = v + 'px';
          icon.style.height = v + 'px';
        });
      });

      panel.querySelectorAll('#ssb-icon-shape-group button[data-shape]').forEach(btn => {
        btn.addEventListener('click', () => {
          panel.querySelectorAll('#ssb-icon-shape-group button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._setCSSVar('--ssb-icon-shape', btn.dataset.shape);
          document.querySelectorAll('.social-share-platform-icon').forEach(icon => {
            icon.style.borderRadius = btn.dataset.shape;
          });
        });
      });

      this._bindIconColorEvents(panel);

      /* ── Section 8: Advanced ──────────────────────────────── */
      $('ssb-font-family').addEventListener('change', e => {
        this._setCSSVar('--ssb-font-family', e.target.value);
      });

      this._bindSlider(panel, 'ssb-hover-scale', 'val-hover-scale',
        v => parseFloat(v).toFixed(2),
        v => this._setCSSVar('--ssb-hover-scale', parseFloat(v).toFixed(2)));

      panel.querySelectorAll('#ssb-shadow-group button[data-shadow]').forEach(btn => {
        btn.addEventListener('click', () => {
          panel.querySelectorAll('#ssb-shadow-group button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this._setCSSVar('--ssb-shadow-intensity', SHADOW_MAP[btn.dataset.shadow] || 'none');
        });
      });

      const syncAccent = v => {
        if (!v) return;
        $('ssb-accent-picker').value = v.startsWith('#') ? v : '#3ea6ff';
        $('ssb-accent-text').value = v;
        this._setCSSVar('--ssb-accent', v);
      };
      $('ssb-accent-picker').addEventListener('input', e => syncAccent(e.target.value));
      $('ssb-accent-text').addEventListener('change', e => syncAccent(e.target.value.trim()));

      /* ── Footer ───────────────────────────────────────────── */
      $('ssb-btn-export').addEventListener('click', () => this._exportTheme());
      $('ssb-btn-reset').addEventListener('click', () => this._reset());
    }

    _bindIconColorEvents(panel) {
      panel.querySelectorAll('input[data-icon-platform]').forEach(picker => {
        picker.addEventListener('input', e => {
          const p = e.target.dataset.iconPlatform;
          this._state.platformColors[p] = e.target.value;
          /* sync text input */
          const textInput = panel.querySelector(`input[data-icon-color-text="${p}"]`);
          if (textInput) textInput.value = e.target.value;
          /* Apply to all visible icons */
          document.querySelectorAll(
            `.social-share-platform-btn[data-platform="${p}"] .social-share-platform-icon`
          ).forEach(icon => { icon.style.backgroundColor = e.target.value; });
        });
      });

      panel.querySelectorAll('input[data-icon-color-text]').forEach(input => {
        input.addEventListener('change', e => {
          const p = e.target.dataset.iconColorText;
          const v = e.target.value.trim();
          if (!v) return;
          this._state.platformColors[p] = v;
          const picker = panel.querySelector(`input[data-icon-platform="${p}"]`);
          if (picker && v.startsWith('#')) picker.value = v;
          document.querySelectorAll(
            `.social-share-platform-btn[data-platform="${p}"] .social-share-platform-icon`
          ).forEach(icon => { icon.style.backgroundColor = v; });
        });
      });
    }

    _bindSlider(panel, sliderId, valueId, fmt, onChange) {
      const slider = document.getElementById(sliderId);
      const valueEl = document.getElementById(valueId);
      if (!slider || !valueEl) return;
      slider.addEventListener('input', () => {
        valueEl.textContent = fmt(slider.value);
        onChange(slider.value);
      });
    }

    _applyGradient() {
      const start = this._state.gradientStart;
      const end   = this._state.gradientEnd;
      const grad  = `linear-gradient(135deg, ${start}, ${end})`;

      this._setCSSVar('--ssb-btn-gradient-start', start);
      this._setCSSVar('--ssb-btn-gradient-end',   end);

      /* Apply gradient directly on button */
      const el = this._getButtonEl();
      if (el) el.style.setProperty('background', grad);

      /* Also update the preview button */
      const previewBtn = document.querySelector('#ssb-preview-share-btn');
      if (previewBtn) previewBtn.style.background = grad;

      /* Update visual preview strip */
      const preview = document.getElementById('ssb-gradient-preview');
      if (preview) preview.style.background = grad;
    }

    /* ── Public: destroy ───────────────────────────────────── */
    destroy() {
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      clearTimeout(this._toastTimer);
      const toast = document.getElementById('ssb-designer-toast');
      if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
      if (this._panelContainer) this._panelContainer.innerHTML = '';
    }
  }

  /* Expose globally */
  root.SocialShareDesigner = SocialShareDesigner;

})(typeof window !== 'undefined' ? window : this);
