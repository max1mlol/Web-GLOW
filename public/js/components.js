// =============================================================
// components.js  –  Reusable UI Function Components
// Used across: index.html, products.html, cart.html
// =============================================================

// --- Helper: escape HTML to prevent XSS ---
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// --- Helper: render star rating (★★★☆☆) ---
function renderStars(rating) {
  const safe = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));
  return "&#9733;".repeat(safe) + "&#9734;".repeat(5 - safe);
}

// ============================================================
//  1. renderHeader({ activePage, cartCount })
//     activePage: 'home' | 'products' | 'cart' | 'admin'
//     cartCount : number shown in the badge
// ============================================================
function renderHeader({ activePage = "", cartCount = 0 } = {}) {
  function active(page) {
    return activePage === page ? ' class="active"' : "";
  }

  return `
    <div class="skip-link-wrap">
      <a class="skip-link" href="#main-content">Үндсэн хэсэг рүү очих</a>
    </div>
    <div class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="logo">GLOW</a>

        <input type="checkbox" id="menu-toggle" class="menu-toggle-checkbox" />
        <label for="menu-toggle" class="menu-toggle-label">
          <span></span><span></span><span></span>
        </label>

        <div class="nav-links">
          <a href="index.html"${active("home")}>Нүүр</a>
          <a href="products.html"${active("products")}>Бүтээгдэхүүн</a>
          <a href="cart.html"${active("cart")}>Сагс</a>
          <a href="admin.html"${active("admin")}>Удирдлага</a>
        </div>

        <div class="nav-actions">
          <label for="theme-toggle" class="theme-toggle-label">
            <span class="sr-only">Dark горим</span>
          </label>
          <a href="cart.html" class="cart-link">
            Сагс <span class="cart-badge">${cartCount}</span>
          </a>
          <a href="login.html" class="btn btn-sm btn-primary">Нэвтрэх</a>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
//  2. renderFooter()
// ============================================================
function renderFooter() {
  return `
    <div class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo">GLOW</a>
            <p>Шинжлэх ухаанд суурилсан найрлага, чанартай орцтой арьс арчилгааны бүтээгдэхүүн.</p>
          </div>
          <div class="footer-col">
            <h4>Дэлгүүр</h4>
            <ul>
              <li><a href="products.html">Бүх бүтээгдэхүүн</a></li>
              <li><a href="products.html">Серум</a></li>
              <li><a href="products.html">Чийгшүүлэгч</a></li>
              <li><a href="products.html">Цэвэрлэгч</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Компанийн тухай</h4>
            <ul>
              <li><a href="index.html">Бидний тухай</a></li>
              <li><a href="index.html">Түүх</a></li>
              <li><a href="index.html">Тогтвортой байдал</a></li>
              <li><a href="index.html">Холбоо барих</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Тусламж</h4>
            <ul>
              <li><a href="index.html">Түгээмэл асуулт</a></li>
              <li><a href="index.html">Хүргэлт</a></li>
              <li><a href="index.html">Буцаалт</a></li>
              <li><a href="login.html">Миний бүртгэл</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&#169; 2026 GLOW Skincare. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div class="footer-bottom-links">
            <a href="index.html">Нууцлалын бодлого</a>
            <a href="index.html">Үйлчилгээний нөхцөл</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
//  3. ProductCard(product)
//     Returns a DOM element (not a string) so we can attach
//     the Favorite button event listener directly.
//
//     product: { id, name, price, oldPrice, description,
//                category, image, rating, ratingCount, badge }
// ============================================================
function ProductCard(product) {
  // --- Favorite state (per card, stored in localStorage) ---
  const favoriteKey = "fav_" + product.id;
  let liked = localStorage.getItem(favoriteKey) === "1";
  let likeCount = parseInt(localStorage.getItem(favoriteKey + "_count") || "0", 10);

  // --- Build card element ---
  const card = document.createElement("div");
  card.className = "product-card";

  const price = `$${product.price}`;
  const oldPriceHtml = product.oldPrice
    ? `<span class="product-price-original">$${product.oldPrice}</span>`
    : "";
  const badgeHtml = product.badge
    ? `<span class="product-badge badge-sale">${escapeHtml(product.badge)}</span>`
    : "";
  const ratingText = product.ratingCount
    ? `${Number(product.rating).toFixed(1)} (${product.ratingCount})`
    : Number(product.rating).toFixed(1);

  card.innerHTML = `
    <a href="product-detail.html?id=${encodeURIComponent(product.id)}">
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}"
           class="product-card-img" width="300" height="300" />
    </a>
    <div class="product-card-body">
      <span class="product-card-category">${escapeHtml(product.category)}</span>
      <h3>
        <a href="product-detail.html?id=${encodeURIComponent(product.id)}">
          ${escapeHtml(product.name)}
        </a>
      </h3>
      <p class="product-card-desc">${escapeHtml(product.description)}</p>
      <div class="product-card-footer">
        <span class="product-price">${price}${oldPriceHtml}</span>
        ${badgeHtml}
      </div>
      <div class="product-rating mt-2">
        <span class="stars">${renderStars(product.rating)}</span>
        <span class="rating-text">${escapeHtml(ratingText)}</span>
      </div>
      <button class="favorite-btn${liked ? " liked" : ""}" aria-label="Дуртай болгох">
        ${liked ? "&#10084;" : "&#9825;"} <span class="favorite-count">${likeCount}</span>
      </button>
    </div>
  `;

  // --- Favorite button click logic ---
  const btn = card.querySelector(".favorite-btn");
  const countEl = card.querySelector(".favorite-count");

  btn.addEventListener("click", function () {
    liked = !liked;
    likeCount = liked ? likeCount + 1 : Math.max(0, likeCount - 1);

    // Update state
    localStorage.setItem(favoriteKey, liked ? "1" : "0");
    localStorage.setItem(favoriteKey + "_count", String(likeCount));

    // Update UI
    btn.innerHTML = `${liked ? "&#10084;" : "&#9825;"} <span class="favorite-count">${likeCount}</span>`;
    btn.classList.toggle("liked", liked);
  });

  return card;
}

// ============================================================
//  4. renderTestimonialCard({ stars, quote, avatar, name, title })
//     Returns an HTML string for a testimonial card.
// ============================================================
function renderTestimonialCard({ stars = 5, quote = "", avatar = "?", name = "", title = "" } = {}) {
  return `
    <div class="testimonial-card">
      <div class="stars">${renderStars(stars)}</div>
      <p class="testimonial-quote">"${escapeHtml(quote)}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${escapeHtml(avatar)}</div>
        <div>
          <div class="testimonial-name">${escapeHtml(name)}</div>
          <div class="testimonial-title">${escapeHtml(title)}</div>
        </div>
      </div>
    </div>
  `;
}
