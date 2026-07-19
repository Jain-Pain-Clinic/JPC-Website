import { procedures } from "@/data/procedures";
import { treatments } from "@/data/treatments";

const LAYOUT_STRINGS = [
  "Home",
  "About",
  "Treatment",
  "Treatments",
  "Procedures",
  "Exercises",
  "Blogs",
  "Contact us",
  "About us",
  "Experts",
  "What we treat",
  "How we treat",
  "Videos",
  "Quick links",
  "Languages",
  "Consult now",
  "Toggle menu",
  "Locations",
  "All rights reserved.",
];

const APPOINTMENT_STRINGS = [
  "Any concern?",
  "Visit our doctors, make an appointment",
  "Email us",
  "Call us",
  "Your name",
  "Email",
  "Whatsapp no.",
  "Location",
  "Describe your problem",
  "Describe your problem...",
  "Book appointment",
];

export const BLOG_RUNTIME_TRANSLATION_STRINGS = [
  ...LAYOUT_STRINGS,
  "Tagged:",
  "Read more",
  "Blog pages",
  "Previous",
  "Next",
  "Search posts by title…",
  "No posts match your search.",
];

export const TREATMENT_RUNTIME_TRANSLATION_STRINGS = [
  ...LAYOUT_STRINGS,
  ...APPOINTMENT_STRINGS,
  "Frequently asked questions",
  "Toggle answer",
  "Excellent Candidate!",
  "Based on your responses, this treatment could be a great option for you. Schedule a consultation to discuss next steps!",
  "Good Candidate",
  "You may benefit from this treatment. We recommend scheduling a consultation to review your specific case with our specialists.",
  "Unlikely Match",
  "Based on your responses, this treatment may not be the best fit right now. If symptoms change or worsen, feel free to revisit or consult our specialists.",
  "Treatment Not Indicated",
  "Your responses suggest you may not need this treatment at this time. If you develop new symptoms in the future, do not hesitate to check again.",
  "Try Again",
  "Book Consultation",
  "Progress",
  "Yes",
  "No",
  "Calculate My Fit",
];

export const PROCEDURE_RUNTIME_TRANSLATION_STRINGS = [
  ...LAYOUT_STRINGS,
  ...APPOINTMENT_STRINGS,
  "Frequently asked questions",
  "Toggle answer",
  "Key Points",
  "What to Expect",
  "Helpful Tips",
  "Stage",
  "Swipe to explore stages",
  "Prev",
  "Excellent!",
  "Good effort!",
  "Keep learning!",
  "Quiz complete",
  "You scored",
  "out of",
  "Try Again",
  "Question",
  "of",
  "Correct!",
  "Not quite.",
  "Next Question",
  "See Results",
  "Preparation",
  "Evaluation",
  "Informed Consent",
  "Pre-Procedure",
  "During Procedure",
  "Recovery",
  "Follow-Up",
  "Feeling Prepared",
  "Patient is relaxed and ready for the procedure",
  "Being Evaluated",
  "Doctor conducting thorough assessment",
  "Signing Consent",
  "Understanding and agreeing to treatment",
  "Getting Ready",
  "Positioned comfortably on procedure table",
  "During Injection",
  "Doctor performing the injection with precision",
  "Resting",
  "Relaxing in recovery room, monitored by staff",
  "Feeling Better",
  "Experiencing pain relief and improved mobility",
];

export function getLayoutRuntimeTranslationStrings() {
  const strings = new Set(LAYOUT_STRINGS);

  treatments.forEach((treatment) => {
    if (treatment.navLabel) {
      strings.add(treatment.navLabel);
    }
  });

  procedures.forEach((procedure) => {
    if (procedure.navLabel) {
      strings.add(procedure.navLabel);
    }
  });

  return [...strings];
}

export function getRuntimeTranslationStrings(strings = []) {
  return [...new Set([...getLayoutRuntimeTranslationStrings(), ...strings])];
}
