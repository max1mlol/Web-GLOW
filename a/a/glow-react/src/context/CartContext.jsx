import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── 1. Context үүсгэх ───────────────────────────────────────────────────────
// createContext() — глобал "дэлгүүр" үүсгэнэ.
// null default утга — Provider-гүйгээр хэрэглэх үед алдаа гарна (хамгаалалт).
const CartContext = createContext(null)

// ─── 2. Initial State ─────────────────────────────────────────────────────────
// localStorage-аас өмнөх сагсыг уншина — хуудас refresh хийхэд алдагдахгүй.
// Lazy init: функц дамжуулснаар зөвхөн нэг удаа тооцоолно (performance).
function getInitialCart() {
  try {
    const saved = localStorage.getItem('glow_cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// ─── 3. Reducer ───────────────────────────────────────────────────────────────
// Reducer — одоогийн state + action авч, шинэ state буцаана.
// switch/case бүр нэг үйлдлийг хариуцна.
// [...state] spread ашиглан эх массивыг өөрчлөхгүй (immutable update).
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      // Бүтээгдэхүүн аль хэдийн байгаа бол тоог нэмнэ, байхгүй бол шинэ элемент нэмнэ
      const existing = state.find(item => item.id === action.product.id)
      if (existing) {
        return state.map(item =>
          item.id === action.product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      // Шинэ бүтээгдэхүүн — qty: 1-тэй нэмнэ
      return [...state, { ...action.product, qty: 1 }]
    }

    case 'REMOVE':
      // id тохирохгүй элементүүдийг л үлдээнэ
      return state.filter(item => item.id !== action.id)

    case 'UPDATE_QTY':
      // qty 0 болбол устгана, эс бөгөөс шинэчилнэ
      return state
        .map(item =>
          item.id === action.id ? { ...item, qty: action.qty } : item
        )
        .filter(item => item.qty > 0)

    case 'CLEAR':
      return []

    default:
      return state
  }
}

// ─── 4. Provider Component ────────────────────────────────────────────────────
// CartProvider — children компонентуудыг state-д холбоно.
// Энэ нь App.jsx-д бүх хуудасны эргэн тойронд байрлана.
export function CartProvider({ children }) {
  // useReducer: [state, dispatch] — state нь items массив
  const [items, dispatch] = useReducer(cartReducer, [], getInitialCart)

  // items өөрчлөгдөх бүрт localStorage-д хадгална
  useEffect(() => {
    localStorage.setItem('glow_cart', JSON.stringify(items))
  }, [items])

  // ─── Helper тооцоолол ─────────────────────────────────────────────────────
  // useMemo биш шууд тооцоолно — items-гаас derive хийгдэх учраас хурдан
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  // ─── Action функцүүд ──────────────────────────────────────────────────────
  // dispatch шууд дуудахын оронд нэрлэгдсэн функц экспортлоно —
  // компонентуудад {type:'ADD', product} гэж мэдэх шаардлагагүй болно.
  const addToCart     = (product)      => dispatch({ type: 'ADD',        product })
  const removeFromCart = (id)          => dispatch({ type: 'REMOVE',     id })
  const updateQty     = (id, qty)      => dispatch({ type: 'UPDATE_QTY', id, qty })
  const clearCart     = ()             => dispatch({ type: 'CLEAR' })

  const value = {
    items,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ─── 5. Custom Hook ───────────────────────────────────────────────────────────
// useCart() — компонент дотор CartContext-д хандах хялбар арга.
// Хэрэв CartProvider-гаас гадна хэрэглэвэл мессеж гарна (debug хялбар).
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}

export default CartContext
