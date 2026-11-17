// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import fc from "fast-check";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DemoLauncher } from "@/components/demo/DemoLauncher";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { localeUrl } from "@/config/site";
import { buttonStyles, platformIds, platformLabels, type PlatformId } from "@/lib/platforms";
import { FakeShareButton, lenis, loadShareLibrary, message, renderWithIntl, translate } from "./helpers";

const defaultPlatforms: PlatformId[] = ["whatsapp", "facebook", "twitter", "linkedin", "telegram", "reddit"];

beforeEach(() => {
  lenis.instance = { stop: vi.fn(), start: vi.fn() };
});

function openDemo(locale: "en" | "hi" = "en", withTheme = false) {
  const launcher = <DemoLauncher label="Try it" />;
  renderWithIntl(withTheme ? <ThemeProvider>{launcher}</ThemeProvider> : launcher, locale);
  const button = screen.getByRole("button", { name: "Try it" });
  button.focus();
  fireEvent.click(button);
  return { launcher: button, dialog: screen.getByRole("dialog") };
}

const live = () => {
  const instances = FakeShareButton.live();
  expect(instances.length).toBeLessThanOrEqual(1);
  return instances[0];
};
const pressed = (name: string) => screen.getByRole("button", { name }).getAttribute("aria-pressed");
/** A control group of the configuration panel, by its legend. */
const group = (key: string) => within(screen.getByRole("group", { name: message("en", `Demo.${key}`) }));

