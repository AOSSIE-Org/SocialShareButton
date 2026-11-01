import { describe, expect, it } from "vitest";
import { defaultLanguage, languages } from "@/config/languages";
import { defaultMessages, messagesMap } from "@/i18n/messages";
import { routing } from "@/i18n/routing";

/** Flattens a message catalog into "Namespace.key" → string. */
function flatten(value: unknown, prefix = ""): Map<string, unknown> {
  if (value === null || typeof value !== "object") return new Map([[prefix, value]]);
  return new Map(
    Object.entries(value).flatMap(([key, child]) => [...flatten(child, prefix ? `${prefix}.${key}` : key)]),
  );
}

/** ICU arguments ({name}) and rich-text tags (<tag>) a translation must keep. */
const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
const tags = (text: string) => [...text.matchAll(/<\/?(\w+)>/g)].map((match) => match[0]).sort();

const codes = languages.map(({ code }) => code);
const english = flatten(messagesMap[defaultLanguage]);
const translations = codes.filter((code) => code !== defaultLanguage);

describe("message catalogs", () => {
  it("exist for exactly the supported languages", () => {
    expect(Object.keys(messagesMap).sort()).toEqual([...codes].sort());
    expect(defaultMessages).toBe(messagesMap[defaultLanguage]);
  });

  it("route exactly the supported languages", () => {
    expect([...routing.locales]).toEqual(codes);
    expect(routing.defaultLocale).toBe(defaultLanguage);
  });

  it.each(codes)("%s has only non-empty strings", (code) => {
    for (const [key, value] of flatten(messagesMap[code])) {
      expect(typeof value, key).toBe("string");
      expect((value as string).trim(), key).not.toBe("");
    }
  });

  it.each(translations)("%s has the same keys as English", (code) => {
    expect([...flatten(messagesMap[code]).keys()].sort()).toEqual([...english.keys()].sort());
  });

  it.each(translations)("%s keeps every ICU argument and rich-text tag", (code) => {
    const translated = flatten(messagesMap[code]);
    for (const [key, source] of english) {
      const target = translated.get(key);
      if (typeof source !== "string" || typeof target !== "string") continue;
      expect(placeholders(target), key).toEqual(placeholders(source));
      expect(tags(target), key).toEqual(tags(source));
    }
  });
});
