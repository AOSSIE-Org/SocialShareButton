import { describe, it, expect, beforeEach, afterEach } from "vitest";

await import("../src/social-share-button.js");
const SocialShareButton = window.SocialShareButton;

function setPage() {
  document.head.innerHTML = `
    <title>Test Page | Site</title>
    <meta property="og:title" content="OG Detected Title" />
    <meta property="og:description" content="OG detected description for sharing." />
  `;
  document.body.innerHTML = `
    <article>
      <h1>Article H1</h1>
      <p>Article body content that is long enough to generate a meaningful excerpt for social sharing.</p>
    </article>
    <div id="share-root"></div>
  `;
}

function makeButton(options = {}) {
  const container = document.getElementById("share-root");
  return new SocialShareButton({ container, ...options });
}

beforeEach(() => {
  SocialShareButton.clearContentCache();
  setPage();
});

afterEach(() => {
  for (const instance of [...SocialShareButton.instances]) instance.destroy();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
  document.title = "";
  SocialShareButton.openModalCount = 0;
  SocialShareButton.clearContentCache();
});

describe("SocialShareButton content auto-detection", () => {
  it("detects og:title when title is omitted", () => {
    expect(makeButton().options.title).toBe("OG Detected Title");
  });

  it("detects og:description when description is omitted", () => {
    expect(makeButton().options.description).toBe("OG detected description for sharing.");
  });

  it("detects twitter:title and meta description", () => {
    document.head.innerHTML = `
      <title>Ignored</title>
      <meta name="twitter:title" content="Twitter Title" />
      <meta name="description" content="Meta description for sharing." />
    `;
    document.body.innerHTML = '<div id="share-root"></div>';
    SocialShareButton.clearContentCache();

    const button = makeButton();

    expect(button.options.title).toBe("Twitter Title");
    expect(button.options.description).toBe("Meta description for sharing.");
  });

  it("falls back to h1 and a body excerpt", () => {
    document.head.innerHTML = "<title>Ignored</title>";
    document.body.innerHTML = `
      <article>
        <h1>Article H1</h1>
        <p>This article has enough body text to generate a meaningful excerpt for social sharing because the detector needs more than fifty characters before it accepts a content root.</p>
      </article>
      <div id="share-root"></div>
    `;
    SocialShareButton.clearContentCache();

    const button = makeButton();

    expect(button.options.title).toBe("Article H1");
    expect(button.options.description.length).toBeGreaterThan(0);
  });

  it("strips a site suffix from document.title when no metadata exists", () => {
    document.head.innerHTML = "<title>Page Title | Site</title>";
    document.body.innerHTML = '<div id="share-root"></div>';
    SocialShareButton.clearContentCache();

    expect(makeButton().options.title).toBe("Page Title");
  });

  it("lets manual values override detection", () => {
    const button = makeButton({
      title: "Manual Title",
      description: "Manual Description",
    });
    expect(button.options.title).toBe("Manual Title");
    expect(button.options.description).toBe("Manual Description");
  });

  it("preserves an explicit empty description", () => {
    expect(makeButton({ description: "" }).options.description).toBe("");
  });

  it("skips detection when autoDetect is false", () => {
    const button = makeButton({ autoDetect: false });
    expect(button.options.title).toBe("Test Page | Site");
    expect(button.options.description).toBe("");
  });

  it("uses the current URL by default", () => {
    expect(makeButton().options.url).toBe(window.location.href);
  });

  it("re-detects on updateOptions when caller fields are omitted", () => {
    const button = makeButton();
    document.querySelector('meta[property="og:title"]').content = "Updated OG Title";
    SocialShareButton.clearContentCache();

    button.updateOptions({ url: "https://example.com/next" });

    expect(button.options.url).toBe("https://example.com/next");
    expect(button.options.title).toBe("Updated OG Title");
  });

  it("uses detected title for SPA page updates", () => {
    const button = makeButton();
    document.querySelector('meta[property="og:title"]').content = "SPA OG Title";
    window.history.replaceState({}, "", "/next");

    SocialShareButton.updateCurrentPage();

    expect(button.options.title).toBe("SPA OG Title");
  });

  it("does not let SPA updates overwrite caller-supplied values", () => {
    const button = makeButton({
      title: "Pinned Title",
      description: "Pinned description",
    });
    document.querySelector('meta[property="og:title"]').content = "SPA OG Title";
    window.history.replaceState({}, "", "/next");

    SocialShareButton.updateCurrentPage();

    expect(button.options.title).toBe("Pinned Title");
    expect(button.options.description).toBe("Pinned description");
  });

  it("keeps document.title behavior when autoDetect is disabled", () => {
    const button = makeButton({ autoDetect: false });
    document.title = "New Route Title";
    window.history.replaceState({}, "", "/next");

    SocialShareButton.updateCurrentPage();

    expect(button.options.title).toBe("New Route Title");
  });
});

describe("SocialShareButton.clearContentCache", () => {
  it("is callable on the class", () => {
    expect(typeof SocialShareButton.clearContentCache).toBe("function");
    expect(() => SocialShareButton.clearContentCache()).not.toThrow();
  });

  it("accepts a URL-scoped clear", () => {
    expect(() => SocialShareButton.clearContentCache(window.location.href)).not.toThrow();
  });
});
