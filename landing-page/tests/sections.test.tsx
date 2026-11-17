// @vitest-environment jsdom
import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it, vi } from "vitest";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Installation } from "@/components/sections/Installation";
import { Architecture, Compare, Faq, Metrics, Testimonials, UseCases, faqKeys, useCaseKeys } from "@/components/sections/MoreSections";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { aossieUrl, libraryGzipKb, npmPackage, repoUrl, socialLinks } from "@/config/site";
import { frameworkIds, installGuides, type FrameworkId } from "@/content/install";
import { platformIds, platformLabels } from "@/lib/platforms";
import { locales, message, renderWithIntl, translate, type TestLocale } from "./helpers";

describe.each(locales)("Hero (%s)", (locale) => {
  it("renders the heading, AOSSIE credit, calls to action and install command", () => {
    renderWithIntl(<Hero />, locale);
    const heading = screen.getByRole("heading", { level: 1 });
    const [firstLine] = message(locale, "Home.heading").match(/<line>(.*)<\/line>/)!.slice(1);
    expect(heading.querySelector("span")?.textContent).toBe(firstLine);
    expect(heading.textContent).toBe(message(locale, "Home.heading").replace(/<\/?line>/g, ""));

    const aossie = screen.getByRole("link", { name: new RegExp(`AOSSIE.*${message(locale, "Nav.external").replace(/[()]/g, "\\$&")}`) });
    expect(aossie.getAttribute("href")).toBe(`${aossieUrl}/`);
    expect(aossie.getAttribute("target")).toBe("_blank");

    const star = screen.getByRole("link", { name: new RegExp(message(locale, "Hero.starOnGithub")) });
    expect(star.getAttribute("href")).toBe(repoUrl);
    expect(star.getAttribute("rel")).toBe("noopener noreferrer");

    const demo = screen.getByRole("button", { name: message(locale, "Hero.tryDemo") });
    expect(demo.getAttribute("aria-haspopup")).toBe("dialog");
    expect(screen.getByText(`npm install ${npmPackage}`)).toBeTruthy();
    expect(screen.getByText(message(locale, "Hero.npmTitle"))).toBeTruthy();
  });
});

describe("TrustedBy", () => {
  it("names the organizations for screen readers and loops their logos for everyone else", () => {
    const { container } = renderWithIntl(<TrustedBy />, "hi");
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(message("hi", "TrustedBy.title"));
    expect(screen.getByText("AOSSIE, DJED, Stability Nexus").className).toBe("sr-only");
    const marquee = container.querySelector("ul")!;
    expect(marquee.getAttribute("aria-hidden")).toBe("true");
    // three organizations, repeated three times, rendered twice for a seamless loop
    expect(marquee.querySelectorAll("li")).toHaveLength(18);
    for (const img of Array.from(marquee.querySelectorAll("img"))) expect(img.getAttribute("alt")).toBe("");
  });
});

describe.each(locales)("Features (%s)", (locale) => {
  it("lists the size, every platform, the button styles and analytics adapters", () => {
    renderWithIntl(<Features />, locale);
    expect(screen.getByRole("heading", { level: 2 }).id).toBe("features-heading");
    expect(screen.getByText(translate(locale, "Features.zeroDeps.description", { size: libraryGzipKb }))).toBeTruthy();
    expect(screen.getByText(translate(locale, "Features.zeroDeps.dependencies", { count: 0 }))).toBeTruthy();
    for (const id of platformIds) expect(screen.getByText(platformLabels[id])).toBeTruthy();
    for (const style of ["primary", "default", "compact"]) {
      expect(screen.getByText(message(locale, `Features.themes.styles.${style}`))).toBeTruthy();
    }
    expect(screen.getByText("PostHog")).toBeTruthy();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
  });
});

