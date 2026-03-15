/**
 * extractContent.js
 *
 * Lightweight, zero-dependency content auto-detection utility for SocialShareButton.
 *
 * Strategy (in priority order):
 *   1. Open Graph / Twitter Card meta tags  — most explicit signal, set by page authors.
 *   2. Standard <meta name="description">   — universal fallback for description.
 *   3. Semantic HTML landmarks              — <article>, <main>, [role="main"].
 *   4. Common CMS class names              — .post-title, .entry-content, etc.
 *   5. First meaningful <h1>               — broad fallback for title.
 *   6. document.title                      — last-resort title fallback.
 *
 * This mirrors the selective detection approach described in issue #26 and covers
 * the same signals that Mozilla Readability uses internally, without adding any
 * external dependency (preserving the project's zero-dependency promise).
 *
 * Cache: results are cached per-document for 30 seconds so repeated calls within
 * the same page lifecycle are O(1) after the first extraction.
 *
 * @module extractContent
 */

/** @type {{ result: ContentResult, ts: number } | null} */
let _cache = null;

/** Cache TTL in milliseconds (30 s). */
const CACHE_TTL_MS = 30_000;

/**
 * @typedef {Object} ContentResult
 * @property {string} title       - Detected page title (never empty).
 * @property {string} excerpt     - 150-200 char excerpt of main content (may be "").
 * @property {string} textContent - Full plain-text of the main content block.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Returns the content attribute of the first matching <meta> selector,
 * or "" if not found.
 *
 * @param {Document} doc
 * @param {string}   selector  - CSS selector for the <meta> element.
 * @returns {string}
 */
function getMetaContent(doc, selector) {
  const el = doc.querySelector(selector);
  return el && el.getAttribute('content') ? el.getAttribute('content').trim() : '';
}

/**
 * Detects the page title using the following priority chain:
 *   og:title → twitter:title → first <h1> in a landmark/article → document.title
 *
 * @param {Document} doc
 * @returns {string}
 */
function detectTitle(doc) {
  // 1. Open Graph title
  const ogTitle = getMetaContent(doc, 'meta[property="og:title"]');
  if (ogTitle) return ogTitle;

  // 2. Twitter Card title
  const twitterTitle =
    getMetaContent(doc, 'meta[name="twitter:title"]') ||
    getMetaContent(doc, 'meta[property="twitter:title"]');
  if (twitterTitle) return twitterTitle;

  // 3. Semantic landmark h1 — prefer scoped headings over generic ones
  const landmarkSelectors = [
    'article h1',
    '[role="main"] h1',
    'main h1',
    '.post-title',
    '.entry-title',
    '.article-title',
    '.page-title',
    '.hero-title',
    'h1',
  ];

  for (const sel of landmarkSelectors) {
    const el = doc.querySelector(sel);
    if (el) {
      const text = el.textContent.trim();
      if (text) return text;
    }
  }

  // 4. Last resort: document.title (strip common " | Site" suffixes)
  const raw = (doc.title || '').trim();
  // Remove trailing " | SiteName" or " - SiteName" patterns (up to 60 chars suffix)
  const cleaned = raw.replace(/\s*[|\-–—]\s*.{1,60}$/, '').trim();
  return cleaned || raw;
}

/**
 * Detects the page description using:
 *   og:description → twitter:description → meta[name="description"]
 *
 * Returns "" if nothing found (caller may then fall back to body excerpt).
 *
 * @param {Document} doc
 * @returns {string}
 */
function detectMetaDescription(doc) {
  return (
    getMetaContent(doc, 'meta[property="og:description"]') ||
    getMetaContent(doc, 'meta[name="twitter:description"]') ||
    getMetaContent(doc, 'meta[property="twitter:description"]') ||
    getMetaContent(doc, 'meta[name="description"]')
  );
}

/**
 * Finds the most content-rich DOM node to use as the article body.
 * Tries semantic landmarks first, then common CMS class names, then <body>.
 *
 * @param {Document} doc
 * @returns {Element}
 */
