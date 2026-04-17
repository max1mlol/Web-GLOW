// js/products.js
// Бүтээгдэхүүний хуудасны үндсэн модуль
// Энэ файл хуудас ачааллахад:
//  1. JSONBin-аас өгөгдөл татна            (api.js)
//  2. URL параметрүүдийг унших             (getUrlParams)
//  3. Шүүлт + эрэмбэлэлт хийнэ            (api.js)
//  4. Карточнуудыг динамикаар зурна        (components.js)
//  5. Sort/Search UI-н event дагаж ажиллана

import { fetchProducts, filterProducts, sortProducts } from './api.js';
import { ProductCard, EmptyState, LoadingSpinner, ActiveFilterBadge } from './components.js';

// LocalStorage-оос хадгалсан бүтээгдэхүүний ID-уудыг уншина.
// Set ашигладаг учир O(1) хугацаанд шалгах боломжтой.

const savedProductIds = new Set(
  JSON.parse(localStorage.getItem('savedProducts') || '[]')
);

const grid        = document.getElementById('products-grid');
const countEl     = document.querySelector('.products-count');
const sortSelect  = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const searchForm  = document.querySelector('.search-box');

// getUrlParams — URL-ийн query параметрүүдийг объект болгон авна
// Жишээ URL: products.html?category=Серум&skinType=Хуурай+арьс&sort=rating
// Буцаах: { category: "Серум", skinType: "Хуурай арьс", sort: "rating", ... }
function getUrlParams() {
  const params = new URLSearchParams(window.location.search);

  return {
    category : params.get('category')  || '',
    skinType : params.get('skinType')  || '',
    q        : params.get('q')         || '',
    minPrice : params.get('minPrice')  || '',
    maxPrice : params.get('maxPrice')  || '',
    sort     : params.get('sort')      || 'featured',
  };
}

// updateUrl — URL-г хуудас refresh хийлгүйгээр шинэчлэнэ
// Sort, search товч дарахад энэ функцыг дуудна.
function updateUrl(params) {
  const query = new URLSearchParams();

  // Хоосон утгыг URL-д нэмэхгүй
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  const newUrl = window.location.pathname +
    (query.toString() ? '?' + query.toString() : '');

  // history.pushState — браузерийн Back/Forward товч ажиллана
  history.pushState({}, '', newUrl);
}

// updateActiveFilters — sidebar-ийн холбоосуудыг тохируулах
// Одоогийн URL параметртэй тохирох холбоосыг "active" болгоно.
function updateActiveFilters(params) {
  // Ангиллын холбоосууд
  document.querySelectorAll('.filter-category-link').forEach(link => {
    const isActive = link.dataset.category === params.category;
    link.classList.toggle('active', isActive);
  });

  // Sort select
  if (sortSelect && params.sort) {
    sortSelect.value = params.sort;
  }

  // Search input
  if (searchInput && params.q) {
    searchInput.value = params.q;
  }
}

// updatePageTitle — хуудасны гарчиг + тоолуурыг шинэчлэнэ
function updatePageTitle(params, count) {
  // H1 гарчиг
  const h1 = document.querySelector('.page-header h1');
  if (h1) {
    h1.textContent = params.category
      ? params.category
      : 'Бүх бүтээгдэхүүн';
  }

  // Тоолуур
  if (countEl) {
    countEl.innerHTML = `<strong>${count}</strong> бүтээгдэхүүн харагдаж байна`;
  }
}

