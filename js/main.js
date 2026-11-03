/* CelineWTQ storefront — vanilla JS, no dependencies. */
(function () {
  "use strict";

  var CART_KEY = "celinewtq-cart-count";
  var SVG_NS = "http://www.w3.org/2000/svg";

  // shape: plate | bowl | mug | platter | cup | vase
  var PRODUCTS = [
    { id: "harvest-dinner-plate", name: "Harvest Dinner Plate", category: "Plates", price: 38, rating: 4.8, reviews: 214, shape: "plate", glaze: "#C9B79C", alt: "Oat-glazed stoneware dinner plate with a raw clay rim, viewed from above" },
    { id: "sage-side-plate", name: "Sage Side Plate", category: "Plates", price: 26, rating: 4.6, reviews: 132, shape: "plate", glaze: "#8A9A86", alt: "Small side plate in a soft sage green glaze, viewed from above" },
    { id: "ember-ramen-bowl", name: "Ember Ramen Bowl", category: "Bowls", price: 44, rating: 4.9, reviews: 98, shape: "bowl", glaze: "#A9603E", alt: "Deep rust-coloured ramen bowl with a speckled finish" },
    { id: "oat-cereal-bowl", name: "Oat Cereal Bowl", category: "Bowls", price: 32, rating: 4.5, reviews: 176, shape: "bowl", glaze: "#D8C8AE", alt: "Everyday cereal bowl in a creamy oat glaze" },
    { id: "morning-mug", name: "Morning Mug", category: "Mugs", price: 34, rating: 4.7, reviews: 301, shape: "mug", glaze: "#4F6B5E", alt: "Forest green handmade mug with a thumb rest on the handle" },
    { id: "pebble-espresso-cup", name: "Pebble Espresso Cup", category: "Mugs", price: 22, rating: 4.4, reviews: 87, shape: "cup", glaze: "#B98A62", alt: "Small handleless espresso cup in a warm caramel glaze" },
    { id: "gathering-platter", name: "Gathering Serving Platter", category: "Serving", price: 89, rating: 4.9, reviews: 64, shape: "platter", glaze: "#E3D6C1", alt: "Large oval serving platter in oat glaze with a darker clay edge" },
    { id: "autumn-bud-vase", name: "Autumn Bud Vase", category: "Serving", price: 42, rating: 4.3, reviews: 41, shape: "vase", glaze: "#A9784F", alt: "Slender bud vase in a mottled amber glaze" }
  ];

  var priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  function formatPrice(value) {
    return priceFormatter.format(value);
  }

  /* ---------- Product imagery (inline SVG placeholders) ---------- */

  var SHAPES = {
    plate: function (g) {
      return '<circle cx="200" cy="150" r="105" fill="#F7F2EA"/>' +
        '<circle cx="200" cy="150" r="96" fill="' + g + '"/>' +
        '<circle cx="200" cy="150" r="62" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3"/>';
    },
    bowl: function (g) {
      return '<ellipse cx="200" cy="215" rx="100" ry="14" fill="rgba(26,26,26,.08)"/>' +
        '<path d="M95 120c0 60 45 95 105 95s105-35 105-95Z" fill="' + g + '"/>' +
        '<ellipse cx="200" cy="120" rx="105" ry="22" fill="#F4EEE4"/>' +
        '<ellipse cx="200" cy="122" rx="92" ry="16" fill="' + g + '" opacity=".55"/>';
    },
    mug: function (g) {
      return '<ellipse cx="190" cy="232" rx="78" ry="10" fill="rgba(26,26,26,.08)"/>' +
        '<path d="M262 120h16a32 32 0 0 1 0 64h-16" fill="none" stroke="' + g + '" stroke-width="14"/>' +
        '<rect x="120" y="80" width="142" height="150" rx="20" fill="' + g + '"/>' +
        '<ellipse cx="191" cy="84" rx="71" ry="10" fill="rgba(255,255,255,.25)"/>';
    },
    cup: function (g) {
      return '<ellipse cx="200" cy="222" rx="60" ry="9" fill="rgba(26,26,26,.08)"/>' +
        '<path d="M145 105h110l-10 105a14 14 0 0 1-14 12h-62a14 14 0 0 1-14-12Z" fill="' + g + '"/>' +
        '<ellipse cx="200" cy="106" rx="55" ry="9" fill="rgba(255,255,255,.3)"/>';
    },
    platter: function (g) {
      return '<ellipse cx="200" cy="158" rx="160" ry="92" fill="#B79A78"/>' +
        '<ellipse cx="200" cy="152" rx="150" ry="84" fill="' + g + '"/>' +
        '<ellipse cx="200" cy="152" rx="112" ry="58" fill="none" stroke="rgba(26,26,26,.06)" stroke-width="3"/>';
    },
    vase: function (g) {
      return '<ellipse cx="200" cy="238" rx="54" ry="8" fill="rgba(26,26,26,.08)"/>' +
        '<path d="M184 50h32v30c0 20 40 40 40 95 0 40-25 60-56 60s-56-20-56-60c0-55 40-75 40-95Z" fill="' + g + '"/>' +
        '<path d="M200 50c-6-20 4-34 14-40" fill="none" stroke="#6F7F5F" stroke-width="3"/>';
    }
  };

  function productImage(product) {
    var titleId = "img-" + product.id;
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 400 300");
    svg.setAttribute("width", "400");
    svg.setAttribute("height", "300");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-labelledby", titleId);
    svg.innerHTML = '<title id="' + titleId + '"></title>' +
      '<rect width="400" height="300" fill="#F1EBE1"/>' +
      SHAPES[product.shape](product.glaze);
    svg.querySelector("title").textContent = product.alt;
    return svg;
  }

  var STAR_PATH = "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9Z";

  function starIcon(fill) {
    // fill: 0 (empty) .. 1 (full); half stars use a clip
    var pct = Math.round(fill * 100);
    var id = "star-" + Math.random().toString(36).slice(2, 9);
    return '<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><rect width="' + (pct / 5) + '" height="20"/></clipPath></defs>' +
      '<path d="' + STAR_PATH + '" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
      '<path d="' + STAR_PATH + '" fill="currentColor" clip-path="url(#' + id + ')"/>' +
      "</svg>";
  }

  function ratingMarkup(rating) {
    var rounded = Math.round(rating * 2) / 2;
    var html = "";
    for (var i = 1; i <= 5; i++) {
      html += starIcon(Math.max(0, Math.min(1, rounded - (i - 1))));
    }
    return html;
  }

  function renderProducts(grid) {
    var fragment = document.createDocumentFragment();

    PRODUCTS.forEach(function (product) {
      var li = document.createElement("li");
      var card = document.createElement("article");
      card.className = "product-card";
      card.setAttribute("aria-labelledby", "name-" + product.id);

      var figure = document.createElement("figure");
      figure.className = "product-media";
      figure.appendChild(productImage(product));

      var body = document.createElement("div");
      body.className = "product-body";
      body.innerHTML =
        '<p class="product-category"></p>' +
        '<h3 class="product-name" id="name-' + product.id + '"></h3>' +
        '<div class="product-meta">' +
          '<p class="price"><span class="visually-hidden">Price: </span><span class="price-value"></span></p>' +
          '<p class="rating" role="img"><span class="stars">' + ratingMarkup(product.rating) + "</span>" +
          '<span class="review-count" aria-hidden="true"></span></p>' +
        "</div>" +
        '<button type="button" class="btn btn-primary add-to-cart">Add to cart</button>';

      body.querySelector(".product-category").textContent = product.category;
      body.querySelector(".product-name").textContent = product.name;
      body.querySelector(".price-value").textContent = formatPrice(product.price);
      body.querySelector(".review-count").textContent = "(" + product.reviews + ")";

      var rating = body.querySelector(".rating");
      rating.setAttribute("aria-label", "Rated " + product.rating + " out of 5, " + product.reviews + " reviews");

      var button = body.querySelector(".add-to-cart");
      button.dataset.productId = product.id;
      button.setAttribute("aria-label", "Add " + product.name + " to cart");

      card.appendChild(figure);
      card.appendChild(body);
      li.appendChild(card);
      fragment.appendChild(li);
    });

    grid.appendChild(fragment);
  }

  /* ---------- Cart ---------- */

  function readCount() {
    var raw;
    try {
      raw = window.localStorage.getItem(CART_KEY);
    } catch (e) {
      return 0; // storage unavailable (privacy mode, disabled, file:// restrictions)
    }
    if (raw === null) return 0;
    // Number() rejects partial strings like "12oops"; isSafeInteger rejects Infinity ("1e400"), fractions and NaN
    var n = raw.trim() === "" ? NaN : Number(raw);
    if (Number.isSafeInteger(n) && n >= 0) return n;
    writeCount(0); // reset corrupt value
    return 0;
  }

  function writeCount(n) {
    try {
      window.localStorage.setItem(CART_KEY, String(n));
    } catch (e) { /* ignore — count still works for this page view */ }
  }

  var cartCount = 0;

  function renderCart(bump) {
    var badge = document.getElementById("cart-count");
    var link = document.getElementById("cart-link");
    badge.textContent = cartCount > 99 ? "99+" : String(cartCount);
    link.setAttribute("aria-label", "Cart, " + cartCount + (cartCount === 1 ? " item" : " items"));
    if (bump) {
      badge.classList.remove("is-bumped");
      void badge.offsetWidth; // restart animation
      badge.classList.add("is-bumped");
    }
  }

  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function handleAddToCart(button) {
    var product = PRODUCTS.find(function (p) { return p.id === button.dataset.productId; });
    if (!product) return;

    cartCount += 1;
    writeCount(cartCount);
    renderCart(true);
    showToast(product.name + " added to cart. " + cartCount + (cartCount === 1 ? " item" : " items") + " in your cart.");

    button.textContent = "Added ✓";
    button.classList.add("is-added");
    clearTimeout(button._resetTimer);
    button._resetTimer = setTimeout(function () {
      button.textContent = "Add to cart";
      button.classList.remove("is-added");
    }, 1600);
  }

  /* ---------- Newsletter ---------- */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateEmail(value) {
    if (!value) return "Please enter your email address.";
    if (!EMAIL_RE.test(value)) return "Please enter a valid email address, like name@example.com.";
    return "";
  }

  function initNewsletter() {
    var form = document.getElementById("newsletter-form");
    var input = document.getElementById("newsletter-email");
    var error = document.getElementById("newsletter-error");
    var success = document.getElementById("newsletter-success");

    function setError(message) {
      error.textContent = message;
      if (message) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value.trim();
      var message = validateEmail(value);
      setError(message);
      if (message) {
        input.focus();
        return;
      }
      form.querySelector(".field").hidden = true;
      success.textContent = "Thank you! Your 10% off code WELCOME10 is on its way to " + value + ".";
      success.hidden = false;
      success.focus(); // the focused submit button was just hidden
    });

    // clear the error as soon as the input becomes valid
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true" && !validateEmail(input.value.trim())) {
        setError("");
      }
    });
  }

  /* ---------- Navigation ---------- */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("product-grid");
    renderProducts(grid);
    grid.addEventListener("click", function (event) {
      var button = event.target.closest(".add-to-cart");
      if (button) handleAddToCart(button);
    });

    document.getElementById("cart-link").addEventListener("click", function () {
      showToast(cartCount === 0 ? "Your cart is empty." : "You have " + cartCount + (cartCount === 1 ? " item" : " items") + " in your cart.");
    });

    cartCount = readCount();
    renderCart(false);
    initNewsletter();
    initNav();

    document.getElementById("year").textContent = String(new Date().getFullYear());
  });
})();
