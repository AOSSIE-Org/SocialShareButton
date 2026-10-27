import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import fc from "fast-check";

/** @type {any} */
let SocialShareButton;

beforeAll(async () => {
  // The library is a classic script: it attaches itself to window instead of exporting
  await import("../src/social-share-button.js");
  SocialShareButton = window.SocialShareButton;
  // jsdom may still report readyState "loading"; fire the event the library waits for to start auto-init
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

const PLATFORMS = [
  "whatsapp",
  "facebook",
  "twitter",
  "linkedin",
  "telegram",
  "reddit",
  "email",
  "pinterest",
  "discord",
];

let container;

function create(options = {}) {
  return new SocialShareButton({
    container,
    url: "https://example.org/page?a=1&b=2",
    title: "Hello & welcome",
    ...options,
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // Let the library's batched auto-init timer finish so its internal throttle resets between tests
  vi.runOnlyPendingTimers();
  for (const instance of [...SocialShareButton.instances]) instance.destroy();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  SocialShareButton.openModalCount = 0;
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("getShareURL", () => {
  it("builds the intent URL for every supported platform", () => {
    const btn = create({ via: "aossie_org", hashtags: ["oss", "gsoc"] });
    expect(btn.getShareURL("linkedin")).toBe(
      "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.org%2Fpage%3Fa%3D1%26b%3D2"
    );
    expect(btn.getShareURL("twitter")).toMatch(
      /^https:\/\/twitter\.com\/intent\/tweet\?text=.+&url=.+&via=aossie_org$/
    );
    expect(btn.getShareURL("email")).toMatch(/^mailto:\?subject=Hello%20%26%20welcome&body=/);
    expect(btn.getShareURL("discord")).toBe("https://discord.com/channels/@me");
  });

  it("returns an empty string for an unknown platform", () => {
    expect(create().getShareURL("myspace")).toBe("");
  });

  it("puts hashtags into the shared text and omits via when not set", () => {
    const btn = create({ hashtags: ["oss", "gsoc"] });
    const text = new URL(btn.getShareURL("twitter")).searchParams.get("text");
    expect(text).toContain("#oss #gsoc");
    expect(btn.getShareURL("twitter")).not.toContain("&via=");
  });

  it("property: the shared page URL survives encoding round-trip on every http platform", () => {
    fc.assert(
      fc.property(
        fc.webUrl({ withQueryParameters: true, withFragments: true }),
        fc.string(),
        (url, title) => {
          const btn = create({ url, title: title || "t" });
          const params = {
            facebook: "u",
            twitter: "url",
            linkedin: "url",
            telegram: "url",
            reddit: "url",
            pinterest: "url",
          };
          for (const [platform, key] of Object.entries(params)) {
            expect(new URL(btn.getShareURL(platform)).searchParams.get(key)).toBe(url);
          }
          btn.destroy();
        }
      ),
      { numRuns: 60 }
    );
  });

  it("property: user-controlled text can never inject extra query parameters", () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (title, description) => {
        const btn = create({ title: title || "t", description });
        const params = new URL(btn.getShareURL("reddit")).searchParams;
        expect([...params.keys()]).toEqual(["url", "title"]);
        btn.destroy();
      }),
      { numRuns: 60 }
    );
  });
});

describe("rendering", () => {
  it("renders the trigger button in the container and a hidden modal with one button per platform", () => {
    create({ platforms: ["whatsapp", "linkedin"], buttonText: "Spread the word" });
    const button = container.querySelector(".social-share-btn");
    expect(button).not.toBeNull();
    expect(button.getAttribute("aria-label")).toBe("Share");
    expect(button.textContent).toContain("Spread the word");

    const modal = document.querySelector(".social-share-modal-overlay");
    expect(modal.style.display).toBe("none");
    const platforms = [...modal.querySelectorAll(".social-share-platform-btn")].map(
      (b) => b.dataset.platform
    );
    expect(platforms).toEqual(["whatsapp", "linkedin"]);
    expect(modal.querySelector(".social-share-link-input input").value).toBe(
      "https://example.org/page?a=1&b=2"
    );
  });

  it("skips the trigger button when showButton is false", () => {
    create({ showButton: false });
    expect(container.querySelector(".social-share-btn")).toBeNull();
    expect(document.querySelector(".social-share-modal-overlay")).not.toBeNull();
  });

  it("returns the existing instance for the same container instead of rendering twice", () => {
    const first = create();
    const second = create();
    expect(second).toBe(first);
    expect(container.querySelectorAll(".social-share-btn")).toHaveLength(1);
  });

  it("does not initialise when the container selector matches nothing", () => {
    const btn = new SocialShareButton({ container: "#missing", url: "https://x.org" });
    expect(btn.modal).toBeNull();
    expect(SocialShareButton.instances.has(btn)).toBe(false);
  });

  it("applies and removes custom colours on hover", () => {
    const btn = create({ buttonColor: "rgb(1, 2, 3)", buttonHoverColor: "rgb(4, 5, 6)" });
    expect(btn.button.style.backgroundColor).toBe("rgb(1, 2, 3)");
    btn.button.dispatchEvent(new Event("mouseenter"));
    expect(btn.button.style.backgroundColor).toBe("rgb(4, 5, 6)");
    btn.button.dispatchEvent(new Event("mouseleave"));
    expect(btn.button.style.backgroundColor).toBe("rgb(1, 2, 3)");
  });
});

describe("modal", () => {
  it("opens on click, locks body scroll, and closes on Escape", () => {
    const btn = create();
    btn.button.click();
    expect(btn.isModalOpen).toBe(true);
    expect(btn.modal.style.display).toBe("flex");
    expect(document.body.style.overflow).toBe("hidden");
    vi.advanceTimersByTime(10);
    expect(btn.modal.classList.contains("active")).toBe(true);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    vi.advanceTimersByTime(200);
    expect(btn.isModalOpen).toBe(false);
    expect(btn.modal.style.display).toBe("none");
    expect(document.body.style.overflow).toBe("");
  });

  it("closes from the close button and from a click on the overlay, but not from inside the content", () => {
    const btn = create();
    btn.openModal();
    btn.modal.querySelector(".social-share-modal-content").click();
    vi.advanceTimersByTime(200);
    expect(btn.isModalOpen).toBe(true);

    btn.modal.querySelector(".social-share-modal-close").click();
    vi.advanceTimersByTime(200);
    expect(btn.isModalOpen).toBe(false);

    btn.openModal();
    btn.modal.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    vi.advanceTimersByTime(200);
    expect(btn.isModalOpen).toBe(false);
  });

  it("keeps body scroll locked until the last of several open modals closes", () => {
    document.body.style.overflow = "auto";
    const a = create();
    const otherContainer = document.createElement("div");
    document.body.appendChild(otherContainer);
    const b = new SocialShareButton({ container: otherContainer, url: "https://b.org" });

    a.openModal();
    b.openModal();
    a.closeModal();
    vi.advanceTimersByTime(200);
    expect(document.body.style.overflow).toBe("hidden");
    b.closeModal();
    vi.advanceTimersByTime(200);
    expect(document.body.style.overflow).toBe("auto");
  });

  it("property: any sequence of open/close calls leaves the lock counter consistent", () => {
    fc.assert(
      fc.property(fc.array(fc.boolean(), { maxLength: 12 }), (ops) => {
        const btn = create();
        for (const open of ops) open ? btn.openModal() : btn.closeModal();
        vi.advanceTimersByTime(500);
        expect(SocialShareButton.openModalCount).toBe(btn.isModalOpen ? 1 : 0);
        expect(document.body.style.overflow).toBe(btn.isModalOpen ? "hidden" : "");
        btn.destroy();
        expect(SocialShareButton.openModalCount).toBe(0);
      }),
      { numRuns: 50 }
    );
  });
});

describe("share", () => {
  it("opens the platform intent in a popup and reports the share", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const onShare = vi.fn();
    const btn = create({ onShare });
    btn.modal.querySelector('[data-platform="linkedin"]').click();
    expect(open).toHaveBeenCalledWith(
      btn.getShareURL("linkedin"),
      "_blank",
      "noopener,noreferrer,width=600,height=600"
    );
    expect(onShare).toHaveBeenCalledWith("linkedin", "https://example.org/page?a=1&b=2");
  });

  it("copies the link and opens Discord DMs for discord", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const btn = create();
    btn.share("discord");
    expect(writeText).toHaveBeenCalledWith("https://example.org/page?a=1&b=2");
    expect(open).toHaveBeenCalledWith(
      "https://discord.com/channels/@me",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("emits an error event instead of opening anything for an unknown platform", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const onAnalytics = vi.fn();
    create({ onAnalytics }).share("myspace");
    expect(open).not.toHaveBeenCalled();
    expect(onAnalytics).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "social_share_error",
        errorMessage: expect.stringContaining("myspace"),
      })
    );
  });
});

