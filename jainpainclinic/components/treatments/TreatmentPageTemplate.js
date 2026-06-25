import RichTextInline from "@/components/shared/RichTextInline";
import TreatmentCalculator from "@/components/treatments/TreatmentCalculator";
import { useT } from "@/components/shared/I18nProvider";

function RichParagraph({ parts, className }) {
  return (
    <p className={className}>
      <RichTextInline parts={parts} />
    </p>
  );
}

function TreatmentContentBlock({ block, calculator }) {
  if (block.type === "image") {
    return (
      <div className="treatment-content__image">
        <img src={block.src} alt={block.alt} loading="lazy" />
      </div>
    );
  }

  if (block.type === "calculator") {
    if (!calculator?.questions?.length) {
      return null;
    }

    return <TreatmentCalculator title={block.title} questions={calculator.questions} />;
  }

  if (block.type !== "section") {
    return null;
  }

  const ListTag = block.list?.type === "ul" ? "ul" : "ol";

  return (
    <div className="treatment-section">
      <h2>{block.heading}</h2>

      {block.paragraphs.map((paragraph, index) => (
        <RichParagraph key={`${block.heading}-paragraph-${index}`} parts={paragraph} />
      ))}

      {block.list ? (
        <ListTag>
          {block.list.items.map((item, index) => (
            <li key={`${block.heading}-item-${index}`}>
              <RichTextInline parts={item} />
            </li>
          ))}
        </ListTag>
      ) : null}
    </div>
  );
}

export default function TreatmentPageTemplate({ treatment }) {
  const t = useT();

  return (
    <>
      <section className="treatment-hero">
        <div className="wrap">
          <p className="treatment-hero__meta">{treatment.heroMeta}</p>
          <h1 className="treatment-hero__title reveal">{treatment.title}</h1>
          <p className="treatment-hero__subtitle reveal reveal-delay-2">
            {treatment.heroSubtitle}
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="treatment-banner reveal">
          <img src={treatment.bannerImage} alt={treatment.bannerAlt} />
        </div>
      </div>

      <section className="treatment-article">
        <div className="wrap">
          <div className="treatment-content">
            <RichParagraph className="treatment-content__intro" parts={treatment.content.intro} />

            {treatment.content.blocks.map((block, index) => (
              <TreatmentContentBlock
                key={`${treatment.slug}-${block.type}-${index}`}
                block={block}
                calculator={treatment.calculator}
              />
            ))}
          </div>

          <aside className="treatment-sidebar">
            <a className="treatment-sidebar__video" href={treatment.sidebar.videoUrl} target="_blank" rel="noreferrer">
              <img src={treatment.sidebar.videoThumbnail} alt={treatment.sidebar.videoAlt} />
              <span className="treatment-sidebar__video-play">
                <i className="fa-solid fa-play" aria-hidden="true"></i>
              </span>
            </a>
            <h3 className="treatment-sidebar__heading">{treatment.sidebar.heading}</h3>
            <p className="treatment-sidebar__desc">{treatment.sidebar.description}</p>
          </aside>
        </div>
      </section>

      <section className="treatment-offer">
        <div className="wrap">
          <div className="treatment-offer__header">
            <p className="treatment-offer__label">{treatment.offer.label}</p>
            <h2 className="treatment-offer__title reveal">{treatment.offer.title}</h2>
          </div>

          <div className="treatment-offer__grid">
            <div className="treatment-offer__content reveal-left">
              <p className="treatment-offer__text">
                <RichTextInline parts={treatment.offer.intro} />
              </p>

              <div className="treatment-offer__divider"></div>

              <ul className="treatment-offer__checklist">
                {treatment.offer.items.map((item, index) => (
                  <li key={`${treatment.slug}-offer-${index}`}>
                    <img src="/assets/check-circle.svg" alt="" />
                    <span>
                      <RichTextInline parts={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {treatment.offer.image ? (
              <div className="treatment-offer__image reveal-right">
                <img src={treatment.offer.image.src} alt={treatment.offer.image.alt} loading="lazy" />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="treatment-faq">
        <div className="wrap">
          <h2 className="treatment-faq__title reveal">{t("Frequently asked questions")}</h2>

          <div className="treatment-faq__list" id="faqList">
            {treatment.faqs.map((faq, index) => (
              <div
                key={`${treatment.slug}-faq-${index}`}
                className={`treatment-faq__item ${faq.openByDefault ? "is-open" : ""}`}
              >
                <div className="treatment-faq__header">
                  <p className="treatment-faq__q">{faq.question}</p>
                  <button className="treatment-faq__toggle" aria-expanded={faq.openByDefault ? "true" : "false"} aria-label={t("Toggle answer")}>
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <div className="treatment-faq__answer">
                  {faq.answer.map((paragraph, paragraphIndex) => (
                    <RichParagraph
                      key={`${treatment.slug}-faq-${index}-paragraph-${paragraphIndex}`}
                      parts={paragraph}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
