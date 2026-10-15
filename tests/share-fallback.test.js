import test from "node:test";
import assert from "node:assert/strict";

// Setup mock browser environment for Node.js
function setupMockEnvironment(overrides = {}) {
  let clipboardWriteTextResult = Promise.resolve();
  let execCommandResult = true;
  let windowOpenResult = {
    closed: false,
    opener: "initial",
    location: { href: "about:blank" },
    close() {
      this.closed = true;
    },
  };
  let windowOpenCalls = [];

  const mockWindow = {
    location: { href: "https://example.com/test-page" },
    open: (url, target, features) => {
      windowOpenCalls.push({ url, target, features });
      if (typeof overrides.windowOpenFactory === "function") {
        return overrides.windowOpenFactory(url, target, features);
      }
      return windowOpenResult;
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    history: { pushState: () => {}, replaceState: () => {} },
  };

  const mockDocument = {
    title: "Test Page Title",
    readyState: "complete",
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      },
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      select: () => {},
      setSelectionRange: () => {},
    }),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    execCommand: (cmd) => {
      if (cmd === "copy") {
        return overrides.execCommandResult !== undefined
          ? overrides.execCommandResult
          : execCommandResult;
      }
      return false;
    },
  };

  const mockNavigator = {
    clipboard: {
      writeText: async (text) => {
        if (overrides.clipboardRejects) {
          throw new Error("Clipboard write permission denied");
        }
        return clipboardWriteTextResult;
      },
    },
  };

  if (overrides.noClipboardApi) {
    delete mockNavigator.clipboard;
  }

  Object.defineProperty(globalThis, "window", {
    value: mockWindow,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "document", {
    value: mockDocument,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, "navigator", {
    value: mockNavigator,
    configurable: true,
    writable: true,
  });
  globalThis.MutationObserver = class {
    observe() {}
    disconnect() {}
  };
  globalThis.CustomEvent = class {
    constructor(name, opts) {
      this.name = name;
      this.detail = opts ? opts.detail : undefined;
    }
  };

  return {
    mockWindow,
    mockDocument,
    mockNavigator,
    windowOpenCalls,
    setWindowOpenResult: (val) => {
      windowOpenResult = val;
    },
    setClipboardRejects: (val) => {
      overrides.clipboardRejects = val;
    },
    setExecCommandResult: (val) => {
      overrides.execCommandResult = val;
    },
  };
}

let CachedSocialShareButton = null;

async function getSocialShareButton(env) {
  if (!CachedSocialShareButton) {
    const mod = await import("../src/social-share-button.js");
    CachedSocialShareButton = mod.default || globalThis.window.SocialShareButton;
  }
  if (env && env.mockWindow) {
    env.mockWindow.SocialShareButton = CachedSocialShareButton;
  }
  return CachedSocialShareButton;
}

test("Discord fallback share: success when clipboard and window.open succeed", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let sharedPlatform = null;
  let sharedUrl = null;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onShare: (platform, url) => {
      sharedPlatform = platform;
      sharedUrl = url;
    },
  });

  const popupHandle = {
    closed: false,
    opener: "exists",
    location: { href: "about:blank" },
    close() {
      this.closed = true;
    },
  };
  env.setWindowOpenResult(popupHandle);

  const result = await instance.share("discord");

  assert.equal(result, true, "share('discord') should resolve to true");
  assert.equal(popupHandle.opener, null, "popup.opener should be severed to null for security");
  assert.equal(popupHandle.location.href, "https://discord.com/channels/@me");
  assert.equal(sharedPlatform, "discord");
  assert.equal(sharedUrl, "https://aossie.org");

  const clickEvent = events.find((e) => e.eventName === "social_share_click");
  assert.ok(clickEvent, "social_share_click must be emitted");
  assert.equal(clickEvent.platform, "discord");

  const copyEvent = events.find((e) => e.eventName === "social_share_copy");
  assert.ok(copyEvent, "social_share_copy must be emitted");

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.ok(successEvent, "social_share_success must be emitted");
  assert.equal(successEvent.platform, "discord");

  const errorEvent = events.find((e) => e.eventName === "social_share_error");
  assert.equal(errorEvent, undefined, "No error event should be emitted on success");
});

test("Discord fallback share: error emitted when clipboard copy fails", async () => {
  const env = setupMockEnvironment({
    clipboardRejects: true,
    execCommandResult: false,
  });
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onShareCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onShare: () => {
      onShareCalled = true;
    },
  });

  const popupHandle = {
    closed: false,
    opener: "exists",
    location: { href: "about:blank" },
    close() {
      this.closed = true;
    },
  };
  env.setWindowOpenResult(popupHandle);

  const result = await instance.share("discord");

  assert.equal(result, false, "share('discord') must resolve to false when copy fails");
  assert.equal(onShareCalled, false, "onShare must NOT be called when copy fails");
  assert.equal(popupHandle.closed, true, "popup must be closed when copy fails");

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.equal(successEvent, undefined, "social_share_success must NOT be emitted");

  const errorEvent = events.find((e) => e.eventName === "social_share_error");
  assert.ok(errorEvent, "social_share_error must be emitted");
  assert.equal(errorEvent.platform, "discord");
  assert.match(errorEvent.errorMessage, /Failed to copy share link/i);
});

