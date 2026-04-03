import Product from './Product.js';

// Fetch all products from the server and return an array of Product objects
function fetchProducts() {
  return fetch('/api/products')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      return data.map(function (item) { return new Product(item); });
    });
}

// Filter an array of Product objects by URL query params
// Supported params: category, skinType, minPrice, maxPrice, q (search)
function filterProducts(products, params) {
  return products.filter(function (p) {
    if (params.get('category') && p.category !== params.get('category')) return false;
    if (params.get('skinType') && p.skinType !== params.get('skinType')) return false;
    if (params.get('minPrice') && p.price < Number(params.get('minPrice'))) return false;
    if (params.get('maxPrice') && p.price > Number(params.get('maxPrice'))) return false;
    if (params.get('q')) {
      var q = params.get('q').toLowerCase();
      if (p.name.toLowerCase().indexOf(q) === -1 && p.description.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  });
}

// Render products into the #products-grid element
function renderProducts(products) {
  var grid = document.getElementById('products-grid');
  grid.innerHTML = '';
  products.forEach(function (p) {
    grid.appendChild(p.render());
  });
}

// Update the count label
function updateCount(count) {
  var el = document.querySelector('.products-count strong');
  if (el) el.textContent = count;
}

// Highlight the active filter link in the sidebar
function highlightActiveLinks(params) {
  var cat = params.get('category');
  document.querySelectorAll('.filter-category-link').forEach(function (a) {
    var linkCat = a.getAttribute('data-category');
    if ((!cat && !linkCat) || cat === linkCat) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

// Entry point
function init() {
  var params = new URLSearchParams(window.location.search);

  fetchProducts()
    .then(function (products) {
      var filtered = filterProducts(products, params);
      renderProducts(filtered);
      updateCount(filtered.length);
      highlightActiveLinks(params);
    })
    .catch(function (err) {
      var grid = document.getElementById('products-grid');
      grid.innerHTML = '<p>Өгөгдөл ачаалахад алдаа гарлаа. Сервер ажиллаж байгаа эсэхийг шалгана уу.</p>';
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', init);
