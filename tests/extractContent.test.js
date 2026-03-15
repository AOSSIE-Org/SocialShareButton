/**
 * tests/extractContent.test.js
 *
 * Tests for the content auto-detection utility (src/utils/extractContent.js).
 *
 * Uses Node's built-in test runner (`node:test`) — zero additional test
 * framework needed.  JSDOM provides a lightweight browser-like DOM.
 *
 * Run: node --experimental-vm-modules tests/extractContent.test.js
 * Or:  npm test
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { extractContent, clearContentCache } from '../src/utils/extractContent.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a JSDOM Document from an HTML string.
 * @param {string} html
 * @returns {Document}
 */
function makeDoc(html) {
  const dom = new JSDOM(html, { url: 'https://example.com/' });
  return dom.window.document;
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('extractContent — title detection', () => {
  beforeEach(() => clearContentCache());

  test('prefers og:title over document.title', () => {
    const doc = makeDoc(`
      <html>
        <head>
          <title>Page Title | Site Name</title>
          <meta property="og:title" content="OG Title Here" />
        </head>
        <body><p>Some body text to ensure excerpt generation works fine.</p></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.title, 'OG Title Here');
  });

  test('falls back to twitter:title when og:title is absent', () => {
    const doc = makeDoc(`
      <html>
        <head>
          <title>Fallback</title>
          <meta name="twitter:title" content="Twitter Card Title" />
        </head>
        <body><p>Body text here.</p></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.title, 'Twitter Card Title');
  });

  test('falls back to article h1 when meta tags are absent', () => {
    const doc = makeDoc(`
      <html>
        <head><title>Ignored</title></head>
        <body>
          <article>
            <h1>Article Heading</h1>
            <p>Some article content here to ensure we have enough text.</p>
          </article>
        </body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.title, 'Article Heading');
  });

  test('strips site name suffix from document.title as last resort', () => {
    const doc = makeDoc(`
      <html>
        <head><title>My Blog Post | Acme Corp</title></head>
        <body><p>Post body text.</p></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.title, 'My Blog Post');
  });

  test('returns document.title unchanged when there is no pipe/dash separator', () => {
    const doc = makeDoc(`
      <html>
        <head><title>Simple Title</title></head>
        <body><p>Body.</p></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.title, 'Simple Title');
  });
});

describe('extractContent — description/excerpt detection', () => {
  beforeEach(() => clearContentCache());

  test('prefers og:description meta tag', () => {
    const doc = makeDoc(`
      <html>
        <head>
          <meta property="og:description" content="OG description text." />
        </head>
        <body><p>Body text.</p></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.excerpt, 'OG description text.');
  });

  test('falls back to meta[name=description]', () => {
    const doc = makeDoc(`
      <html>
        <head>
          <meta name="description" content="Standard meta description." />
        </head>
        <body><p>Body text.</p></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(result.excerpt, 'Standard meta description.');
  });

  test('generates excerpt from article body when no meta description exists', () => {
    const longText = 'This is a very long article body. '.repeat(10).trim(); // ~340 chars
    const doc = makeDoc(`
      <html>
        <head><title>Article</title></head>
        <body>
          <article>
            <h1>Heading</h1>
            <p>${longText}</p>
          </article>
        </body>
      </html>
    `);
    const result = extractContent(doc);
    // Excerpt must be non-empty and within the allowed length window
    assert.ok(result.excerpt.length > 0, 'excerpt should be non-empty');
    assert.ok(result.excerpt.length <= 210, `excerpt too long: ${result.excerpt.length} chars`);
  });

  test('returns empty excerpt gracefully when body is nearly empty', () => {
    const doc = makeDoc(`
      <html>
        <head><title>Empty</title></head>
        <body></body>
      </html>
    `);
    const result = extractContent(doc);
    assert.equal(typeof result.excerpt, 'string');
  });
});

describe('extractContent — content root detection', () => {
  beforeEach(() => clearContentCache());

  test('prefers <article> over generic <body> content', () => {
    const doc = makeDoc(`
      <html>
        <head><title>Test</title></head>
        <body>
          <nav>Navigation noise nav nav nav</nav>
          <article>
            <p>Relevant article text that should be extracted by the detector.</p>
          </article>
          <footer>Footer noise</footer>
        </body>
      </html>
    `);
    const result = extractContent(doc);
    assert.ok(
      result.textContent.includes('Relevant article text'),
      'textContent should include article body'
    );
    assert.ok(
      !result.textContent.includes('Navigation noise'),
      'textContent should not include nav noise'
    );
  });

  test('strips <script> and <style> from text content', () => {
    const doc = makeDoc(`
      <html>
        <head><title>Test</title></head>
        <body>
          <article>
            <script>var x = 1;</script>
            <style>.foo { color: red; }</style>
            <p>Clean paragraph text here.</p>
          </article>
        </body>
      </html>
    `);
    const result = extractContent(doc);
    assert.ok(!result.textContent.includes('var x'), 'scripts should be stripped');
    assert.ok(!result.textContent.includes('.foo'), 'styles should be stripped');
    assert.ok(result.textContent.includes('Clean paragraph text'), 'body text preserved');
  });
});

describe('extractContent — caching', () => {
  test('returns cached result on second call without bustCache', () => {
    clearContentCache();
    const doc = makeDoc(`
      <html>
        <head>
          <meta property="og:title" content="Cached Title" />
        </head>
        <body><p>Text.</p></body>
      </html>
    `);

    const first = extractContent(doc);
    // Mutate the DOM after first call — cache should serve stale result
    const meta = doc.querySelector('meta[property="og:title"]');
    meta.setAttribute('content', 'New Title After Mutation');

    const second = extractContent(doc);
    assert.equal(second.title, 'Cached Title', 'cache should return stale result');
  });

  test('busts cache when bustCache=true', () => {
    clearContentCache();
    const doc = makeDoc(`
      <html>
        <head>
          <meta property="og:title" content="Original Title" />
        </head>
        <body><p>Text.</p></body>
      </html>
    `);

    extractContent(doc); // prime cache
    doc.querySelector('meta[property="og:title"]').setAttribute('content', 'Updated Title');

    const fresh = extractContent(doc, true); // bustCache=true
    assert.equal(fresh.title, 'Updated Title', 'bust cache should return fresh result');
  });

  test('clearContentCache() forces re-extraction', () => {
    clearContentCache();
    const doc = makeDoc(`
      <html>
        <head>
          <meta property="og:title" content="Before Clear" />
        </head>
        <body><p>Text.</p></body>
      </html>
    `);

    extractContent(doc); // prime cache
    doc.querySelector('meta[property="og:title"]').setAttribute('content', 'After Clear');

    clearContentCache();
    const fresh = extractContent(doc);
    assert.equal(fresh.title, 'After Clear');
  });
});

describe('extractContent — error resilience', () => {
  beforeEach(() => clearContentCache());

  test('returns safe fallback when document is completely empty', () => {
    const doc = makeDoc('<html><head></head><body></body></html>');
    const result = extractContent(doc);
    assert.equal(typeof result.title, 'string');
    assert.equal(typeof result.excerpt, 'string');
    assert.equal(typeof result.textContent, 'string');
  });

  test('never throws even for a document with no head', () => {
    const doc = makeDoc('<html><body><p>Just body.</p></body></html>');
    assert.doesNotThrow(() => extractContent(doc));
  });
});
