// ============================================================
// js/components.js
// UI компонентуудын модуль — дахин ашиглагдах функц-компонентууд
//
// Компонент бүр:
//   - Зөвхөн UI (харагдах хэсэг) үүсгэнэ
//   - Шаардлагатай өгөгдлийг аргументээр авна
//   - Бусдаас хамааралгүй — дахин ашиглах боломжтой
//   - Өгөгдөл өөрчлөгдвөл дахин зурагдана (DOM-ийг update хийнэ)
// ============================================================


// ──────────────────────────────────────────────────────────────
// Туслах: одоор рейтинг харуулах
// Жишээ: createStars(4.8) → "★★★★★"
// ──────────────────────────────────────────────────────────────
function createStars(rating) {
  const full  = Math.floor(rating);             // бүтэн одны тоо
  const empty = 5 - full;                       // хоосон одны тоо
  return '★'.repeat(full) + '☆'.repeat(empty);
}


// ══════════════════════════════════════════════════════════════
// ProductCard компонент
//
// Аргументууд:
//   product      — Product объект (api.js-ийн Product классаас)
//   options = {
//     savedIds:     Set<number>  — хадгалсан ID-уудын Set
//     onSaveToggle: function     — хадгалах товч дарахад дуудагдах
//   }
//
// Буцаах: <div class="product-card"> — HTML элемент
// ══════════════════════════════════════════════════════════════
function ProductCard(product, options = {}) {
  const { savedIds = new Set(), onSaveToggle = null } = options;

  // Карточны үндсэн элемент
  const card = document.createElement('div');
  card.className       = 'product-card';
  card.dataset.productId = product.id;

  // Анхны хадгалагдсан байдал
  const isSaved = savedIds.has(product.id);

  // ── HTML бүтэц ──────────────────────────────────────────────
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

      <!-- Хадгалах товч (Save / Like) -->
      <button
        class="save-btn${isSaved ? ' saved' : ''}"
        aria-label="${isSaved ? 'Хадгаласнаас хасах' : 'Хадгалах'}"
        data-product-id="${product.id}"
        title="${isSaved ? 'Хадгаласнаас хасах' : 'Хадгалах'}"
      >
        <!-- Зүрхний дүрс — хадгалсан бол дүүрэн, үгүй бол хоосон -->
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

      <!-- Үнэ + рейтинг -->
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

    <!-- Сагсанд нэмэх товч -->
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

  // ── Save товчны интерактив байдал ────────────────────────────
  const saveBtn = card.querySelector('.save-btn');

  saveBtn.addEventListener('click', () => {
    // Одоогийн байдлыг олох
    const currentlySaved = savedIds.has(product.id);

    // Toggle хийх
    if (currentlySaved) {
      savedIds.delete(product.id);
    } else {
      savedIds.add(product.id);
    }

    const nowSaved = savedIds.has(product.id);

    // ── DOM-г шинэчлэх (re-render биш, зөвхөн өөрчлөгдсөн хэсгийг) ──
    saveBtn.classList.toggle('saved', nowSaved);
    saveBtn.setAttribute('aria-label', nowSaved ? 'Хадгаласнаас хасах' : 'Хадгалах');
    saveBtn.title = nowSaved ? 'Хадгаласнаас хасах' : 'Хадгалах';

    // Зүрхний дүрсийг шинэчлэх
    const svgEl = saveBtn.querySelector('svg');
    svgEl.setAttribute('fill', nowSaved ? 'currentColor' : 'none');

    // Текстийг шинэчлэх
    saveBtn.querySelector('.save-label').textContent = nowSaved ? 'Хадгалсан' : 'Хадгалах';

    // Callback дуудах (products.js localStorage-д хадгалах боломжтой болно)
    if (typeof onSaveToggle === 'function') {
      onSaveToggle(product.id, nowSaved);
    }
  });

  return card;
}


// ══════════════════════════════════════════════════════════════
// EmptyState компонент
// Шүүлтийн үр дүн хоосон үед харуулна.
//
// Аргумент:
//   message — харуулах мессеж
// ══════════════════════════════════════════════════════════════
function EmptyState(message = 'Тохирох бүтээгдэхүүн олдсонгүй') {
  const el = document.createElement('div');
  el.className = 'empty-state';

  el.innerHTML = `
    <div class="empty-state-icon">
      <!-- Томруулдаг шил — "олдсонгүй" -->
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


// ══════════════════════════════════════════════════════════════
// LoadingSpinner компонент
// Өгөгдлийг татаж байх явцад харуулна.
// ══════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════
// ActiveFilterBadge компонент
// Идэвхтэй шүүлтүүрийг badge хэлбэрээр харуулна.
// "✕" дарахад тухайн шүүлтүүр арилна.
//
// Аргументууд:
//   label    — харуулах текст ("Серум", "Хуурай арьс" гэх мэт)
//   onRemove — хасах товч дарахад дуудагдах функц
// ══════════════════════════════════════════════════════════════
function ActiveFilterBadge(label, onRemove) {
  const badge = document.createElement('span');
  badge.className = 'active-filter-badge';

  badge.innerHTML = `
    ${label}
    <button class="active-filter-remove" aria-label="${label} шүүлтүүр хасах">✕</button>
  `;

  badge.querySelector('.active-filter-remove')
       .addEventListener('click', onRemove);

  return badge;
}


// ──────────────────────────────────────────────────────────────
// Экспорт
// ──────────────────────────────────────────────────────────────
export { ProductCard, EmptyState, LoadingSpinner, ActiveFilterBadge };
