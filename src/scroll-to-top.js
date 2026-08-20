/**
 * Scroll to Top Feature
 * @version 1.0.0
 * @license GPL-3.0
 *
 * A floating action button that appears when scrolling down,
 * allowing users to smoothly scroll back to the top of the page.
 */

class ScrollToTop {
  /**
   * Create a new ScrollToTop instance
   * @param {Object} options - Configuration options
   * @param {string} options.position - 'bottom-right' | 'bottom-left' | 'bottom-center'
   * @param {number} options.showAfter - Pixels to scroll before showing button
   * @param {string} options.buttonColor - Custom button background color
   * @param {string} options.buttonHoverColor - Custom hover color
   * @param {number} options.iconSize - Size of the arrow icon
   * @param {number} options.zIndex - CSS z-index value
   * @param {number} options.animationDuration - Animation duration in ms
   */
  constructor(options = {}) {
    // Default options
    this.options = {
      position: options.position || "bottom-right",
      showAfter: options.showAfter || 300,
      buttonColor: options.buttonColor || "#667eea",
      buttonHoverColor: options.buttonHoverColor || "#764ba2",
      iconSize: options.iconSize || 24,
      zIndex: options.zIndex || 999,
      animationDuration: options.animationDuration || 400,
    };

    this.button = null;
    this.isVisible = false;
    this.isDestroyed = false;
    this.scrollHandler = null;
    this.clickHandler = null;

    this.init();
  }

  /**
   * Initialize the scroll to top feature
   */
  init() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (document.querySelector(".scroll-to-top")) {
      return;
    }

    this.createButton();
    this.attachEvents();
  }

  /**
   * Create the button element
   */
  createButton() {
    const btn = document.createElement("button");
    btn.className = `scroll-to-top scroll-to-top-${this.options.position}`;
    btn.setAttribute("aria-label", "Scroll to top");
    btn.setAttribute("title", "Scroll to top");

    // Create SVG arrow icon
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.options.iconSize);
    svg.setAttribute("height", this.options.iconSize);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.style.display = "block";

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 19V5M5 12l7-7 7 7");
    svg.appendChild(path);

    btn.appendChild(svg);

    // Store reference
    this.button = btn;

    if (document.body) {
      document.body.appendChild(btn);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) {
          document.body.appendChild(btn);
        }
      });
    }
  }

  /**
   * Attach scroll and click events
   */
  attachEvents() {
    // Scroll handler with throttling for performance
    let ticking = false;

    this.scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    this.clickHandler = (e) => {
      e.preventDefault();
      this.scrollToTop();
    };

    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    this.button.addEventListener("click", this.clickHandler);

    // Keyboard support
    this.button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.scrollToTop();
      }
    });

    // Initial check
    this.handleScroll();
  }

  /**
   * Handle scroll events - show/hide button
   */
  handleScroll() {
    if (this.isDestroyed) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const shouldShow = scrollY > this.options.showAfter;

    if (shouldShow && !this.isVisible) {
      this.button.classList.add("visible");
      this.isVisible = true;
    } else if (!shouldShow && this.isVisible) {
      this.button.classList.remove("visible");
      this.isVisible = false;
    }
  }

  /**
   * Smooth scroll to top
   */
  scrollToTop() {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (e) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }

  /**
   * Update options dynamically
   */
  updateOptions(options) {
    this.options = { ...this.options, ...options };

    // Reapply colors if changed
    if (options.buttonColor && this.button) {
      this.button.style.background = options.buttonColor;
    }
  }

  /**
   * Destroy instance and clean up
   */
  destroy() {
    this.isDestroyed = true;

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      this.scrollHandler = null;
    }

    if (this.button) {
      this.button.removeEventListener("click", this.clickHandler);
      if (this.button.parentNode) {
        this.button.parentNode.removeChild(this.button);
      }
      this.button = null;
    }

    this.isVisible = false;
    this.clickHandler = null;
  }
}

// Export for different module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScrollToTop;
}

if (typeof window !== "undefined") {
  window.ScrollToTop = ScrollToTop;
}
