const DATA_URL = "https://dummyjson.com/products/category/beauty?limit=30";

// Constructor function + prototype methods (single JS file requirement).
function Product(data) {
  this.id = data.id ?? null;
  this.name = data.name ?? "";
  this.price = Number(data.price ?? 0);
  this.description = data.description ?? "";
  this.category = data.category ?? "";
  this.brand = data.brand ?? "";
  this.image = data.image ?? "";
  this.rating = Number(data.rating ?? 0);
  this.ratingCount = Number(data.ratingCount ?? 0);
  this.oldPrice = data.oldPrice ?? null;
  this.badge = data.badge ?? "";
  this.skinType = data.skinType ?? "";
}

Product.prototype.matchesField = function matchesField(fieldName, value) {
  const filterValue = String(value || "").trim().toLowerCase();
  if (!filterValue) return true;
  const ownValue = String(this[fieldName] || "").trim().toLowerCase();
  return ownValue.includes(filterValue);
};

function normalizeProduct(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.name && !raw.title) return null;

  // Map DummyJSON fields → our Product model
  const mapped = {
    id:          raw.id,
    name:        raw.name  || raw.title,
    price:       raw.price,
    description: raw.description,
    category:    raw.category,
    brand:       raw.brand,
    image:       raw.image || raw.thumbnail,          // DummyJSON uses "thumbnail"
    rating:      raw.rating,
    ratingCount: raw.ratingCount || raw.stock || 0,   // use stock count as a proxy
    oldPrice:    raw.oldPrice
                   || (raw.discountPercentage         // calculate original price
                         ? (raw.price / (1 - raw.discountPercentage / 100)).toFixed(2)
                         : null),
    badge:       raw.badge
                   || (raw.discountPercentage >= 10 ? `${Math.round(raw.discountPercentage)}% OFF` : ""),
    skinType:    raw.skinType || "",
  };

  return new Product(mapped);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderStars(rating) {
  const rounded = Math.round(Number(rating) || 0);
  const safe = Math.min(5, Math.max(0, rounded));
  const full = "&#9733;".repeat(safe);
  const empty = "&#9734;".repeat(5 - safe);
  return full + empty;
}

async function fetchProducts() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products: " + res.status);

  const data = await res.json();
  let list = [];
  if (Array.isArray(data)) list = data;
  else if (Array.isArray(data.products)) list = data.products;
  else if (Array.isArray(data.items)) list = data.items;

  return list.map(normalizeProduct).filter(Boolean);
}

function getListFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: (params.get("category") || "").trim(),
    brand: (params.get("brand") || "").trim(),
  };
}

function filterProducts(products, filters) {
  return products.filter(function (product) {
    return product.matchesField("category", filters.category) && product.matchesField("brand", filters.brand);
  });
}

function renderProducts(products) {
  const container = document.getElementById("products-grid");
  const countEl = document.querySelector(".products-count strong");

  if (countEl) countEl.textContent = String(products.length);
  if (!container) return;

  container.innerHTML = "";

  if (!products.length) return;

  // Use the reusable ProductCard component from components.js
  products.forEach(function (p) {
    container.appendChild(ProductCard(p));
  });
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function getProductDetailEls() {
  return {
    image: document.getElementById("product-image"),
    title: document.getElementById("product-title"),
    category: document.getElementById("product-category"),
    stars: document.getElementById("product-stars"),
    ratingText: document.getElementById("product-rating-text"),
    price: document.getElementById("product-price"),
    description: document.getElementById("product-description"),
    badges: document.getElementById("product-badges"),
  };
}

function setProductImage(product, els) {
  if (!els.image) return;
  els.image.src = product.image || "images/product-serum.jpg";
  els.image.alt = product.name || "Product image";
}

function setProductMeta(product, els) {
  if (els.title) els.title.textContent = product.name;
  if (els.category) els.category.textContent = product.category || "";
  if (els.stars) els.stars.innerHTML = renderStars(product.rating);
  if (els.ratingText) {
    els.ratingText.textContent = product.ratingCount
      ? `${product.rating.toFixed(1)} (${product.ratingCount})`
      : product.rating.toFixed(1);
  }
}

function setProductPrice(product, els) {
  if (!els.price) return;
  const oldPrice = product.oldPrice ? ` <span class="product-price-original">$${product.oldPrice}</span>` : "";
  els.price.innerHTML = `$${product.price}${oldPrice}`;
}

function setProductDescription(product, els) {
  if (els.description) els.description.textContent = product.description || "";
}

function setProductBadges(product, els) {
  if (!els.badges) return;
  const tags = [];
  if (product.badge) tags.push(`<span class="product-badge badge-sale">${escapeHtml(product.badge)}</span>`);
  if (product.brand) tags.push(`<span class="ingredient-tag">${escapeHtml(product.brand)}</span>`);
  if (product.skinType) tags.push(`<span class="ingredient-tag">${escapeHtml(product.skinType)}</span>`);
  if (product.category) tags.push(`<span class="ingredient-tag">${escapeHtml(product.category)}</span>`);
  els.badges.innerHTML = tags.join("");
}

function setProductPageMeta(product) {
  setText("breadcrumb-product", product.name);
  document.title = `${product.name} | GLOW Skincare`;
}

function renderProductDetail(product) {
  const els = getProductDetailEls();
  setProductImage(product, els);
  setProductMeta(product, els);
  setProductPrice(product, els);
  setProductDescription(product, els);
  setProductBadges(product, els);
  setProductPageMeta(product);
}

async function initProducts() {

  let allProducts = [];
  try {
    allProducts = await fetchProducts();
  } catch (err) {
    allProducts = [];
  }

  const filters = getListFilters();
  const filtered = filterProducts(allProducts, filters);
  renderProducts(filtered);
}

async function initProductDetail() {

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const productId = idParam ? Number(idParam) : null;

  let products = [];
  try {
    products = await fetchProducts();
  } catch (err) {
    products = [];
  }

  if (!products.length) return;

  const product = productId ? products.find((p) => Number(p.id) === productId) : products[0];
  if (!product) return;

  renderProductDetail(product);
}

function main() {
  // One bundle works for both pages by checking which DOM exists.
  if (document.getElementById("products-grid")) initProducts();
  else if (document.getElementById("product-detail")) initProductDetail();
}

main();