describe("Installation", () => {
  const picker = () => screen.getByRole("button", { name: new RegExp(message("en", "Install.frameworkLabel")) });
  const listbox = () => screen.queryByRole("listbox");
  const label = (id: FrameworkId, locale: TestLocale = "en") => message(locale, `Install.frameworks.${id}.label`);

  it("starts with a framework picker and an empty state", () => {
    renderWithIntl(<Installation />);
    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(message("en", "Install.eyebrow"));
    expect(picker().textContent).toBe(message("en", "Install.frameworkPlaceholder"));
    expect(screen.getByLabelText("Step 1")).toBeTruthy();
    expect(screen.getByText(message("en", "Install.emptyState"))).toBeTruthy();
    expect(screen.queryByLabelText("Step 2")).toBeNull();
  });

  it("shows the four steps with the chosen framework's snippets and remembers the choice", () => {
    renderWithIntl(<Installation />);
    fireEvent.click(picker());
    const options = within(listbox()!).getAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual(frameworkIds.map((id) => label(id)));
    fireEvent.click(options[frameworkIds.indexOf("next-pages")]);

    const guide = installGuides["next-pages"];
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(picker());
    expect(picker().textContent).toBe(label("next-pages"));
    expect(localStorage.getItem("ssb:framework")).toBe("next-pages");
    expect(screen.queryByText(message("en", "Install.emptyState"))).toBeNull();
    for (const step of [2, 3, 4]) expect(screen.getByLabelText(`Step ${step}`)).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: new RegExp(translate("en", "Install.cdnTitle", { file: guide.loadFile })) })).toBeTruthy();
    // Pages Router documents go in <Head>, not <head>
    expect(screen.getAllByText("<Head>")[0].tagName).toBe("CODE");
    const codes = Array.from(document.querySelectorAll("pre code")).map((c) => c.textContent);
    expect(codes).toEqual([guide.head.code, guide.body.code, guide.container.code, guide.init.code]);
  });

  it("uses <head> and the plain HTML wording for other frameworks, in Hindi too", () => {
    renderWithIntl(<Installation />, "hi");
    fireEvent.click(screen.getByRole("button", { name: new RegExp(message("hi", "Install.frameworkLabel")) }));
    fireEvent.click(screen.getByRole("option", { name: label("html", "hi") }));
    expect(screen.getAllByText("<head>")[0].tagName).toBe("CODE");
    expect(screen.getByText("</body>").tagName).toBe("CODE");
    expect(screen.getByRole("heading", { level: 3, name: new RegExp(message("hi", "Install.containerTitle")) })).toBeTruthy();
  });

  it("restores a saved framework on the next visit", async () => {
    localStorage.setItem("ssb:framework", "vite");
    renderWithIntl(<Installation />);
    await waitFor(() => expect(picker().textContent).toBe(label("vite")));
    expect(screen.getByLabelText("Step 4")).toBeTruthy();
  });

  it("property: restores only saved values that are framework ids", async () => {
    await fc.assert(
      fc.asyncProperty(fc.oneof(fc.constantFrom(...frameworkIds), fc.string({ maxLength: 12 })), async (saved) => {
        localStorage.setItem("ssb:framework", saved);
        const { unmount } = renderWithIntl(<Installation />);
        await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
        const valid = (frameworkIds as readonly string[]).includes(saved);
        expect(picker().textContent).toBe(valid ? label(saved as FrameworkId) : message("en", "Install.frameworkPlaceholder"));
        unmount();
      }),
      { numRuns: 15 },
    );
  }, 30_000);

  it("cancels the restore frame when unmounted immediately", () => {
    localStorage.setItem("ssb:framework", "html");
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = renderWithIntl(<Installation />);
    unmount();
    expect(cancel).toHaveBeenCalled();
  });

  it("works when site storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    renderWithIntl(<Installation />);
    fireEvent.click(picker());
    fireEvent.click(screen.getByRole("option", { name: label("cra") }));
    expect(picker().textContent).toBe(label("cra"));
    expect(screen.getByLabelText("Step 4")).toBeTruthy();
  });

  it("supports the listbox keyboard pattern", () => {
    renderWithIntl(<Installation />);
    fireEvent.keyDown(picker(), { key: "Enter" });
    expect(listbox()).toBeNull();
    fireEvent.keyDown(picker(), { key: "ArrowDown" });
    const list = listbox()!;
    expect(document.activeElement).toBe(list);
    const active = () => list.getAttribute("aria-activedescendant")!;
    expect(active()).toMatch(/-cra$/);
    fireEvent.keyDown(list, { key: "End" });
    expect(active()).toMatch(/-html$/);
    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(active()).toMatch(/-html$/);
    fireEvent.keyDown(list, { key: "ArrowUp" });
    expect(active()).toMatch(/-preact$/);
    fireEvent.keyDown(list, { key: "Home" });
    fireEvent.keyDown(list, { key: "ArrowUp" });
    expect(active()).toMatch(/-cra$/);
    fireEvent.keyDown(list, { key: "x" });
    fireEvent.keyDown(list, { key: " " });
    expect(picker().textContent).toBe(label("cra"));

    // Reopening starts on the selected framework
    fireEvent.keyDown(picker(), { key: "ArrowUp" });
    expect(listbox()!.getAttribute("aria-activedescendant")).toMatch(/-cra$/);
    fireEvent.pointerEnter(screen.getByRole("option", { name: label("vite") }));
    fireEvent.keyDown(listbox()!, { key: "Enter" });
    expect(picker().textContent).toBe(label("vite"));
    fireEvent.click(picker());
    expect(screen.getByRole("option", { name: label("vite") }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("option", { name: label("cra") }).getAttribute("aria-selected")).toBe("false");
  });

  it("closes on Escape, Tab, a second click and outside clicks", () => {
    renderWithIntl(
      <>
        <Installation />
        <p>outside</p>
      </>,
    );
    fireEvent.click(picker());
    fireEvent.keyDown(listbox()!, { key: "Escape" });
    expect(listbox()).toBeNull();
    expect(document.activeElement).toBe(picker());
    fireEvent.click(picker());
    fireEvent.keyDown(listbox()!, { key: "Tab" });
    expect(listbox()).toBeNull();
    fireEvent.click(picker());
    fireEvent.click(picker());
    expect(listbox()).toBeNull();
    fireEvent.click(picker());
    fireEvent.pointerDown(screen.getAllByRole("option")[0]);
    expect(listbox()).not.toBeNull();
    fireEvent.pointerDown(screen.getByText("outside"));
    expect(listbox()).toBeNull();
  });

  it("property: every framework shows its own snippets under the four steps", () => {
    fc.assert(
      fc.property(fc.constantFrom(...frameworkIds), (id) => {
        const { unmount } = renderWithIntl(<Installation />);
        fireEvent.click(picker());
        fireEvent.click(screen.getByRole("option", { name: label(id) }));
        const guide = installGuides[id];
        const codes = Array.from(document.querySelectorAll("pre code")).map((c) => c.textContent);
        expect(codes).toEqual([guide.head.code, guide.body.code, guide.container.code, guide.init.code]);
        expect(screen.getAllByText(guide.container.file).length).toBeGreaterThan(0);
        unmount();
      }),
      { numRuns: 12 },
    );
  });
});

