import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { Manrope, Noto_Sans_Arabic, Noto_Sans_Devanagari } from "next/font/google";
import { I18nProvider } from "@/components/shared/I18nProvider";
import { DEFAULT_LOCALE, getLocaleMeta } from "@/lib/i18n";
import "@/styles/globals.css";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "GTM-NRQQSQST";
const GTM_LOAD_DELAY_MS = 2000;
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});
const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

function getElementText(element) {
  return element.textContent?.replace(/\s+/g, " ").trim() || "";
}

function pushDataLayerEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    page_path: window.location.pathname + window.location.search,
    ...params,
  });
}

function GoogleTagManager() {
  const router = useRouter();

  useEffect(() => {
    if (!GTM_CONTAINER_ID) {
      return undefined;
    }

    window.dataLayer = window.dataLayer || [];

    const handleRouteChange = (url) => {
      pushDataLayerEvent("page_view", {
        page_path: url,
      });
    };

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const appointmentButton = event.target.closest(".appointment-submit");

      if (appointmentButton) {
        pushDataLayerEvent("book_appointment_button_click", {
          event_category: "lead",
          button_text: getElementText(appointmentButton),
        });

        return;
      }

      const link = event.target.closest("a[href]");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href") || "";
      const linkText = getElementText(link);
      const commonParams = {
        event_category: "lead",
        link_text: linkText,
        link_url: link.href,
      };

      if (href === "#contact" || href === "#contact-form" || href.endsWith("/#contact")) {
        pushDataLayerEvent("book_appointment_click", commonParams);
        return;
      }

      if (href.startsWith("tel:")) {
        pushDataLayerEvent("call_us_click", {
          ...commonParams,
          phone_number: href.replace("tel:", ""),
        });
        return;
      }

      if (href.includes("wa.me/") || href.includes("api.whatsapp.com/")) {
        pushDataLayerEvent("consult_now_click", commonParams);
      }
    };

    const handleSubmit = (event) => {
      if (!event.target.classList?.contains("appointment-form")) {
        return;
      }

      pushDataLayerEvent("book_appointment_submit", {
        event_category: "lead",
        form_action: event.target.getAttribute("action") || "",
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit, true);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, [router.events]);

  if (!GTM_CONTAINER_ID) {
    return null;
  }

  return (
    <Script id="google-tag-manager" strategy="lazyOnload">
      {`
        (function() {
          window.dataLayer = window.dataLayer || [];

          if (window.__jpcGtmLoaded || window.__jpcGtmTimer) {
            return;
          }

          function loadGoogleTagManager() {
            if (window.__jpcGtmLoaded) {
              return;
            }

            window.__jpcGtmTimer = null;
            window.__jpcGtmLoaded = true;

            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');
          }

          function scheduleGoogleTagManager() {
            if (window.__jpcGtmLoaded || window.__jpcGtmTimer) {
              return;
            }

            window.__jpcGtmTimer = window.setTimeout(loadGoogleTagManager, ${GTM_LOAD_DELAY_MS});
          }

          if (document.readyState === 'complete') {
            scheduleGoogleTagManager();
          } else {
            window.addEventListener('load', scheduleGoogleTagManager, { once: true });
          }
        })();
      `}
    </Script>
  );
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const locale = pageProps.locale || DEFAULT_LOCALE;
  const localeMeta = getLocaleMeta(locale);
  const localeFontClass =
    locale === "hi" ? devanagari.className : locale === "ar" ? arabic.className : manrope.className;

  useEffect(() => {
    document.documentElement.lang = localeMeta.code;
    document.documentElement.dir = localeMeta.dir;
  }, [localeMeta.code, localeMeta.dir]);

  useEffect(() => {
    const closeLanguageDropdowns = () => {
      document.querySelectorAll(".language-dropdown[open]").forEach((dropdown) => {
        dropdown.removeAttribute("open");
      });
    };

    const handlePointerDown = (event) => {
      if (!(event.target instanceof Element) || event.target.closest(".language-dropdown")) {
        return;
      }

      closeLanguageDropdowns();
    };

    const handleClick = (event) => {
      if (event.target instanceof Element && event.target.closest(".language-dropdown__menu a")) {
        closeLanguageDropdowns();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLanguageDropdowns();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    router.events.on("routeChangeStart", closeLanguageDropdowns);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
      router.events.off("routeChangeStart", closeLanguageDropdowns);
    };
  }, [router.events]);

  return (
    <I18nProvider locale={locale}>
      <div className={localeFontClass}>
        <GoogleTagManager />
        <Component {...pageProps} />
      </div>
    </I18nProvider>
  );
}
