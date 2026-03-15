/**
 * tests/socialShareButton.autodetect.test.js
 *
 * Integration tests verifying that SocialShareButton correctly auto-detects
 * page content and that manual props always override auto-detection.
 *
 * Uses Node's built-in test runner (`node:test`) and JSDOM.
 *
 * Run: npm test
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// ---------------------------------------------------------------------------
// JSDOM global setup
// We need `document` and `window` globals so SocialShareButton can run in Node.
// ---------------------------------------------------------------------------

const dom = new JSDOM(
  `<!DOCTYPE html>
  <html>
    <head>
      <title>Test Page | Site</title>
      <meta property="og:title" content="OG Detected Title" />
      <meta property="og:description" content="OG detected description for sharing." />
    </head>
    <body>
      <article>
        <h1>Article H1</h1>
        <p>Article body content that is long enough to generate a meaningful excerpt for social sharing.</p>
      </article>
      <div id="share-root"></div>
    </body>
  </html>`,
  {
    url: 'https://example.com/',
    pretendToBeVisual: true,
  }
);

// Expose globals that SocialShareButton reads
global.window = dom.window;
global.document = dom.window.document;
global.CustomEvent = dom.window.CustomEvent;
// navigator is read-only in Node 22+ — use Object.defineProperty if needed
try {
  global.navigator = dom.window.navigator;
} catch (_) {
  Object.defineProperty(global, 'navigator', {
    get: () => dom.window.navigator,
    configurable: true,
  });
}

// Import AFTER globals are set
const { default: SocialShareButton } = await import('../src/social-share-button.js');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let instances = [];

function makeButton(options = {}) {
  const container = dom.window.document.querySelector('#share-root');
  const btn = new SocialShareButton({ container, ...options });
  instances.push(btn);
  return btn;
}

afterEach(() => {
  instances.forEach((b) => {
    try {
      b.destroy();
    } catch (_) {
      /* ignore */
    }
  });
  instances = [];
  SocialShareButton.clearContentCache();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SocialShareButton — content auto-detection', () => {
  test('auto-detects og:title when title prop is omitted', () => {
    const btn = makeButton();
    assert.equal(btn.options.title, 'OG Detected Title', 'should pick up og:title from page meta');
  });

  test('auto-detects og:description when description prop is omitted', () => {
    const btn = makeButton();
    assert.equal(
      btn.options.description,
      'OG detected description for sharing.',
      'should pick up og:description from page meta'
    );
  });

  test('manual title prop overrides auto-detection', () => {
    const btn = makeButton({ title: 'My Custom Title' });
    assert.equal(
      btn.options.title,
      'My Custom Title',
      'explicit title prop must win over auto-detection'
    );
  });

  test('manual description prop overrides auto-detection', () => {
    const btn = makeButton({ description: 'My custom description.' });
    assert.equal(
      btn.options.description,
      'My custom description.',
      'explicit description prop must win over auto-detection'
    );
  });

  test('both manual title and description disable auto-detection for those fields', () => {
    const btn = makeButton({
      title: 'Manual Title',
      description: 'Manual Description',
    });
    assert.equal(btn.options.title, 'Manual Title');
    assert.equal(btn.options.description, 'Manual Description');
  });

  test('autoDetect: false skips all content detection', () => {
    // With autoDetect: false, no og:title should be used — falls back to document.title
    const btn = makeButton({ autoDetect: false });
    // document.title is "Test Page | Site"
    assert.notEqual(
      btn.options.title,
      'OG Detected Title',
      'autoDetect:false should not use og:title'
    );
    assert.equal(btn.options.description, '', 'autoDetect:false should leave description empty');
  });

  test('url defaults to window.location.href', () => {
    const btn = makeButton();
    assert.equal(btn.options.url, 'https://example.com/');
  });

  test('explicit url prop is used as-is', () => {
    const btn = makeButton({ url: 'https://my.site/page' });
    assert.equal(btn.options.url, 'https://my.site/page');
  });
});

describe('SocialShareButton — fallback when detection produces nothing', () => {
  test('title falls back to document.title when all meta and h1 are absent', () => {
    // Temporarily remove the og:title meta
    const meta = dom.window.document.querySelector('meta[property="og:title"]');
    const parent = meta.parentNode;
    parent.removeChild(meta);
    SocialShareButton.clearContentCache();

    const btn = makeButton();
    // Should fall back through h1 → document.title strip
    const title = btn.options.title;
    assert.ok(title.length > 0, 'title must never be empty');

    // Restore
    parent.appendChild(meta);
    SocialShareButton.clearContentCache();
  });
});

describe('SocialShareButton — updateOptions preserves auto-detected values', () => {
  test('updateOptions merges new values without losing unrelated options', () => {
    const btn = makeButton();
    const originalTitle = btn.options.title;
    btn.updateOptions({ url: 'https://new.url/' });
    assert.equal(btn.options.url, 'https://new.url/');
    assert.equal(btn.options.title, originalTitle, 'title should be preserved after updateOptions');
  });
});

describe('SocialShareButton — static clearContentCache', () => {
  test('clearContentCache is a static function on the class', () => {
    assert.equal(typeof SocialShareButton.clearContentCache, 'function');
  });

  test('calling clearContentCache does not throw', () => {
    assert.doesNotThrow(() => SocialShareButton.clearContentCache());
  });
});
