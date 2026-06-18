(function () {
  const treatButtons = Array.from(document.querySelectorAll(".treat-link"));
  const panel = document.getElementById("treatPanel");
  const title = document.getElementById("treatTitle");
  const body = document.getElementById("treatBody");
  const bgImageIn = document.getElementById("treatBgImage");
  const bgImageOut = document.getElementById("treatBgImageOut");

  if (!treatButtons.length || !panel || !title || !body) return;

  const treatmentImages = {
    "back-pain": "assets/treat-back-pain.jpg",
    "neck-pain": "assets/treat-neck-pain.jpg",
    "sciatica": "assets/treat-sciatica.jpg",
    "shoulder-pain": "assets/treat-shoulder-pain.jpg",
    "knee-pain": "assets/treat-knee-pain.jpg",
    "hip-pain": "assets/treat-hip-pain.jpg",
    "trigeminal-neuralgia": "assets/treat-trigeminal.jpg",
    "cancer-pain": "assets/treat-cancer-pain.jpg",
    "palliative-care": "assets/treat-palliative.jpg",
    "home-care": "assets/treat-home-care.jpg"
  };

  const treatmentContent = {
    "back-pain": {
      title: "Back pain often has more than one cause.",
      body: "Muscles, joints, discs, and nerves can all contribute. A focused evaluation helps identify whether the pain is mainly posture-related, movement-related, or linked to nerve irritation.",
      url: "treatments/lower-back-pain",
      linkContext: "about back pain"
    },
    "neck-pain": {
      title: "Neck pain may build slowly or flare after sudden strain.",
      body: "The neck works hard through screen time, driving, sleep posture, and stress-related muscle tightening. Pain can come from muscles, joints, discs, or irritated nerves.",
      url: "treatments/neck-pain",
      linkContext: "about neck pain"
    },
    sciatica: {
      title: "Sciatica usually follows the path of the sciatic nerve.",
      body: "Patients often notice pain, tingling, or burning that starts in the lower back or hip and travels down the buttock or leg. It commonly reflects nerve irritation rather than just muscle strain.",
      url: "treatments/sciatica",
      linkContext: "about sciatica"
    },
    "shoulder-pain": {
      title: "Shoulder pain often shows up when everyday movement becomes guarded.",
      body: "Reaching overhead, lifting, dressing, or sleeping on one side can become uncomfortable when the shoulder joint, tendons, or surrounding muscles become irritated.",
      url: "treatments/shoulder-pain",
      linkContext: "about shoulder pain"
    },
    "knee-pain": {
      title: "Knee pain can affect walking, stairs, and confidence in movement.",
      body: "Pain around the knee may come from joint wear, inflammation, overload, ligament strain, or surrounding muscle imbalance. The exact location and timing often give useful clues.",
      url: "treatments/knee-pain",
      linkContext: "about knee pain"
    },
    "hip-pain": {
      title: "Hip pain may be felt in the groin, side of the hip, or even the buttock.",
      body: "Because hip pain can overlap with back pain and nerve pain, location matters. Some patients feel deep joint pain while others notice pain after walking, climbing stairs, or lying on one side.",
      url: "treatments/hip-pain",
      linkContext: "about hip pain"
    },
    "trigeminal-neuralgia": {
      title: "Trigeminal neuralgia is known for sudden, brief, intense facial pain.",
      body: "Patients often describe shock-like or stabbing pain triggered by speaking, chewing, brushing, washing the face, or even a light breeze.",
      url: "treatments/trigeminal-neuralgia",
      linkContext: "about trigeminal neuralgia"
    },
    "cancer-pain": {
      title: "Cancer pain care focuses on comfort, function, and day-to-day relief.",
      body: "Pain may come from the illness itself, from treatment, or from reduced mobility. The goal is not only lowering pain intensity but also improving rest, activity, and overall comfort.",
      url: "treatments/cancer-pain",
      linkContext: "about cancer pain"
    },
    "palliative-care": {
      title: "Palliative care supports comfort alongside active medical treatment.",
      body: "It focuses on easing pain and distressing symptoms while also supporting rest, appetite, sleep, emotional comfort, and daily functioning for patients and families.",
      url: "treatments/palliative-care",
      linkContext: "about palliative care"
    },
    "home-care": {
      title: "Home care helps treatment continue in a more familiar setting.",
      body: "For patients who need monitoring, pain support, or reduced travel strain, home care can improve continuity while keeping the treatment plan connected to the clinic.",
      url: "treatments/home-care",
      linkContext: "about home care"
    }
  };

  function switchBgImage(key) {
    if (!bgImageIn || !bgImageOut) return;
    const newSrc = treatmentImages[key];
    if (!newSrc || bgImageIn.src.endsWith(newSrc)) return;

    bgImageOut.src = bgImageIn.src;
    bgImageOut.classList.add("is-visible");
    bgImageOut.classList.remove("is-fading-out");

    bgImageIn.classList.remove("is-visible");
    bgImageIn.src = newSrc;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        bgImageIn.classList.add("is-visible");
        bgImageOut.classList.add("is-fading-out");
        bgImageOut.classList.remove("is-visible");
      });
    });
  }

  function animatePanel() {
    panel.classList.remove("is-changing");
    void panel.offsetWidth;
    panel.classList.add("is-changing");
  }

  function setActive(button, options) {
    const { animate = true } = options || {};
    const key = button.dataset.condition;
    const content = key ? treatmentContent[key] : null;

    if (!content) return;

    treatButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    const readMore = document.getElementById("treatReadMore");

    panel.setAttribute("aria-labelledby", button.id);
    title.textContent = content.title;
    body.textContent = content.body;
    if (readMore) {
      readMore.href = content.url;
      const linkContext = readMore.querySelector(".treat-link-context");
      if (linkContext) linkContext.textContent = content.linkContext;
    }
    switchBgImage(key);
    if (animate) animatePanel();
  }

  treatButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setActive(button);
    });

    button.addEventListener("keydown", function (event) {
      const currentIndex = treatButtons.indexOf(button);
      let targetIndex = currentIndex;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        targetIndex = (currentIndex + 1) % treatButtons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        targetIndex = (currentIndex - 1 + treatButtons.length) % treatButtons.length;
      } else if (event.key === "Home") {
        targetIndex = 0;
      } else if (event.key === "End") {
        targetIndex = treatButtons.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      treatButtons[targetIndex].focus();
      setActive(treatButtons[targetIndex], { animate: false });
    });
  });

  panel.addEventListener("animationend", function () {
    panel.classList.remove("is-changing");
  });

  setActive(treatButtons.find((button) => button.classList.contains("is-active")) || treatButtons[0], { animate: false });
})();

