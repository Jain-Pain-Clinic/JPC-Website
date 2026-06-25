import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, getLocaleMeta, localizePath, translateText } from "@/lib/i18n";

const I18nContext = createContext({
  locale: DEFAULT_LOCALE,
  dir: "ltr",
  t: (value) => value,
  localizeHref: (href) => href,
});

export function I18nProvider({ locale = DEFAULT_LOCALE, children }) {
  const meta = getLocaleMeta(locale);
  const value = {
    locale,
    dir: meta.dir,
    t: (text) => translateText(locale, text),
    localizeHref: (href) => localizePath(href, locale),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useLocale() {
  return useI18n().locale;
}

export function useT() {
  return useI18n().t;
}
