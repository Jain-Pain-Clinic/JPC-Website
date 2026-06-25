import HomePage, { getStaticProps as getHomeStaticProps } from "@/pages/index";
import AboutPage, { getStaticProps as getAboutStaticProps } from "@/pages/about";
import ContactPage, { getStaticProps as getContactStaticProps } from "@/pages/contact-us";
import ExercisePage, { getStaticProps as getExerciseStaticProps } from "@/pages/exercise";
import BlogIndexPage, { getStaticProps as getBlogIndexStaticProps } from "@/pages/blog";
import BlogSlugPage, { getStaticProps as getBlogSlugStaticProps } from "@/pages/blog/[slug]";
import TreatmentPage, { getStaticProps as getTreatmentStaticProps } from "@/pages/treatments/[slug]";
import ProcedurePage, { getStaticProps as getProcedureStaticProps } from "@/pages/procedures/[slug]";
import { blogs, BLOGS_PER_PAGE } from "@/data/blogs";
import { procedures } from "@/data/procedures";
import { treatments } from "@/data/treatments";
import { TARGET_LOCALES, isSupportedLocale } from "@/lib/i18n";
import { getTotalPages } from "@/lib/pagination";

const PAGE_COMPONENTS = {
  home: HomePage,
  about: AboutPage,
  contact: ContactPage,
  exercise: ExercisePage,
  blogIndex: BlogIndexPage,
  blogSlug: BlogSlugPage,
  treatment: TreatmentPage,
  procedure: ProcedurePage,
};

export default function LocalizedPage({ pageKind, ...props }) {
  const Component = PAGE_COMPONENTS[pageKind];

  if (!Component) {
    return null;
  }

  return <Component {...props} />;
}

export function getStaticPaths() {
  const totalBlogPages = getTotalPages(blogs.length, BLOGS_PER_PAGE);
  const localizedPaths = [];

  for (const locale of TARGET_LOCALES) {
    localizedPaths.push({ params: { locale: locale.code, path: [] } });
    localizedPaths.push({ params: { locale: locale.code, path: ["about"] } });
    localizedPaths.push({ params: { locale: locale.code, path: ["contact-us"] } });
    localizedPaths.push({ params: { locale: locale.code, path: ["exercise"] } });
    localizedPaths.push({ params: { locale: locale.code, path: ["blog"] } });

    for (let page = 2; page <= totalBlogPages; page += 1) {
      localizedPaths.push({ params: { locale: locale.code, path: ["blog", `page-${page}`] } });
    }

    for (const post of blogs) {
      localizedPaths.push({ params: { locale: locale.code, path: ["blog", post.slug] } });
    }

    for (const treatment of treatments) {
      localizedPaths.push({ params: { locale: locale.code, path: ["treatments", treatment.slug] } });
    }

    for (const procedure of procedures) {
      localizedPaths.push({ params: { locale: locale.code, path: ["procedures", procedure.slug] } });
    }
  }

  return {
    paths: localizedPaths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { locale, path = [] } = context.params || {};

  if (!isSupportedLocale(locale) || locale === "en") {
    return { notFound: true };
  }

  const route = Array.isArray(path) ? path : [];
  const localeContext = { ...context, params: { ...context.params, locale } };
  let result;
  let pageKind;

  if (route.length === 0) {
    result = await getHomeStaticProps(localeContext);
    pageKind = "home";
  } else if (route.length === 1 && route[0] === "about") {
    result = await getAboutStaticProps(localeContext);
    pageKind = "about";
  } else if (route.length === 1 && route[0] === "contact-us") {
    result = await getContactStaticProps(localeContext);
    pageKind = "contact";
  } else if (route.length === 1 && route[0] === "exercise") {
    result = await getExerciseStaticProps(localeContext);
    pageKind = "exercise";
  } else if (route.length === 1 && route[0] === "blog") {
    result = getBlogIndexStaticProps(localeContext);
    pageKind = "blogIndex";
  } else if (route.length === 2 && route[0] === "blog") {
    result = getBlogSlugStaticProps({ ...localeContext, params: { ...localeContext.params, slug: route[1] } });
    pageKind = "blogSlug";
  } else if (route.length === 2 && route[0] === "treatments") {
    result = getTreatmentStaticProps({ ...localeContext, params: { ...localeContext.params, slug: route[1] } });
    pageKind = "treatment";
  } else if (route.length === 2 && route[0] === "procedures") {
    result = getProcedureStaticProps({ ...localeContext, params: { ...localeContext.params, slug: route[1] } });
    pageKind = "procedure";
  } else {
    return { notFound: true };
  }

  if (result?.notFound) {
    return result;
  }

  return {
    ...result,
    props: {
      ...(result.props || {}),
      pageKind,
    },
  };
}
