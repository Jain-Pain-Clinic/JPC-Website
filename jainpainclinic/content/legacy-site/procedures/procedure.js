/* ══════════════════════════════════════════
   Your Journey – Procedure Explorer
   ══════════════════════════════════════════ */
(function () {
  var stageImages = {
    'preparation':   '../assets/how-we-treat/preparing.jpg',
    'evaluation':    '../assets/how-we-treat/evaluate.jpg',
    'consent':       '../assets/how-we-treat/consent.jpg',
    'pre-procedure': '../assets/how-we-treat/preop.jpg',
    'procedure':     '../assets/how-we-treat/surgery.jpg',
    'recovery':      '../assets/how-we-treat/recovery.jpg',
    'follow-up':     '../assets/how-we-treat/followup.jpg'
  };

  var icons = {
    'clipboard-check': '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>',
    'user-check': '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    'file-text': '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    'syringe': '<path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>',
    'heart-pulse': '<path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.572"/><path d="M12 6l1 5h2l1-3 1 3h2l1-5"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'chevron-left': '<polyline points="15 18 9 12 15 6"/>',
    'chevron-right': '<polyline points="9 18 15 12 9 6"/>'
  };

  function svg(name, size) {
    size = size || 24;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icons[name] + '</svg>';
  }

  /* ── Data (can be overridden per-page via window.journeyStages / window.journeyContent) ── */
  var stages = window.journeyStages || [
    { id: 'preparation',    title: 'Preparation',      number: 1, icon: 'clipboard-check', state: 'Feeling Prepared', stateDesc: 'Patient is relaxed and ready for the procedure' },
    { id: 'evaluation',     title: 'Evaluation',       number: 2, icon: 'user-check',      state: 'Being Evaluated', stateDesc: 'Doctor conducting thorough assessment' },
    { id: 'consent',        title: 'Informed Consent',  number: 3, icon: 'file-text',       state: 'Signing Consent', stateDesc: 'Understanding and agreeing to treatment' },
    { id: 'pre-procedure',  title: 'Pre-Procedure',     number: 4, icon: 'activity',        state: 'Getting Ready',   stateDesc: 'Positioned comfortably on procedure table' },
    { id: 'procedure',      title: 'During Procedure',  number: 5, icon: 'syringe',         state: 'During Injection', stateDesc: 'Doctor performing the injection with precision' },
    { id: 'recovery',       title: 'Recovery',          number: 6, icon: 'heart-pulse',     state: 'Resting',         stateDesc: 'Relaxing in recovery room, monitored by staff' },
    { id: 'follow-up',      title: 'Follow-Up',         number: 7, icon: 'calendar',        state: 'Feeling Better',  stateDesc: 'Experiencing pain relief and improved mobility' }
  ];

  var contentData = window.journeyContent || {
    preparation:    { title: 'Preparing for Your Epidural Steroid Injection', description: 'Proper preparation ensures a smooth and successful procedure. Follow these important guidelines before your appointment.', keyPoints: ['Stop blood thinners 3-7 days before (consult your doctor)', 'Arrange for someone to drive you home', 'Bring your medical records and imaging studies', 'Wear comfortable, loose-fitting clothing'], duration: '30 minutes before appointment', whatToExpect: 'You will complete paperwork, discuss any concerns with our staff, and prepare mentally for the procedure. Our team will answer all your questions and ensure you feel comfortable.', tips: ['Eat a light meal 2 hours before if receiving sedation', 'Take your regular medications unless instructed otherwise', 'Arrive 15 minutes early for check-in'] },
    evaluation:     { title: 'Comprehensive Patient Evaluation', description: 'Our specialists conduct a thorough assessment to determine if epidural steroid injection is right for you.', keyPoints: ['Review of medical history and current symptoms', 'Physical and neurological examination', 'Analysis of MRI/CT imaging studies', 'Discussion of treatment goals and expectations'], duration: '30-45 minutes', whatToExpect: 'Your doctor will examine your spine, test reflexes and sensation, review imaging, and create a personalized treatment plan based on your specific condition.' },
    consent:        { title: 'Understanding Your Treatment \u2013 Informed Consent', description: 'Before proceeding, we ensure you fully understand the procedure, its benefits, risks, and alternatives.', keyPoints: ['Detailed explanation of the injection procedure', 'Discussion of expected benefits (70-90% success rate)', 'Review of potential risks and complications', 'Exploration of alternative treatment options'], duration: '15-20 minutes', whatToExpect: 'You will sign consent forms after all your questions are answered. This is your opportunity to discuss any concerns or fears about the procedure.' },
    'pre-procedure':{ title: 'Final Preparations Before Your Injection', description: 'The moments before your procedure involve final preparations to ensure your safety and comfort.', keyPoints: ['Vital signs monitoring (blood pressure, heart rate)', 'IV line placement if sedation is planned', 'Positioning on the fluoroscopy table', 'Skin cleaning and sterilization of injection site'], duration: '15-20 minutes', whatToExpect: 'You will lie face-down on a padded table. The injection area will be thoroughly cleaned. Our team will ensure you are comfortable and relaxed before beginning.' },
    procedure:      { title: 'During the Epidural Steroid Injection', description: 'The actual injection procedure is performed with precision using real-time imaging guidance.', keyPoints: ['Local anesthetic numbs the injection site', 'Fluoroscopic (X-ray) guidance ensures accuracy', 'Contrast dye confirms correct needle placement', 'Steroid medication is carefully injected'], duration: '20-30 minutes', whatToExpect: 'You may feel pressure or a brief stinging sensation from the numbing medicine. Most patients report minimal discomfort. You will remain awake and can communicate with your doctor throughout.', tips: ['Stay as still as possible during needle insertion', 'Let your doctor know if you feel any sharp pain', 'Deep breathing helps you stay relaxed'] },
    recovery:       { title: 'Immediate Post-Procedure Recovery', description: 'After your injection, you will rest in our recovery area while our staff monitors your response to treatment.', keyPoints: ['Rest in recovery room for 15-30 minutes', 'Vital signs monitoring', 'Assessment of immediate pain relief', 'Discharge instructions and follow-up scheduling'], duration: '30-60 minutes', whatToExpect: 'Some patients experience immediate relief from the local anesthetic. Others may have temporary increased soreness. Both responses are normal. You can go home the same day.', tips: ['Apply ice to injection site for 15 minutes', 'Rest for the remainder of the day', 'Avoid bathtubs/pools for 48 hours'] },
    'follow-up':    { title: 'Long-Term Follow-Up Care', description: 'Continued monitoring and support help you achieve and maintain optimal results from your treatment.', keyPoints: ['Follow-up appointment in 2-4 weeks', 'Physical therapy may be recommended', 'Gradual return to normal activities', 'Assessment of pain relief and function improvement'], duration: 'Ongoing for 2-12 weeks', whatToExpect: 'Pain relief typically begins within 3-7 days as inflammation reduces. Your doctor will track your progress and adjust your treatment plan as needed. Most patients experience significant improvement lasting 3-6 months.' }
  };

  var activeStage = stages[0].id;
  var scrollToJourney = false;

  function getActiveIndex() {
    for (var i = 0; i < stages.length; i++) {
      if (stages[i].id === activeStage) return i;
    }
    return 0;
  }

  function renderContentHTML(content) {
    var h = '<h2 class="journey-content__title">' + content.title + '</h2>' +
      '<p class="journey-content__desc">' + content.description + '</p>';
    if (content.duration) {
      h += '<div class="journey-duration">' + svg('clock', 16) + ' Duration: ' + content.duration + '</div>';
    }
    h += '<div class="journey-keypoints__title">' + svg('check-circle', 20) + ' Key Points</div>';
    content.keyPoints.forEach(function (p) {
      h += '<div class="journey-keypoint"><div class="journey-keypoint__dot"><div class="journey-keypoint__dot-inner"></div></div><span class="journey-keypoint__text">' + p + '</span></div>';
    });
    h += '<div class="journey-info"><div class="journey-info__title">' + svg('info', 20) + ' What to Expect</div><p class="journey-info__text">' + content.whatToExpect + '</p></div>';
    if (content.tips && content.tips.length) {
      h += '<div class="journey-info"><div class="journey-info__title">' + svg('alert-circle', 20) + ' Helpful Tips</div><ul class="journey-tips">';
      content.tips.forEach(function (t) { h += '<li><span>\uD83D\uDCA1</span><span>' + t + '</span></li>'; });
      h += '</ul></div>';
    }
    return h;
  }

  function renderPatientHTML(stageId, large) {
    var s;
    for (var i = 0; i < stages.length; i++) { if (stages[i].id === stageId) { s = stages[i]; break; } }
    return '<div class="journey-patient">' +
      '<img src="' + (stageImages[stageId] || '../assets/how-we-treat/preparing.jpg') + '" alt="' + s.state + '" class="journey-patient__img">' +
      '<div class="journey-patient__badge">' + s.state + '</div>' +
      (large ? '<p class="journey-patient__desc">' + s.stateDesc + '</p>' : '') +
      '</div>';
  }

  function render() {
    var desktopEl = document.getElementById('journeyDesktop');
    var mobileEl = document.getElementById('journeyMobile');
    if (!desktopEl || !mobileEl) return;

    var idx = getActiveIndex();
    var content = contentData[activeStage];

    /* ── Desktop ── */
    var sidebar = '<div class="journey-stage-list"><div class="journey-stage-line"><div class="journey-stage-line__fill" style="height:' + (idx / (stages.length - 1) * 100) + '%"></div></div>';
    stages.forEach(function (s, i) {
      var cls = s.id === activeStage ? 'active' : i < idx ? 'past' : 'future';
      var iconHTML = (i < idx && s.id !== activeStage) ? svg('check') : svg(s.icon);
      sidebar += '<button class="journey-stage-btn ' + cls + '" data-stage="' + s.id + '">' +
        '<div class="journey-stage-icon">' + iconHTML + '</div>' +
        '<div class="journey-stage-label"><div class="journey-stage-number">Stage ' + s.number + '</div><div class="journey-stage-name">' + s.title + '</div></div>' +
        '<div class="journey-stage-bar"></div>' +
        '</button>';
    });
    sidebar += '</div>';

    desktopEl.innerHTML =
      '<div class="journey-sidebar">' + sidebar + '</div>' +
      '<div class="journey-content">' + renderContentHTML(content) + '</div>' +
      '<div class="journey-patient-col">' + renderPatientHTML(activeStage, true) + '</div>';

    /* ── Mobile ── */
    var mob = '<div class="journey-m-scroller"><div class="journey-m-row">';
    stages.forEach(function (s, i) {
      var cls = s.id === activeStage ? 'active' : i < idx ? 'past' : '';
      var iconHTML = (i < idx && s.id !== activeStage) ? svg('check', 20) : svg(s.icon, 20);
      mob += '<button class="journey-m-btn ' + cls + '" data-stage="' + s.id + '">' +
        '<div class="journey-m-btn__icon">' + iconHTML + '</div>' +
        '<div><div class="journey-m-btn__num">Stage ' + s.number + '</div><div class="journey-m-btn__name">' + s.title + '</div></div>' +
        '</button>';
    });
    mob += '</div></div>';
    mob += '<p class="journey-swipe-hint">\u2190 Swipe to explore stages \u2192</p>';
    mob += '<div class="journey-m-card">' + renderContentHTML(content) + '</div>';
    mob += '<div class="journey-m-patient">' + renderPatientHTML(activeStage, false) + '</div>';

    var isFirst = idx === 0, isLast = idx === stages.length - 1;
    mob += '<div class="journey-m-nav"><div class="journey-nav-bar">' +
      '<button class="journey-nav-btn ' + (isFirst ? 'disabled' : 'enabled') + '"' + (isFirst ? ' disabled' : ' data-stage="' + stages[idx - 1].id + '"') + '>' + svg('chevron-left', 20) + ' Prev</button>' +
      '<div class="journey-nav-center"><div class="journey-nav-center__num">Stage ' + (idx + 1) + '/' + stages.length + '</div><div class="journey-nav-center__name">' + stages[idx].title + '</div></div>' +
      '<button class="journey-nav-btn ' + (isLast ? 'disabled' : 'enabled') + '"' + (isLast ? ' disabled' : ' data-stage="' + stages[idx + 1].id + '"') + '>Next ' + svg('chevron-right', 20) + '</button>' +
      '</div></div>';

    mobileEl.innerHTML = mob;

    /* After DOM is painted, scroll the pill row to the active stage */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var scroller = mobileEl.querySelector('.journey-m-scroller');
        var activeBtn = mobileEl.querySelector('.journey-m-btn.active');
        if (scroller && activeBtn) {
          var target = activeBtn.offsetLeft - scroller.offsetWidth / 2 + activeBtn.offsetWidth / 2;
          scroller.scrollLeft = target;
        }
        if (scrollToJourney) {
          scrollToJourney = false;
          var section = document.querySelector('.journey');
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* Re-bind click events */
    desktopEl.querySelectorAll('[data-stage]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeStage = this.getAttribute('data-stage');
        render();
      });
    });
    mobileEl.querySelectorAll('.journey-m-btn[data-stage]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeStage = this.getAttribute('data-stage');
        render();
      });
    });
    mobileEl.querySelectorAll('.journey-nav-btn[data-stage]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeStage = this.getAttribute('data-stage');
        scrollToJourney = true;
        render();
      });
    });
  }

  /* Init when DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  /* Expose for possible external use */
  window.journeyRender = render;
  window.journeySetStage = function (id) { activeStage = id; render(); };
})();

