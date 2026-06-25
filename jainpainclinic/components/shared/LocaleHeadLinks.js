import { DEFAULT_LOCALE, LOCALES, getCanonicalUrl, localizePath } from "@/lib/i18n";

export default function LocaleHeadLinks({ path = "/", locale = DEFAULT_LOCALE }) {
  return (
    <>
      <link rel="canonical" href={getCanonicalUrl(path, locale)} />
      {LOCALES.map((item) => (
        <link
          key={item.code}
          rel="alternate"
          hrefLang={item.code}
          href={`https://www.jainpainclinic.com${localizePath(path, item.code)}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`https://www.jainpainclinic.com${localizePath(path, DEFAULT_LOCALE)}`} />
    </>
  );
}
