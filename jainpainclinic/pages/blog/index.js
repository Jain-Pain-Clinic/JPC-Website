import BlogArchivePage from "@/components/blogs/BlogArchivePage";
import SiteLayout from "@/components/layout/SiteLayout";
import Seo from "@/components/shared/Seo";
import { blogs, BLOGS_PER_PAGE, BLOG_ARCHIVE } from "@/data/blogs";
import { getPaginatedItems, getTotalPages } from "@/lib/pagination";

export default function BlogIndexPage({ items, totalPages }) {
  return (
    <>
      <Seo
        title={BLOG_ARCHIVE.seoTitle}
        description={BLOG_ARCHIVE.description}
        canonical={`https://www.jainpainclinic.com${BLOG_ARCHIVE.canonicalPath}`}
        ogImage={BLOG_ARCHIVE.ogImage}
      />

      <SiteLayout showAppointment>
        <BlogArchivePage
          items={items}
          currentPage={1}
          totalPages={totalPages}
          title={BLOG_ARCHIVE.title}
          subtitle={BLOG_ARCHIVE.description}
        />
      </SiteLayout>
    </>
  );
}

export function getStaticProps() {
  return {
    props: {
      items: getPaginatedItems(blogs, 1, BLOGS_PER_PAGE),
      totalPages: getTotalPages(blogs.length, BLOGS_PER_PAGE),
    },
  };
}
