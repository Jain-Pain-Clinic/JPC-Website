import translationMemory from "../.cache/translation-memory.json";
export * from "./i18n-config";
import { LOCALES, TARGET_LOCALES, DEFAULT_LOCALE, normalizeTranslationText } from "./i18n-config";

const translationByLocale = LOCALES.reduce((acc, locale) => {
  acc[locale.code] = new Map();
  return acc;
}, {});

for (const entry of Object.values(translationMemory || {})) {
  const english = normalizeTranslationText(entry.en || "");

  if (!english) {
    continue;
  }

  for (const locale of TARGET_LOCALES) {
    if (entry[locale.code]) {
      translationByLocale[locale.code].set(english, entry[locale.code]);
    }
  }
}

export function translateText(locale, value) {
  if (locale === DEFAULT_LOCALE || typeof value !== "string") {
    return value;
  }

  const normalized = normalizeTranslationText(value);

  if (!normalized) {
    return value;
  }

  return translationByLocale[locale]?.get(normalized) || value;
}
