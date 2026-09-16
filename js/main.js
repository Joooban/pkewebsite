/* PKE — shared behavior: header scroll state, mobile drawer, cart counter, hours status, scroll-reveal */
(function () {
  "use strict";

  /* ---------- Sticky / scrolled header ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav drawer ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var drawer = document.querySelector("[data-menu-drawer]");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Cart / quote counter (persists across pages via sessionStorage) ---------- */
  var CART_KEY = "pke-quote-count";
  function getCartCount() {
    var n = parseInt(sessionStorage.getItem(CART_KEY), 10);
    return isNaN(n) ? 2 : n; // seed matches the sample "2 items already quoted" state
  }
  function setCartCount(n) {
    sessionStorage.setItem(CART_KEY, String(n));
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = n;
    });
  }
  setCartCount(getCartCount());

  document.querySelectorAll("[data-add-to-quote]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setCartCount(getCartCount() + 1);
      var original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
      }, 900);
    });
  });

  /* ---------- Hero lineup scroll-reveal ---------- */
  var lineup = document.querySelector("[data-hero-lineup]");
  if (lineup) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              lineup.classList.add("is-visible");
              io.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(lineup);
    } else {
      lineup.classList.add("is-visible");
    }
  }

  /* ---------- Generic scroll-reveal for cards and sections ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var revealIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 5) * 70 + "ms";
        revealIo.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ---------- Open/closed status — Mon–Sat, 8AM–5PM, Asia/Manila ---------- */
  var hoursDot = document.querySelector("[data-hours-dot]");
  var hoursLabel = document.querySelector("[data-hours-label]");
  if (hoursDot || hoursLabel) {
    try {
      var parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Manila",
        hour12: false,
        weekday: "short",
        hour: "numeric"
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) {
        map[p.type] = p.value;
      });
      var openDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var hour = parseInt(map.hour, 10);
      var isOpen = openDays.indexOf(map.weekday) > -1 && hour >= 8 && hour < 17;
      if (hoursDot) hoursDot.setAttribute("data-open", isOpen ? "true" : "false");
      if (hoursLabel) hoursLabel.textContent = isOpen ? "Open now" : "Closed";
    } catch (e) {
      if (hoursLabel) hoursLabel.textContent = "Mon–Sat, 8AM–5PM";
    }
  }
})();
