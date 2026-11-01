// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import fc from "fast-check";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeBlock, copyText } from "@/components/ui/CodeBlock";
import { GlowGroup } from "@/components/ui/GlowGroup";
import * as Icons from "@/components/ui/Icons";
import { InfoTip } from "@/components/ui/InfoTip";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { Eyebrow, Section, SectionHeading, sectionPadding } from "@/components/ui/Section";
import { richCode } from "@/components/ui/rich";
import { FINE_POINTER, media, message, renderWithIntl } from "./helpers";

let writeText: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
  Reflect.deleteProperty(document, "execCommand");
});

/** Lets the awaited clipboard promise settle inside React's act(). */
const settle = () => act(async () => {});

describe("Section primitives", () => {
  it("renders an eyebrow as a paragraph or heading with its tone and fit size", () => {
    render(
      <>
        <Eyebrow>Plain</Eyebrow>
        <Eyebrow as="h2" id="eyebrow-heading" tone="highlight" fit>
          Heading
        </Eyebrow>
      </>,
    );
    const plain = screen.getByText("Plain");
    expect(plain.tagName).toBe("P");
    expect(plain.className).toContain("text-accent");
    expect(plain.className).toContain("text-xs sm:text-sm");
    const heading = screen.getByRole("heading", { level: 2, name: "Heading" });
    expect(heading.id).toBe("eyebrow-heading");
    expect(heading.className).toContain("text-highlight");
    expect(heading.className).toContain("100cqi/32");
  });

  it("labels a section by its heading", () => {
    render(
      <Section id="faqs" labelledBy="faq-title" className="extra">
        <SectionHeading id="faq-title">Questions</SectionHeading>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Questions" });
    expect(region.id).toBe("faqs");
    expect(region.className).toContain("extra");
    expect(sectionPadding).toMatch(/^px-/);
  });

  it("renders the rich-text code tag as <code>", () => {
    render(<p>{richCode.code("npm i")}</p>);
    expect(screen.getByText("npm i").tagName).toBe("CODE");
  });
});

describe("Icons", () => {
  it.each(Object.entries(Icons))("%s is a decorative SVG that forwards props", (_name, Icon) => {
    const { container } = render(<Icon className="size-4" data-testid="icon" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("class")).toBe("size-4");
    expect(svg.childElementCount).toBeGreaterThan(0);
  });
});

describe("copyText", () => {
  it("uses the async clipboard API when available", async () => {
    await expect(copyText("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to a hidden textarea and execCommand", async () => {
    writeText.mockRejectedValue(new Error("insecure context"));
    let copied = "";
    document.execCommand = vi.fn(() => {
      const textarea = document.querySelector("textarea")!;
      expect(textarea.hasAttribute("readonly")).toBe(true);
      copied = textarea.value;
      return true;
    });
    await expect(copyText("fallback")).resolves.toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(copied).toBe("fallback");
    expect(document.querySelector("textarea")).toBeNull();
  });

  it("reports failure when the fallback cannot copy either", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    document.execCommand = vi.fn(() => false);
    await expect(copyText("x")).resolves.toBe(false);
  });
});

describe("CodeBlock", () => {
  const shortCode = "const a = 1;";

  it("shows the file name and highlighted code", () => {
    const { container } = renderWithIntl(<CodeBlock file="index.js" code={shortCode} />);
    expect(screen.getByText("index.js")).toBeTruthy();
    expect(container.querySelector("pre code")?.textContent).toBe(shortCode);
    // sugar-high wraps tokens in spans
    expect(container.querySelector("pre code span")).not.toBeNull();
    expect(screen.queryByRole("button", { name: message("en", "Install.expand") })).toBeNull();
  });

  it("copies the code and confirms for two seconds", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    renderWithIntl(<CodeBlock file="index.js" code={shortCode} />);
    fireEvent.click(screen.getByRole("button", { name: message("en", "Install.copy") }));
    await settle();
    expect(writeText).toHaveBeenCalledWith(shortCode);
    expect(screen.getByRole("button", { name: message("en", "Install.copied") })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe(message("en", "Install.copied"));

    // A second copy restarts the timer
    act(() => vi.advanceTimersByTime(1500));
    fireEvent.click(screen.getByRole("button", { name: message("en", "Install.copied") }));
    await settle();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole("status").textContent).toBe(message("en", "Install.copied"));
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByRole("button", { name: message("en", "Install.copy") })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("");
  });

  it("stays unconfirmed when copying fails", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    document.execCommand = vi.fn(() => false);
    renderWithIntl(<CodeBlock file="a.js" code={shortCode} />);
    fireEvent.click(screen.getByRole("button", { name: message("en", "Install.copy") }));
    await settle();
    expect(screen.queryByRole("button", { name: message("en", "Install.copied") })).toBeNull();
  });

  it("clears a pending confirmation timer on unmount", async () => {
    const clear = vi.spyOn(window, "clearTimeout");
    const { unmount } = renderWithIntl(<CodeBlock file="a.js" code={shortCode} />);
    fireEvent.click(screen.getByRole("button", { name: message("en", "Install.copy") }));
    await settle();
    clear.mockClear();
    unmount();
    expect(clear).toHaveBeenCalledTimes(1);
  });

  it("collapses long snippets behind an expand toggle", () => {
    const code = Array.from({ length: 20 }, (_, i) => `line${i}();`).join("\n");
    const { container } = renderWithIntl(<CodeBlock file="long.js" code={code} grow />, "hi");
    const pre = container.querySelector("pre")!;
    const toggle = screen.getByRole("button", { name: message("hi", "Install.expand") });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBe(pre.id);
    expect(pre.className).toContain("max-h-64");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(toggle.textContent).toBe(message("hi", "Install.collapse"));
    expect(pre.className).not.toContain("max-h-64");
    // grow adds a spacer that fills the column on lg
    expect(container.querySelector('[aria-hidden="true"].lg\\:flex-1')).not.toBeNull();
  });

  it("property: collapses exactly when the snippet has more than 14 lines", () => {
    fc.assert(
      fc.property(fc.array(fc.stringMatching(/^[a-z0-9 =;()]{0,20}$/), { minLength: 1, maxLength: 30 }), (lines) => {
        const { unmount } = renderWithIntl(<CodeBlock file="f.js" code={lines.join("\n")} />);
        const toggle = screen.queryByRole("button", { name: message("en", "Install.expand") });
        expect(toggle !== null).toBe(lines.length > 14);
        unmount();
      }),
      { numRuns: 40 },
    );
  });
});

describe("InstallCommand", () => {
  it("shows the command and copies it", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    renderWithIntl(<InstallCommand command="npm install x" />, "hi");
    expect(screen.getByText("npm install x")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: message("hi", "Install.copyCommand") }));
    await settle();
    expect(writeText).toHaveBeenCalledWith("npm install x");
    expect(screen.getByRole("status").textContent).toBe(message("hi", "Install.copied"));
    fireEvent.click(screen.getByRole("button", { name: message("hi", "Install.copied") }));
    await settle();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole("button", { name: message("hi", "Install.copyCommand") })).toBeTruthy();
  });

  it("does nothing when copying fails, and clears its timer on unmount", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    document.execCommand = vi.fn(() => false);
    const clear = vi.spyOn(window, "clearTimeout");
    const { unmount } = renderWithIntl(<InstallCommand command="npm i" />);
    const button = screen.getByRole("button", { name: message("en", "Install.copyCommand") });
    fireEvent.click(button);
    await settle();
    expect(screen.getByRole("status").textContent).toBe("");
    fireEvent.click(button);
    await settle();
    expect(screen.getByRole("status").textContent).toBe(message("en", "Install.copied"));
    clear.mockClear();
    unmount();
    expect(clear).toHaveBeenCalledTimes(1);
  });
});

