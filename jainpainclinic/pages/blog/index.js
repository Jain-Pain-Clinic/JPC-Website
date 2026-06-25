import BlogArchivePage from "@/components/blogs/BlogArchivePage";
import SiteLayout from "@/components/layout/SiteLayout";
import Seo from "@/components/shared/Seo";
import { blogs, BLOGS_PER_PAGE, BLOG_ARCHIVE } from "@/data/blogs";
import { getLocaleFromContext, translatePageProps, withLocaleProps } from "@/lib/page-i18n.server";
import { getPaginatedItems, getTotalPages } from "@/lib/pagination";

export default function BlogIndexPage({ items, totalPages, archive = BLOG_ARCHIVE, locale = "en" }) {
  return (
    <>
      <Seo
        title={archive.seoTitle}
        description={archive.description}
        canonicalPath={BLOG_ARCHIVE.canonicalPath}
        locale={locale}
        ogImage={archive.ogImage}
      />

      <SiteLayout showAppointment>
        <BlogArchivePage
          items={items}
          currentPage={1}
          totalPages={totalPages}
          title={archive.title}
          subtitle={archive.description}
        />
      </SiteLayout>
    </>
  );
}

export function getStaticProps(context) {
  const locale = getLocaleFromContext(context);
  const props = {
    items: getPaginatedItems(blogs, 1, BLOGS_PER_PAGE),
    totalPages: getTotalPages(blogs.length, BLOGS_PER_PAGE),
    archive: BLOG_ARCHIVE,
  };

  return {
    props: withLocaleProps(translatePageProps(props, locale), locale),
  };
}
