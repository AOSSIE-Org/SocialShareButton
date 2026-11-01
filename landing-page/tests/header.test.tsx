// @vitest-environment jsdom
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import fc from "fast-check";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/site/Header";
import { languages } from "@/config/languages";
import { docsUrl, libraryVersion, localeUrl, repoUrl } from "@/config/site";
import { messagesMap } from "@/i18n/messages";
import { platformIds } from "@/lib/platforms";
import { FakeShareButton, PREFERS_DARK, loadShareLibrary, media, message, navigation, type TestLocale } from "./helpers";

function renderIn(ui: ReactNode, locale: TestLocale = "en", withTheme = false) {
  const content = withTheme ? <ThemeProvider>{ui}</ThemeProvider> : ui;
  return render(
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]} timeZone="UTC">
      {content}
    </NextIntlClientProvider>,
  );
}

const desktopNav = (locale: TestLocale = "en") => screen.getAllByRole("navigation", { name: message(locale, "Nav.primary") })[0];

describe("Header navigation", () => {
  it("links the brand and sections to anchors on the home page", () => {
    renderIn(<Header />);
    expect(screen.getByRole("link", { name: message("en", "Nav.home") }).getAttribute("href")).toBe("#get");
    const nav = desktopNav();
    expect(within(nav).getByRole("link", { name: "Get" }).getAttribute("href")).toBe("#get");
    expect(within(nav).getByRole("link", { name: "Use-Cases" }).getAttribute("href")).toBe("#use-cases");
    expect(within(nav).getByRole("link", { name: "FAQs" }).getAttribute("href")).toBe("#faqs");
    expect(within(nav).getByRole("link", { name: "Get" }).getAttribute("aria-current")).toBe("true");
  });

  it.each<[TestLocale, string]>([
    ["en", "/en"],
    ["hi", "/hi"],
  ])("links sections to the localized home page from other pages (%s)", (locale, home) => {
    navigation.pathname = "/privacy";
    renderIn(<Header />, locale);
    const nav = desktopNav(locale);
    const sectionLinks = within(nav)
      .getAllByRole("link")
      .filter((link) => !link.getAttribute("href")?.startsWith("http"));
    expect(sectionLinks.map((link) => link.getAttribute("href"))).toEqual([`${home}#get`, `${home}#use-cases`, `${home}#faqs`]);
    for (const link of sectionLinks) expect(link.hasAttribute("aria-current")).toBe(false);
    expect(screen.getByText(message(locale, "Nav.get"), { selector: "a" })).toBeTruthy();
  });

  it("links the release badge, docs and repository in new tabs", () => {
    renderIn(<Header />);
    const badge = screen.getByRole("link", { name: new RegExp(`v${libraryVersion}`) });
    expect(badge.getAttribute("href")).toBe(`${repoUrl}/releases/tag/v${libraryVersion}`);
    expect(badge.getAttribute("title")).toBe(`Current release v${libraryVersion}`);
    const docs = within(desktopNav()).getByRole("link", { name: /View Docs/ });
    expect(docs.getAttribute("href")).toBe(docsUrl);
    const github = screen.getByRole("link", { name: "GitHub repository (opens in a new tab)" });
    expect(github.getAttribute("href")).toBe(repoUrl);
    for (const link of [badge, docs, github]) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});

describe("Header active section", () => {
  let frames: FrameRequestCallback[];
  const tops: Record<string, number> = {};

  beforeEach(() => {
    frames = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", vi.fn());
    for (const id of ["get", "use-cases", "faqs"]) tops[id] = 2000;
  });

  function renderWithSections() {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      return { top: tops[this.id] ?? 0 } as DOMRect;
    });
    return renderIn(
      <>
        <Header />
        {["get", "use-cases", "faqs"].map((id) => (
          <section key={id} id={id} />
        ))}
      </>,
    );
  }

  const current = () =>
    within(desktopNav())
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "true")
      .map((link) => link.textContent);

  const scroll = () =>
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
      const pending = frames;
      frames = [];
      pending.forEach((cb) => cb(0));
    });

  it("highlights the last section that has reached the top 30% of the viewport", () => {
    renderWithSections();
    expect(current()).toEqual(["Get"]);
    tops["use-cases"] = 100;
    scroll();
    expect(current()).toEqual(["Use-Cases"]);
    tops.faqs = 0;
    scroll();
    expect(current()).toEqual(["FAQs"]);
  });

  it("requests one frame per burst of scroll events and cancels it on unmount", () => {
    const { unmount } = renderWithSections();
    const before = frames.length; // the theme toggle requests its own mount frame
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    expect(frames).toHaveLength(before + 1);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("property: the highlighted item is the last section above the threshold, else Get", () => {
    const threshold = window.innerHeight * 0.3;
    renderWithSections();
    fc.assert(
      fc.property(fc.tuple(fc.integer({ min: -500, max: 1500 }), fc.integer({ min: -500, max: 1500 }), fc.integer({ min: -500, max: 1500 })), ([a, b, c]) => {
        Object.assign(tops, { get: a, "use-cases": b, faqs: c });
        scroll();
        const reached = [
          ["Get", a],
          ["Use-Cases", b],
          ["FAQs", c],
        ].filter(([, top]) => (top as number) <= threshold);
        expect(current()).toEqual([reached.length ? reached[reached.length - 1][0] : "Get"]);
      }),
      { numRuns: 50 },
    );
  });
});

