/**
 * Tests for SocialShareButton — Enterprise-Grade Modal Refactor
 *
 * Covers:
 *   - Security: No innerHTML usage (Trusted Types / CSP compliance)
 *   - Accessibility: WCAG 2.1 AA focus management, ARIA attributes
 *   - Performance: Event delegation for platform buttons
 *   - Modal lifecycle: open, close, destroy
 *   - Keyboard navigation: Escape, Tab, Shift+Tab focus trapping
 *   - Focus restoration after close
 *   - Public API backward compatibility
 *
 * @environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// We need to set up the DOM environment before importing the module
// because the IIFE at the bottom of social-share-button.js runs on import.
let SocialShareButton;

beforeEach(async () => {
  // Reset module registry so each test gets a fresh class with clean statics
  vi.resetModules();
  const mod = await import("../src/social-share-button.js");
  SocialShareButton = mod.default || window.SocialShareButton;
});

afterEach(() => {
  // Clean up any instances and DOM nodes
  if (SocialShareButton && SocialShareButton.instances) {
    // Copy to array to avoid mutation during iteration
    [...SocialShareButton.instances].forEach((instance) => instance.destroy());
  }
  // Remove any remaining modal overlays
  document.querySelectorAll(".social-share-modal-overlay").forEach((el) => el.remove());
  // Remove any remaining buttons
  document.querySelectorAll(".social-share-btn").forEach((el) => el.remove());
  // Remove any containers
  document.querySelectorAll("[data-social-share]").forEach((el) => el.remove());
  document.querySelectorAll("#test-container").forEach((el) => el.remove());
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function createInstance(overrides = {}) {
  const container = document.createElement("div");
  container.id = "test-container";
  document.body.appendChild(container);

  const defaults = {
    container,
    url: "https://example.com",
    title: "Test Title",
    platforms: ["whatsapp", "facebook", "twitter"],
  };

  return new SocialShareButton({ ...defaults, ...overrides });
}

// ---------------------------------------------------------------------------
// 1. Security — Trusted Types / CSP compliance
// ---------------------------------------------------------------------------

describe("Security: Trusted Types & CSP compliance", () => {
  it("should not use innerHTML anywhere in the source", async () => {
    // Read the source file content — we check at the string level
    // to guarantee no innerHTML slips in during future edits
    const fs = await import("fs");
    const path = await import("path");
    const sourceFile = path.resolve("src/social-share-button.js");
    const source = fs.readFileSync(sourceFile, "utf-8");

    // Match innerHTML assignments (not just the word in comments/strings)
    const innerHTMLAssignment = /\.innerHTML\s*=/g;
    expect(source.match(innerHTMLAssignment)).toBeNull();
  });

  it("should build the share button using createElement, not innerHTML", () => {
    const instance = createInstance();
    const btn = instance.button;

    expect(btn).toBeInstanceOf(HTMLButtonElement);
    expect(btn.querySelector("svg")).not.toBeNull();
    expect(btn.querySelector("span")).not.toBeNull();
    expect(btn.querySelector("span").textContent).toBe("Share");
  });

  it("should build the modal using createElement, not innerHTML", () => {
    const instance = createInstance();
    const modal = instance.modal;

    expect(modal).toBeInstanceOf(HTMLDivElement);
    expect(modal.querySelector(".social-share-modal-header")).not.toBeNull();
    expect(modal.querySelector(".social-share-modal-close")).not.toBeNull();
    expect(modal.querySelector(".social-share-platforms")).not.toBeNull();
    expect(modal.querySelector(".social-share-link-container")).not.toBeNull();
    expect(modal.querySelector(".social-share-copy-btn")).not.toBeNull();
  });

  it("should build platform buttons using createElement and DocumentFragment", () => {
    const instance = createInstance({ platforms: ["whatsapp", "facebook"] });
    const platformBtns = instance.modal.querySelectorAll(".social-share-platform-btn");

    expect(platformBtns.length).toBe(2);
    platformBtns.forEach((btn) => {
      expect(btn.querySelector(".social-share-platform-icon")).not.toBeNull();
      expect(btn.querySelector("svg")).not.toBeNull();
      expect(btn.querySelector("span")).not.toBeNull();
    });
  });

  it("should create SVGs using createElementNS with correct namespace", () => {
    const instance = createInstance();
    const svg = instance.button.querySelector("svg");

    expect(svg.namespaceURI).toBe("http://www.w3.org/2000/svg");
    expect(svg.querySelector("path").namespaceURI).toBe("http://www.w3.org/2000/svg");
  });
});

// ---------------------------------------------------------------------------
// 2. Accessibility — WCAG 2.1 AA modal behavior
// ---------------------------------------------------------------------------

describe("Accessibility: WCAG 2.1 AA modal behavior", () => {
  it("should set role='dialog' on the modal overlay", () => {
    const instance = createInstance();
    expect(instance.modal.getAttribute("role")).toBe("dialog");
  });

  it("should set aria-modal='true' on the modal overlay", () => {
    const instance = createInstance();
    expect(instance.modal.getAttribute("aria-modal")).toBe("true");
  });

  it("should set aria-labelledby pointing to the modal title", () => {
    const instance = createInstance();
    const labelledBy = instance.modal.getAttribute("aria-labelledby");
    const title = instance.modal.querySelector("h3");

    expect(labelledBy).toBeTruthy();
    expect(title.id).toBe(labelledBy);
  });

  it("should generate unique aria-labelledby IDs across multiple instances", () => {
    const container1 = document.createElement("div");
    const container2 = document.createElement("div");
    document.body.appendChild(container1);
    document.body.appendChild(container2);

    const instance1 = new SocialShareButton({ container: container1, url: "https://a.com", title: "A" });
    const instance2 = new SocialShareButton({ container: container2, url: "https://b.com", title: "B" });

    const id1 = instance1.modal.getAttribute("aria-labelledby");
    const id2 = instance2.modal.getAttribute("aria-labelledby");

    expect(id1).not.toBe(id2);

    instance1.destroy();
    instance2.destroy();
    container1.remove();
    container2.remove();
  });

  it("should set aria-label='Close' on the close button", () => {
    const instance = createInstance();
    const closeBtn = instance.modal.querySelector(".social-share-modal-close");
    expect(closeBtn.getAttribute("aria-label")).toBe("Close");
  });

  it("should set aria-label='URL to share' on the URL input", () => {
    const instance = createInstance();
    const input = instance.modal.querySelector(".social-share-link-input input");
    expect(input.getAttribute("aria-label")).toBe("URL to share");
  });

  it("should set aria-label='Share' on the trigger button", () => {
    const instance = createInstance();
    expect(instance.button.getAttribute("aria-label")).toBe("Share");
  });
});

// ---------------------------------------------------------------------------
// 3. Focus Management
// ---------------------------------------------------------------------------

describe("Focus Management", () => {
  it("should save the previously focused element when opening the modal", () => {
    const instance = createInstance();
    instance.button.focus();

    instance.openModal();

    expect(instance.previousActiveElement).toBe(instance.button);
  });

  it("should move focus into the modal after opening", async () => {
    const instance = createInstance();
    instance.button.focus();

    instance.openModal();

    // The focus is moved in a setTimeout(…, 10), so we need to wait
    await new Promise((resolve) => setTimeout(resolve, 20));

    const activeEl = document.activeElement;
    expect(instance.modal.contains(activeEl)).toBe(true);
  });

  it("should restore focus to the trigger element after closing", async () => {
    const instance = createInstance();
    instance.button.focus();

    instance.openModal();
    await new Promise((resolve) => setTimeout(resolve, 20));

    instance.closeModal();
    // closeModal has a 200ms timeout
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(document.activeElement).toBe(instance.button);
  });

  it("should trap focus on Tab at the last element", async () => {
    const instance = createInstance();
    instance.openModal();
    await new Promise((resolve) => setTimeout(resolve, 20));

    const focusable = instance.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastEl = focusable[focusable.length - 1];
    const firstEl = focusable[0];

    // Focus the last element
    lastEl.focus();
    expect(document.activeElement).toBe(lastEl);

    // Simulate Tab
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(firstEl);
  });

  it("should trap focus on Shift+Tab at the first element", async () => {
    const instance = createInstance();
    instance.openModal();
    await new Promise((resolve) => setTimeout(resolve, 20));

    const focusable = instance.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    // Focus the first element
    firstEl.focus();
    expect(document.activeElement).toBe(firstEl);

    // Simulate Shift+Tab
    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(shiftTabEvent);

    expect(document.activeElement).toBe(lastEl);
  });

  it("should close the modal on Escape key", async () => {
    const instance = createInstance();
    instance.openModal();
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(instance.isModalOpen).toBe(true);

    const escEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(escEvent);

    // closeModal is called synchronously, but the display:none is in a 200ms timeout
    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(instance.isModalOpen).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. Event Delegation
// ---------------------------------------------------------------------------

describe("Event Delegation", () => {
  it("should handle platform button clicks via delegation on the container", () => {
    const instance = createInstance({ platforms: ["whatsapp", "facebook", "twitter"] });
    const shareSpy = vi.spyOn(instance, "share");

    // Open the modal first
    instance.openModal();

    // Click a platform button
    const whatsappBtn = instance.modal.querySelector('[data-platform="whatsapp"]');
    whatsappBtn.click();

    expect(shareSpy).toHaveBeenCalledWith("whatsapp");
  });

  it("should handle clicks on child elements of platform buttons via closest()", () => {
    const instance = createInstance({ platforms: ["facebook"] });
    const shareSpy = vi.spyOn(instance, "share");

    instance.openModal();

    // Click the icon div (child of the button)
    const iconDiv = instance.modal.querySelector(".social-share-platform-icon");
    iconDiv.click();

    expect(shareSpy).toHaveBeenCalledWith("facebook");
  });

  it("should not trigger share when clicking empty space in the platforms container", () => {
    const instance = createInstance({ platforms: ["whatsapp"] });
    const shareSpy = vi.spyOn(instance, "share");

    instance.openModal();

    // Click the container itself, not a button
    const container = instance.modal.querySelector(".social-share-platforms");
    container.click();

    expect(shareSpy).not.toHaveBeenCalled();
  });

  it("should use fewer event listeners than the number of platforms", () => {
    const platformCount = 8;
    const instance = createInstance({
      platforms: ["whatsapp", "facebook", "twitter", "linkedin", "telegram", "reddit", "pinterest", "discord"],
    });

    // Count listeners registered on platform buttons
    const platformListeners = instance.listeners.filter(
      (l) => l.element && l.element.classList && l.element.classList.contains("social-share-platform-btn")
    );

    // With delegation, there should be 0 direct listeners on platform buttons
    expect(platformListeners.length).toBe(0);

    // Instead there should be one on the platforms container
    const containerListeners = instance.listeners.filter(
      (l) => l.element && l.element.classList && l.element.classList.contains("social-share-platforms")
    );
    expect(containerListeners.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 5. Modal Lifecycle
// ---------------------------------------------------------------------------

describe("Modal Lifecycle", () => {
  it("should start with modal hidden", () => {
    const instance = createInstance();
    expect(instance.modal.style.display).toBe("none");
    expect(instance.isModalOpen).toBe(false);
  });

  it("should show the modal on openModal()", () => {
    const instance = createInstance();
    instance.openModal();

    expect(instance.modal.style.display).toBe("flex");
    expect(instance.isModalOpen).toBe(true);
  });

  it("should hide the modal on closeModal() after transition delay", async () => {
    const instance = createInstance();
    instance.openModal();
    instance.closeModal();

    await new Promise((resolve) => setTimeout(resolve, 250));

    expect(instance.modal.style.display).toBe("none");
    expect(instance.isModalOpen).toBe(false);
  });

  it("should close modal when clicking the overlay background", () => {
    const instance = createInstance();
    const closeModalSpy = vi.spyOn(instance, "closeModal");

    instance.openModal();

    // Simulate clicking the overlay (the modal element itself)
    const clickEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickEvent, "target", { value: instance.modal });
    instance.modal.dispatchEvent(clickEvent);

    expect(closeModalSpy).toHaveBeenCalled();
  });

  it("should close modal when clicking the close button", () => {
    const instance = createInstance();
    const closeModalSpy = vi.spyOn(instance, "closeModal");

    instance.openModal();

    const closeBtn = instance.modal.querySelector(".social-share-modal-close");
    closeBtn.click();

    expect(closeModalSpy).toHaveBeenCalled();
  });

  it("should clean up DOM and listeners on destroy()", () => {
    const instance = createInstance();
    const modal = instance.modal;
    const button = instance.button;

    expect(document.body.contains(modal)).toBe(true);

    instance.destroy();

    expect(document.body.contains(modal)).toBe(false);
    expect(instance.modal).toBeNull();
    expect(instance.button).toBeNull();
    expect(instance.listeners.length).toBe(0);
    expect(instance.isDestroyed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. Public API Backward Compatibility
// ---------------------------------------------------------------------------

describe("Public API backward compatibility", () => {
  it("should accept all standard constructor options without errors", () => {
    expect(() =>
      createInstance({
        url: "https://example.com",
        title: "Title",
        description: "Description",
        hashtags: ["test"],
        via: "testuser",
        platforms: ["whatsapp", "twitter"],
        theme: "light",
        buttonText: "Share This",
        customClass: "my-class",
        buttonStyle: "rounded",
        modalPosition: "bottom",
        analytics: true,
        debug: false,
      })
    ).not.toThrow();
  });

  it("should expose openModal() and closeModal() as public methods", () => {
    const instance = createInstance();
    expect(typeof instance.openModal).toBe("function");
    expect(typeof instance.closeModal).toBe("function");
  });

  it("should expose share() as a public method", () => {
    const instance = createInstance();
    expect(typeof instance.share).toBe("function");
  });

  it("should expose destroy() as a public method", () => {
    const instance = createInstance();
    expect(typeof instance.destroy).toBe("function");
  });

  it("should expose updateOptions() as a public method", () => {
    const instance = createInstance();
    expect(typeof instance.updateOptions).toBe("function");
  });

  it("should track instances in the static instances Set", () => {
    const instance = createInstance();
    expect(SocialShareButton.instances.has(instance)).toBe(true);
  });

  it("should remove instance from static Set on destroy", () => {
    const instance = createInstance();
    instance.destroy();
    expect(SocialShareButton.instances.has(instance)).toBe(false);
  });

  it("should set the correct URL in the input field", () => {
    const instance = createInstance({ url: "https://custom-url.dev" });
    const input = instance.modal.querySelector(".social-share-link-input input");
    expect(input.value).toBe("https://custom-url.dev");
  });

  it("should render the correct number of platform buttons", () => {
    const instance = createInstance({
      platforms: ["whatsapp", "facebook", "twitter", "linkedin"],
    });
    const btns = instance.modal.querySelectorAll(".social-share-platform-btn");
    expect(btns.length).toBe(4);
  });

  it("should set data-platform attribute on each platform button", () => {
    const instance = createInstance({ platforms: ["telegram", "reddit"] });
    const btns = instance.modal.querySelectorAll(".social-share-platform-btn");

    expect(btns[0].dataset.platform).toBe("telegram");
    expect(btns[1].dataset.platform).toBe("reddit");
  });

  it("should preserve custom buttonText", () => {
    const instance = createInstance({ buttonText: "Share this page" });
    const span = instance.button.querySelector("span");
    expect(span.textContent).toBe("Share this page");
  });
});

// ---------------------------------------------------------------------------
// 7. SVG Visual Parity
// ---------------------------------------------------------------------------

describe("SVG Visual Parity", () => {
  it("should set width and height on the share button SVG", () => {
    const instance = createInstance();
    const svg = instance.button.querySelector("svg");
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("20");
  });

  it("should set fill='none' on the share button SVG (path uses currentColor)", () => {
    const instance = createInstance();
    const svg = instance.button.querySelector("svg");
    expect(svg.getAttribute("fill")).toBe("none");
  });

  it("should set the share-icon class on the share button SVG", () => {
    const instance = createInstance();
    const svg = instance.button.querySelector("svg");
    expect(svg.classList.contains("share-icon")).toBe(true);
  });

  it("should set fill='white' on platform icon SVGs", () => {
    const instance = createInstance({ platforms: ["whatsapp"] });
    const platformSvg = instance.modal.querySelector(".social-share-platform-icon svg");
    expect(platformSvg.getAttribute("fill")).toBe("white");
  });

  it("should set viewBox='0 0 24 24' on all SVGs", () => {
    const instance = createInstance({ platforms: ["twitter"] });
    const allSvgs = [
      instance.button.querySelector("svg"),
      ...instance.modal.querySelectorAll(".social-share-platform-icon svg"),
    ];

    allSvgs.forEach((svg) => {
      expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    });
  });
});