(function () {
  const controls = Array.from(document.querySelectorAll("[data-track-target]"));

  controls.forEach((button) => {
    button.addEventListener("click", function () {
      const trackId = button.getAttribute("data-track-target");
      const direction = Number(button.getAttribute("data-direction")) || 1;
      const track = trackId ? document.getElementById(trackId) : null;
      const firstItem = track ? track.firstElementChild : null;

      if (!track || !firstItem) return;

      const gapValue = window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || "0";
      const gap = Number.parseFloat(gapValue) || 0;
      const scrollAmount = firstItem.getBoundingClientRect().width + gap;

      track.scrollBy({
        left: scrollAmount * direction,
        behavior: "smooth"
      });
    });
  });
})();

/* —— Scroll reveal animations —— */
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();

/* —— Exclusive accordion (only one item open at a time, animated) —— */
(function () {
  var accordion = document.getElementById('facilitiesAccordion');
  if (!accordion) return;

  var items = accordion.querySelectorAll('.accordion__item');

  // Set initial height for the open item
  items.forEach(function (item) {
    var body = item.querySelector('.accordion__body');
    if (item.classList.contains('is-open')) {
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });

  accordion.addEventListener('click', function (e) {
    var btn = e.target.closest('.accordion__header');
    if (!btn) return;

    var parent = btn.parentElement;
    var isOpen = parent.classList.contains('is-open');

    // Close all items
    items.forEach(function (item) {
      var body = item.querySelector('.accordion__body');
      item.classList.remove('is-open');
      item.querySelector('.accordion__header').setAttribute('aria-expanded', 'false');
      body.style.maxHeight = '0';
    });

    // If the clicked item was closed, open it
    if (!isOpen) {
      var body = parent.querySelector('.accordion__body');
      parent.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
})();

/* —— FAQ accordion (treatment page) —— */
(function () {
  var list = document.getElementById('faqList');
  if (!list) return;

  var items = list.querySelectorAll('.treatment-faq__item');

  // Set initial height for open items
  items.forEach(function (item) {
    var answer = item.querySelector('.treatment-faq__answer');
    if (item.classList.contains('is-open')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  list.addEventListener('click', function (e) {
    var header = e.target.closest('.treatment-faq__header');
    if (!header) return;

    var item = header.parentElement;
    var isOpen = item.classList.contains('is-open');

    // Close all
    items.forEach(function (it) {
      var ans = it.querySelector('.treatment-faq__answer');
      it.classList.remove('is-open');
      it.querySelector('.treatment-faq__toggle').setAttribute('aria-expanded', 'false');
      ans.style.maxHeight = '0';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      var answer = item.querySelector('.treatment-faq__answer');
      item.classList.add('is-open');
      item.querySelector('.treatment-faq__toggle').setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
})();
/* —— Blog filter tabs —— */
(function () {
  var filters = document.querySelectorAll('.blog-filter');
  if (!filters.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });
})();

/* —— Exercise filter tabs —— */
(function () {
  var filters = document.querySelectorAll('.exercise-filter');
  if (!filters.length) return;

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      var target = btn.getAttribute('data-target');
      if (target) {
        var card = document.getElementById(target);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });
})();

/* —— Nav dropdown toggle (mobile) —— */
(function () {
  var dropdowns = document.querySelectorAll('.nav__item.has-dropdown');
  if (!dropdowns.length) return;

  dropdowns.forEach(function (dd) {
    var trigger = dd.querySelector(':scope > a');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 780) {
        e.preventDefault();
        dd.classList.toggle('is-open');
      }
    });
  });
})();

/* —— Appointment form submission (Web3Forms) —— */
(function () {
  /* Form submit */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form.classList.contains('appointment-form')) return;
    e.preventDefault();

    var btn = form.querySelector('.appointment-submit');
    var originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var data = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          form.reset();
          btn.textContent = 'Sent! We will contact you soon.';
          btn.style.background = '#22c55e';
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.background = '';
          }, 5000);
        } else {
          throw new Error(json.message || 'Submission failed');
        }
      })
      .catch(function (err) {
        btn.disabled = false;
        var msg = (err && err.message) ? err.message : 'Please try again.';
        btn.textContent = 'Error: ' + msg;
        btn.style.background = '#ef4444';
        setTimeout(function () {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 6000);
      });
  });
})();
