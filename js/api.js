// js/api.js - Өгөгдлийн модуль — Product класс, fetch, шүүлт, эрэмбэлэлт

// JSONBin.io дээр байрлуулсан өгөгдлийн URL
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/69d0ddeeaaba882197c360de';

// Member A
// Product класс — бүтээгдэхүүний загвар (model)
// Бүх шинж чанар (property) constructor-т тодорхойлогдоно.
class Product {
  constructor({ id, name, category, skinType, price, originalPrice,
    rating, reviewCount, image, imageAlt, badge, description }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.skinType = skinType;
    this.price = price;
    this.originalPrice = originalPrice;   // null байж болно
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.image = image;
    this.imageAlt = imageAlt;
    this.badge = badge;           // null байж болно
    this.description = description;
  }

  // Хямдралтай эсэхийг шалгах
  isOnSale() {
    return this.originalPrice !== null && this.originalPrice > this.price;
  }

  // Үнийн HTML текст авах
  getPriceHTML() {
    if (this.isOnSale()) {
      return `$${this.price} <span class="product-price-original">$${this.originalPrice}</span>`;
    }
    return `$${this.price}`;
  }
}

// Дотоод хүснэгт (in-memory table)
// Өгөгдлийг нэг удаа татаад энд хадгална.
// Шүүлт болон эрэмбэлэлт энэ хүснэгт дотроос хийгдэнэ.
let productTable = [];

// Member A
// fetchProducts — серверээс өгөгдөл татах
// Хэрэв productTable өмнө нь дүүрсэн бол дахин fetch хийхгүй.
async function fetchProducts() {
  // Cache: өмнө нь татсан бол тэр хүснэгтийг буцаана
  if (productTable.length > 0) {
    return productTable;
  }

  try {
    const response = await fetch(JSONBIN_URL);

    if (!response.ok) {
      throw new Error(`Серверийн алдаа: ${response.status}`);
    }

    const data = await response.json();

    // JSONBin-ийн хариу дотроос "record" массивыг авна
    const rawList = data.record;

    // Массивын элемент бүрийг Product объект болгоно
    productTable = rawList.map(item => new Product(item));

    console.log(`${productTable.length} бүтээгдэхүүн татлаа.`);
    return productTable;

  } catch (error) {
    console.error('Өгөгдөл татахад алдаа гарлаа:', error.message);
    return [];
  }
}

// Member B
// filterProducts — хүснэгт дотроос шүүлт хийх
//
// params объект дараах шинж чанартай байж болно:
//   category  — ангилал ("Серум", "Маск", ...)
//   skinType  — арьсны төрөл ("Хуурай арьс", ...)
//   minPrice  — хамгийн бага үнэ
//   maxPrice  — хамгийн их үнэ
//   q         — хайлтын текст (нэр эсвэл тайлбараар)
function filterProducts(params = {}) {
  return productTable.filter(product => {

    // 1. Ангиллын шүүлт
    if (params.category && product.category !== params.category) {
      return false;
    }

    // 2. Арьсны төрлийн шүүлт
    if (params.skinType && product.skinType !== params.skinType) {
      return false;
    }

    // 3. Доод үнийн шүүлт
    if (params.minPrice && product.price < Number(params.minPrice)) {
      return false;
    }

    // 4. Дээд үнийн шүүлт
    if (params.maxPrice && product.price > Number(params.maxPrice)) {
      return false;
    }

    // 5. Хайлтын шүүлт — нэр болон тайлбараар хайна
    if (params.q) {
      const query = params.q.toLowerCase();
      const inName = product.name.toLowerCase().includes(query);
      const inDesc = product.description.toLowerCase().includes(query);
      if (!inName && !inDesc) return false;
    }

    return true;
  });
}

// Member B
// sortProducts — эрэмбэлэх
// Эх массивыг өөрчлөхгүйн тулд [...spread] ашиглана.
function sortProducts(products, sortBy = 'featured') {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;

    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;

    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;

    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'mn'));
      break;

    default:
      // 'featured' — оруулсан дарааллаар (өөрчлөхгүй)
      break;
  }

  return sorted;
}

// Экспорт — бусад модулиас импортлон ашиглана
export { fetchProducts, filterProducts, sortProducts, Product };