// renderActiveFilterBadges — идэвхтэй шүүлтүүрүүдийг харуулна
function renderActiveFilterBadges(params) {
  let container = document.getElementById('active-filters-bar');

  // Контейнер байхгүй бол үүсгэнэ
  if (!container) {
    container = document.createElement('div');
    container.id = 'active-filters-bar';
    container.className = 'active-filters-bar';

    const toolbar = document.querySelector('.products-toolbar');
    if (toolbar) {
      toolbar.insertAdjacentElement('afterend', container);
    }
  }

  container.innerHTML = '';

  // Идэвхтэй шүүлтүүр бүрт badge нэмнэ
  const filterMap = {
    category : params.category,
    skinType : params.skinType,
    q        : params.q ? `"${params.q}"` : '',
    minPrice : params.minPrice ? `$${params.minPrice}+` : '',
    maxPrice : params.maxPrice ? `$${params.maxPrice}-` : '',
  };

  let hasActive = false;

  Object.entries(filterMap).forEach(([key, label]) => {
    if (!label) return;
    hasActive = true;

    const badge = ActiveFilterBadge(label, () => {
      // Тухайн шүүлтүүрийг URL-аас хасаж дахин render хийнэ
      const newParams = getUrlParams();
      newParams[key] = '';

      // minPrice + maxPrice-г хамтад нь хэрэглэсэн бол хоёуланг нь цэвэрлэнэ
      if (key === 'minPrice') newParams.maxPrice = '';
      if (key === 'maxPrice') newParams.minPrice = '';

      updateUrl(newParams);
      renderAll(newParams);
    });

    container.appendChild(badge);
  });

  // Бүх шүүлтүүр хасах товч
  if (hasActive) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'clear-filters-btn';
    clearBtn.textContent = 'Бүгдийг арилгах';
    clearBtn.addEventListener('click', () => {
      const empty = { category: '', skinType: '', q: '', minPrice: '', maxPrice: '', sort: params.sort };
      updateUrl(empty);
      renderAll(empty);
    });
    container.appendChild(clearBtn);
  }
}


// renderProducts — grid дэх карточнуудыг зурна
// Аргументууд:
// products — Product объектуудын массив (шүүгдсэн + эрэмбэлэгдсэн)
function renderProducts(products) {
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.appendChild(EmptyState());
    return;
  }

  // Карточ бүрийг ProductCard компонентоор үүсгэнэ
  products.forEach(product => {
    const card = ProductCard(product, {
      savedIds: savedProductIds,

      // Хадгалах товч дарахад localStorage-г шинэчлэнэ
      onSaveToggle: (id, isSaved) => {
        localStorage.setItem(
          'savedProducts',
          JSON.stringify([...savedProductIds])
        );
        console.log(`💾 Бүтээгдэхүүн #${id} — ${isSaved ? 'хадгалсан' : 'хасагдсан'}`);
      }
    });

    grid.appendChild(card);
  });
}

// renderAll — бүх render үйлдлийг нэгтгэсэн функц
// Sort, Search, Badge, ProductGrid зэргийг цэгцтэй дуудна.
function renderAll(params) {
  // Sidebar-ийн active байдлыг тохируулах
  updateActiveFilters(params);

  // Шүүлт хийх
  const filtered = filterProducts(params);

  // Эрэмбэлэх
  const sorted = sortProducts(filtered, params.sort);

  // Гарчиг + тоолуур
  updatePageTitle(params, sorted.length);

  // Идэвхтэй шүүлтүүрийн badge-ууд
  renderActiveFilterBadges(params);

  // Карточнуудыг зурах
  renderProducts(sorted);
}

// init — хуудас ачааллахад нэг удаа дуудагдана
async function init() {
  // Loading харуулна
  grid.innerHTML = '';
  grid.appendChild(LoadingSpinner());

  // JSONBin-аас өгөгдөл татна (нэг удаа)
  await fetchProducts();

  // URL параметрүүд авна
  const params = getUrlParams();

  // Бүх UI-г зурна
  renderAll(params);
}

// Sort select — сонголт өөрчлөгдөхөд
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    const params  = getUrlParams();
    params.sort   = sortSelect.value;
    updateUrl(params);
    renderAll(params);
  });
}

// Search form — хайх товч дарахад
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const params = getUrlParams();
    params.q     = searchInput ? searchInput.value.trim() : '';
    params.sort  = sortSelect  ? sortSelect.value         : 'featured';

    updateUrl(params);
    renderAll(params);
  });
}

// Browser Back / Forward товч дэмжих
// URL өөрчлөгдөхөд шинэ параметрүүдийг уншиж дахин render хийнэ
window.addEventListener('popstate', () => {
  const params = getUrlParams();
  renderAll(params);
});


// Хуудас ачааллах
init();