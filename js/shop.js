/* PKE — product listing page: filters, sort, load more, empty state */
(function () {
  "use strict";

  var grid = document.querySelector("[data-product-grid]");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));
  cards.forEach(function (card, i) {
    card.dataset.order = i;
  });

  var brandBoxes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-brand]"));
  var powerToggles = Array.prototype.slice.call(document.querySelectorAll("[data-filter-power]"));
  var capacityPills = Array.prototype.slice.call(document.querySelectorAll("[data-filter-capacity]"));
  var priceSlider = document.querySelector("[data-price-slider]");
  var priceLabel = document.querySelector("[data-price-label]");
  var clearBtn = document.querySelector("[data-clear-filters]");
  var resetBtn = document.querySelector("[data-reset-filters]");
  var countEl = document.querySelector("[data-result-count]");
  var emptyState = document.querySelector("[data-empty-state]");
  var loadMoreBtn = document.querySelector("[data-load-more]");
  var sortTrigger = document.querySelector("[data-sort-trigger]");
  var sortMenu = document.querySelector("[data-sort-menu]");
  var sortLabel = document.querySelector("[data-sort-label]");

  var peso = function (n) {
    return "₱" + Number(n).toLocaleString("en-US");
  };

  function activeValues(nodes, attr) {
    return nodes
      .filter(function (n) {
        if (n.matches("input")) return n.checked;
        return n.getAttribute("aria-pressed") === "true";
      })
      .map(function (n) {
        return n.dataset[attr];
      });
  }

  function applyFilters() {
    var brands = activeValues(brandBoxes, "filterBrand");
    var powers = activeValues(powerToggles, "filterPower");
    var caps = activeValues(capacityPills, "filterCapacity");
    var maxPrice = priceSlider ? Number(priceSlider.value) : Infinity;

    var visibleCount = 0;
    cards.forEach(function (card) {
      var isExtra = card.dataset.extra === "true" && !card.dataset.revealed;
      var price = Number(card.dataset.price);
      var matches =
        !isExtra &&
        (brands.length === 0 || brands.indexOf(card.dataset.brand) > -1) &&
        (powers.length === 0 || powers.indexOf(card.dataset.power) > -1) &&
        (caps.length === 0 || caps.indexOf(card.dataset.capacity) > -1) &&
        price <= maxPrice;
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    if (countEl) countEl.textContent = visibleCount;
    if (emptyState) emptyState.classList.toggle("is-visible", visibleCount === 0);
    if (grid) grid.hidden = visibleCount === 0;

    var remainingExtras = cards.some(function (c) {
      return c.dataset.extra === "true" && !c.dataset.revealed;
    });
    if (loadMoreBtn) loadMoreBtn.hidden = !remainingExtras;
  }

  brandBoxes.forEach(function (box) {
    box.addEventListener("change", applyFilters);
  });
  powerToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var pressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!pressed));
      applyFilters();
    });
  });
  capacityPills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      var pressed = pill.getAttribute("aria-pressed") === "true";
      pill.setAttribute("aria-pressed", String(!pressed));
      applyFilters();
    });
  });
  if (priceSlider) {
    priceSlider.addEventListener("input", function () {
      if (priceLabel) priceLabel.textContent = peso(priceSlider.value);
      applyFilters();
    });
  }

  function clearAll() {
    brandBoxes.forEach(function (box) {
      box.checked = false;
    });
    powerToggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
    });
    capacityPills.forEach(function (pill) {
      pill.setAttribute("aria-pressed", "false");
    });
    if (priceSlider) {
      priceSlider.value = priceSlider.max;
      if (priceLabel) priceLabel.textContent = peso(priceSlider.value);
    }
    applyFilters();
  }
  if (clearBtn) clearBtn.addEventListener("click", clearAll);
  if (resetBtn) resetBtn.addEventListener("click", clearAll);

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      cards.forEach(function (card) {
        if (card.dataset.extra === "true" && !card.dataset.revealed) {
          card.dataset.revealed = "true";
        }
      });
      applyFilters();
    });
  }

  /* ---------- Sort ---------- */
  function sortCards(mode) {
    var sorted = cards.slice().sort(function (a, b) {
      if (mode === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (mode === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (mode === "newest") return Number(b.dataset.newest) - Number(a.dataset.newest);
      return Number(a.dataset.order) - Number(b.dataset.order); // Best Sellers = curated order
    });
    sorted.forEach(function (card) {
      grid.appendChild(card);
    });
  }

  if (sortTrigger && sortMenu) {
    sortTrigger.addEventListener("click", function () {
      var open = sortMenu.classList.toggle("is-open");
      sortTrigger.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!sortMenu.contains(e.target) && !sortTrigger.contains(e.target)) {
        sortMenu.classList.remove("is-open");
        sortTrigger.setAttribute("aria-expanded", "false");
      }
    });
    Array.prototype.slice.call(sortMenu.querySelectorAll("button")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        Array.prototype.slice.call(sortMenu.querySelectorAll("button")).forEach(function (b) {
          b.setAttribute("aria-selected", "false");
        });
        btn.setAttribute("aria-selected", "true");
        if (sortLabel) sortLabel.textContent = btn.textContent;
        sortCards(btn.dataset.sort);
        sortMenu.classList.remove("is-open");
        sortTrigger.setAttribute("aria-expanded", "false");
      });
    });
  }

  applyFilters();
})();