describe("Header share button", () => {
  const shareButtons = () => screen.getAllByRole("button", { name: message("en", "Nav.share") });

  it("is disabled until the library loads, then opens the site share modal", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
    renderIn(<Header />);
    expect((shareButtons()[0] as HTMLButtonElement).disabled).toBe(true);
    loadShareLibrary();
    act(() => vi.advanceTimersByTime(50));
    await waitFor(() => expect((shareButtons()[0] as HTMLButtonElement).disabled).toBe(false));
    await waitFor(() => expect(FakeShareButton.live()).toHaveLength(1));

    const [instance] = FakeShareButton.live();
    expect(instance.options).toMatchObject({
      url: localeUrl("en"),
      title: message("en", "Share.title"),
      description: message("en", "Share.description"),
      platforms: [...platformIds],
      theme: "dark",
      showButton: false,
      via: "aossie_org",
    });
    expect((instance.options.container as HTMLElement).hidden).toBe(true);
    fireEvent.click(shareButtons()[0]);
    expect(instance.openModal).toHaveBeenCalledTimes(1);
  });

  it("shares the Hindi page with a light modal in the light theme", async () => {
    loadShareLibrary();
    localStorage.setItem("theme", "light");
    renderIn(<Header />, "hi", true);
    await waitFor(() => expect(FakeShareButton.live().at(-1)?.options.theme).toBe("light"));
    expect(FakeShareButton.live().at(-1)?.options).toMatchObject({ url: localeUrl("hi"), title: message("hi", "Share.title") });
  });
});

