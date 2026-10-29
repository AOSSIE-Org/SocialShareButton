/**
 * SocialShareButton QR Code Extension
 * Dynamically loads Kazuhiko Arase's qrcode-generator from CDN
 */

(function () {
  // Shared bootstrap error helper for the QR extension.
  // Keeps all console output in one place for easy logger swapping.
  function _qrWarn(message) {
    /* eslint-disable no-console */
    if (typeof console !== "undefined" && typeof console.warn === "function") {
      console.warn("[SocialShareButton QR] " + message);
    }
    /* eslint-enable no-console */
  }

  // Cached Promise for the qrcode-generator CDN load.
  // Guarantees only one <script> tag is ever injected.
  var _generatorPromise = null;

  // Returns a Promise that resolves once window.qrcode is available.
  // Resolves immediately if self-hosted. Subsequent calls return the same cached Promise.
  function getQRCodeGenerator() {
    if (_generatorPromise) return _generatorPromise;

    if (typeof window.qrcode !== "undefined") {
      _generatorPromise = Promise.resolve();
      return _generatorPromise;
    }

    _generatorPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js";
      script.onload = resolve;
      script.onerror = function () {
        // Reset so a retry (e.g. after fixing CSP) can attempt the load again
        _generatorPromise = null;
        _qrWarn(
          "Failed to load qrcode-generator from CDN (https://cdn.jsdelivr.net). " +
          "Check your network connection or Content Security Policy. " +
          "To self-host, load qrcode.min.js before social-share-button-qr.js."
        );
        reject(new Error("qrcode-generator CDN load failed"));
      };
      document.head.appendChild(script);
    });

    return _generatorPromise;
  }

  function applyQRPatch() {
    if (typeof window === "undefined" || !window.SocialShareButton) {
      _qrWarn("SocialShareButton core must be loaded before the QR extension.");
      return;
    }

    // Guard against double-patching
    if (window.SocialShareButton._qrPatched) return;
    window.SocialShareButton._qrPatched = true;

    var originalShare = window.SocialShareButton.prototype.share;
    var originalCloseModal = window.SocialShareButton.prototype.closeModal;

    window.SocialShareButton.prototype.share = function (platform) {
      if (platform === "qrcode") {
        var self = this;
        this._qrRenderRequestId = (this._qrRenderRequestId || 0) + 1;
        var requestToken = this._qrRenderRequestId;

        this._emit("social_share_click", "share", { platform: platform });

        // Show a pending/disabled state on the QR button while the library loads
        var qrBtn = this.modal
          ? this.modal.querySelector('[data-platform="qrcode"]')
          : null;
        if (qrBtn) {
          qrBtn.disabled = true;
          qrBtn.setAttribute("aria-busy", "true");
        }

        getQRCodeGenerator()
          .then(function () {
            // Abort if the user closed the modal or clicked again while loading
            if (self._qrRenderRequestId !== requestToken || !self.modal) {
              return;
            }

            var rendered = self.renderQRPanel();
            // Only emit success and invoke callback after rendering succeeds
            if (rendered !== false) {
              self._emit("social_share_success", "share", { platform: platform });
              if (self.options.onShare) {
                self.options.onShare(platform, self.options.url);
              }
            }
          })
          .catch(function () {
            // CDN failed — warning already logged inside getQRCodeGenerator
          })
          .then(function () {
            // Restore button only if this is still the active request
            if (self._qrRenderRequestId === requestToken && qrBtn) {
              qrBtn.disabled = false;
              qrBtn.removeAttribute("aria-busy");
            }
          });

        return;
      }

      // Delegate all other platforms to the original handler
      return originalShare.call(this, platform);
    };

    window.SocialShareButton.prototype.renderQRPanel = function () {
      if (!this.modal) return false;

      // Do not render twice
      if (this.modal.querySelector(".social-share-qr-panel")) return;

      if (typeof window.qrcode === "undefined") {
        _qrWarn("qrcode-generator is not available. The QR panel cannot be rendered.");
        return false;
      }

      // --- Generate QR data ---
      var typeNumber = 0; // 0 = auto-detect
      var errorCorrectionLevel = "M";
      var qr = window.qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(this.options.url);
      qr.make();

      var moduleCount = qr.getModuleCount();
      var cellSize = Math.max(3, Math.floor(180 / moduleCount));
      var margin = 4;
      var size = moduleCount * cellSize + margin * 2 * cellSize;

      // --- Build DOM ---
      var qrPanel = document.createElement("div");
      qrPanel.className = "social-share-qr-panel";

      var title = document.createElement("h4");
      var titleText = (this.options.labels && this.options.labels.qrScanTitle) || "Scan QR Code";
      title.textContent = titleText;

      var canvas = document.createElement("canvas");
      canvas.className = "social-share-qr-canvas";
      canvas.width = size;
      canvas.height = size;

      var ctx = canvas.getContext("2d");

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // Dark modules
      ctx.fillStyle = "#000000";
      for (var row = 0; row < moduleCount; row++) {
        for (var col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(
              (col + margin) * cellSize,
              (row + margin) * cellSize,
              cellSize,
              cellSize
            );
          }
        }
      }

      var downloadBtn = document.createElement("button");
      downloadBtn.className = "social-share-qr-download";
      var downloadText = (this.options.labels && this.options.labels.qrDownload) || "Download QR";
      downloadBtn.textContent = downloadText;

      var self = this;
      var downloadHandler = function () {
        var dataUrl = canvas.toDataURL("image/png");
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = "share-qrcode.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      downloadBtn.addEventListener("click", downloadHandler);
      // Register in central listener list so destroy() cleans it up
      this.addEventListener(downloadBtn, "click", downloadHandler);

      this._qrDownloadHandler = downloadHandler;
      this._qrDownloadBtn = downloadBtn;

      qrPanel.appendChild(title);
      qrPanel.appendChild(canvas);
      qrPanel.appendChild(downloadBtn);

      // Insert right after the platforms row
      var platformsContainer = this.modal.querySelector(".social-share-platforms");
      if (platformsContainer && platformsContainer.parentNode) {
        platformsContainer.parentNode.insertBefore(qrPanel, platformsContainer.nextSibling);
      } else {
        var content = this.modal.querySelector(".social-share-modal-content");
        if (content) content.appendChild(qrPanel);
      }
    };

    window.SocialShareButton.prototype.closeModal = function () {
      // Invalidate any pending QR renders
      this._qrRenderRequestId = (this._qrRenderRequestId || 0) + 1;

      if (this.modal) {
        var qrPanel = this.modal.querySelector(".social-share-qr-panel");
        if (qrPanel) {
          if (this._qrDownloadBtn && this._qrDownloadHandler) {
            this._qrDownloadBtn.removeEventListener("click", this._qrDownloadHandler);
            // Purge from central registry
            this.listeners = this.listeners.filter(
              function (l) { return l.handler !== this._qrDownloadHandler; },
              this
            );
            this._qrDownloadBtn = null;
            this._qrDownloadHandler = null;
          }
          qrPanel.remove();
        }
      }
      return originalCloseModal.call(this);
    };
  } // end applyQRPatch

  // Patch prototype immediately — CDN load is deferred to first QR click.
  // Guard against SSR environments (Next.js, Nuxt, etc.) where window/document
  // are undefined at import time.
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyQRPatch);
    } else {
      applyQRPatch();
    }
  }
})();
