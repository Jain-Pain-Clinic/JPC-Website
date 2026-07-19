import { DEFAULT_LOCALE, LOCALES, localizePath } from "./i18n.js";
import {
  getClientTranslationMap,
  loadTranslationMemory,
  translateHtmlForLocale,
  translateObjectForLocale,
} from "./translation-memory.server.js";
import { getRuntimeTranslationStrings } from "./runtime-translation-strings.server.js";

export function getLocaleFromContext(context) {
  return context?.params?.locale || DEFAULT_LOCALE;
}

export function translatePageProps(props, locale) {
  if (locale === DEFAULT_LOCALE) {
    return props;
  }

  const memory = loadTranslationMemory();
  return translateObjectForLocale(props, locale, memory);
}

export function withLocaleProps(props, locale, runtimeTranslationStrings = getRuntimeTranslationStrings()) {
  const clientTranslations = {
    ...getClientTranslations(runtimeTranslationStrings, locale),
    ...(props.clientTranslations || {}),
  };

  return {
    ...props,
    clientTranslations,
    locale,
  };
}

export function translateLegacyMarkup(markup, locale, path = "/") {
  if (locale === DEFAULT_LOCALE) {
    return injectLegacyLanguageSwitcher(markup, locale, path);
  }

  const memory = loadTranslationMemory();
  const translatedMarkup = translateHtmlForLocale(markup, locale, memory);
  return injectLegacyLanguageSwitcher(localizeLegacyLinks(translatedMarkup, locale), locale, path);
}

export function localizeLegacyLinks(markup, locale) {
  if (locale === DEFAULT_LOCALE) {
    return markup;
  }

  return markup.replace(/\s(href|action)="([^"]+)"/g, (match, attr, href) => {
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("//") ||
      href.startsWith("/assets/") ||
      /^(https?:|mailto:|tel:)/i.test(href)
    ) {
      return match;
    }

    return ` ${attr}="${localizePath(href.startsWith("/") ? href : `/${href}`, locale)}"`;
  });
}

export function injectLegacyLanguageSwitcher(markup, locale, path) {
  const currentLocale = LOCALES.find((item) => item.code === locale) || LOCALES[0];
  const links = LOCALES.map((item) => {
    const currentClass = item.code === locale ? ' class="is-current"' : "";
    return `<a href="${localizePath(path, item.code)}" hreflang="${item.code}"${currentClass}>${item.nativeLabel}</a>`;
  }).join("");
  const switcher = `<details class="language-dropdown"><summary aria-label="Languages">${currentLocale.nativeLabel}</summary><div class="language-dropdown__menu">${links}</div></details>`;

  if (markup.includes('class="language-dropdown"')) {
    return markup;
  }

  return markup.replace('<a class="pill-button pill-button--small header-cta"', `${switcher}\n        <a class="pill-button pill-button--small header-cta"`);
}

export function getClientTranslations(strings, locale) {
  return getClientTranslationMap(strings, locale, loadTranslationMemory());
}
