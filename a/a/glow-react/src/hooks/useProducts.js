import { useState, useEffect, useMemo } from 'react'
import { fetchProducts, filterProducts, sortProducts } from '../services/api'

// ─── useProducts Hook ─────────────────────────────────────────────────────────
// Custom hook — бүтээгдэхүүн татах, шүүх, эрэмбэлэх логикийг нэгтгэнэ.
//
// params: {
//   category, skinType, minPrice, maxPrice, q,  ← шүүлтүүр
//   sort                                         ← эрэмбэлэлт
// }
//
// Буцаана: { products, allProducts, loading, error }
export function useProducts(params = {}) {
  // loading — fetch хийж байх үед true
  const [loading, setLoading] = useState(true)

  // error — fetch амжилтгүй болвол error message хадгална
  const [error, setError] = useState(null)

  // allProducts — JSONBin-аас ирсэн бүх бүтээгдэхүүн (шүүлгүй)
  const [allProducts, setAllProducts] = useState([])

  // ─── useEffect: Компонент mount хийгдэхэд нэг удаа дуудагдана ──────────────
  // dependency array хоосон [] — зөвхөн нэг удаа ажиллана.
  // Хэрэв productTable cache дүүрсэн бол fetchProducts дотроос шууд буцаана.
  useEffect(() => {
    let cancelled = false // cleanup: component unmount хийгдэхэд fetch-г "цуцална"

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProducts()
        if (!cancelled) setAllProducts(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    // Cleanup функц — компонент unmount хийгдэхэд cancelled = true болгоно.
    // Ингэснээр unmount хийсэн компонент дээр setState дуудахгүй (memory leak хамгаалалт)
    return () => { cancelled = true }
  }, []) // ← хоосон array = нэг удаа л ажиллана

  // ─── useMemo: шүүлт + эрэмбэлэлт ────────────────────────────────────────────
  // useMemo — params эсвэл allProducts өөрчлөгдөхөд л дахин тооцоолно.
  // Энэ нь re-render бүрт шүүлт хийхгүй байх "мemoize" хийх арга.
  // (react-best-practices: rerender-memo)
  const products = useMemo(() => {
    if (allProducts.length === 0) return []
    const filtered = filterProducts(params)
    return sortProducts(filtered, params.sort || 'featured')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, params.category, params.skinType, params.minPrice,
      params.maxPrice, params.q, params.sort])
  // ↑ Primitive dependency-г тодорхой жагсаана — object бүхэлд нь биш
  //   (react-best-practices: rerender-dependencies)

  return { products, allProducts, loading, error }
}
