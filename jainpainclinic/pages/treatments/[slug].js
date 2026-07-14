import Head from "next/head";
import TreatmentPageTemplate from "@/components/treatments/TreatmentPageTemplate";
import SiteLayout from "@/components/layout/SiteLayout";
import Seo from "@/components/shared/Seo";
import { treatments, getTreatmentBySlug } from "@/data/treatments";
import { getLocaleFromContext, translatePageProps, withLocaleProps } from "@/lib/page-i18n.server";
import { clinicSchema, doctorSchema } from "@/lib/structured-data";

export default function TreatmentPage({ treatment, locale = "en" }) {
  return (
    <>
      <Seo
        title={treatment.seoTitle}
        description={treatment.description}
        canonicalPath={`/treatments/${treatment.slug}`}
        locale={locale}
        ogImage={`https://www.jainpainclinic.com${treatment.ogImage}`}
      />
      <Head>
        <meta name="keywords" content={treatment.keywords} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={treatment.seoTitle} />
        <meta property="og:description" content={treatment.description} />
        <meta property="og:url" content={`https://www.jainpainclinic.com/treatments/${treatment.slug}`} />
        <meta property="og:image" content={`https://www.jainpainclinic.com${treatment.ogImage}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "MedicalWebPage",
                name: treatment.seoTitle.replace(" | Jain Pain Clinic", ""),
                description: treatment.description,
                url: `https://www.jainpainclinic.com${treatment.canonicalPath}`,
                medicalAudience: { "@type": "Patient" },
                about: { "@type": "MedicalCondition", name: treatment.title.split(":")[0] },
                author: doctorSchema(),
                publisher: clinicSchema(),
              },
              {
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
                    name: "Treatments",
                    item: "https://www.jainpainclinic.com/",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: treatment.title.split(":")[0],
                    item: `https://www.jainpainclinic.com${treatment.canonicalPath}`,
                  },
                ],
              },
            ]),
          }}
        />
      </Head>

      <SiteLayout showAppointment>
        <TreatmentPageTemplate treatment={treatment} />
      </SiteLayout>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: treatments.map((item) => ({
      params: { slug: item.slug },
    })),
    fallback: false,
  };
}

export function getStaticProps(context) {
  const { params } = context;
  const locale = getLocaleFromContext(context);
  const treatment = getTreatmentBySlug(params.slug);

  if (!treatment) {
    return { notFound: true };
  }

  return {
    props: withLocaleProps(translatePageProps({
      treatment,
    }, locale), locale),
  };
}
