import Head from "next/head";
import { DEFAULT_LOCALE, LOCALES, getCanonicalUrl, localizePath } from "@/lib/i18n";

function getPathFromCanonical(canonical) {
  if (!canonical) {
    return "";
  }

  try {
    return new URL(canonical).pathname;
  } catch {
    return canonical;
  }
}

export default function Seo({
  title,
  description,
  canonical,
  canonicalPath,
  locale = DEFAULT_LOCALE,
  ogImage,
  noIndex = false,
}) {
  const path = canonicalPath || getPathFromCanonical(canonical);
  const canonicalUrl = canonical || (path ? getCanonicalUrl(path, locale) : "");

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {path
        ? LOCALES.map((item) => (
            <link
              key={item.code}
              rel="alternate"
              hrefLang={item.code}
              href={`https://www.jainpainclinic.com${localizePath(path, item.code)}`}
            />
          ))
        : null}
      {path ? (
        <link rel="alternate" hrefLang="x-default" href={`https://www.jainpainclinic.com${localizePath(path, DEFAULT_LOCALE)}`} />
      ) : null}
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Jain Pain Clinic" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
    </Head>
  );
}
