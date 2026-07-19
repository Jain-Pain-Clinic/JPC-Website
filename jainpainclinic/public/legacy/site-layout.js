(function () {
  var list = document.getElementById("faqList");
  if (!list) return;

  var items = list.querySelectorAll(".treatment-faq__item");

  items.forEach(function (item) {
    var answer = item.querySelector(".treatment-faq__answer");
    if (answer && item.classList.contains("is-open")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });

  list.addEventListener("click", function (event) {
    var header = event.target.closest(".treatment-faq__header");
    if (!header) return;

    var item = header.parentElement;
    var isOpen = item.classList.contains("is-open");

    items.forEach(function (currentItem) {
      var answer = currentItem.querySelector(".treatment-faq__answer");
      var toggle = currentItem.querySelector(".treatment-faq__toggle");
      currentItem.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      if (answer) answer.style.maxHeight = "0";
    });

    if (!isOpen) {
      var currentAnswer = item.querySelector(".treatment-faq__answer");
      var currentToggle = item.querySelector(".treatment-faq__toggle");
      item.classList.add("is-open");
      if (currentToggle) currentToggle.setAttribute("aria-expanded", "true");
      if (currentAnswer) currentAnswer.style.maxHeight = currentAnswer.scrollHeight + "px";
    }
  });
})();

(function () {
  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (!form.classList || !form.classList.contains("appointment-form")) return;

    event.preventDefault();

    var button = form.querySelector(".appointment-submit");
    if (!button) return;

    var originalText = button.textContent;
    button.disabled = true;
    button.textContent = "Sending...";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        if (!json.success) {
          throw new Error(json.message || "Submission failed");
        }

        form.reset();
        button.textContent = "Sent! We will contact you soon.";
        button.style.background = "#22c55e";

        window.setTimeout(function () {
          button.disabled = false;
          button.textContent = originalText;
          button.style.background = "";
        }, 5000);
      })
      .catch(function (error) {
        button.disabled = false;
        button.textContent = "Error: " + (error && error.message ? error.message : "Please try again.");
        button.style.background = "#ef4444";

        window.setTimeout(function () {
          button.textContent = originalText;
          button.style.background = "";
        }, 6000);
      });
  });
})();
