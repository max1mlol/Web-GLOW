// js/components.js — дахин ашиглагдах UI компонентууд

// Тоон үнэлгээг одоор харуулна. Жишээ: 4.8 → "★★★★☆"
function createStars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}


// Нэг бүтээгдэхүүний card үүсгэж <div> буцаана.
// product: api.js-ийн Product объект
// options.savedIds: хадгалсан ID-уудын Set
// options.onSaveToggle: хадгалах товч дарахад дуудагдах функц

function ProductCard(product, options = {}) {
  const { savedIds = new Set(), onSaveToggle = null } = options;

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = product.id;

  const isSaved = savedIds.has(product.id);

  card.innerHTML = `
    <div class="product-card-img-wrap">
      <img
        src="${product.image}"
        alt="${product.imageAlt}"
        class="product-card-img"
        width="300"
        height="300"
        loading="lazy"
      />

      ${product.badge
      ? `<span class="product-badge badge-sale pc-badge">${product.badge}</span>`
      : ''
    }

      <button
        class="save-btn${isSaved ? ' saved' : ''}"
        aria-label="${isSaved ? 'Хадгаласнаас хасах' : 'Хадгалах'}"
        data-product-id="${product.id}"
        title="${isSaved ? 'Хадгаласнаас хасах' : 'Хадгалах'}"
      >
        <!-- Дүүрэн зүрх = хадгалсан, хоосон зүрх = хадгалаагүй -->
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
             viewBox="0 0 24 24"
             fill="${isSaved ? 'currentColor' : 'none'}"
             stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round"
             aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
                   a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
                   1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <span class="save-label">${isSaved ? 'Хадгалсан' : 'Хадгалах'}</span>
      </button>
    </div>

    <div class="product-card-body">
      <span class="product-card-category">${product.category}</span>

      <h3>
        <a href="product-detail.html?id=${product.id}">${product.name}</a>
      </h3>

      <p class="product-card-desc">${product.description}</p>

      <div class="product-card-footer">
        <span class="product-price">${product.getPriceHTML()}</span>
      </div>

      <div class="product-card-meta mt-4">
        <span class="stars" aria-label="${product.rating} одтой үнэлгээ">
          ${createStars(product.rating)}
        </span>
        <span class="rating-text">${product.rating} (${product.reviewCount})</span>
      </div>
    </div>

    <div class="product-card-actions">
      <button
        class="btn btn-sm btn-primary btn-add-cart"
        data-product-id="${product.id}"
        id="add-cart-${product.id}"
      >
        Сагсанд нэмэх
      </button>
    </div>
  `;

  // Save товч — бүтэн re-render хийхгүй, зөвхөн өөрчлөгдсөн хэсгийг шинэчилнэ
  const saveBtn = card.querySelector('.save-btn');

  saveBtn.addEventListener('click', () => {
    if (savedIds.has(product.id)) {
      savedIds.delete(product.id);
    } else {
      savedIds.add(product.id);
    }

    const nowSaved = savedIds.has(product.id);

    saveBtn.classList.toggle('saved', nowSaved);
    saveBtn.setAttribute('aria-label', nowSaved ? 'Хадгаласнаас хасах' : 'Хадгалах');
    saveBtn.title = nowSaved ? 'Хадгаласнаас хасах' : 'Хадгалах';
    saveBtn.querySelector('svg').setAttribute('fill', nowSaved ? 'currentColor' : 'none');
    saveBtn.querySelector('.save-label').textContent = nowSaved ? 'Хадгалсан' : 'Хадгалах';

    // Дуудагч (products.js) энд localStorage-г шинэчилнэ
    if (typeof onSaveToggle === 'function') {
      onSaveToggle(product.id, nowSaved);
    }
  });

  return card;
}


// Шүүлтийн үр дүн хоосон үед харуулах мессеж
function EmptyState(message = 'Тохирох бүтээгдэхүүн олдсонгүй') {
  const el = document.createElement('div');
  el.className = 'empty-state';

  el.innerHTML = `
    <div class="empty-state-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </div>
    <h3>${message}</h3>
    <p>Шүүлтүүрийг өөрчилж дахин оролдоно уу.</p>
    <a href="products.html" class="btn btn-secondary">Бүх бүтээгдэхүүн харах</a>
  `;

  return el;
}


// Өгөгдөл ачаалж байх үед харуулах spinner
function LoadingSpinner() {
  const el = document.createElement('div');
  el.className = 'loading-state';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');

  el.innerHTML = `
    <div class="spinner" aria-hidden="true"></div>
    <p>Өгөгдөл ачааллаж байна...</p>
  `;

  return el;
}


// Идэвхтэй шүүлтүүрийг badge хэлбэрээр харуулна — ✕ дарахад onRemove дуудагдана
function ActiveFilterBadge(label, onRemove) {
  const badge = document.createElement('span');
  badge.className = 'active-filter-badge';

  badge.innerHTML = `
    ${label}
    <button class="active-filter-remove" aria-label="${label} шүүлтүүр хасах">✕</button>
  `;

  badge.querySelector('.active-filter-remove').addEventListener('click', onRemove);

  return badge;
}


export { ProductCard, EmptyState, LoadingSpinner, ActiveFilterBadge };
