import { useMemo, useState } from "react";
import { useT } from "@/components/shared/I18nProvider";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function ProcedureQuiz({ questions }) {
  const t = useT();
  const totalQuestions = questions.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = selectedAnswer !== -1;
  const finished = currentQuestionIndex >= totalQuestions;

  const score = useMemo(
    () => answers.filter((answer, index) => answer === questions[index].answer).length,
    [answers, questions]
  );

  function handleOptionClick(index) {
    if (hasAnswered || finished) {
      return;
    }

    setSelectedAnswer(index);
  }

  function handleNextClick() {
    const nextAnswers = [...answers, selectedAnswer];
    setAnswers(nextAnswers);

    if (currentQuestionIndex === totalQuestions - 1) {
      setCurrentQuestionIndex(totalQuestions);
      setSelectedAnswer(-1);
      return;
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(-1);
  }

  function handleRestart() {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(-1);
    setAnswers([]);
  }

  if (finished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const heading =
      percentage >= 80 ? t("Excellent!") : percentage >= 50 ? t("Good effort!") : t("Keep learning!");

    return (
      <div className="quiz-card">
        <div className="quiz-result">
          <img className="quiz-result__img" src="/assets/quiz.jpg" alt={t("Quiz complete")} />
          <h3 className="quiz-result__heading">{heading}</h3>
          <p className="quiz-result__score">
            {t("You scored")} {score} {t("out of")} {totalQuestions} ({percentage}%)
          </p>
          <button className="quiz-result__restart" type="button" onClick={handleRestart}>
            {t("Try Again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-card">
      <div className="quiz-card__progress">
        {questions.map((question, index) => {
          let stateClass = "";

          if (index < currentQuestionIndex) {
            stateClass = "done";
          } else if (index === currentQuestionIndex) {
            stateClass = "active";
          }

          return <div key={`${question.question}-${index}`} className={`quiz-card__progress-dot ${stateClass}`}></div>;
        })}
      </div>

      <div className="quiz-card__counter">
        {t("Question")} {currentQuestionIndex + 1} {t("of")} {totalQuestions}
      </div>
      <h3 className="quiz-card__question">{currentQuestion.question}</h3>

      <div className="quiz-card__options">
        {currentQuestion.options.map((option, index) => {
          let stateClass = "";

          if (hasAnswered) {
            if (index === currentQuestion.answer) {
              stateClass = "correct";
            } else if (index === selectedAnswer) {
              stateClass = "wrong";
            } else {
              stateClass = "disabled";
            }
          }

          return (
            <button
              key={`${currentQuestion.question}-option-${index}`}
              className={`quiz-card__option ${stateClass}`}
              type="button"
              onClick={() => handleOptionClick(index)}
            >
              <span className="quiz-card__option-letter">
                {hasAnswered && index === currentQuestion.answer ? (
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                ) : hasAnswered && index === selectedAnswer ? (
                  <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                ) : (
                  LETTERS[index]
                )}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {hasAnswered ? (
        <>
          <div className="quiz-card__explanation">
            <strong>{selectedAnswer === currentQuestion.answer ? `${t("Correct!")} ` : `${t("Not quite.")} `}</strong>
            {currentQuestion.explanation}
          </div>

          <button className="quiz-card__next" type="button" onClick={handleNextClick}>
            {currentQuestionIndex < totalQuestions - 1 ? `${t("Next Question")} →` : `${t("See Results")} →`}
          </button>
        </>
      ) : null}
    </div>
  );
}
