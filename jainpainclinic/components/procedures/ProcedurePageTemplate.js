import ProcedureJourney from "@/components/procedures/ProcedureJourney";
import ProcedureQuiz from "@/components/procedures/ProcedureQuiz";
import { useT } from "@/components/shared/I18nProvider";

function ProcedureFaq({ procedure }) {
  const t = useT();

  return (
    <section className="treatment-faq">
      <div className="wrap">
        <h2 className="treatment-faq__title reveal">{t("Frequently asked questions")}</h2>

        <div className="treatment-faq__list" id="faqList">
          {procedure.faqs.map((faq, index) => (
            <div
              key={`${procedure.slug}-faq-${index}`}
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
                {faq.answer.map((paragraph, paragraphIndex) => (
                  <p key={`${procedure.slug}-faq-${index}-paragraph-${paragraphIndex}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ProcedurePageTemplate({ procedure }) {
  return (
    <>
      <section className="treatment-hero">
        <div className="wrap">
          <h1 className="treatment-hero__title reveal">{procedure.title}</h1>
          <p className="treatment-hero__subtitle reveal reveal-delay-2">{procedure.heroSubtitle}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="treatment-banner reveal">
          <img src={procedure.bannerImage} alt={procedure.bannerAlt} />
        </div>
      </div>

      <ProcedureJourney key={procedure.slug} procedure={procedure} />

      <section className="quiz-video">
        <div className="wrap">
          <div className="quiz-video__header">
            <p className="quiz-video__subtitle">{procedure.quizSubtitle}</p>
            <h2 className="quiz-video__title">{procedure.quizTitle}</h2>
          </div>

          <div className="quiz-video__grid">
            <ProcedureQuiz questions={procedure.quizQuestions} />

            <aside className="proc-sidebar">
              <a className="proc-sidebar__video" href={procedure.videoUrl} target="_blank" rel="noreferrer">
                <img src={procedure.videoThumbnail} alt={procedure.videoAlt} />
                <span className="proc-sidebar__video-play">
                  <i className="fa-solid fa-play" aria-hidden="true"></i>
                </span>
              </a>
              <h3 className="proc-sidebar__heading">{procedure.videoHeading}</h3>
              <p className="proc-sidebar__desc">{procedure.videoDescription}</p>
            </aside>
          </div>
        </div>
      </section>

      <ProcedureFaq procedure={procedure} />
    </>
  );
}
