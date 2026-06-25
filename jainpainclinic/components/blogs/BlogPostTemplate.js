import { useT } from "@/components/shared/I18nProvider";

function ContentBlock({ block }) {
  if (block.type === "image") {
    return (
      <figure className="blog-post-content__image">
        <img src={block.src} alt={block.alt} loading="lazy" />
      </figure>
    );
  }

  if (block.type !== "section") {
    return null;
  }

  const ListTag = block.list?.type === "ol" ? "ol" : "ul";

  return (
    <section className="blog-post-section">
      <h2>{block.heading}</h2>

      {block.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {block.subSections?.map((subSection) => (
        <div key={subSection.heading} className="blog-post-subsection">
          <h3>{subSection.heading}</h3>
          {subSection.paragraphs.map((paragraph) => (
            <p key={`${subSection.heading}-${paragraph}`}>{paragraph}</p>
          ))}
        </div>
      ))}

      {block.list ? (
        <ListTag>
          {block.list.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ListTag>
      ) : null}

      {block.quote ? (
        <blockquote>
          <p>{block.quote}</p>
        </blockquote>
      ) : null}
    </section>
  );
}

export default function BlogPostTemplate({ post }) {
  const t = useT();

  return (
    <>
      <section className="blog-post-hero">
        <div className="wrap">
          <div className="blog-post-hero__meta">
            <span className="blog-post-hero__category">{post.category}</span>
            <span className="blog-post-hero__readtime">{post.readTime}</span>
          </div>

          <h1 className="blog-post-hero__title reveal">{post.title}</h1>
          <p className="blog-post-hero__subtitle reveal reveal-delay-2">{post.heroSubtitle}</p>

          <div className="blog-post-hero__byline">
            <span className="blog-post-hero__author">
              <img className="blog-post-hero__author-avatar" src={post.authorImage} alt="" />
              {post.author}
            </span>
            <time className="blog-post-hero__date" dateTime={post.publishedAt}>
              {post.publishedLabel}
            </time>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="blog-post-banner reveal">
          <img src={post.bannerImage} alt={post.bannerAlt} />
        </div>
      </div>

      <article className="blog-post-article" itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={post.title} />
        <meta itemProp="datePublished" content={post.publishedAt} />
        <meta itemProp="author" content={post.author} />

        <div className="wrap">
          <div className="blog-post-content">
            <p className="blog-post-content__intro">{post.content.intro}</p>
            {post.content.blocks.map((block, index) => (
              <ContentBlock key={`${block.type}-${index}`} block={block} />
            ))}

            <div className="blog-post-tags">
              <span className="blog-post-tags__label">{t("Tagged:")}</span>
              {post.tags.map((tag) => (
                <span key={tag} className="blog-post-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