describe("copyLink", () => {
  it("uses the Clipboard API, shows feedback, then resets it", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const onCopy = vi.fn();
    const btn = create({ onCopy });
    const copyBtn = btn.modal.querySelector(".social-share-copy-btn");

    copyBtn.click();
    await vi.waitFor(() => expect(copyBtn.textContent).toBe("Copied!"));
    expect(onCopy).toHaveBeenCalledWith("https://example.org/page?a=1&b=2");
    vi.advanceTimersByTime(2000);
    expect(copyBtn.textContent).toBe("Copy");
  });

  it("falls back to execCommand when the Clipboard API is missing", () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn(() => true);
    const btn = create();
    btn.copyLink();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(btn.modal.querySelector(".social-share-copy-btn").textContent).toBe("Copied!");
  });

  it("falls back when the Clipboard API rejects, and shows Failed if that throws too", async () => {
    vi.stubGlobal("navigator", {
      clipboard: { writeText: () => Promise.reject(new Error("denied")) },
    });
    document.execCommand = vi.fn(() => {
      throw new Error("blocked");
    });
    const btn = create();
    const copyBtn = btn.modal.querySelector(".social-share-copy-btn");
    btn.copyLink();
    await vi.waitFor(() => expect(copyBtn.textContent).toBe("Failed"));
    vi.advanceTimersByTime(2000);
    expect(copyBtn.textContent).toBe("Copy");
  });
});

