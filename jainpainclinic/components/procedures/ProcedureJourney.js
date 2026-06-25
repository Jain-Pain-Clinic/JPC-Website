import { useState } from "react";
import { useT } from "@/components/shared/I18nProvider";

const STAGES = [
  {
    id: "preparation",
    title: "Preparation",
    number: 1,
    icon: "clipboard-check",
    state: "Feeling Prepared",
    stateDesc: "Patient is relaxed and ready for the procedure",
    image: "/assets/how-we-treat/preparing.jpg",
  },
  {
    id: "evaluation",
    title: "Evaluation",
    number: 2,
    icon: "user-check",
    state: "Being Evaluated",
    stateDesc: "Doctor conducting thorough assessment",
    image: "/assets/how-we-treat/evaluate.jpg",
  },
  {
    id: "consent",
    title: "Informed Consent",
    number: 3,
    icon: "file-text",
    state: "Signing Consent",
    stateDesc: "Understanding and agreeing to treatment",
    image: "/assets/how-we-treat/consent.jpg",
  },
  {
    id: "pre-procedure",
    title: "Pre-Procedure",
    number: 4,
    icon: "activity",
    state: "Getting Ready",
    stateDesc: "Positioned comfortably on procedure table",
    image: "/assets/how-we-treat/preop.jpg",
  },
  {
    id: "procedure",
    title: "During Procedure",
    number: 5,
    icon: "syringe",
    state: "During Injection",
    stateDesc: "Doctor performing the injection with precision",
    image: "/assets/how-we-treat/surgery.jpg",
  },
  {
    id: "recovery",
    title: "Recovery",
    number: 6,
    icon: "heart-pulse",
    state: "Resting",
    stateDesc: "Relaxing in recovery room, monitored by staff",
    image: "/assets/how-we-treat/recovery.jpg",
  },
  {
    id: "follow-up",
    title: "Follow-Up",
    number: 7,
    icon: "calendar",
    state: "Feeling Better",
    stateDesc: "Experiencing pain relief and improved mobility",
    image: "/assets/how-we-treat/followup.jpg",
  },
];

function Icon({ name, size = 24 }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  if (name === "clipboard-check") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    );
  }

  if (name === "user-check") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <polyline points="16 11 18 13 22 9" />
      </svg>
    );
  }

  if (name === "file-text") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );
  }

  if (name === "activity") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }

  if (name === "syringe") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
        <path d="m9 11 4 4" />
        <path d="m5 19-3 3" />
        <path d="m14 4 6 6" />
      </svg>
    );
  }

  if (name === "heart-pulse") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <path d="M19.5 12.572 12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 0 1 7.5 6.566Z" />
        <path d="M12 6l1 5h2l1-3 1 3h2l1-5" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }

  if (name === "check-circle") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    );
  }

  if (name === "info") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    );
  }

  if (name === "chevron-left") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" {...commonProps}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PatientCard({ stage, large }) {
  const t = useT();

  return (
    <div className="journey-patient">
      <img src={stage.image} alt={t(stage.state)} className="journey-patient__img" />
      <div className="journey-patient__badge">{t(stage.state)}</div>
      {large ? <p className="journey-patient__desc">{t(stage.stateDesc)}</p> : null}
    </div>
  );
}

