/**
 * Shared test helpers: rendering inside the real message catalogs, resolving async Server
 * Components, and controllable stand-ins for what jsdom cannot provide (see tests/setup.tsx).
 */
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider, createTranslator } from "next-intl";
import { vi } from "vitest";
import { messagesMap } from "@/i18n/messages";
import type { SocialShareButtonInstance, SocialShareButtonOptions } from "@/lib/social-share-button";

export const locales = ["en", "hi"] as const;
export type TestLocale = (typeof locales)[number];

/** Renders client UI the way SiteShell provides it: inside NextIntlClientProvider with the real catalog. */
export function renderWithIntl(ui: ReactNode, locale: TestLocale = "en") {
  return render(
    <NextIntlClientProvider locale={locale} messages={messagesMap[locale]} timeZone="UTC">
      {ui}
    </NextIntlClientProvider>,
  );
}

/** A message from the real catalog, e.g. `message("en", "Nav.brand")`. */
export function message(locale: TestLocale, key: string): string {
  const value = key.split(".").reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], messagesMap[locale]);
  if (typeof value !== "string") throw new Error(`No message ${locale}:${key}`);
  return value;
}

type AnyComponent = (props: Record<string, unknown>) => ReactNode | Promise<ReactNode>;

/**
 * Replaces async Server Components in a tree with what they render, so the result can be
 * rendered on the client. Client components are left for React to render.
 */
export async function resolveServer(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolveServer));
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>;
  if (typeof element.type === "function" && element.type.constructor.name === "AsyncFunction") {
    return resolveServer(await (element.type as AnyComponent)(element.props));
  }
  if (element.props.children === undefined) return element;
  const children = await resolveServer(element.props.children as ReactNode);
  return cloneElement(element, undefined, ...(Array.isArray(children) ? children : [children]));
}

/** State behind the mocked next-intl navigation hooks (tests/setup.tsx). */
export const navigation = {
  pathname: "/",
  router: { replace: vi.fn(), push: vi.fn() },
};

/** State behind the mocked `lenis/react` (tests/setup.tsx). */
export const lenis: { instance: { stop: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn> } | null } = {
  instance: null,
};

/** Media queries the mocked `window.matchMedia` reports as matching (tests/setup.tsx). */
export const media = {
  matching: new Set<string>(),
  listeners: new Map<string, Set<() => void>>(),
  /** Changes whether `query` matches and notifies its listeners. */
  set(query: string, matches: boolean) {
    if (matches) this.matching.add(query);
    else this.matching.delete(query);
    for (const listener of this.listeners.get(query) ?? []) listener();
  },
};

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const PREFERS_DARK = "(prefers-color-scheme: dark)";

/** A stand-in for the SocialShareButton library that records every instance it creates. */
export class FakeShareButton implements SocialShareButtonInstance {
  static instances: FakeShareButton[] = [];
  options: SocialShareButtonOptions;
  openModal = vi.fn();
  closeModal = vi.fn();
  destroy = vi.fn();
  updateOptions = vi.fn();

  constructor(options: SocialShareButtonOptions) {
    this.options = options;
    FakeShareButton.instances.push(this);
  }

  /** Instances that have not been destroyed. */
  static live() {
    return FakeShareButton.instances.filter((instance) => instance.destroy.mock.calls.length === 0);
  }
}

/** Defines `window.SocialShareButton`, as the library script does once it has loaded. */
export function loadShareLibrary() {
  window.SocialShareButton = FakeShareButton;
}

export function resetHelpers() {
  navigation.pathname = "/";
  navigation.router.replace.mockReset();
  navigation.router.push.mockReset();
  lenis.instance = null;
  media.matching.clear();
  media.listeners.clear();
  FakeShareButton.instances = [];
}

/** Formats a message from the real catalog with ICU arguments, as next-intl does for components. */
export function translate(locale: TestLocale, key: string, values?: Record<string, string | number>): string {
  return createTranslator({ locale, messages: messagesMap[locale] })(key as never, values as never);
}
