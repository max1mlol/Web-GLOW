// Product constructor — uses prototype, not class
function Product(data) {
  this.id            = data.id;
  this.name          = data.name;
  this.category      = data.category;
  this.skinType      = data.skinType;
  this.price         = data.price;
  this.originalPrice = data.originalPrice || null;
  this.rating        = data.rating;
  this.reviewCount   = data.reviewCount;
  this.image         = data.image;
  this.imageAlt      = data.imageAlt;
  this.badge         = data.badge || null;
  this.description   = data.description;
}

// Build filled/empty star string from rating (e.g. 4.7 → ★★★★☆)
Product.prototype.starsHTML = function () {
  var full  = Math.round(this.rating);
  var empty = 5 - full;
  return '&#9733;'.repeat(full) + '&#9734;'.repeat(empty);
};

// Render a product card DOM element
Product.prototype.render = function () {
  var card = document.createElement('div');
  card.className = 'product-card';

  var priceHTML;
  if (this.originalPrice) {
    priceHTML =
      '<span class="product-price">$' + this.price +
      ' <span class="product-price-original">$' + this.originalPrice + '</span></span>';
  } else {
    priceHTML = '<span class="product-price">$' + this.price + '</span>';
  }

  var badgeHTML = this.badge
    ? '<span class="product-badge badge-sale">' + this.badge + '</span>'
    : '';

  card.innerHTML =
    '<img src="' + this.image + '" alt="' + this.imageAlt + '" class="product-card-img" width="300" height="300" />' +
    '<div class="product-card-body">' +
      '<span class="product-card-category">' + this.category + '</span>' +
      '<h3><a href="product-detail.html">' + this.name + '</a></h3>' +
      '<p class="product-card-desc">' + this.description + '</p>' +
      '<div class="product-card-footer">' +
        priceHTML +
        badgeHTML +
      '</div>' +
      '<div class="mt-4">' +
        '<span class="stars">' + this.starsHTML() + '</span>' +
        '<span class="rating-text">' + this.rating + ' (' + this.reviewCount + ')</span>' +
      '</div>' +
    '</div>';

  return card;
};

export default Product;
