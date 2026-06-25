import Head from "next/head";
import Seo from "@/components/shared/Seo";
import SiteLayout from "@/components/layout/SiteLayout";
import ProcedurePageTemplate from "@/components/procedures/ProcedurePageTemplate";
import { procedures, getProcedureBySlug } from "@/data/procedures";
import { getLocaleFromContext, translatePageProps, withLocaleProps } from "@/lib/page-i18n.server";

export default function ProcedurePage({ procedure, medicalSchema, locale = "en" }) {
  return (
    <>
      <Seo
        title={procedure.seoTitle}
        description={procedure.description}
        canonicalPath={procedure.canonicalPath}
        locale={locale}
        ogImage={`https://www.jainpainclinic.com${procedure.ogImage}`}
      />

      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }}
        />
      </Head>

      <SiteLayout showAppointment>
        <ProcedurePageTemplate procedure={procedure} />
      </SiteLayout>
    </>
  );
}

export function getStaticPaths() {
  return {
    paths: procedures.map((item) => ({
      params: { slug: item.slug },
    })),
    fallback: false,
  };
}

export function getStaticProps(context) {
  const { params } = context;
  const locale = getLocaleFromContext(context);
  const procedure = getProcedureBySlug(params.slug);

  if (!procedure) {
    return { notFound: true };
  }

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: procedure.medicalProcedure.name,
    description: procedure.medicalProcedure.description,
    procedureType: procedure.title,
    bodyLocation: procedure.medicalProcedure.bodyLocation,
    preparation: procedure.medicalProcedure.preparation,
    followup: procedure.medicalProcedure.followup,
    howPerformed: procedure.medicalProcedure.howPerformed,
    relevantSpecialty: {
      "@type": "MedicalSpecialty",
      name: procedure.medicalProcedure.relevantSpecialty,
    },
    provider: {
      "@type": "MedicalClinic",
      name: "Jain Pain Clinic",
      url: "https://www.jainpainclinic.com",
    },
    image: `https://www.jainpainclinic.com${procedure.ogImage}`,
  };

  return {
    props: withLocaleProps(translatePageProps({
      procedure,
      medicalSchema,
    }, locale), locale),
  };
}
