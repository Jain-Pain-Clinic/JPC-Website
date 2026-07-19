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

const HOME_CRITICAL_CSS = `
:root{--ink:#032126;--blue:#1253a3;--blue-dark:#0f468d;--muted:rgba(3,33,38,.5);--surface:#fff}
*,:before,:after{box-sizing:border-box}
html{overflow-x:clip}
body{margin:0;min-width:320px;overflow-x:clip;background:var(--surface);color:var(--ink);font-family:Manrope,sans-serif;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}
picture{display:block}
a{color:inherit;text-decoration:none}
button{border:0;background:none;cursor:pointer;font:inherit}
.wrap{width:min(1440px,100%);margin:0 auto;padding:0 120px}
.pill-button{display:inline-flex;align-items:center;justify-content:center;min-height:60px;padding:20px 32px;border:1px solid rgba(0,0,0,.1);border-radius:32px;background:var(--blue);color:#eeebff;text-decoration:none;font-size:18px;font-weight:700;line-height:1}
.pill-button--small{min-height:44px;padding:12px 18px;font-size:14px;font-weight:700}
.site-header{position:sticky;top:0;z-index:200;background:rgba(255,255,255,.97);box-shadow:0 3px 4px rgba(171,171,171,.08)}
.header-bar{display:flex;align-items:center;justify-content:space-between;gap:40px;min-height:76px}
.brand{flex:0 0 auto}
.brand img{width:147px;height:auto}
.main-nav{display:flex;flex:1;justify-content:center;gap:26px;min-width:0}
.main-nav a{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;color:var(--ink);text-decoration:none;font-size:14px;font-weight:500;line-height:1.35}
.header-actions{display:flex;align-items:center;gap:12px}
.header-cta{flex:0 0 auto;gap:8px}
.hamburger{display:none}
.hero-section{position:relative;overflow:hidden;background:#fff}
.hero-section::before{content:"";position:absolute;inset:0;background:url("/assets/BG.webp") center/cover no-repeat;pointer-events:none}
.hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:495px 1fr;gap:23px;min-height:745px}
.hero-copy{position:relative;z-index:1;align-self:start;padding-top:196px}
.hero-copy h1{margin:0;max-width:495px;color:var(--ink);font-size:55px;font-weight:700;line-height:1.1;letter-spacing:-1.65px}
.hero-copy p{margin:20px 0 48px;max-width:417px;color:var(--muted);font-size:20px;font-weight:500;line-height:1.32;letter-spacing:-.4px}
.hero-visual{position:relative;display:flex;align-items:flex-end;justify-content:flex-end}
.hero-figure{width:92%;max-width:630px;height:auto;object-fit:contain}
.hero-figure img{width:100%;height:auto;object-fit:contain}
@media (max-width:1100px){.wrap{padding:0 36px}.hero-grid{grid-template-columns:1fr;min-height:auto;padding:72px 0 0}.hero-copy{padding-top:0}.hero-visual{min-height:620px}.hero-figure{right:50%;transform:translateX(50%);width:min(620px,88vw)}}
@media (max-width:780px){.wrap{padding:0 20px}.hamburger{display:flex;flex:0 0 40px;flex-direction:column;justify-content:center;gap:5px;width:40px;height:40px;padding:9px 6px;background:none;border:0}.hamburger span{display:block;width:100%;height:2px;border-radius:2px;background:var(--ink)}.header-bar{flex-wrap:nowrap;justify-content:space-between;gap:10px;padding:14px 0;min-height:auto}.brand{position:relative;z-index:101;min-width:0}.brand img{width:124px}.header-actions{display:flex;align-items:center;flex:0 0 auto;gap:8px;position:relative;z-index:101}.header-cta{flex:0 0 auto;min-height:auto;padding:12px 18px;border-radius:62px;font-size:12px}.main-nav{position:fixed;top:0;left:0;right:0;bottom:0;z-index:100;flex-direction:column;justify-content:flex-start;align-items:stretch;gap:40px;padding:80px 20px 40px;background:#fff;overflow-y:auto;opacity:0;pointer-events:none}.hero-grid{grid-template-columns:1fr;min-height:auto;padding:40px 0 0;text-align:center}.hero-copy{padding-top:0;align-items:center;display:flex;flex-direction:column}.hero-copy h1{font-size:32px;max-width:307px;letter-spacing:-.96px}.hero-copy p{font-size:14px;max-width:277px;margin:16px 0 36px;letter-spacing:-.28px}.hero-visual{justify-content:center;min-height:auto}.hero-figure{position:relative;right:auto;transform:none;width:min(420px,90vw);max-width:none}}
`;

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

export default function HomePage({ homepageMarkup, clientTranslations = {}, locale = "en" }) {
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
        <style
          id="jpc-home-critical-css"
          dangerouslySetInnerHTML={{
            __html: HOME_CRITICAL_CSS,
          }}
        />
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

      <div dangerouslySetInnerHTML={{ __html: homepageMarkup }} />

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

  return {
    props: withLocaleProps({
      homepageMarkup: translateLegacyMarkup(homepageMarkup, locale, "/"),
      clientTranslations: getClientTranslations(HOME_DYNAMIC_STRINGS, locale),
    }, locale, []),
  };
}
