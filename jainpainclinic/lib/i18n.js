export * from "./i18n-config";
import { DEFAULT_LOCALE, normalizeTranslationText } from "./i18n-config";

export function translateText(locale, value, translations = {}) {
  if (locale === DEFAULT_LOCALE || typeof value !== "string") {
    return value;
  }

  const normalized = normalizeTranslationText(value);

  if (!normalized) {
    return value;
  }

  return translations[normalized] || value;
}
