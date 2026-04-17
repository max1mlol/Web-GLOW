import ProductCard from './components/ProductCard.js';

// Product constructor
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
  this.likeCount     = data.likeCount || 0;
}

// render ig ProductCard component ruu jiisn
// onAddToCart duudaj bolno callback
Product.prototype.render = function (onAddToCart) {
  return ProductCard(this, onAddToCart);
}; // hasah

export default Product;