describe("DemoLauncher dialog", () => {
  it("opens a labelled modal dialog, locks scrolling and focuses the close button", () => {
    document.documentElement.style.overflow = "auto";
    const { dialog } = openDemo();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByRole("dialog", { name: message("en", "Demo.title") })).toBe(dialog);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: message("en", "Demo.close") }));
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(lenis.instance!.stop).toHaveBeenCalled();
  });

  it("closes from the close button and restores scrolling and focus", () => {
    document.documentElement.style.overflow = "auto";
    const { launcher } = openDemo();
    fireEvent.click(screen.getByRole("button", { name: message("en", "Demo.close") }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.documentElement.style.overflow).toBe("auto");
    expect(lenis.instance!.start).toHaveBeenCalled();
    expect(document.activeElement).toBe(launcher);
  });

  it("closes on Escape and on a backdrop click", () => {
    const { dialog } = openDemo();
    fireEvent.keyDown(dialog, { key: "a" });
    expect(screen.queryByRole("dialog")).not.toBeNull();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Try it" }));
    fireEvent.click(screen.getByRole("dialog").previousElementSibling!);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("leaves Escape to the library's share modal while it is open", () => {
    const { dialog } = openDemo();
    const overlay = document.body.appendChild(document.createElement("div"));
    overlay.className = "social-share-modal-overlay active";
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeNull();
    overlay.remove();
  });

  it("works without smooth scrolling", () => {
    lenis.instance = null;
    openDemo();
    fireEvent.click(screen.getByRole("button", { name: message("en", "Demo.close") }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("traps Tab focus inside the dialog", () => {
    const { dialog } = openDemo();
    const focusable = dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input, [href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    expect(last.tagName).toBe("INPUT");

    last.focus();
    fireEvent.keyDown(last, { key: "Tab" });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
    // In the middle of the dialog the browser moves focus as usual
    focusable[2].focus();
    fireEvent.keyDown(focusable[2], { key: "Tab" });
    fireEvent.keyDown(focusable[2], { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(focusable[2]);
  });

  it("is translated", () => {
    openDemo("hi");
    expect(screen.getByRole("dialog", { name: message("hi", "Demo.title") })).toBeTruthy();
    expect(screen.getByRole("tab", { name: message("hi", "Demo.code") })).toBeTruthy();
    expect(screen.getByText(message("hi", "Demo.loading"))).toBeTruthy();
  });
});

describe("DemoLauncher live preview", () => {
  it("shows a loading note until the library is ready, then mounts the real button", async () => {
    openDemo();
    expect(screen.getByText(message("en", "Demo.loading"))).toBeTruthy();
    loadShareLibrary();
    await waitFor(() => expect(live()).toBeDefined());
    expect(screen.getByText(message("en", "Demo.hint"))).toBeTruthy();
    const panel = screen.getByRole("tabpanel");
    expect(panel.contains(live().options.container as HTMLElement)).toBe(true);
    expect(live().options).toMatchObject({
      url: localeUrl("en"),
      title: message("en", "Demo.shareTitle"),
      description: message("en", "Demo.shareDescription"),
      theme: "dark",
      buttonStyle: "primary",
      platforms: defaultPlatforms,
      buttonText: "Share",
      buttonColor: "",
      buttonHoverColor: "",
    });
  });

  it("starts in the site's light theme and switches the preview theme", async () => {
    localStorage.setItem("theme", "light");
    loadShareLibrary();
    openDemo("en", true);
    await waitFor(() => expect(live()?.options.theme).toBe("light"));
    expect(screen.getByRole("tabpanel").className).toContain("bg-white");
    expect(pressed(message("en", "Demo.light"))).toBe("true");

    fireEvent.click(screen.getByRole("button", { name: message("en", "Demo.dark") }));
    expect(live().options.theme).toBe("dark");
    expect(screen.getByRole("tabpanel").className).toContain("bg-gray-950");
    expect(pressed(message("en", "Demo.dark"))).toBe("true");
  });

  it("applies the button style, color and text", async () => {
    loadShareLibrary();
    openDemo();
    await waitFor(() => expect(live()).toBeDefined());
    for (const style of buttonStyles) expect(group("style").getByRole("button", { name: message("en", `Demo.styles.${style}`) })).toBeTruthy();
    fireEvent.click(group("style").getByRole("button", { name: message("en", "Demo.styles.compact") }));
    expect(live().options.buttonStyle).toBe("compact");

    fireEvent.click(screen.getByRole("button", { name: translate("en", "Demo.colorLabel", { color: "#2563eb" }) }));
    expect(live().options).toMatchObject({ buttonColor: "#2563eb", buttonHoverColor: "#1f54c8" });
    const defaultColor = group("color").getByRole("button", { name: message("en", "Demo.defaultColor") });
    expect(defaultColor.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(defaultColor);
    expect(defaultColor.getAttribute("aria-pressed")).toBe("true");
    expect(live().options).toMatchObject({ buttonColor: "", buttonHoverColor: "" });

    const input = screen.getByLabelText(message("en", "Demo.buttonText")) as HTMLInputElement;
    expect(input.maxLength).toBe(24);
    fireEvent.change(input, { target: { value: "  Teilen " } });
    expect(live().options.buttonText).toBe("Teilen");
    fireEvent.change(input, { target: { value: "   " } });
    expect(live().options.buttonText).toBe("Share");
  });

  it("removes the button when no platform is selected", async () => {
    loadShareLibrary();
    openDemo();
    await waitFor(() => expect(live()).toBeDefined());
    for (const id of defaultPlatforms) fireEvent.click(screen.getByRole("button", { name: platformLabels[id] }));
    expect(live()).toBeUndefined();
    expect(screen.getByText(message("en", "Demo.noPlatforms"))).toBeTruthy();
  });

  it("property: toggled platforms stay unique and in the library's order", async () => {
    loadShareLibrary();
    openDemo();
    await waitFor(() => expect(live()).toBeDefined());
    let model = new Set<PlatformId>(defaultPlatforms);
    fc.assert(
      fc.property(fc.array(fc.constantFrom(...platformIds), { maxLength: 8 }), (toggles) => {
        for (const id of toggles) {
          fireEvent.click(screen.getByRole("button", { name: platformLabels[id] }));
          model = new Set(model.has(id) ? [...model].filter((p) => p !== id) : [...model, id]);
        }
        const expected = platformIds.filter((id) => model.has(id));
        expect(live()?.options.platforms ?? []).toEqual(expected);
        for (const id of platformIds) expect(pressed(platformLabels[id])).toBe(String(model.has(id)));
      }),
      { numRuns: 15 },
    );
  }, 30_000);
});

describe("DemoLauncher code tab", () => {
  const codeText = () => screen.getByRole("tabpanel").querySelector("code")!.textContent;

  it("shows the snippet for the current configuration and pauses the preview", async () => {
    loadShareLibrary();
    openDemo();
    await waitFor(() => expect(live()).toBeDefined());
    const codeTab = screen.getByRole("tab", { name: message("en", "Demo.code") });
    fireEvent.click(codeTab);
    expect(codeTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: message("en", "Demo.preview") }).getAttribute("aria-selected")).toBe("false");
    expect(screen.getByRole("tabpanel").id).toBe("demo-panel-code");
    expect(live()).toBeUndefined();
    expect(screen.getByText("index.js")).toBeTruthy();
    expect(codeText()).toBe(
      [
        "new SocialShareButton({",
        '  container: "#share-button",',
        '  theme: "dark",',
        '  buttonStyle: "primary",',
        `  platforms: ${JSON.stringify(defaultPlatforms)},`,
        "});",
      ].join("\n"),
    );
  });

  it("adds custom text and colors to the snippet only when they differ from the defaults", () => {
    openDemo();
    fireEvent.change(screen.getByLabelText(message("en", "Demo.buttonText")), { target: { value: "Spread it" } });
    fireEvent.click(screen.getByRole("button", { name: translate("en", "Demo.colorLabel", { color: "#030712" }) }));
    fireEvent.click(screen.getByRole("tab", { name: message("en", "Demo.code") }));
    expect(codeText()).toContain('  buttonText: "Spread it",\n  buttonColor: "#030712",\n  buttonHoverColor: "#03060f",');

    fireEvent.click(screen.getByRole("tab", { name: message("en", "Demo.preview") }));
    fireEvent.change(screen.getByLabelText(message("en", "Demo.buttonText")), { target: { value: "Share" } });
    fireEvent.click(screen.getByRole("tab", { name: message("en", "Demo.code") }));
    expect(codeText()).not.toContain("buttonText");
    expect(within(screen.getByRole("dialog")).getAllByRole("tab")).toHaveLength(2);
  });
});