describe("analytics", () => {
  it("delivers the same versioned payload via DOM event, callback and plugins", () => {
    const onAnalytics = vi.fn();
    const plugin = { track: vi.fn() };
    const domListener = vi.fn();
    document.addEventListener("social-share", domListener);
    const btn = create({ onAnalytics, analyticsPlugins: [plugin], componentId: "hero" });

    btn.openModal();
    const payload = onAnalytics.mock.calls[0][0];
    expect(payload).toMatchObject({
      version: "1.0",
      source: "social-share-button",
      eventName: "social_share_popup_open",
      interactionType: "popup_open",
      platform: null,
      componentId: "hero",
      url: "https://example.org/page?a=1&b=2",
    });
    expect(plugin.track).toHaveBeenCalledWith(payload);
    expect(domListener.mock.calls[0][0].detail).toEqual(payload);
    document.removeEventListener("social-share", domListener);
  });

  it("emits nothing when analytics is disabled", () => {
    const onAnalytics = vi.fn();
    create({ analytics: false, onAnalytics }).openModal();
    expect(onAnalytics).not.toHaveBeenCalled();
  });

  it("isolates failures: a throwing callback or plugin does not stop the others", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const good = { track: vi.fn() };
    const btn = create({
      debug: true,
      onAnalytics: () => {
        throw new Error("callback broke");
      },
      analyticsPlugins: [
        {
          track: () => {
            throw new Error("plugin broke");
          },
        },
        null,
        good,
      ],
    });
    btn.openModal();
    expect(good.track).toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(2);
  });
});

describe("updateOptions and SPA routing", () => {
  it("updates the URL shown in the modal and re-applies colours", () => {
    const btn = create();
    btn.updateOptions({ url: "https://new.example.org", buttonColor: "rgb(9, 9, 9)" });
    expect(btn.modal.querySelector(".social-share-link-input input").value).toBe(
      "https://new.example.org"
    );
    expect(btn.button.style.backgroundColor).toBe("rgb(9, 9, 9)");
  });

  it("refreshes auto-detected url/title on route change but keeps caller-supplied ones", () => {
    const dynamic = new SocialShareButton({ container });
    const fixedContainer = document.createElement("div");
    document.body.appendChild(fixedContainer);
    const fixed = new SocialShareButton({
      container: fixedContainer,
      url: "https://fixed.org",
      title: "Fixed",
    });

    window.history.pushState({}, "", "/new-route");
    document.title = "New page";
    vi.advanceTimersByTime(60);

    expect(dynamic.options.url).toBe(window.location.href);
    expect(dynamic.options.title).toBe("New page");
    expect(fixed.options.url).toBe("https://fixed.org");
    expect(fixed.options.title).toBe("Fixed");
  });
});