describe.each(locales)("More sections (%s)", (locale) => {
  it("Metrics shows the size, dependencies, platforms and frameworks", () => {
    renderWithIntl(<Metrics />, locale);
    const values = Array.from(document.querySelectorAll("dd")).map((dd) => dd.textContent);
    expect(values).toEqual([String(libraryGzipKb), "0", String(platformIds.length), String(frameworkIds.length)]);
    expect(Array.from(document.querySelectorAll("dt")).map((dt) => dt.textContent)).toEqual(
      ["size", "deps", "platforms", "frameworks"].map((key) => message(locale, `Metrics.${key}`)),
    );
    expect(screen.getByRole("region", { name: message(locale, "Metrics.title") })).toBeTruthy();
  });

  it("Compare is an accessible table with a row per criterion", () => {
    renderWithIntl(<Compare />, locale);
    const table = screen.getByRole("table", { name: message(locale, "Compare.caption") });
    expect(within(table).getAllByRole("columnheader").map((th) => th.textContent)).toEqual(
      ["feature", "us", "them"].map((key) => message(locale, `Compare.${key}`)),
    );
    expect(within(table).getAllByRole("rowheader")).toHaveLength(6);
    expect(within(table).getByText(translate(locale, "Compare.rows.size.us", { size: libraryGzipKb }))).toBeTruthy();
  });

  it("UseCases numbers each use case inside the #use-cases anchor", () => {
    renderWithIntl(<UseCases />, locale);
    const region = screen.getByRole("region", { name: message(locale, "UseCases.title") });
    expect(region.id).toBe("use-cases");
    const items = within(region).getAllByRole("listitem");
    expect(items).toHaveLength(useCaseKeys.length);
    expect(items.map((item) => item.querySelector("span")?.textContent)).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(within(items[0]).getByRole("heading").textContent).toBe(message(locale, "UseCases.items.blogs.title"));
  });

  it("Architecture shows the modules, their files and the event APIs", () => {
    renderWithIntl(<Architecture />, locale);
    for (const key of ["delivery", "core", "wrappers", "analytics"]) {
      expect(screen.getByRole("heading", { level: 3, name: message(locale, `Architecture.${key}.title`) })).toBeTruthy();
    }
    expect(screen.getByText("social-share-button.js")).toBeTruthy();
    expect(screen.getByText("-qwik.tsx")).toBeTruthy();
    expect(screen.getByText(message(locale, "Architecture.events.plugins"))).toBeTruthy();
    expect(document.querySelectorAll("[data-glow]")).toHaveLength(4);
    // The core module is emphasised
    expect(screen.getByRole("heading", { level: 3, name: message(locale, "Architecture.core.title") }).className).toContain("text-accent");
  });

  it("Faq renders an exclusive accordion of every question inside #faqs", () => {
    renderWithIntl(<Faq />, locale);
    expect(screen.getByRole("region", { name: message(locale, "Faq.title") }).id).toBe("faqs");
    const details = Array.from(document.querySelectorAll("details"));
    expect(details).toHaveLength(faqKeys.length);
    for (const [index, key] of faqKeys.entries()) {
      expect(details[index].getAttribute("name")).toBe("faq");
      expect(details[index].querySelector("summary")?.textContent).toBe(message(locale, `Faq.items.${key}.question`));
      expect(details[index].querySelector("p")?.textContent).toBe(message(locale, `Faq.items.${key}.answer`));
    }
  });

  it("Testimonials invites the first real story on Discord", () => {
    renderWithIntl(<Testimonials />, locale);
    expect(screen.getByText(message(locale, "Testimonials.emptyTitle"))).toBeTruthy();
    const cta = screen.getByRole("link", { name: message(locale, "Testimonials.cta") });
    expect(cta.getAttribute("href")).toBe(socialLinks.discord);
    expect(cta.getAttribute("target")).toBe("_blank");
    expect(screen.queryByRole("blockquote")).toBeNull();
  });
});
