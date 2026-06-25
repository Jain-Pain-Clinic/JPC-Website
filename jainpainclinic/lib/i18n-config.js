export const DEFAULT_LOCALE = "en";

export const LOCALES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
];

export const TARGET_LOCALES = LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE);

export const LOCALE_CODES = LOCALES.map((locale) => locale.code);

export const UI_STRINGS = [
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
  "Consult now",
  "Toggle menu",
  "Languages",
  "Locations",
  "All rights reserved.",
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
  "Search posts by title…",
  "No posts match your search.",
  "Previous",
  "Next",
  "Blog pages",
  "Read more",
  "Tagged:",
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
  "Preparation",
  "Feeling Prepared",
  "Patient is relaxed and ready for the procedure",
  "Evaluation",
  "Being Evaluated",
  "Doctor conducting thorough assessment",
  "Informed Consent",
  "Signing Consent",
  "Understanding and agreeing to treatment",
  "Pre-Procedure",
  "Getting Ready",
  "Positioned comfortably on procedure table",
  "During Procedure",
  "During Injection",
  "Doctor performing the injection with precision",
  "Recovery",
  "Resting",
  "Relaxing in recovery room, monitored by staff",
  "Follow-Up",
  "Feeling Better",
  "Experiencing pain relief and improved mobility",
  "Key Points",
  "What to Expect",
  "Helpful Tips",
  "Stage",
  "Swipe to explore stages",
  "Prev",
  "Question",
  "of",
  "Excellent!",
  "Good effort!",
  "Keep learning!",
  "Quiz complete",
  "You scored",
  "out of",
  "Correct!",
  "Not quite.",
  "Next Question",
  "See Results",
];

export function getLocaleMeta(locale = DEFAULT_LOCALE) {
  return LOCALES.find((item) => item.code === locale) || LOCALES[0];
}

export function normalizeTranslationText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

export function isSupportedLocale(locale) {
  return LOCALE_CODES.includes(locale);
}

export function stripLocaleFromPath(pathname = "/") {
  const [pathWithoutHash, hash = ""] = pathname.split("#");
  const [pathWithoutQuery, query = ""] = pathWithoutHash.split("?");
  const segments = pathWithoutQuery.split("/").filter(Boolean);

  if (segments.length && isSupportedLocale(segments[0]) && segments[0] !== DEFAULT_LOCALE) {
    segments.shift();
  }

  const barePath = `/${segments.join("/")}`.replace(/\/$/, "") || "/";
  const queryPart = query ? `?${query}` : "";
  const hashPart = hash ? `#${hash}` : "";

  return `${barePath}${queryPart}${hashPart}`;
}

export function localizePath(pathname = "/", locale = DEFAULT_LOCALE) {
  if (!pathname || /^(https?:|mailto:|tel:|#)/.test(pathname)) {
    return pathname;
  }

  const basePath = stripLocaleFromPath(pathname);

  if (locale === DEFAULT_LOCALE) {
    return basePath;
  }

  if (basePath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${basePath}`;
}

export function getCanonicalUrl(pathname = "/", locale = DEFAULT_LOCALE) {
  return `https://www.jainpainclinic.com${localizePath(pathname, locale)}`;
}
