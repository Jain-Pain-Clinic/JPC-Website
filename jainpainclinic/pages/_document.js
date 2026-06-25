import Document, { Html, Head, Main, NextScript } from "next/document";
import { DEFAULT_LOCALE, getLocaleMeta, isSupportedLocale } from "@/lib/i18n";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "GTM-NRQQSQST";

export default function MyDocument({ locale = DEFAULT_LOCALE }) {
  const meta = getLocaleMeta(locale);

  return (
    <Html lang={meta.code} dir={meta.dir}>
      <Head>
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
      </Head>
      <body className="antialiased">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx) => {
  const initialProps = await Document.getInitialProps(ctx);
  const locale = typeof ctx.query?.locale === "string" && isSupportedLocale(ctx.query.locale)
    ? ctx.query.locale
    : DEFAULT_LOCALE;

  return {
    ...initialProps,
    locale,
  };
};
