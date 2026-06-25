import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { DEFAULT_LOCALE, TARGET_LOCALES, normalizeTranslationText } from "./i18n-config.js";

export const TRANSLATION_MEMORY_PATH = path.join(process.cwd(), ".cache", "translation-memory.json");

const SKIPPED_KEYS = new Set([
  "slug",
  "id",
  "href",
  "url",
  "videoUrl",
  "canonical",
  "canonicalPath",
  "ogImage",
  "src",
  "image",
  "cardImage",
  "bannerImage",
  "authorImage",
  "videoThumbnail",
  "publishedAt",
  "publishedLabel",
  "access_key",
  "from_name",
]);

const SKIPPED_KEY_PARTS = [
  "path",
  "url",
  "href",
  "src",
  "image",
  "thumbnail",
  "icon",
  "class",
  "type",
];

function isLikelyNonHumanString(value) {
  const text = String(value).trim();

  if (!text) {
    return true;
  }

  if (!/\p{L}/u.test(text)) {
    return true;
  }

  if (/^(https?:|mailto:|tel:|#|\/assets\/|\/blog\/|\/treatments\/|\/procedures\/)/i.test(text)) {
    return true;
  }

  if (/^[\w.-]+\.(jpg|jpeg|png|webp|svg|gif|ico|css|js)$/i.test(text)) {
    return true;
  }

  if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(text) && !text.includes(" ")) {
    return true;
  }

  if (/^\+?\d[\d\s().-]+$/.test(text)) {
    return true;
  }

  return false;
}

function shouldTranslateString(key, value) {
  if (typeof value !== "string" || isLikelyNonHumanString(value)) {
    return false;
  }

  if (!key) {
    return true;
  }

  if (SKIPPED_KEYS.has(key)) {
    return false;
  }

  const lowerKey = key.toLowerCase();

  return !SKIPPED_KEY_PARTS.some((part) => lowerKey.includes(part));
}

export function getTranslationKey(value) {
  return crypto
    .createHash("sha256")
    .update(normalizeTranslationText(value))
    .digest("hex")
    .slice(0, 16);
}

export function loadTranslationMemory() {
  if (!fs.existsSync(TRANSLATION_MEMORY_PATH)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(TRANSLATION_MEMORY_PATH, "utf8"));
}

export function saveTranslationMemory(memory) {
  fs.mkdirSync(path.dirname(TRANSLATION_MEMORY_PATH), { recursive: true });
  fs.writeFileSync(`${TRANSLATION_MEMORY_PATH}.tmp`, `${JSON.stringify(memory, null, 2)}\n`);
  fs.renameSync(`${TRANSLATION_MEMORY_PATH}.tmp`, TRANSLATION_MEMORY_PATH);
}

export function rememberEnglish(memory, value) {
  const normalized = normalizeTranslationText(value);

  if (!normalized) {
    return null;
  }

  const key = getTranslationKey(normalized);
  memory[key] = {
    en: normalized,
    ...(memory[key] || {}),
  };

  return key;
}

export function collectTranslatableStrings(value, memory = {}, collector = new Set(), key = "") {
  if (typeof value === "string") {
    if (shouldTranslateString(key, value)) {
      const normalized = normalizeTranslationText(value);
      rememberEnglish(memory, normalized);
      collector.add(normalized);
    }

    return collector;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectTranslatableStrings(item, memory, collector, key));
    return collector;
  }

  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) {
      collectTranslatableStrings(childValue, memory, collector, childKey);
    }
  }

  return collector;
}

export function translateObjectForLocale(value, locale, memory = loadTranslationMemory(), key = "") {
  if (locale === DEFAULT_LOCALE) {
    return value;
  }

  if (typeof value === "string") {
    if (!shouldTranslateString(key, value)) {
      return value;
    }

    const normalized = normalizeTranslationText(value);
    const entry = memory[getTranslationKey(normalized)];
    return entry?.[locale] || value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => translateObjectForLocale(item, locale, memory, key));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        translateObjectForLocale(childValue, locale, memory, childKey),
      ])
    );
  }

  return value;
}

function translateHtmlTextSegment(segment, locale, memory) {
  return segment.replace(/>([^<>]+)</g, (match, text) => {
    const normalized = normalizeTranslationText(text);

    if (!normalized || isLikelyNonHumanString(normalized)) {
      return match;
    }

    rememberEnglish(memory, normalized);
    const entry = memory[getTranslationKey(normalized)];
    const translated = entry?.[locale] || text;
    const leading = text.match(/^\s*/)?.[0] || "";
    const trailing = text.match(/\s*$/)?.[0] || "";

    return `>${leading}${translated}${trailing}<`;
  });
}

function translateHtmlAttributes(segment, locale, memory) {
  return segment.replace(
    /\s(alt|title|placeholder|aria-label|value|content)="([^"]+)"/g,
    (match, attr, value) => {
      if (isLikelyNonHumanString(value)) {
        return match;
      }

      const normalized = normalizeTranslationText(value);
      rememberEnglish(memory, normalized);
      const entry = memory[getTranslationKey(normalized)];

      return ` ${attr}="${entry?.[locale] || value}"`;
    }
  );
}

export function translateHtmlForLocale(markup, locale, memory = loadTranslationMemory()) {
  if (locale === DEFAULT_LOCALE) {
    return markup;
  }

  const protectedBlocks = [];
  const tokenized = markup.replace(/<(script|style)[\s\S]*?<\/\1>/gi, (block) => {
    const token = `__JPC_PROTECTED_${protectedBlocks.length}__`;
    protectedBlocks.push(block);
    return token;
  });

  return translateHtmlAttributes(translateHtmlTextSegment(tokenized, locale, memory), locale, memory)
    .replace(/__JPC_PROTECTED_(\d+)__/g, (_, index) => protectedBlocks[Number(index)]);
}

export function getMissingTranslations(strings, locale, memory) {
  return [...strings].filter((text) => !memory[getTranslationKey(text)]?.[locale]);
}

export function getAllTargetLocaleCodes() {
  return TARGET_LOCALES.map((locale) => locale.code);
}

export function getClientTranslationMap(strings, locale, memory = loadTranslationMemory()) {
  if (locale === DEFAULT_LOCALE) {
    return {};
  }

  return Object.fromEntries(
    strings.map((text) => {
      const normalized = normalizeTranslationText(text);
      const entry = memory[getTranslationKey(normalized)];
      return [normalized, entry?.[locale] || text];
    })
  );
}