describe("destroy", () => {
  it("removes DOM, listeners and registry entry, and is idempotent", () => {
    const btn = create();
    btn.openModal();
    btn.destroy();
    expect(container.querySelector(".social-share-btn")).toBeNull();
    expect(document.querySelector(".social-share-modal-overlay")).toBeNull();
    expect(SocialShareButton.instances.has(btn)).toBe(false);
    expect(container._socialShareButtonInstance).toBeUndefined();
    expect(document.body.style.overflow).toBe("");
    expect(() => btn.destroy()).not.toThrow();
  });

  it("ignores a clipboard result that arrives after destroy", async () => {
    let resolve;
    vi.stubGlobal("navigator", {
      clipboard: { writeText: () => new Promise((r) => (resolve = r)) },
    });
    const onCopy = vi.fn();
    const btn = create({ onCopy });
    btn.copyLink();
    btn.destroy();
    resolve();
    await Promise.resolve();
    expect(onCopy).not.toHaveBeenCalled();
  });
});

describe("auto-init from data attributes", () => {
  it("creates an instance for [data-social-share] elements added to the page", async () => {
    const el = document.createElement("div");
    el.setAttribute("data-social-share", "");
    el.setAttribute("data-url", "https://auto.example.org");
    el.setAttribute("data-platforms", "whatsapp, reddit");
    el.setAttribute("data-hashtags", "a, b");
    el.setAttribute("data-show-button", "true");
    document.body.appendChild(el);

    await vi.advanceTimersByTimeAsync(20);
    const instance = el._socialShareButtonInstance;
    expect(instance).toBeDefined();
    expect(instance.options).toMatchObject({
      url: "https://auto.example.org",
      platforms: ["whatsapp", "reddit"],
      hashtags: ["a", "b"],
      showButton: true,
    });
  });

  it("destroys the instance when its element is removed from the page", async () => {
    const el = document.createElement("div");
    el.setAttribute("data-social-share", "");
    document.body.appendChild(el);
    await vi.advanceTimersByTimeAsync(20);
    const instance = el._socialShareButtonInstance;
    expect(SocialShareButton.instances.has(instance)).toBe(true);

    el.remove();
    await vi.advanceTimersByTimeAsync(20);
    expect(SocialShareButton.instances.has(instance)).toBe(false);
  });
});

describe("platform coverage", () => {
  it.each(PLATFORMS)("%s produces a non-empty, well-formed share target", (platform) => {
    const url = create().getShareURL(platform);
    expect(() => new URL(url)).not.toThrow();
  });
});

