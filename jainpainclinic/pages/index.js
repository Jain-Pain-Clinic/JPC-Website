import fs from "fs";
import path from "path";
import Head from "next/head";
import Script from "next/script";
import LocaleHeadLinks from "@/components/shared/LocaleHeadLinks";
import { normalizeWhatsAppConsultLinks } from "@/lib/external-link-markup";
import { HOME_DYNAMIC_STRINGS } from "@/lib/home-dynamic-strings";
import { normalizeLegacyProcedureMenus } from "@/lib/legacy-procedure-menus";
import { getClientTranslations, getLocaleFromContext, translateLegacyMarkup, withLocaleProps } from "@/lib/page-i18n.server";
import { clinicGraph } from "@/lib/structured-data";

const HERO_STRINGS = [
  "True life starts when the pain ends",
  "NCR's leading chronic pain clinic, with expertise in interventional pain management.",
  "Book appointment",
];

function normalizeHomepageMarkup(html) {
  return normalizeLegacyProcedureMenus(normalizeWhatsAppConsultLinks(html))
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/src="assets\//g, 'src="/assets/')
    .replace(
      '<div class="hero-copy reveal">',
      '<div class="hero-copy">'
    )
    .replace(
      '<div class="hero-visual reveal reveal-delay-2">',
      '<div class="hero-visual">'
    )
    .replaceAll(
      '<img src="/assets/logo.png" alt="Jain Pain Clinic" />',
      '<img src="/assets/logo-small.png" width="600" height="150" decoding="async" alt="Jain Pain Clinic" />'
    )
    .replaceAll(
      '<img class="footer-logo" src="/assets/logo.png" alt="Jain Pain Clinic" />',
      '<img class="footer-logo" src="/assets/logo-small.png" width="600" height="150" loading="lazy" decoding="async" alt="Jain Pain Clinic" />'
    )
    .replace(
      '<img class="hero-figure" src="/assets/hero-right.png" alt="Doctor with 50,000+ happy patients and 4 expert doctors" />',
      '<picture class="hero-figure"><source srcset="/assets/hero-right.webp" type="image/webp" /><img src="/assets/hero-right.png" width="1143" height="1200" loading="eager" decoding="async" fetchpriority="high" alt="Doctor with 50,000+ happy patients and 4 expert doctors" /></picture>'
    )
    .replace(
      '<img src="/assets/about-us.jpg" alt="Doctors supporting patients" />',
      '<picture><source srcset="/assets/about-us.webp" type="image/webp" /><img src="/assets/about-us.jpg" width="1004" height="1200" loading="lazy" decoding="async" fetchpriority="low" alt="Doctors supporting patients" /></picture>'
    )
    .replace(
      '<img src="/assets/sitting doctor.png" alt="Dr Ashu Kumar Jain" />',
      '<picture><source srcset="/assets/sitting%20doctor.webp" type="image/webp" /><img src="/assets/sitting doctor.png" width="800" height="697" loading="lazy" decoding="async" fetchpriority="low" alt="Dr Ashu Kumar Jain" /></picture>'
    )
    .replace(
      '<img src="/assets/meenu.png" alt="Dr. Meenu Gupta" />',
      '<picture><source srcset="/assets/meenu.webp" type="image/webp" /><img src="/assets/meenu.png" width="638" height="700" loading="lazy" decoding="async" fetchpriority="low" alt="Dr. Meenu Gupta" /></picture>'
    )
    .replace(
      '<img src="/assets/mohit.png" alt="Dr. Mohit Gupta" />',
      '<picture><source srcset="/assets/mohit.webp" type="image/webp" /><img src="/assets/mohit.png" width="729" height="800" loading="lazy" decoding="async" fetchpriority="low" alt="Dr. Mohit Gupta" /></picture>'
    )
    .replace(
      '<img class="treat-bg-image is-visible" id="treatBgImage" src="/assets/treat-back-pain.jpg" alt="" aria-hidden="true" />',
      '<img class="treat-bg-image is-visible" id="treatBgImage" src="/assets/treat-back-pain.jpg" width="800" height="533" loading="lazy" decoding="async" fetchpriority="low" alt="" aria-hidden="true" />'
    )
    .replace(
      '<img src="/assets/belief-1.jpg" alt="Doctors at Jain Pain Clinic" />',
      '<picture><source srcset="/assets/belief-1.webp" type="image/webp" /><img src="/assets/belief-1.jpg" width="800" height="600" loading="lazy" decoding="async" fetchpriority="low" alt="Doctors at Jain Pain Clinic" /></picture>'
    )
    .replace(
      '<img src="/assets/belief-2.jpg" alt="Jain Pain Clinic medical team" />',
      '<picture><source srcset="/assets/belief-2.webp" type="image/webp" /><img src="/assets/belief-2.jpg" width="600" height="800" loading="lazy" decoding="async" fetchpriority="low" alt="Jain Pain Clinic medical team" /></picture>'
    )
    .replace(
      '<img src="/assets/belief-3.jpg" alt="Interventional pain procedure" />',
      '<picture><source srcset="/assets/belief-3.webp" type="image/webp" /><img src="/assets/belief-3.jpg" width="735" height="800" loading="lazy" decoding="async" fetchpriority="low" alt="Interventional pain procedure" /></picture>'
    );
}

