import { useMemo, useState } from "react";
import Link from "next/link";
import BlogCard from "@/components/blogs/BlogCard";
import { useI18n } from "@/components/shared/I18nProvider";

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis-start", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", totalPages];
}

function Pagination({ currentPage, totalPages }) {
  const { t, localizeHref } = useI18n();

  if (totalPages <= 1) {
    return null;
  }

  const paginationItems = getPaginationItems(currentPage, totalPages);
  const previousHref = currentPage === 2 ? "/blog" : `/blog/page-${currentPage - 1}`;
  const nextHref = `/blog/page-${currentPage + 1}`;

  return (
    <nav className="blog-pagination" aria-label={t("Blog pages")}>
      {currentPage > 1 ? (
        <Link href={localizeHref(previousHref)} className="blog-pagination__nav blog-pagination__nav--prev">
          <span aria-hidden="true">←</span>
          <span>{t("Previous")}</span>
        </Link>
      ) : (
        <span className="blog-pagination__nav blog-pagination__nav--disabled">
          <span aria-hidden="true">←</span>
          <span>{t("Previous")}</span>
        </span>
      )}

      <div className="blog-pagination__pages">
        {paginationItems.map((item, index) => {
          if (typeof item !== "number") {
            return (
              <span key={`${item}-${index}`} className="blog-pagination__ellipsis" aria-hidden="true">
                ...
              </span>
            );
          }

          const href = item === 1 ? "/blog" : `/blog/page-${item}`;

          return (
            <Link
              key={item}
              href={localizeHref(href)}
              aria-current={item === currentPage ? "page" : undefined}
              className={`blog-pagination__link ${item === currentPage ? "is-current" : ""}`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link href={localizeHref(nextHref)} className="blog-pagination__nav blog-pagination__nav--next">
          <span>{t("Next")}</span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <span className="blog-pagination__nav blog-pagination__nav--disabled">
          <span>{t("Next")}</span>
          <span aria-hidden="true">→</span>
        </span>
      )}
    </nav>
  );
}

export default function BlogArchivePage({
  items,
  currentPage = 1,
  totalPages = 1,
  title,
  subtitle,
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
      return items;
    }

    return items.filter((item) => {
      const haystack = [item.title, item.excerpt, ...(item.tags || [])]
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchTerm);
    });
  }, [items, query]);

  return (
    <>
      <section className="blog-hero">
        <div className="wrap">
          <h1 className="blog-hero__title">{title}</h1>
          <p className="blog-hero__subtitle">{subtitle}</p>
        </div>
      </section>

      <div className="blog-scroll-icon">
        <img src="/assets/scroll-icon.svg" alt="" width="32" height="58" />
      </div>

      <section className="blog-filter-bar-section">
        <div className="wrap">
          <div className="blog-search-wrap">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input
              id="blog-search"
              type="search"
              placeholder={t("Search posts by title…")}
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="blog-posts">
        <div className="wrap">
          <div className="blog-grid reveal">
            {filteredItems.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
            {!filteredItems.length ? (
              <p className="blog-no-results" style={{ display: "block" }}>
                {t("No posts match your search.")}
              </p>
            ) : null}
          </div>
          {!query.trim() ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          ) : null}
        </div>
      </section>
    </>
  );
}