describe("edge cases", () => {
  it("defaults url and title to the current page when not provided", () => {
    document.title = "Current page";
    const btn = new SocialShareButton({ container });
    expect(btn.options.url).toBe(window.location.href);
    expect(btn.options.title).toBe("Current page");
    expect(btn._dynamicUrl).toBe(true);
  });

  it("builds a Pinterest description even without a title", () => {
    const btn = create({ title: "", description: "Just a description" });
    btn.options.title = "";
    expect(new URL(btn.getShareURL("pinterest")).searchParams.get("description")).toBe(
      " - Just a description"
    );
  });

  it("navigates the current tab for email instead of opening a popup", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const btn = create();
    try {
      btn.share("email");
    } catch {
      // jsdom does not implement navigation; only the popup behaviour matters here
    }
    expect(open).not.toHaveBeenCalled();
  });

  it("restarts the copy feedback timer when copying twice", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const btn = create();
    const copyBtn = btn.modal.querySelector(".social-share-copy-btn");
    btn.copyLink();
    await vi.waitFor(() => expect(copyBtn.textContent).toBe("Copied!"));
    vi.advanceTimersByTime(1500);
    btn.copyLink();
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
    await Promise.resolve();
    vi.advanceTimersByTime(1000);
    expect(copyBtn.textContent).toBe("Copied!");
    vi.advanceTimersByTime(1000);
    expect(copyBtn.textContent).toBe("Copy");
  });

  it("calls onCopy and restarts feedback in the execCommand fallback too", () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn(() => true);
    const onCopy = vi.fn();
    const btn = create({ onCopy });
    const copyBtn = btn.modal.querySelector(".social-share-copy-btn");
    btn.copyLink();
    btn.copyLink();
    expect(onCopy).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(2000);
    expect(copyBtn.textContent).toBe("Copy");
  });

  it("restarts the Failed feedback timer when the fallback fails twice", () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn(() => {
      throw new Error("blocked");
    });
    const btn = create();
    const copyBtn = btn.modal.querySelector(".social-share-copy-btn");
    btn.copyLink();
    vi.advanceTimersByTime(1500);
    btn.copyLink();
    vi.advanceTimersByTime(1000);
    expect(copyBtn.textContent).toBe("Failed");
    vi.advanceTimersByTime(1000);
    expect(copyBtn.textContent).toBe("Copy");
  });

  it("does nothing in the fallback after destroy, and cancels pending feedback/close timers on destroy", () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn(() => true);
    const btn = create();
    const copyBtn = btn.modal.querySelector(".social-share-copy-btn");
    btn.copyLink();
    btn.openModal();
    btn.closeModal();
    btn.destroy();
    expect(() => vi.advanceTimersByTime(3000)).not.toThrow();
    expect(copyBtn.textContent).toBe("Copied!");
    btn.fallbackCopy(document.createElement("input"), copyBtn);
    expect(document.execCommand).toHaveBeenCalledTimes(1);
  });

  it("ignores open/close calls once destroyed", () => {
    const btn = create();
    btn.destroy();
    expect(() => {
      btn.openModal();
      btn.closeModal();
    }).not.toThrow();
    expect(btn.isModalOpen).toBe(false);
  });

  it("re-applying colours swaps handlers, removes the legacy global style tag, and supports hover-only colours", () => {
    const legacy = document.createElement("style");
    legacy.id = "social-share-custom-colors";
    document.head.appendChild(legacy);
    const btn = create({ buttonColor: "rgb(1, 2, 3)" });
    expect(document.getElementById("social-share-custom-colors")).toBeNull();

    btn.updateOptions({ buttonColor: "", buttonHoverColor: "rgb(7, 7, 7)" });
    expect(btn.button.style.backgroundColor).toBe("");
    btn.button.dispatchEvent(new Event("mouseenter"));
    expect(btn.button.style.backgroundColor).toBe("rgb(7, 7, 7)");
    btn.button.dispatchEvent(new Event("mouseleave"));
    expect(btn.button.style.backgroundColor).toBe("");
  });

  it("recomputes the dynamic-title flag on an external title update", () => {
    const btn = new SocialShareButton({ container, url: "https://x.org" });
    expect(btn._dynamicTitle).toBe(true);
    btn.updateOptions({ title: "Pinned" });
    expect(btn._dynamicTitle).toBe(false);
    btn.updateOptions({ title: "" });
    expect(btn._dynamicTitle).toBe(true);
  });

  it("does not register listeners twice", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    const btn = create();
    btn.attachEvents();
    btn.modal.querySelector('[data-platform="reddit"]').click();
    expect(open).toHaveBeenCalledTimes(1);
  });

  it("dispatches analytics on document when the instance has no container", () => {
    const listener = vi.fn();
    document.addEventListener("social-share", listener);
    const btn = new SocialShareButton({ url: "https://x.org", title: "x" });
    btn._emit("social_share_click", "share", { platform: "x" });
    expect(listener).toHaveBeenCalled();
    document.removeEventListener("social-share", listener);
  });

  it("swallows analytics errors silently when debug is off", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const btn = create({
      onAnalytics: () => {
        throw new Error("x");
      },
    });
    btn.openModal();
    expect(warn).not.toHaveBeenCalled();
  });

  it("auto-inits an element that is itself the added node, and ignores nodes the library adds", async () => {
    const wrapper = document.createElement("section");
    const el = document.createElement("div");
    el.setAttribute("data-social-share", "");
    el.setAttribute("data-show-button", "false");
    wrapper.appendChild(el);
    document.body.appendChild(wrapper);
    await vi.advanceTimersByTimeAsync(20);
    expect(el._socialShareButtonInstance).toBeDefined();
    expect(el.querySelector(".social-share-btn")).toBeNull();

    // removing an ancestor of the container also cleans up the instance
    const instance = el._socialShareButtonInstance;
    wrapper.remove();
    await vi.advanceTimersByTimeAsync(20);
    expect(SocialShareButton.instances.has(instance)).toBe(false);
  });
});