function splitHomepageMarkup(markup) {
  const headerMatch = markup.match(/^\s*(<header[\s\S]*?<\/header>)/);
  const mainMatch = markup.match(/<main id="top">([\s\S]*?)<\/main>/);
  const footerMatch = markup.match(/(<footer[\s\S]*?<\/footer>)\s*$/);

  if (!headerMatch || !mainMatch) {
    return {
      headerMarkup: "",
      mainSectionsMarkup: markup,
      footerMarkup: "",
    };
  }

  const mainContent = mainMatch[1] || "";
  const heroMatch = mainContent.match(/^\s*<section class="hero-section">[\s\S]*?<\/section>/);

  return {
    headerMarkup: headerMatch[1],
    mainSectionsMarkup: heroMatch ? mainContent.slice(heroMatch[0].length) : mainContent,
    footerMarkup: footerMatch ? footerMatch[1] : "",
  };
}

function HomeHero({ copy }) {
  return (
    <section className="hero-section">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <a className="pill-button" href="#contact">{copy.cta}</a>
        </div>

        <div className="hero-visual">
          <picture className="hero-figure">
            <source srcSet="/assets/hero-right.webp" type="image/webp" />
            <img
              src="/assets/hero-right.png"
              width="1143"
              height="1200"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              alt="Doctor with 50,000+ happy patients and 4 expert doctors"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}

export default function HomePage({
  headerMarkup,
  mainSectionsMarkup,
  footerMarkup,
  heroCopy,
  clientTranslations = {},
  locale = "en",
}) {
  return (
    <>
      <Head>
        <title>Jain Pain Clinic | Chronic Pain Specialist in Gurugram</title>
        <meta
          name="description"
          content="Jain Pain Clinic, led by Dr Ashu Kumar Jain, is NCR&apos;s leading chronic pain and interventional pain management clinic at Artemis Hospitals, Gurugram. Treating back pain, neck pain, sciatica, knee pain, and more."
        />
        <meta
          name="keywords"
          content="Jain Pain Clinic, Dr Ashu Kumar Jain, chronic pain, pain management, interventional pain, Gurugram, NCR, back pain, neck pain, sciatica, knee pain, palliative care"
        />
        <LocaleHeadLinks path="/" locale={locale} />
        <link
          rel="preload"
          as="image"
          href="/assets/hero-right.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/BG.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Jain Pain Clinic | Dr Ashu Kumar Jain | Chronic Pain Specialist, Gurugram"
        />
        <meta
          property="og:description"
          content="NCR&apos;s leading chronic pain and interventional pain management clinic, led by Dr Ashu Kumar Jain at Artemis Hospitals, Gurugram."
        />
        <meta property="og:url" content="https://www.jainpainclinic.com/" />
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
                  ],
                },
              ])
            ),
          }}
        />
      </Head>

      {headerMarkup ? <div dangerouslySetInnerHTML={{ __html: headerMarkup }} /> : null}
      <main id="top">
        <HomeHero copy={heroCopy} />
        <div dangerouslySetInnerHTML={{ __html: mainSectionsMarkup }} />
      </main>
      {footerMarkup ? <div dangerouslySetInnerHTML={{ __html: footerMarkup }} /> : null}

      <Script id="jpc-locale-runtime" strategy="afterInteractive">
        {`
          window.__JPC_LOCALE = ${JSON.stringify(locale)};
          window.__JPC_TRANSLATIONS = ${JSON.stringify(clientTranslations)};
        `}
      </Script>
      <Script src="/home-script.js" strategy="afterInteractive" />
    </>
  );
}

export async function getStaticProps(context) {
  const locale = getLocaleFromContext(context);
  const homepagePath = path.join(process.cwd(), "content", "legacy-site", "index.html");
  const homepageHtml = fs.readFileSync(homepagePath, "utf8");
  const bodyMatch = homepageHtml.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>/);
  const homepageMarkup = normalizeHomepageMarkup(bodyMatch ? bodyMatch[1] : "");
  const splitMarkup = splitHomepageMarkup(homepageMarkup);
  const runtimeStrings = [...HOME_DYNAMIC_STRINGS, ...HERO_STRINGS];
  const clientTranslations = getClientTranslations(runtimeStrings, locale);
  const translateHeroString = (value) => clientTranslations[value] || value;

  return {
    props: withLocaleProps({
      headerMarkup: translateLegacyMarkup(splitMarkup.headerMarkup, locale, "/"),
      mainSectionsMarkup: translateLegacyMarkup(splitMarkup.mainSectionsMarkup, locale, "/"),
      footerMarkup: translateLegacyMarkup(splitMarkup.footerMarkup, locale, "/"),
      heroCopy: {
        title: translateHeroString(HERO_STRINGS[0]),
        subtitle: translateHeroString(HERO_STRINGS[1]),
        cta: translateHeroString(HERO_STRINGS[2]),
      },
      clientTranslations,
    }, locale, []),
  };
}