test("Discord fallback share: error emitted when popup is blocked (window.open returns null)", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onShareCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onShare: () => {
      onShareCalled = true;
    },
  });

  env.setWindowOpenResult(null); // Simulate popup blocker

  const result = await instance.share("discord");

  assert.equal(result, false, "share('discord') must resolve to false when popup is blocked");
  assert.equal(onShareCalled, false, "onShare must NOT be called when popup is blocked");

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.equal(successEvent, undefined, "social_share_success must NOT be emitted");

  const errorEvent = events.find((e) => e.eventName === "social_share_error");
  assert.ok(errorEvent, "social_share_error must be emitted");
  assert.equal(errorEvent.platform, "discord");
  assert.match(errorEvent.errorMessage, /Popup blocked/i);
});

test("Discord fallback share: error emitted when popup is immediately closed", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onShareCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onShare: () => {
      onShareCalled = true;
    },
  });

  env.setWindowOpenResult({ closed: true });

  const result = await instance.share("discord");

  assert.equal(result, false, "share('discord') must resolve to false when popup is closed");
  assert.equal(onShareCalled, false, "onShare must NOT be called when popup is closed");

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.equal(successEvent, undefined, "social_share_success must NOT be emitted");

  const errorEvent = events.find((e) => e.eventName === "social_share_error");
  assert.ok(errorEvent, "social_share_error must be emitted");
  assert.equal(errorEvent.platform, "discord");
  assert.match(errorEvent.errorMessage, /Popup blocked/i);
});

test("Generic platform (twitter): detects popup blocker and emits error", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onShareCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onShare: () => {
      onShareCalled = true;
    },
  });

  env.setWindowOpenResult(null); // popup blocked

  const result = await instance.share("twitter");

  assert.equal(result, false, "share('twitter') must resolve to false when popup is blocked");
  assert.equal(onShareCalled, false, "onShare must NOT be called when popup is blocked");

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.equal(successEvent, undefined, "social_share_success must NOT be emitted");

  const errorEvent = events.find((e) => e.eventName === "social_share_error");
  assert.ok(errorEvent, "social_share_error must be emitted");
  assert.equal(errorEvent.platform, "twitter");
  assert.match(errorEvent.errorMessage, /Popup blocked/i);
});

test("Generic platform (twitter): succeeds and severs opener when popup opens", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onShareCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onShare: () => {
      onShareCalled = true;
    },
  });

  const popup = { closed: false, opener: "exists" };
  env.setWindowOpenResult(popup);

  const result = await instance.share("twitter");

  assert.equal(result, true);
  assert.equal(onShareCalled, true);
  assert.equal(popup.opener, null, "popup.opener should be severed");

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.ok(successEvent);
  assert.equal(successEvent.platform, "twitter");
});

test("Email platform: redirects location.href without popup check", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onShareCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    title: "Test",
    onAnalytics: (payload) => events.push(payload),
    onShare: () => {
      onShareCalled = true;
    },
  });

  const result = await instance.share("email");

  assert.equal(result, true);
  assert.equal(onShareCalled, true);
  assert.match(env.mockWindow.location.href, /^mailto:/);

  const successEvent = events.find((e) => e.eventName === "social_share_success");
  assert.ok(successEvent);
});

test("copyLink: resolves to true and emits social_share_copy on success", async () => {
  const env = setupMockEnvironment();
  const SocialShareButton = await getSocialShareButton(env);

  const events = [];
  let onCopyCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onAnalytics: (payload) => events.push(payload),
    onCopy: () => {
      onCopyCalled = true;
    },
  });

  const result = await instance.copyLink();

  assert.equal(result, true);
  assert.equal(onCopyCalled, true);
  const copyEvent = events.find((e) => e.eventName === "social_share_copy");
  assert.ok(copyEvent);
});

test("copyLink: resolves to false when clipboard writeText rejects and fallback fails", async () => {
  const env = setupMockEnvironment({
    clipboardRejects: true,
    execCommandResult: false,
  });
  const SocialShareButton = await getSocialShareButton(env);

  let onCopyCalled = false;

  const instance = new SocialShareButton({
    url: "https://aossie.org",
    onCopy: () => {
      onCopyCalled = true;
    },
  });

  const result = await instance.copyLink();

  assert.equal(result, false);
  assert.equal(onCopyCalled, false);
});
