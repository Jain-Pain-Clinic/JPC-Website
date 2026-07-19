import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import { Manrope } from "next/font/google";
import { I18nProvider } from "@/components/shared/I18nProvider";
import { DEFAULT_LOCALE, getLocaleMeta } from "@/lib/i18n";
import "@/styles/globals.css";

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "GTM-NRQQSQST";
const GTM_LOAD_DELAY_MS = 2000;
const REVEAL_SELECTOR = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
const REVEAL_VIEWPORT_OFFSET = 96;
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
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

function isRevealInRange(element) {
  const rect = element.getBoundingClientRect();

  return rect.top <= window.innerHeight + REVEAL_VIEWPORT_OFFSET && rect.bottom >= -REVEAL_VIEWPORT_OFFSET;
}

function revealElement(element) {
  element.classList.add("is-visible");
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
  const clientTranslations = pageProps.clientTranslations || {};
  const localeMeta = getLocaleMeta(locale);

  useEffect(() => {
    document.documentElement.lang = localeMeta.code;
    document.documentElement.dir = localeMeta.dir;
  }, [localeMeta.code, localeMeta.dir]);

  useEffect(() => {
    let observer = null;
    let rafId = null;

    const getHiddenRevealElements = () =>
      Array.from(document.querySelectorAll(REVEAL_SELECTOR)).filter((element) => !element.classList.contains("is-visible"));

    const revealVisibleElements = () => {
      getHiddenRevealElements().forEach((element) => {
        if (isRevealInRange(element)) {
          revealElement(element);
          observer?.unobserve(element);
        }
      });
    };

    const initRevealObserver = () => {
      observer?.disconnect();
      observer = null;

      const elements = getHiddenRevealElements();
      if (!elements.length) {
        return;
      }

      const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (shouldReduceMotion || !("IntersectionObserver" in window)) {
        elements.forEach(revealElement);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || isRevealInRange(entry.target)) {
              revealElement(entry.target);
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: "96px 0px 96px 0px" }
      );

      elements.forEach((element) => {
        if (isRevealInRange(element)) {
          revealElement(element);
        } else {
          observer.observe(element);
        }
      });
    };

    const scheduleRevealRefresh = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        initRevealObserver();
        revealVisibleElements();
      });
    };

    scheduleRevealRefresh();

    router.events.on("routeChangeComplete", scheduleRevealRefresh);
    window.addEventListener("load", scheduleRevealRefresh);
    window.addEventListener("pageshow", scheduleRevealRefresh);
    window.addEventListener("scroll", revealVisibleElements, { passive: true });
    window.addEventListener("resize", revealVisibleElements);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      observer?.disconnect();
      router.events.off("routeChangeComplete", scheduleRevealRefresh);
      window.removeEventListener("load", scheduleRevealRefresh);
      window.removeEventListener("pageshow", scheduleRevealRefresh);
      window.removeEventListener("scroll", revealVisibleElements);
      window.removeEventListener("resize", revealVisibleElements);
    };
  }, [router.events]);

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
    <I18nProvider locale={locale} translations={clientTranslations}>
      <div className={manrope.className}>
        <GoogleTagManager />
        <Component {...pageProps} />
      </div>
    </I18nProvider>
  );
}
