// src/services/api.js
// Таны одоогийн js/api.js-ийн логикийг React ES module болгон хувиргав.
// JSONBin URL, Product класс, шүүлт, эрэмбэлэлт — бүгд хэвээр.

// ─── JSONBin тохиргоо ─────────────────────────────────────────────────────────
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/69d0ddeeaaba882197c360de'

// ─── Product класс ────────────────────────────────────────────────────────────
// Одоогийн api.js-тэй яг адилхан — бүтээгдэхүүний загвар (model)
export class Product {
  constructor({ id, name, category, skinType, price, originalPrice,
    rating, reviewCount, image, imageAlt, badge, description }) {
    this.id            = id
    this.name          = name
    this.category      = category
    this.skinType      = skinType
    this.price         = price
    this.originalPrice = originalPrice  // null байж болно
    this.rating        = rating
    this.reviewCount   = reviewCount
    this.image         = image
    this.imageAlt      = imageAlt
    this.badge         = badge          // null байж болно
    this.description   = description
  }

  // Хямдралтай эсэхийг шалгах
  isOnSale() {
    return this.originalPrice !== null && this.originalPrice > this.price
  }

  // Хямдралын хувийг тооцоолох (шинэ — ProductDetailPage-д хэрэглэнэ)
  getDiscountPercent() {
    if (!this.isOnSale()) return 0
    return Math.round((1 - this.price / this.originalPrice) * 100)
  }
}

// ─── In-memory cache ──────────────────────────────────────────────────────────
// Модуль түвшинд хадгалагдах тул хуудас солигдоход дахин fetch хийхгүй.
// (React-ийн useRef-тэй адил үр дүн, гэхдээ глобал)
let productTable = []

// ─── fetchProducts ────────────────────────────────────────────────────────────
// async function — JSONBin-аас бүтээгдэхүүн татна.
// Cache дүүрсэн бол дахин fetch хийхгүй (react-best-practices: async-parallel).
export async function fetchProducts() {
  if (productTable.length > 0) return productTable

  const response = await fetch(JSONBIN_URL)

  if (!response.ok) {
    throw new Error(`Серверийн алдаа: ${response.status}`)
  }

  const data = await response.json()

  // JSONBin-ийн хариуны бүтэц: { record: [...] }
  productTable = data.record.map(item => new Product(item))

  return productTable
}

// ─── filterProducts ───────────────────────────────────────────────────────────
// params: { category, skinType, minPrice, maxPrice, q }
// Таны одоогийн api.js-тэй яг адилхан логик
export function filterProducts(params = {}) {
  return productTable.filter(product => {
    if (params.category && product.category !== params.category) return false
    if (params.skinType && product.skinType !== params.skinType)  return false
    if (params.minPrice && product.price < Number(params.minPrice)) return false
    if (params.maxPrice && product.price > Number(params.maxPrice)) return false
    if (params.q) {
      const q = params.q.toLowerCase()
      const inName = product.name.toLowerCase().includes(q)
      const inDesc = product.description.toLowerCase().includes(q)
      if (!inName && !inDesc) return false
    }
    return true
  })
}

// ─── sortProducts ─────────────────────────────────────────────────────────────
// [...products] spread — эх массивыг өөрчлөхгүй (immutable)
export function sortProducts(products, sortBy = 'featured') {
  const sorted = [...products]
  switch (sortBy) {
    case 'price-low':  sorted.sort((a, b) => a.price - b.price);                 break
    case 'price-high': sorted.sort((a, b) => b.price - a.price);                 break
    case 'rating':     sorted.sort((a, b) => b.rating - a.rating);               break
    case 'name':       sorted.sort((a, b) => a.name.localeCompare(b.name, 'mn')); break
    default: break // 'featured' — оруулсан дарааллаар
  }
  return sorted
}

// ─── getProductById ───────────────────────────────────────────────────────────
// ProductDetailPage-д ашиглана — id-гаар нэг бүтээгдэхүүн хайна.
// js-index-maps best practice: Map ашиглавал O(1) хурдтай хайна.
let productMap = null

export function getProductById(id) {
  // Map анх удаа хэрэглэхэд байгуулна (lazy)
  if (!productMap) {
    productMap = new Map(productTable.map(p => [String(p.id), p]))
  }
  return productMap.get(String(id)) ?? null
}