/* ══════════════════════════════════════════
   Quiz – Test Your Knowledge
   ══════════════════════════════════════════ */
(function () {
  'use strict';

  var defaultQuestions = [
    {
      question: 'What is the primary purpose of an epidural steroid injection?',
      options: [
        'To permanently cure back pain',
        'To reduce inflammation and relieve nerve pain',
        'To strengthen the spine',
        'To replace damaged discs'
      ],
      answer: 1,
      explanation: 'Epidural steroid injections deliver corticosteroid medication into the epidural space to reduce inflammation around irritated nerve roots, providing targeted pain relief.'
    },
    {
      question: 'Where is the medication delivered during an epidural steroid injection?',
      options: [
        'Into the muscle tissue',
        'Into the bloodstream',
        'Into the epidural space around the spinal cord',
        'Into the spinal disc'
      ],
      answer: 2,
      explanation: 'The medication is injected into the epidural space — the area surrounding the spinal cord and nerve roots — for direct, targeted action on inflamed tissue.'
    },
    {
      question: 'Which imaging technique is commonly used to guide the needle during the procedure?',
      options: [
        'MRI',
        'Ultrasound or fluoroscopy (X-ray)',
        'CT scan',
        'No imaging is needed'
      ],
      answer: 1,
      explanation: 'Fluoroscopic (real-time X-ray) or ultrasound guidance is used to ensure precise needle placement into the epidural space for safe and effective delivery.'
    },
    {
      question: 'How long does a typical epidural steroid injection procedure take?',
      options: [
        '5 minutes',
        '15–30 minutes',
        '1–2 hours',
        'Half a day'
      ],
      answer: 1,
      explanation: 'The procedure is minimally invasive and typically takes between 15 and 30 minutes, after which patients can usually go home the same day.'
    },
    {
      question: 'Which conditions may benefit from an epidural steroid injection?',
      options: [
        'Broken bones and fractures',
        'Sciatica, disc herniation, and spinal stenosis',
        'Muscle strains only',
        'Skin conditions'
      ],
      answer: 1,
      explanation: 'Epidural steroid injections are most effective for conditions involving nerve inflammation such as sciatica, herniated discs, and spinal stenosis.'
    }
  ];

  var questions = window.quizQuestions || defaultQuestions;
  var currentQ = 0;
  var selectedAnswer = -1;
  var answered = false;
  var score = 0;
  var finished = false;

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  function renderQuiz() {
    var el = document.getElementById('quizCard');
    if (!el) return;

    if (finished) {
      var pct = Math.round(score / questions.length * 100);
      el.innerHTML =
        '<div class="quiz-result">' +
          '<img class="quiz-result__img" src="../assets/quiz.jpg" alt="Quiz complete" />' +
          '<h3 class="quiz-result__heading">' + (pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good effort!' : 'Keep learning!') + '</h3>' +
          '<p class="quiz-result__score">You scored ' + score + ' out of ' + questions.length + ' (' + pct + '%)</p>' +
          '<button class="quiz-result__restart" id="quizRestart">Try Again</button>' +
        '</div>';
      document.getElementById('quizRestart').addEventListener('click', function () {
        currentQ = 0; selectedAnswer = -1; answered = false; score = 0; finished = false;
        renderQuiz();
      });
      return;
    }

    var q = questions[currentQ];

    /* Progress dots */
    var dots = '<div class="quiz-card__progress">';
    for (var i = 0; i < questions.length; i++) {
      var cls = i < currentQ ? 'done' : i === currentQ ? 'active' : '';
      dots += '<div class="quiz-card__progress-dot ' + cls + '"></div>';
    }
    dots += '</div>';

    /* Options */
    var opts = '<div class="quiz-card__options">';
    q.options.forEach(function (opt, idx) {
      var cls = 'quiz-card__option';
      var letter = LETTERS[idx];
      if (answered) {
        if (idx === q.answer) { cls += ' correct'; letter = '<i class="fa-solid fa-check"></i>'; }
        else if (idx === selectedAnswer) { cls += ' wrong'; letter = '<i class="fa-solid fa-xmark"></i>'; }
        if (idx !== q.answer && idx !== selectedAnswer) cls += ' disabled';
      }
      opts += '<button class="' + cls + '" data-idx="' + idx + '">' +
        '<span class="quiz-card__option-letter">' + letter + '</span>' +
        '<span>' + opt + '</span>' +
      '</button>';
    });
    opts += '</div>';

    /* Explanation + Next */
    var extra = '';
    if (answered) {
      extra = '<div class="quiz-card__explanation"><strong>' + (selectedAnswer === q.answer ? 'Correct! ' : 'Not quite. ') + '</strong>' + q.explanation + '</div>';
      extra += '<button class="quiz-card__next" id="quizNext">' + (currentQ < questions.length - 1 ? 'Next Question →' : 'See Results →') + '</button>';
    }

    el.innerHTML = dots +
      '<div class="quiz-card__counter">Question ' + (currentQ + 1) + ' of ' + questions.length + '</div>' +
      '<h3 class="quiz-card__question">' + q.question + '</h3>' +
      opts + extra;

    /* Bind option clicks */
    if (!answered) {
      el.querySelectorAll('.quiz-card__option').forEach(function (btn) {
        btn.addEventListener('click', function () {
          selectedAnswer = parseInt(this.getAttribute('data-idx'), 10);
          answered = true;
          if (selectedAnswer === q.answer) score++;
          renderQuiz();
        });
      });
    }

    /* Bind next */
    var nextBtn = document.getElementById('quizNext');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        currentQ++;
        selectedAnswer = -1;
        answered = false;
        if (currentQ >= questions.length) finished = true;
        renderQuiz();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderQuiz);
  } else {
    renderQuiz();
  }

  window.quizRender = renderQuiz;
})();