function findContentRoot(doc) {
  const candidates = [
    'article',
    '[role="main"]',
    'main',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.article-body',
    '.blog-content',
    '.page-content',
    '.content-body',
    '#content',
    '#main-content',
  ];

  for (const sel of candidates) {
    const el = doc.querySelector(sel);
    if (el && el.textContent.trim().length > 50) {
      return el;
    }
  }

  return doc.body || doc.documentElement;
}

/**
 * Converts a DOM element's inner content to clean plain text by:
 *   - Removing script, style, nav, header, footer, aside, and form elements.
 *   - Collapsing multiple whitespace/newline sequences to single spaces.
 *
 * A cloned subtree is used so the live DOM is never mutated.
 *
 * @param {Element} root
 * @returns {string}
 */
function extractPlainText(root) {
  const clone = root.cloneNode(true);

  // Remove noise elements that carry no article content
  const noise = clone.querySelectorAll(
    'script, style, noscript, nav, header, footer, aside, form, ' +
      "[aria-hidden='true'], .nav, .navigation, .menu, .sidebar, " +
      '.advertisement, .ad, .cookie-banner, .social-share-modal-overlay'
  );
  noise.forEach((el) => el.remove());

  return clone.textContent.replace(/\s+/g, ' ').trim();
}

/**
 * Trims plain text to a natural sentence boundary within [minLen, maxLen].
 * If no sentence boundary exists, cuts at the nearest word boundary.
 *
 * @param {string} text
 * @param {number} [minLen=140]
 * @param {number} [maxLen=200]
 * @returns {string}
 */
function generateExcerpt(text, minLen = 140, maxLen = 200) {
  if (!text) return '';
  if (text.length <= maxLen) return text;

  // Try to end at a sentence boundary within the window
  const window = text.slice(0, maxLen);
  const sentenceEnd = Math.max(
    window.lastIndexOf('. '),
    window.lastIndexOf('! '),
    window.lastIndexOf('? ')
  );

  if (sentenceEnd >= minLen) {
    return window.slice(0, sentenceEnd + 1).trim();
  }

  // Fall back to word boundary
  const wordEnd = window.lastIndexOf(' ');
  if (wordEnd > minLen) {
    return window.slice(0, wordEnd).trim() + '…';
  }

  return window.trim() + '…';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Extracts sharing-relevant content from the given Document.
 *
 * Results are cached for CACHE_TTL_MS milliseconds. Pass `bustCache = true`
 * to force a fresh extraction (useful after dynamic content updates).
 *
 * @param {Document} doc         - The document to analyse (typically `document`).
 * @param {boolean}  [bustCache] - Force re-extraction ignoring the cache.
 * @returns {ContentResult}
 */
function extractContent(doc, bustCache = false) {
  // Serve from cache if still fresh
  if (!bustCache && _cache && Date.now() - _cache.ts < CACHE_TTL_MS) {
    return _cache.result;
  }

  /** @type {ContentResult} */
  let result;

  try {
    const title = detectTitle(doc);

    // Description: prefer explicit meta tags; generate excerpt from body as fallback
    let excerpt = detectMetaDescription(doc);
    let textContent = '';

    if (!excerpt) {
      const contentRoot = findContentRoot(doc);
      textContent = extractPlainText(contentRoot);
      excerpt = generateExcerpt(textContent);
    } else {
      // textContent is the full body text when we have a meta description
      try {
        const contentRoot = findContentRoot(doc);
        textContent = extractPlainText(contentRoot);
      } catch (_) {
        textContent = excerpt;
      }
    }

    result = { title, excerpt, textContent };
  } catch (_err) {
    // Hard fallback: never throw to callers
    result = {
      title: typeof doc !== 'undefined' && doc.title ? doc.title.trim() : '',
      excerpt: '',
      textContent: '',
    };
  }

  _cache = { result, ts: Date.now() };
  return result;
}

/**
 * Clears the internal extraction cache.
 * Call this when the page content changes dynamically (e.g. SPA navigation).
 */
function clearContentCache() {
  _cache = null;
}

export { extractContent, clearContentCache };
