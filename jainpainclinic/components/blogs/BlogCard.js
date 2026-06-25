import Link from "next/link";
import { useI18n } from "@/components/shared/I18nProvider";

export default function BlogCard({ post }) {
  const { t, localizeHref } = useI18n();

  return (
    <article className="blog-card" data-title={post.title} data-tags={post.tags.join(",")}>
      <div className="blog-card__image">
        <img src={post.cardImage} alt={post.cardAlt || post.title} loading="lazy" />
      </div>
      <div className="blog-card__body">
        <span className="blog-card__meta">{post.readTime}</span>
        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__desc">{post.excerpt}</p>
      </div>
      <Link className="blog-card__link" href={localizeHref(`/blog/${post.slug}`)}>
        {t("Read more")} <img src="/assets/arrow-outward.svg" alt="" width="20" height="20" />
      </Link>
    </article>
  );
}
