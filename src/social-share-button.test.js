// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "./social-share-button.js";

describe("SocialShareButton Unit Tests", () => {
  let container;

  beforeEach(() => {
    // Create a fresh container in the mocked DOM before each test
    container = document.createElement("div");
    container.id = "share-container";
    document.body.appendChild(container);

    // Mock window.open and window.location
    vi.stubGlobal("open", vi.fn());
  });

  afterEach(() => {
    // Clean up DOM and global mocks
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("should initialize with default options", () => {
    const SocialShareButtonClass = window.SocialShareButton;
    expect(SocialShareButtonClass).toBeDefined();

    const instance = new SocialShareButtonClass({
      container: "#share-container",
      url: "https://test-url.com",
      title: "Test Title",
    });

    expect(instance.options.url).toBe("https://test-url.com");
    expect(instance.options.title).toBe("Test Title");
    expect(instance.options.theme).toBe("dark");
  });

  it("should render the share button inside container when showButton is true", () => {
    const SocialShareButtonClass = window.SocialShareButton;

    new SocialShareButtonClass({
      container: "#share-container",
      showButton: true,
      buttonText: "Share Now",
    });

    const button = container.querySelector(".social-share-btn");
    expect(button).not.toBeNull();
    expect(button.textContent.trim()).toBe("Share Now");
  });

  it("should not render the button if showButton is false", () => {
    const SocialShareButtonClass = window.SocialShareButton;

    new SocialShareButtonClass({
      container: "#share-container",
      showButton: false,
    });

    const button = container.querySelector(".social-share-btn");
    expect(button).toBeNull();
  });

  it("should correctly generate share modal HTML with sharing platforms", () => {
    const SocialShareButtonClass = window.SocialShareButton;

    const instance = new SocialShareButtonClass({
      container: "#share-container",
      platforms: ["facebook", "whatsapp", "twitter"],
      url: "https://example.com",
    });

    // Verify modal is constructed
    expect(instance.modal).not.toBeNull();

    // Check if platforms are listed
    const fbItem = instance.modal.querySelector(
      '.social-share-platform-btn[data-platform="facebook"]'
    );
    const waItem = instance.modal.querySelector(
      '.social-share-platform-btn[data-platform="whatsapp"]'
    );
    const twItem = instance.modal.querySelector(
      '.social-share-platform-btn[data-platform="twitter"]'
    );

    expect(fbItem).not.toBeNull();
    expect(waItem).not.toBeNull();
    expect(twItem).not.toBeNull();
  });

  it("should trigger onShare callback when a platform button is clicked", () => {
    const SocialShareButtonClass = window.SocialShareButton;
    const onShareSpy = vi.fn();

    const instance = new SocialShareButtonClass({
      container: "#share-container",
      platforms: ["facebook"],
      onShare: onShareSpy,
      url: "https://example.com",
    });

    const fbBtn = instance.modal.querySelector(
      '.social-share-platform-btn[data-platform="facebook"]'
    );
    expect(fbBtn).not.toBeNull();

    // Trigger click on the sharing button
    fbBtn.click();

    expect(onShareSpy).toHaveBeenCalledTimes(1);
    expect(onShareSpy).toHaveBeenCalledWith("facebook", "https://example.com");
  });

  it("should remove elements and listeners when destroy is called", () => {
    const SocialShareButtonClass = window.SocialShareButton;

    const instance = new SocialShareButtonClass({
      container: "#share-container",
      showButton: true,
    });

    expect(container.children.length).toBeGreaterThan(0);

    instance.destroy();

    expect(container.children.length).toBe(0);
    expect(instance.isDestroyed).toBe(true);
  });
});
