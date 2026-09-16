/* PKE — product detail page: gallery thumbs, tabs, sticky quote bar */
(function () {
  "use strict";

  /* ---------- Gallery thumbnails (crop into different regions of the one product photo) ---------- */
  var mainFrame = document.querySelector("[data-gallery-image]");
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-thumb-pos]"));
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      thumbs.forEach(function (t) {
        t.removeAttribute("aria-current");
      });
      thumb.setAttribute("aria-current", "true");
      if (mainFrame) {
        mainFrame.style.backgroundSize = thumb.dataset.thumbSize;
        mainFrame.style.backgroundPosition = thumb.dataset.thumbPos;
      }
    });
  });

  /* ---------- Tabs ---------- */
  var tabButtons = Array.prototype.slice.call(document.querySelectorAll("[data-tab-btn]"));
  var tabPanels = Array.prototype.slice.call(document.querySelectorAll("[data-tab-panel]"));
  tabButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabButtons.forEach(function (b) {
        b.setAttribute("aria-selected", "false");
      });
      tabPanels.forEach(function (p) {
        p.classList.remove("is-active");
      });
      btn.setAttribute("aria-selected", "true");
      var panel = document.querySelector('[data-tab-panel="' + btn.dataset.tabBtn + '"]');
      if (panel) panel.classList.add("is-active");
    });
  });

  /* ---------- Sticky quote bar (appears once the buy block scrolls past) ---------- */
  var buyBlock = document.querySelector("[data-buy-block]");
  var stickyBar = document.querySelector("[data-sticky-quote-bar]");
  if (buyBlock && stickyBar) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            stickyBar.classList.toggle("is-visible", !entry.isIntersecting && entry.boundingClientRect.top < 0);
          });
        },
        { threshold: 0 }
      );
      io.observe(buyBlock);
    }
  }
})();