describe("InfoTip", () => {
  const tip = () => screen.queryByRole("tooltip");

  it("opens on hover and closes when the pointer leaves", () => {
    renderWithIntl(<InfoTip>Explanation</InfoTip>);
    const button = screen.getByRole("button", { name: message("en", "Install.moreInfo") });
    expect(tip()).toBeNull();
    fireEvent.mouseEnter(button.parentElement!);
    expect(tip()?.textContent).toBe("Explanation");
    expect(button.getAttribute("aria-describedby")).toBe(tip()?.id);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    fireEvent.mouseLeave(button.parentElement!);
    expect(tip()).toBeNull();
  });

  it("opens on focus and closes on blur", () => {
    renderWithIntl(<InfoTip label="What is a CDN?">A CDN serves files</InfoTip>);
    const button = screen.getByRole("button", { name: "What is a CDN?" });
    fireEvent.focus(button);
    expect(tip()).not.toBeNull();
    fireEvent.blur(button);
    expect(tip()).toBeNull();
  });

  it("stays open when pinned by a click, until clicked again", () => {
    renderWithIntl(<InfoTip>Pinned</InfoTip>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.mouseLeave(button.parentElement!);
    fireEvent.blur(button);
    expect(tip()).not.toBeNull();
    fireEvent.click(button);
    expect(tip()).toBeNull();
  });

  it("closes on Escape and on a click outside", () => {
    renderWithIntl(
      <>
        <InfoTip>Tip</InfoTip>
        <p>outside</p>
      </>,
    );
    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(tip()).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(tip()).toBeNull();

    fireEvent.click(button);
    fireEvent.pointerDown(tip()!);
    expect(tip()).not.toBeNull();
    fireEvent.pointerDown(screen.getByText("outside"));
    expect(tip()).toBeNull();
  });
});

describe("GlowGroup", () => {
  let frames: FrameRequestCallback[];

  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
  });

  const renderGroup = () =>
    render(
      <GlowGroup className="grid">
        <div data-glow data-testid="card" />
      </GlowGroup>,
    );

  // jsdom has no PointerEvent, so fireEvent.pointerMove would drop clientX/clientY; a MouseEvent keeps them
  const pointerMove = (target: Element, clientX: number, clientY: number) =>
    fireEvent(target, new MouseEvent("pointermove", { bubbles: true, clientX, clientY }));

  it("positions the glow relative to the group and each card on fine pointers", () => {
    media.set(FINE_POINTER, true);
    const { container } = renderGroup();
    const group = container.firstElementChild as HTMLElement;
    const card = screen.getByTestId("card");
    expect(group.className).toBe("glow-group grid");
    vi.spyOn(group, "getBoundingClientRect").mockReturnValue({ left: 10, top: 20 } as DOMRect);
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue({ left: 50, top: 70 } as DOMRect);

    pointerMove(group, 100, 200);
    pointerMove(group, 110, 210);
    expect(frames).toHaveLength(1); // batched per frame
    frames[0](0);
    expect(group.style.getPropertyValue("--glow-x")).toBe("100px");
    expect(group.style.getPropertyValue("--glow-y")).toBe("190px");
    expect(card.style.getPropertyValue("--glow-x")).toBe("60px");
    expect(card.style.getPropertyValue("--glow-y")).toBe("140px");
  });

  it("stops listening on unmount", () => {
    media.set(FINE_POINTER, true);
    const { container, unmount } = renderGroup();
    const group = container.firstElementChild as HTMLElement;
    unmount();
    pointerMove(group, 1, 1);
    expect(frames).toHaveLength(0);
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("does nothing on touch devices", () => {
    const { container } = renderGroup();
    pointerMove(container.firstElementChild!, 1, 1);
    expect(frames).toHaveLength(0);
  });
});