function StageContent({ content }) {
  const t = useT();

  return (
    <>
      <h3 className="journey-content__title">{content.title}</h3>
      <p className="journey-content__desc">{content.description}</p>

      <div className="journey-duration">
        <Icon name="clock" size={16} />
        <span>{content.duration}</span>
      </div>

      <div className="journey-keypoints">
        <h4 className="journey-keypoints__title">
          <Icon name="check-circle" size={20} />
          {t("Key Points")}
        </h4>

        {content.keyPoints.map((point, index) => (
          <div key={`${content.title}-point-${index}`} className="journey-keypoint">
            <div className="journey-keypoint__dot">
              <div className="journey-keypoint__dot-inner"></div>
            </div>
            <p className="journey-keypoint__text">{point}</p>
          </div>
        ))}
      </div>

      <div className="journey-info">
        <h4 className="journey-info__title">
          <Icon name="info" size={20} />
          {t("What to Expect")}
        </h4>
        <p className="journey-info__text">{content.whatToExpect}</p>
      </div>

      {content.tips?.length ? (
        <div className="journey-info">
          <h4 className="journey-info__title">
            <Icon name="check-circle" size={20} />
            {t("Helpful Tips")}
          </h4>
          <ul className="journey-tips">
            {content.tips.map((tip, index) => (
              <li key={`${content.title}-tip-${index}`}>
                <Icon name="check" size={16} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

export default function ProcedureJourney({ procedure }) {
  const t = useT();
  const [activeStageId, setActiveStageId] = useState(STAGES[0].id);
  const activeIndex = STAGES.findIndex((stage) => stage.id === activeStageId);
  const activeStage = STAGES[activeIndex];
  const activeContent = procedure.journeyContent[activeStageId];
  const fillHeight = `${(activeIndex / (STAGES.length - 1)) * 100}%`;

  return (
    <section className="journey">
      <div className="wrap">
        <div className="journey__header">
          <p className="journey__subtitle">{procedure.journeySubtitle}</p>
          <h2 className="journey__title">{procedure.journeyTitle}</h2>
        </div>

        <div className="journey__desktop">
          <div className="journey-sidebar">
            <div className="journey-stage-list">
              <div className="journey-stage-line">
                <div className="journey-stage-line__fill" style={{ height: fillHeight }}></div>
              </div>

              {STAGES.map((stage, index) => {
                const stateClass =
                  stage.id === activeStageId ? "active" : index < activeIndex ? "past" : "future";

                return (
                  <button
                    key={stage.id}
                    className={`journey-stage-btn ${stateClass}`}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                  >
                    <div className="journey-stage-icon">
                      {index < activeIndex && stage.id !== activeStageId ? (
                        <Icon name="check" />
                      ) : (
                        <Icon name={stage.icon} />
                      )}
                    </div>

                    <div className="journey-stage-label">
                      <div className="journey-stage-number">{t("Stage")} {stage.number}</div>
                      <div className="journey-stage-name">{t(stage.title)}</div>
                    </div>

                    <div className="journey-stage-bar"></div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="journey-content">
            <StageContent content={activeContent} />
          </div>

          <div className="journey-patient-col">
            <PatientCard stage={activeStage} large />
          </div>
        </div>

        <div className="journey__mobile">
          <div className="journey-m-scroller">
            <div className="journey-m-row">
              {STAGES.map((stage, index) => {
                const stateClass =
                  stage.id === activeStageId ? "active" : index < activeIndex ? "past" : "";

                return (
                  <button
                    key={`${stage.id}-mobile`}
                    className={`journey-m-btn ${stateClass}`}
                    type="button"
                    onClick={() => setActiveStageId(stage.id)}
                  >
                    <div className="journey-m-btn__icon">
                      {index < activeIndex && stage.id !== activeStageId ? (
                        <Icon name="check" size={20} />
                      ) : (
                        <Icon name={stage.icon} size={20} />
                      )}
                    </div>

                    <div>
                      <div className="journey-m-btn__num">{t("Stage")} {stage.number}</div>
                      <div className="journey-m-btn__name">{t(stage.title)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="journey-swipe-hint">&larr; {t("Swipe to explore stages")} &rarr;</p>

          <div className="journey-m-card">
            <StageContent content={activeContent} />
          </div>

          <div className="journey-m-patient">
            <PatientCard stage={activeStage} />
          </div>

          <div className="journey-m-nav">
            <div className="journey-nav-bar">
              <button
                className={`journey-nav-btn ${activeIndex === 0 ? "disabled" : "enabled"}`}
                type="button"
                onClick={() => setActiveStageId(STAGES[activeIndex - 1].id)}
                disabled={activeIndex === 0}
              >
                <Icon name="chevron-left" size={20} />
                {t("Prev")}
              </button>

              <div className="journey-nav-center">
                <div className="journey-nav-center__num">
                  {t("Stage")} {activeIndex + 1}/{STAGES.length}
                </div>
                <div className="journey-nav-center__name">{t(activeStage.title)}</div>
              </div>

              <button
                className={`journey-nav-btn ${activeIndex === STAGES.length - 1 ? "disabled" : "enabled"}`}
                type="button"
                onClick={() => setActiveStageId(STAGES[activeIndex + 1].id)}
                disabled={activeIndex === STAGES.length - 1}
              >
                {t("Next")}
                <Icon name="chevron-right" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
