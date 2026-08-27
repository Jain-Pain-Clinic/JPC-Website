import Head from "next/head";
import Seo from "@/components/shared/Seo";
import SiteLayout from "@/components/layout/SiteLayout";
import ProcedurePageTemplate from "@/components/procedures/ProcedurePageTemplate";
import { procedures, getProcedureBySlug } from "@/data/procedures";
import { getLocaleFromContext, translatePageProps, withLocaleProps } from "@/lib/page-i18n.server";
import { PROCEDURE_RUNTIME_TRANSLATION_STRINGS } from "@/lib/runtime-translation-strings.server";
import { clinicSchema } from "@/lib/structured-data";

const localizedProcedureVideoIds = {
  wqg9sc9e5QU: { hi: "wqg9sc9e5QU", ar: "kXa0bwQVBxc" },
  awp2TufSiJw: { hi: "awp2TufSiJw", ar: "NXMFxGMaz4Q", ru: "b0isMgMIq5o" },
  N5xa3FI3jr8: { hi: "N5xa3FI3jr8", ar: "T9TKKYz1j-k", ru: "VCBzVQiUoIY" },
  kL3HQKV9ceA: { hi: "kL3HQKV9ceA", ar: "zXLmBb4b-eE", ru: "KM2QWRDFEKk" },
  kjUf78rYxW0: { hi: "kjUf78rYxW0", ar: "ipb9quVNrAs", ru: "J-OU4l6grZ4" },
  "om-KUA6ft-k": { hi: "om-KUA6ft-k", ar: "8dPiLC7m47g", ru: "pWVfHr8YfOw" },
  BY56OYtuuT0: { hi: "BY56OYtuuT0", ar: "2FDNB-Oyo14", ru: "srxgW39u8To" },
  CWHZValrZlo: { hi: "CWHZValrZlo", ar: "bfT1u-vEVDk", ru: "e4EhJsz_Ccs" },
  "vZeNk-8Vd00": { hi: "vZeNk-8Vd00", ar: "fceBG8lxc34", ru: "u17q_zeyOLw" },
  hodwHC_LTRw: { hi: "hodwHC_LTRw", ar: "Bmfu6LQIN4k", ru: "l3QPkgtOu_s" },
  x6l8GbwOW6Y: { hi: "x6l8GbwOW6Y", ar: "mvsXUu7NIGc", ru: "7V7xhaxB7cU" },
  "I2r-sYjNHpM": { hi: "I2r-sYjNHpM", ar: "h2-w6Vd4N-8", ru: "6MsmR6ek1vE" },
  QUAJGyU8XRA: { hi: "QUAJGyU8XRA", ar: "q0tFNN8PGhc", ru: "KA2XD5LDNiU" },
};

function localizeProcedureVideo(procedure, locale) {
  const defaultVideoId = procedure.videoUrl?.match(/[?&]v=([^&]+)/)?.[1];
  const videoId = localizedProcedureVideoIds[defaultVideoId]?.[locale] || defaultVideoId;

  if (!videoId || videoId === defaultVideoId) {
    return procedure;
  }

  return {
    ...procedure,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    videoThumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}

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

  const localizedProcedure = localizeProcedureVideo(procedure, locale);
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
    provider: clinicSchema(),
    image: `https://www.jainpainclinic.com${procedure.ogImage}`,
  };

  return {
    props: withLocaleProps(translatePageProps({
      procedure: localizedProcedure,
      medicalSchema,
    }, locale), locale, PROCEDURE_RUNTIME_TRANSLATION_STRINGS),
  };
}
