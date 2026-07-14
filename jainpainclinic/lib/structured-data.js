export const SITE_URL = "https://www.jainpainclinic.com";
export const CLINIC_ID = `${SITE_URL}/#clinic`;
export const DOCTOR_ID = `${SITE_URL}/about#dr-ashu-kumar-jain`;

export const clinicAddress = {
  "@type": "PostalAddress",
  streetAddress: "Artemis Hospitals, Sector-51",
  addressLocality: "Gurugram",
  addressRegion: "Haryana",
  postalCode: "122001",
  addressCountry: "IN",
};

export function clinicSchema(overrides = {}) {
  return {
    "@type": "MedicalClinic",
    "@id": CLINIC_ID,
    name: "Jain Pain Clinic",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/logo.png`,
    logo: `${SITE_URL}/assets/logo.png`,
    email: "ashu.jain@jainpainclinic.com",
    telephone: "+919211281009",
    address: clinicAddress,
    priceRange: "$$",
    medicalSpecialty: "Pain Medicine",
    areaServed: ["Gurugram", "Delhi NCR", "Haryana"],
    employee: {
      "@type": "Person",
      "@id": DOCTOR_ID,
      name: "Dr Ashu Kumar Jain",
      url: `${SITE_URL}/about`,
    },
    ...overrides,
  };
}

export function doctorSchema(overrides = {}) {
  return {
    "@type": "Person",
    "@id": DOCTOR_ID,
    name: "Dr Ashu Kumar Jain",
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/assets/hero-right.png`,
    description:
      "Dr Ashu Kumar Jain is a chronic pain and interventional pain management specialist at Jain Pain Clinic, Gurugram.",
    ...overrides,
  };
}

export function clinicGraph(extraItems = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [clinicSchema(), doctorSchema(), ...extraItems],
  };
}
