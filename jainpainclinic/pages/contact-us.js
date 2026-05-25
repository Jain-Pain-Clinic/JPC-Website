import fs from "fs";
import path from "path";
import Head from "next/head";
import Script from "next/script";

function normalizeContactMarkup(html) {
  return html
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/src="assets\//g, 'src="/assets/');
}

export default function ContactPage({ contactMarkup }) {
  return (
    <>
      <Head>
        <title>Contact Us – Jain Pain Clinic</title>
        <meta
          name="description"
          content="Book an appointment or contact Jain Pain Clinic in Gurugram. Reach Dr Ashu Kumar Jain by phone, WhatsApp, or email at Artemis Hospitals, Sector-51."
        />
        <meta
          name="keywords"
          content="contact Jain Pain Clinic, book appointment pain clinic Gurugram, Dr Ashu Kumar Jain appointment, pain specialist Gurugram contact"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.jainpainclinic.com/contact-us" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact Jain Pain Clinic | Book an Appointment in Gurugram" />
        <meta
          property="og:description"
          content="Book an appointment at Jain Pain Clinic, Gurugram. Call, WhatsApp, or email Dr Ashu Kumar Jain at Artemis Hospitals, Sector-51."
        />
        <meta property="og:url" content="https://www.jainpainclinic.com/contact-us" />
        <meta property="og:image" content="https://www.jainpainclinic.com/assets/logo.png" />
        <meta property="og:site_name" content="Jain Pain Clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Jain Pain Clinic | Book an Appointment" />
        <meta
          name="twitter:description"
          content="Contact Jain Pain Clinic, Gurugram to book a consultation with Dr Ashu Kumar Jain."
        />
        <meta name="twitter:image" content="https://www.jainpainclinic.com/assets/logo.png" />
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
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Contact Us",
                  item: "https://www.jainpainclinic.com/contact-us",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              name: "Contact Jain Pain Clinic",
              url: "https://www.jainpainclinic.com/contact-us",
              mainEntity: {
                "@type": "MedicalClinic",
                name: "Jain Pain Clinic",
                telephone: "+918130640351",
                email: "ashu.jain@jainpainclinic.com",
                url: "https://www.jainpainclinic.com/",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Artemis Hospitals, Sector-51",
                  addressLocality: "Gurugram",
                  addressRegion: "Haryana",
                  addressCountry: "IN",
                },
              },
            }),
          }}
        />
      </Head>

      <div dangerouslySetInnerHTML={{ __html: contactMarkup }} />

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-2R0G1WLVX7"
        strategy="afterInteractive"
      />
      <Script id="google-analytics-contact" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2R0G1WLVX7');
        `}
      </Script>
      <Script src="/home-script.js" strategy="afterInteractive" />
    </>
  );
}

export async function getStaticProps() {
  const contactPath = path.join(process.cwd(), "content", "legacy-site", "contact-us.html");
  const contactHtml = fs.readFileSync(contactPath, "utf8");
  const bodyMatch = contactHtml.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>/);

  return {
    props: {
      contactMarkup: normalizeContactMarkup(bodyMatch ? bodyMatch[1] : ""),
    },
  };
}
