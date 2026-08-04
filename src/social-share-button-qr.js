/**
 * SocialShareButton QR Code Extension
 * Dynamically loads Kazuhiko Arase's qrcode-generator from CDN
 */

(function () {
  function applyQRPatch() {
    if (typeof window === "undefined" || !window.SocialShareButton) {
      console.warn("SocialShareButton core must be loaded before QR extension");
      return;
    }

    // Guard against double-patching
    if (window.SocialShareButton._qrPatched) return;
    window.SocialShareButton._qrPatched = true;

    var originalShare = window.SocialShareButton.prototype.share;
    var originalCloseModal = window.SocialShareButton.prototype.closeModal;

    window.SocialShareButton.prototype.share = function (platform) {
      if (platform === "qrcode") {
        this._emit("social_share_click", "share", { platform });
        this.renderQRPanel();
        this._emit("social_share_success", "share", { platform });

        if (this.options.onShare) {
          this.options.onShare(platform, this.options.url);
        }
        return;
      }

      // Delegate all other platforms to the original handler
      return originalShare.call(this, platform);
    };

    window.SocialShareButton.prototype.renderQRPanel = function () {
      if (!this.modal) return;

      // Do not render twice
      if (this.modal.querySelector(".social-share-qr-panel")) return;

      if (typeof window.qrcode === "undefined") {
        console.error("qrcode-generator failed to load.");
        return;
      }

      // --- Generate QR data ---
      var typeNumber = 0; // 0 = auto-detect
      var errorCorrectionLevel = "M";
      var qr = window.qrcode(typeNumber, errorCorrectionLevel);
      qr.addData(this.options.url);
      qr.make();

      var moduleCount = qr.getModuleCount();
      var cellSize = Math.max(3, Math.floor(180 / moduleCount));
      var margin = 2;
      var size = moduleCount * cellSize + margin * 2 * cellSize;

      // --- Build DOM ---
      var qrPanel = document.createElement("div");
      qrPanel.className = "social-share-qr-panel";

      var title = document.createElement("h4");
      title.textContent = "Scan QR Code";

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
      downloadBtn.textContent = "Download QR";

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

  function loadQRCodeGenerator(callback) {
    if (typeof window.qrcode !== "undefined") {
      callback();
      return;
    }

    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js";
    script.onload = callback;
    script.onerror = function () {
      console.error("Failed to load qrcode-generator from CDN.");
    };
    document.head.appendChild(script);
  }

  function init() {
    loadQRCodeGenerator(function () {
      applyQRPatch();
    });
  }

  // Wait for all deferred scripts to finish evaluating before loading and patching.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
