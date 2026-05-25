import Head from "next/head";

export default function Seo({ title, description, canonical, ogImage, noIndex = false }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Jain Pain Clinic" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
    </Head>
  );
}
