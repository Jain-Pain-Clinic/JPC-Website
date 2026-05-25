import { useState } from "react";

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

function getResult(score) {
  if (score >= 80) {
    return {
      title: "Excellent Candidate!",
      message:
        "Based on your responses, this treatment could be a great option for you. Schedule a consultation to discuss next steps!",
    };
  }

  if (score >= 50) {
    return {
      title: "Good Candidate",
      message:
        "You may benefit from this treatment. We recommend scheduling a consultation to review your specific case with our specialists.",
    };
  }

  if (score > 0) {
    return {
      title: "Unlikely Match",
      message:
        "Based on your responses, this treatment may not be the best fit right now. If symptoms change or worsen, feel free to revisit or consult our specialists.",
    };
  }

  return {
    title: "Treatment Not Indicated",
    message:
      "Your responses suggest you may not need this treatment at this time. If you develop new symptoms in the future, do not hesitate to check again.",
  };
}

export default function TreatmentCalculator({ title, questions = [] }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const allDone = questions.every((question) => answers[question.id] !== undefined);
  const rawScore = questions.reduce(
    (total, question) => total + (answers[question.id] ? question.points : 0),
    0
  );
  const maxScore = questions.reduce((total, question) => total + question.points, 0);
  const score = maxScore ? Math.round((rawScore / maxScore) * 100) : 0;
  const result = getResult(score);

  function handleAnswer(questionId, value) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  }

  function resetCalculator() {
    setAnswers({});
    setShowResult(false);
  }

  return (
    <div className="calc-inline">
      <div className="calc-section__header">
        <h2 className="calc-section__title">{title}</h2>
      </div>

      <div className="calc-card">
        {showResult ? (
          <div className="calc-result">
            <img src="/assets/treatment.jpg" alt="" className="calc-result__img" />
            <div className="calc-result__title">{result.title}</div>
            <div className="calc-result__score">{score}/100</div>
            <p className="calc-result__msg">{result.message}</p>
            <div className="calc-result__btns">
              <button className="calc-result-btn calc-result-btn--reset" type="button" onClick={resetCalculator}>
                <IconRefresh />
                Try Again
              </button>
              <a className="calc-result-btn calc-result-btn--book" href="#contact">
                <IconArrowRight />
                Book Consultation
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="calc-progress-row">
              <span className="calc-progress-label">Progress</span>
              <span className="calc-progress-count">
                {answeredCount}/{questions.length}
              </span>
            </div>

            <div className="calc-progress-track">
              <div
                className="calc-progress-fill"
                style={{
                  width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="calc-questions">
              {questions.map((question) => (
                <div key={question.id} className="calc-q-row">
                  <p className="calc-q-text">{question.text}</p>
                  <div className="calc-btns">
                    <button
                      className={`calc-btn calc-btn-yes ${answers[question.id] === true ? "selected" : ""}`}
                      type="button"
                      onClick={() => handleAnswer(question.id, true)}
                    >
                      <IconCheck />
                      Yes
                    </button>
                    <button
                      className={`calc-btn calc-btn-no ${answers[question.id] === false ? "selected" : ""}`}
                      type="button"
                      onClick={() => handleAnswer(question.id, false)}
                    >
                      <IconX />
                      No
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`calc-submit ${allDone ? "enabled" : "disabled"}`}
              type="button"
              disabled={!allDone}
              onClick={() => setShowResult(true)}
            >
              Calculate My Fit
              <IconArrowRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
