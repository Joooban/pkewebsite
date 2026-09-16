/* PKE — contact page: front-end-only demo submit */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var note = form.querySelector("[data-form-note]");
    var submitBtn = form.querySelector("[data-form-submit]");
    if (note) {
      note.textContent = "Thanks — we've got your message and will get back to you shortly.";
      note.classList.add("is-visible");
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.disabled = false;
      }, 900);
    }
    form.reset();
  });
})();
