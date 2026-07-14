import fs from "fs";
import path from "path";
import Head from "next/head";
import Script from "next/script";
import LocaleHeadLinks from "@/components/shared/LocaleHeadLinks";
import { normalizeWhatsAppConsultLinks } from "@/lib/external-link-markup";
import { getLocaleFromContext, translateLegacyMarkup, withLocaleProps } from "@/lib/page-i18n.server";
import { clinicGraph } from "@/lib/structured-data";

function normalizeAboutMarkup(html) {
  return normalizeWhatsAppConsultLinks(html)
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/src="assets\//g, 'src="/assets/');
}

export default function AboutPage({ aboutMarkup, locale = "en" }) {
  return (
    <>
      <Head>
        <title>Dr Ashu Kumar Jain | Jain Pain Clinic</title>
        <meta
          name="description"
          content="Learn about Dr Ashu Kumar Jain, Head of Pain Medicine and Palliative Care at Artemis Hospitals, Gurugram. Expert in chronic pain management and interventional pain procedures across NCR."
        />
        <meta
          name="keywords"
          content="Dr Ashu Kumar Jain, Jain Pain Clinic, chronic pain specialist, pain physician Gurugram, interventional pain management, palliative care NCR, pain doctor Artemis Hospital"
        />
        <LocaleHeadLinks path="/about" locale={locale} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Dr Ashu Kumar Jain | Jain Pain Clinic, Gurugram" />
        <meta
          property="og:description"
          content="Dr Ashu Kumar Jain is NCR&apos;s leading chronic pain physician and Head of Pain Medicine at Artemis Hospitals, Gurugram. Book a consultation at Jain Pain Clinic."
        />
        <meta property="og:url" content="https://www.jainpainclinic.com/about" />
        <meta property="og:image" content="https://www.jainpainclinic.com/assets/hero-right.png" />
        <meta property="og:site_name" content="Jain Pain Clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Dr Ashu Kumar Jain | Jain Pain Clinic, Gurugram" />
        <meta
          name="twitter:description"
          content="Dr Ashu Kumar Jain is NCR&apos;s leading chronic pain physician and Head of Pain Medicine at Artemis Hospitals, Gurugram."
        />
        <meta name="twitter:image" content="https://www.jainpainclinic.com/assets/hero-right.png" />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              clinicGraph([
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://www.jainpainclinic.com/",
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "About Dr Ashu Kumar Jain",
                      item: "https://www.jainpainclinic.com/about",
                    },
                  ],
                },
              ])
            ),
          }}
        />
      </Head>

      <div dangerouslySetInnerHTML={{ __html: aboutMarkup }} />

      <Script src="/home-script.js" strategy="afterInteractive" />
    </>
  );
}

export async function getStaticProps(context) {
  const locale = getLocaleFromContext(context);
  const aboutPath = path.join(process.cwd(), "content", "legacy-site", "about.html");
  const aboutHtml = fs.readFileSync(aboutPath, "utf8");
  const bodyMatch = aboutHtml.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>/);
  const aboutMarkup = normalizeAboutMarkup(bodyMatch ? bodyMatch[1] : "");

  return {
    props: withLocaleProps({
      aboutMarkup: translateLegacyMarkup(aboutMarkup, locale, "/about"),
    }, locale),
  };
}
