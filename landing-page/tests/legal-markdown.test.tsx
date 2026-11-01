import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  LegalDocument,
  parseLegalMarkdown,
  renderLegalInline,
  resolveLegalHref,
} from "@/lib/legal-markdown";

const links = { privacy: "/en/privacy", terms: "/en/terms" };
const SAFE_HREF = /^(https?:|mailto:|\/|#)/i;

const render = (source: string) => renderToStaticMarkup(<LegalDocument links={links} source={source} />);
const hrefsIn = (html: string) => [...html.matchAll(/href="([^"]*)"/g)].map((match) => match[1]);

describe("parseLegalMarkdown", () => {
  it("splits headings, paragraphs and lists", () => {
    const blocks = parseLegalMarkdown("# Title\n\nOne\ntwo\n\n## Part\n\n* a\n* b\n  continued\n\nEnd");
    expect(blocks).toEqual([
      { type: "heading", level: 1, text: "Title" },
      { type: "paragraph", text: "One two" },
      { type: "heading", level: 2, text: "Part" },
      { type: "list", items: ["a", "b continued"] },
      { type: "paragraph", text: "End" },
    ]);
  });

  it("handles Windows line endings", () => {
    expect(parseLegalMarkdown("## A\r\n\r\ntext\r\n")).toEqual([
      { type: "heading", level: 2, text: "A" },
      { type: "paragraph", text: "text" },
    ]);
  });

  it("supports level-3 headings and treats deeper ones as text", () => {
    expect(parseLegalMarkdown("### Third\n#### Fourth")).toEqual([
      { type: "heading", level: 3, text: "Third" },
      { type: "paragraph", text: "#### Fourth" },
    ]);
  });

  it("ends a paragraph when a list starts without a blank line, and accepts '-' items", () => {
    expect(parseLegalMarkdown("Intro\n- one\n- two\n### Next")).toEqual([
      { type: "paragraph", text: "Intro" },
      { type: "list", items: ["one", "two"] },
      { type: "heading", level: 3, text: "Next" },
    ]);
  });

  it("returns no blocks for blank input", () => {
    expect(parseLegalMarkdown("")).toEqual([]);
    expect(parseLegalMarkdown(" \n\t\n\r\n")).toEqual([]);
  });

  it("never throws and never keeps line breaks or blank text in blocks (property)", () => {
    const line = fc.oneof(
      fc.string(),
      fc.constantFrom("", "# H", "## H", "### H", "* item", "- item", "  indented", "**b** `c` [l](u)"),
    );
    fc.assert(
      fc.property(fc.array(line, { maxLength: 20 }), (lines) => {
        const blocks = parseLegalMarkdown(lines.join("\n"));
        const texts = blocks.flatMap((block) => (block.type === "list" ? block.items : [block.text]));
        for (const text of texts) {
          expect(text).not.toMatch(/[\r\n]/);
          expect(text.trim()).not.toBe("");
        }
        for (const block of blocks) if (block.type === "list") expect(block.items.length).toBeGreaterThan(0);
      }),
    );
  });

  it("parses LF, CRLF and CR line endings identically (property)", () => {
    fc.assert(
      fc.property(fc.array(fc.string({ unit: "grapheme-ascii" }).filter((s) => !/[\r\n]/.test(s))), (lines) => {
        const lf = parseLegalMarkdown(lines.join("\n"));
        expect(parseLegalMarkdown(lines.join("\r\n"))).toEqual(lf);
        expect(parseLegalMarkdown(lines.join("\r"))).toEqual(lf);
      }),
    );
  });
});

describe("resolveLegalHref", () => {
  it("maps the legal files to site pages", () => {
    expect(resolveLegalHref("PRIVACY.md", links)).toBe("/en/privacy");
    expect(resolveLegalHref("./TERMS.md", links)).toBe("/en/terms");
  });

  it("keeps http(s) and mailto links and drops unsafe ones", () => {
    expect(resolveLegalHref("https://example.org", links)).toBe("https://example.org");
    expect(resolveLegalHref("mailto:contact@aossie.org", links)).toBe("mailto:contact@aossie.org");
    expect(resolveLegalHref("javascript:alert(1)", links)).toBeNull();
    expect(resolveLegalHref("other.md", links)).toBeNull();
  });

  it("drops protocol-relative links to other hosts", () => {
    expect(resolveLegalHref("//example.org", links)).toBeNull();
    expect(resolveLegalHref("/\\example.org", links)).toBeNull();
  });

  it("keeps site-relative paths and in-page anchors", () => {
    expect(resolveLegalHref("/support", links)).toBe("/support");
    expect(resolveLegalHref("#contact", links)).toBe("#contact");
  });

  it("only ever returns a safe href or null (property)", () => {
    const href = fc.oneof(
      fc.string(),
      fc.webUrl(),
      fc.tuple(fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9+.-]{0,9}$/), fc.string()).map(([scheme, rest]) => `${scheme}:${rest}`),
    );
    fc.assert(
      fc.property(href, (value) => {
        const result = resolveLegalHref(value, links);
        if (result !== null) expect(result).toMatch(SAFE_HREF);
        if (result !== null && result !== links.privacy && result !== links.terms) expect(result).toBe(value);
      }),
    );
  });
});

