import fs from "fs";
import path from "path";
import Head from "next/head";
import Script from "next/script";

function normalizeHomepageMarkup(html) {
  return html
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/src="assets\//g, 'src="/assets/')
    .replace(
      '<img class="hero-figure" src="/assets/hero-right.png" alt="Doctor with 50,000+ happy patients and 4 expert doctors" />',
      '<picture class="hero-figure"><source srcset="/assets/hero-right.webp" type="image/webp" /><img src="/assets/hero-right.png" width="1143" height="1200" loading="eager" decoding="async" fetchpriority="high" alt="Doctor with 50,000+ happy patients and 4 expert doctors" /></picture>'
    );
}

export default function HomePage({ homepageMarkup }) {
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
        <link rel="canonical" href="https://www.jainpainclinic.com/" />
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
          href="/assets/BG.png"
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
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              name: "Jain Pain Clinic",
              url: "https://www.jainpainclinic.com/",
              email: "ashu.jain@jainpainclinic.com",
              telephone: "+919211281009",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Artemis Hospitals, Sector-51",
                addressLocality: "Gurugram",
                addressRegion: "Haryana",
                addressCountry: "IN",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "66",
                bestRating: "5",
                worstRating: "1",
              },
              medicalSpecialty: "Pain Medicine",
              physician: {
                "@type": "Physician",
                name: "Dr Ashu Kumar Jain",
                honorificPrefix: "Dr",
                jobTitle: "Head of Department, Pain Medicine and Palliative Care",
                affiliation: "Artemis Hospitals, Gurugram",
                hasCredential: "MBBS, MD, Fellowship Pain Medicine (FIAPM)",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.jainpainclinic.com/",
                },
              ],
            }),
          }}
        />
      </Head>

      <div dangerouslySetInnerHTML={{ __html: homepageMarkup }} />

      <Script src="/home-script.js" strategy="afterInteractive" />
    </>
  );
}

export async function getStaticProps() {
  const homepagePath = path.join(process.cwd(), "content", "legacy-site", "index.html");
  const homepageHtml = fs.readFileSync(homepagePath, "utf8");
  const bodyMatch = homepageHtml.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>/);

  return {
    props: {
      homepageMarkup: normalizeHomepageMarkup(bodyMatch ? bodyMatch[1] : ""),
    },
  };
}
