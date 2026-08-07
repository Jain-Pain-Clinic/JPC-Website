import RichTextInline from "@/components/shared/RichTextInline";
import { useT } from "@/components/shared/I18nProvider";

function InlineContent({ value }) {
  if (Array.isArray(value)) {
    return <RichTextInline parts={value} />;
  }

  return value;
}

function getFaqAnswerParagraphs(answer) {
  if (Array.isArray(answer)) {
    return answer;
  }

  return answer ? [answer] : [];
}

function ContentBlock({ block }) {
  if (block.type === "image") {
    return (
      <figure className="blog-post-content__image">
        <img
          src={block.src}
          alt={block.alt}
          width="960"
          height="400"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
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

      {block.paragraphs?.map((paragraph, index) => (
        <p key={`${block.heading}-paragraph-${index}`}>
          <InlineContent value={paragraph} />
        </p>
      ))}

      {block.subSections?.map((subSection) => (
        <div key={subSection.heading} className="blog-post-subsection">
          <h3>{subSection.heading}</h3>
          {subSection.paragraphs.map((paragraph, index) => (
            <p key={`${subSection.heading}-paragraph-${index}`}>
              <InlineContent value={paragraph} />
            </p>
          ))}
        </div>
      ))}

      {block.list ? (
        <ListTag>
          {block.list.items.map((item, index) => (
            <li key={`${block.heading}-item-${index}`}>
              <InlineContent value={item} />
            </li>
          ))}
        </ListTag>
      ) : null}

      {block.quote ? (
        <blockquote>
          <p>
            <InlineContent value={block.quote} />
          </p>
        </blockquote>
      ) : null}
    </section>
  );
}

function BlogFaqs({ post }) {
  const t = useT();

  if (!post.faqs?.length) {
    return null;
  }

  return (
    <section className="blog-post-faq treatment-faq" aria-labelledby="blogFaqTitle">
      <h2 id="blogFaqTitle" className="treatment-faq__title reveal">
        {t("Frequently asked questions")}
      </h2>

      <div className="treatment-faq__list" id="faqList">
        {post.faqs.map((faq, index) => (
          <div
            key={`${post.slug}-faq-${index}`}
            className={`treatment-faq__item ${faq.openByDefault ? "is-open" : ""}`}
          >
            <div className="treatment-faq__header">
              <p className="treatment-faq__q">{faq.question}</p>
              <button
                className="treatment-faq__toggle"
                aria-expanded={faq.openByDefault ? "true" : "false"}
                aria-label={t("Toggle answer")}
                type="button"
              >
                <i className="fa-solid fa-plus" aria-hidden="true"></i>
              </button>
            </div>

            <div className="treatment-faq__answer">
              {getFaqAnswerParagraphs(faq.answer).map((paragraph, paragraphIndex) => (
                <p key={`${post.slug}-faq-${index}-paragraph-${paragraphIndex}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function BlogResources({ resources = [] }) {
  if (!resources.length) {
    return null;
  }

  return (
    <section className="blog-post-resources" aria-labelledby="blogResourcesTitle">
      <h2 id="blogResourcesTitle">Resources</h2>
      <ul>
        {resources.map((resource) => (
          <li key={resource.href}>
            <a href={resource.href} target="_blank" rel="noopener noreferrer">
              {resource.title}
            </a>
            {resource.source ? <span>{resource.source}</span> : null}
          </li>
        ))}
      </ul>
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
              <img
                className="blog-post-hero__author-avatar"
                src={post.authorImage}
                alt=""
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
              />
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
          <img
            src={post.bannerImage}
            alt={post.bannerAlt}
            width="1200"
            height="496"
            decoding="async"
            fetchPriority="high"
          />
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

            <BlogResources resources={post.resources} />

            <BlogFaqs post={post} />

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