describe("renderLegalInline", () => {
  it("returns plain text unchanged", () => {
    expect(renderLegalInline("No formatting here.", links)).toEqual(["No formatting here."]);
  });

  it("renders links nested in bold and keeps the text around them", () => {
    const html = renderToStaticMarkup(<p>{renderLegalInline("See **the [policy](PRIVACY.md)** now.", links)}</p>);
    expect(html).toBe('<p>See <strong>the <a href="/en/privacy">policy</a></strong> now.</p>');
  });

  it("opens only external links in a new tab", () => {
    const html = renderToStaticMarkup(
      <p>{renderLegalInline("[mail](mailto:a@b.org) [anchor](#x) [web](http://example.org)", links)}</p>,
    );
    expect(html).toContain('<a href="mailto:a@b.org">mail</a>');
    expect(html).toContain('<a href="#x">anchor</a>');
    expect(html).toContain('<a href="http://example.org" target="_blank" rel="noopener noreferrer">web</a>');
  });
});

describe("LegalDocument", () => {
  it("renders inline formatting, safe links and English language markup", () => {
    const html = renderToStaticMarkup(
      <LegalDocument
        links={links}
        source={"# Privacy\n\n**Bold** `theme` [Terms](TERMS.md) [GitHub](https://github.com) [x](javascript:alert(1))"}
      />,
    );
    expect(html).toContain('<div lang="en">');
    expect(html).toContain("<h1>Privacy</h1>");
    expect(html).toContain("<strong>Bold</strong>");
    expect(html).toContain("<code>theme</code>");
    expect(html).toContain('<a href="/en/terms">Terms</a>');
    expect(html).toContain('<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>');
    expect(html).not.toContain("javascript:");
  });

  it("renders lists and passes the class name through", () => {
    const html = renderToStaticMarkup(
      <LegalDocument links={links} className="prose" source={"### Data\n\n* one\n* `two`"} />,
    );
    expect(html).toBe('<div lang="en" class="prose"><h3>Data</h3><ul><li>one</li><li><code>two</code></li></ul></div>');
  });

  it("escapes raw HTML in the source", () => {
    const html = render('<script>alert(1)</script> <img src=x onerror="alert(1)">');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;script&gt;");
  });

  it("never emits an unsafe href, whatever the link target (property)", () => {
    const target = fc.oneof(
      fc.constantFrom("javascript:alert(1)", "JaVaScRiPt:x", "data:text/html,x", "vbscript:x", "file:///etc/passwd"),
      fc.stringMatching(/^[^\s()\]"]{1,30}$/),
    );
    const linkText = fc.tuple(fc.stringMatching(/^[a-z ]{1,10}$/), target).map(([label, href]) => `[${label}](${href})`);
    fc.assert(
      fc.property(fc.array(fc.oneof(linkText, fc.string()), { maxLength: 8 }), (parts) => {
        for (const href of hrefsIn(render(parts.join(" ")))) expect(href).toMatch(SAFE_HREF);
      }),
    );
  });
});