describe("Header mobile menu", () => {
  const toggle = () => screen.getByRole("button", { name: /navigation menu/ });

  it("opens with the same items as the desktop nav and closes again", () => {
    renderIn(<Header />);
    expect(toggle().getAttribute("aria-expanded")).toBe("false");
    expect(toggle().getAttribute("aria-label")).toBe(message("en", "Nav.openMenu"));
    expect(document.getElementById("mobile-menu")).toBeNull();

    fireEvent.click(toggle());
    const menu = document.getElementById("mobile-menu")!;
    expect(toggle().getAttribute("aria-expanded")).toBe("true");
    expect(toggle().getAttribute("aria-controls")).toBe("mobile-menu");
    expect(toggle().getAttribute("aria-label")).toBe(message("en", "Nav.closeMenu"));
    const items = within(menu).getAllByRole("listitem").map((item) => item.textContent);
    expect(items).toEqual(["Get", "Share", "Use-Cases", "View Docs (opens in a new tab)", "FAQs"]);
    expect(within(menu).getByRole("button", { name: /Language/ })).toBeTruthy();

    fireEvent.click(toggle());
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("closes on Escape but not on other keys", () => {
    renderIn(<Header />);
    fireEvent.click(toggle());
    fireEvent.keyDown(document, { key: "Enter" });
    expect(document.getElementById("mobile-menu")).not.toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("closes after following a section link", () => {
    renderIn(<Header />);
    fireEvent.click(toggle());
    const link = within(document.getElementById("mobile-menu")!).getByRole("link", { name: "FAQs" });
    expect(link.getAttribute("href")).toBe("#faqs");
    fireEvent.click(link);
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("closes and opens the share modal from the menu", async () => {
    loadShareLibrary();
    renderIn(<Header />);
    fireEvent.click(toggle());
    const share = within(document.getElementById("mobile-menu")!).getByRole("button", { name: "Share" });
    await waitFor(() => expect((share as HTMLButtonElement).disabled).toBe(false));
    await waitFor(() => expect(FakeShareButton.live()).toHaveLength(1));
    fireEvent.click(share);
    expect(document.getElementById("mobile-menu")).toBeNull();
    expect(FakeShareButton.live()[0].openModal).toHaveBeenCalledTimes(1);
  });
});

describe("LanguageSwitcher", () => {
  const button = () => screen.getByRole("button", { name: /^(Language|भाषा)/ });
  const listbox = () => screen.queryByRole("listbox");

  it("shows the current language and lists every language in its own script", () => {
    renderIn(<LanguageSwitcher />, "hi");
    expect(button().getAttribute("aria-label")).toBe(`${message("hi", "LanguageSwitcher.label")}: हिन्दी`);
    expect(button().getAttribute("aria-haspopup")).toBe("listbox");
    fireEvent.click(button());
    const list = listbox()!;
    expect(button().getAttribute("aria-expanded")).toBe("true");
    expect(button().getAttribute("aria-controls")).toBe(list.id);
    expect(document.activeElement).toBe(list);
    const options = within(list).getAllByRole("option");
    expect(options.map((o) => o.getAttribute("lang"))).toEqual(languages.map((l) => l.code));
    expect(options.map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "true"]);
    expect(options[0].textContent).toBe("EnglishEnglish");
    expect(options[1].textContent).toBe("हिन्दीHindi");
    expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
    expect(list.className).toContain("right-0");
    fireEvent.click(button());
    expect(listbox()).toBeNull();
  });

  it("aligns to the start edge and fills the width when asked", () => {
    const { container } = renderIn(<LanguageSwitcher align="start" fullWidth />);
    expect((container.firstElementChild as HTMLElement).className).toContain("w-full");
    fireEvent.keyDown(button(), { key: "ArrowDown" });
    expect(listbox()!.className).toContain("left-0");
  });

  it("switches locale on the current page with the router", () => {
    navigation.pathname = "/privacy";
    renderIn(<LanguageSwitcher />);
    fireEvent.keyDown(button(), { key: "ArrowUp" });
    fireEvent.keyDown(listbox()!, { key: "ArrowDown" });
    fireEvent.keyDown(listbox()!, { key: "Enter" });
    expect(navigation.router.replace).toHaveBeenCalledWith("/privacy", { locale: "hi" });
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(button());
  });

  it("selects with Space and with a click", () => {
    renderIn(<LanguageSwitcher />);
    fireEvent.click(button());
    fireEvent.keyDown(listbox()!, { key: "End" });
    fireEvent.keyDown(listbox()!, { key: " " });
    expect(navigation.router.replace).toHaveBeenLastCalledWith("/", { locale: "hi" });

    fireEvent.click(button());
    fireEvent.click(screen.getByRole("option", { name: /Hindi/ }));
    expect(navigation.router.replace).toHaveBeenCalledTimes(2);
  });

  it("does nothing when the current language is chosen", () => {
    renderIn(<LanguageSwitcher />);
    fireEvent.click(button());
    fireEvent.click(screen.getByRole("option", { name: /English/ }));
    expect(listbox()).toBeNull();
    expect(navigation.router.replace).not.toHaveBeenCalled();
  });

  it("loads the canonical root page when switching to English on the home page", () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { ...window.location, assign });
    renderIn(<LanguageSwitcher />, "hi");
    fireEvent.click(button());
    fireEvent.keyDown(listbox()!, { key: "Home" });
    fireEvent.keyDown(listbox()!, { key: "Enter" });
    expect(assign).toHaveBeenCalledWith("/");
    expect(navigation.router.replace).not.toHaveBeenCalled();
  });

  it("closes on Escape, Tab and outside clicks, and ignores other keys", () => {
    renderIn(
      <>
        <LanguageSwitcher />
        <p>outside</p>
      </>,
    );
    fireEvent.click(button());
    fireEvent.keyDown(listbox()!, { key: "a" });
    fireEvent.keyDown(button(), { key: "Enter" });
    expect(listbox()).not.toBeNull();
    fireEvent.keyDown(listbox()!, { key: "Escape" });
    expect(listbox()).toBeNull();

    fireEvent.click(button());
    fireEvent.keyDown(listbox()!, { key: "Tab" });
    expect(listbox()).toBeNull();

    fireEvent.click(button());
    fireEvent.pointerDown(screen.getAllByRole("option")[0]);
    expect(listbox()).not.toBeNull();
    fireEvent.pointerDown(screen.getByText("outside"));
    expect(listbox()).toBeNull();
  });

  it("property: arrow, Home and End keys keep the active option within the list", () => {
    renderIn(<LanguageSwitcher />);
    fireEvent.click(button());
    const options = screen.getAllByRole("option");
    fireEvent.pointerEnter(options[1]);
    let model = 1;
    expect(listbox()!.getAttribute("aria-activedescendant")).toBe(options[1].id);
    const last = options.length - 1;
    fc.assert(
      fc.property(fc.array(fc.constantFrom("ArrowDown", "ArrowUp", "Home", "End"), { maxLength: 12 }), (keys) => {
        for (const key of keys) {
          fireEvent.keyDown(listbox()!, { key });
          model = key === "ArrowDown" ? Math.min(last, model + 1) : key === "ArrowUp" ? Math.max(0, model - 1) : key === "Home" ? 0 : last;
        }
        expect(listbox()!.getAttribute("aria-activedescendant")).toBe(options[model].id);
      }),
    );
  });
});

describe("ThemeToggle", () => {
  it("renders a placeholder until mounted, then toggles between light and dark", async () => {
    media.set(PREFERS_DARK, true);
    const { container } = renderIn(<ThemeToggle />, "en", true);
    expect(container.querySelector(".animate-pulse")).not.toBeNull();
    const button = await screen.findByRole("button");
    expect(button.getAttribute("aria-label")).toBe("Toggle theme. Current theme: dark");
    expect(button.getAttribute("title")).toBe("Current theme: dark");
    expect(button.querySelector("svg.text-icon-moon")).not.toBeNull();

    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute("aria-label")).toBe("Toggle theme. Current theme: light"));
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(button.querySelector("svg.text-icon-sun")).not.toBeNull();

    fireEvent.click(button);
    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
  });

  it("follows a light OS preference on the first visit and speaks Hindi", async () => {
    renderIn(<ThemeToggle />, "hi", true);
    const button = await screen.findByRole("button");
    const light = message("hi", "ThemeToggle.light");
    expect(button.getAttribute("title")).toBe(message("hi", "ThemeToggle.current").replace("{theme}", light));
  });

  it("cancels the mount frame when unmounted first", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = renderIn(<ThemeToggle />);
    unmount();
    expect(cancel).toHaveBeenCalled();
  });
});
