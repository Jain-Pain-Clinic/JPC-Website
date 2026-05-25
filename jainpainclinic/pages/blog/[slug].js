import Head from "next/head";
import BlogArchivePage from "@/components/blogs/BlogArchivePage";
import BlogPostTemplate from "@/components/blogs/BlogPostTemplate";
import SiteLayout from "@/components/layout/SiteLayout";
import Seo from "@/components/shared/Seo";
import { blogs, BLOGS_PER_PAGE, BLOG_ARCHIVE, getBlogBySlug } from "@/data/blogs";
import { getPaginatedItems, getTotalPages } from "@/lib/pagination";

export default function BlogSlugPage(props) {
  if (props.kind === "archive") {
    return (
      <>
        <Seo
          title={`${BLOG_ARCHIVE.title} - Page ${props.currentPage} | Jain Pain Clinic Gurugram`}
          description={BLOG_ARCHIVE.description}
          canonical={`https://www.jainpainclinic.com/blog/page-${props.currentPage}`}
          ogImage={BLOG_ARCHIVE.ogImage}
        />

        <SiteLayout showAppointment>
          <BlogArchivePage
            items={props.items}
            currentPage={props.currentPage}
            totalPages={props.totalPages}
            title={BLOG_ARCHIVE.title}
            subtitle={BLOG_ARCHIVE.description}
          />
        </SiteLayout>
      </>
    );
  }

  const { post } = props;

  return (
    <>
      <Seo
        title={post.seoTitle}
        description={post.description}
        canonical={`https://www.jainpainclinic.com/blog/${post.slug}`}
        ogImage={`https://www.jainpainclinic.com${post.ogImage}`}
      />
      <Head>
        <meta name="keywords" content={post.keywords} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta
          name="twitter:image"
          content={`https://www.jainpainclinic.com${post.ogImage}`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.description,
              image: `https://www.jainpainclinic.com${post.ogImage}`,
              datePublished: post.publishedAt,
              dateModified: post.publishedAt,
              author: {
                "@type": "Person",
                name: post.author,
                url: "https://www.jainpainclinic.com/about",
              },
              publisher: {
                "@type": "Organization",
                name: "Jain Pain Clinic",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.jainpainclinic.com/assets/logo.png",
                },
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.jainpainclinic.com${post.canonicalPath}`,
              },
            }),
          }}
        />
      </Head>

      <SiteLayout showAppointment>
        <BlogPostTemplate post={post} />
      </SiteLayout>
    </>
  );
}

export function getStaticPaths() {
  const totalPages = getTotalPages(blogs.length, BLOGS_PER_PAGE);
  const archivePaths = Array.from({ length: totalPages - 1 }, (_, index) => ({
    params: { slug: `page-${index + 2}` },
  }));

  return {
    paths: [
      ...blogs.map((post) => ({
        params: { slug: post.slug },
      })),
      ...archivePaths,
    ],
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const totalPages = getTotalPages(blogs.length, BLOGS_PER_PAGE);

  if (params.slug.startsWith("page-")) {
    const currentPage = Number(params.slug.replace("page-", ""));

    if (!Number.isInteger(currentPage) || currentPage < 2 || currentPage > totalPages) {
      return { notFound: true };
    }

    return {
      props: {
        kind: "archive",
        items: getPaginatedItems(blogs, currentPage, BLOGS_PER_PAGE),
        currentPage,
        totalPages,
      },
    };
  }

  const post = getBlogBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      kind: "post",
      post,
    },
  };
}
