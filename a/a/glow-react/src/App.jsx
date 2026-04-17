import { Routes, Route } from 'react-router-dom'

// Layout — Header + Footer-г бүх хуудаст нийтлэг ашиглана
import Layout from './components/layout/Layout'

// Pages — хуудас бүр тусдаа component
import HomePage          from './pages/HomePage'
import ProductsPage      from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage          from './pages/CartPage'
import CheckoutPage      from './pages/CheckoutPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import AdminPage         from './pages/AdminPage'

// Context Providers — global state
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'

// ─── App Component ────────────────────────────────────────────────────────────
// Functional component — class component биш!
// Context providers-г хамгийн гадна нь байрлуулна,
// ингэснээр дотор компонент бүр тэдгээрт хандах боломжтой.
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/*
          Routes — url pattern тохирох эхний Route-г харуулна.
          Layout route — path="/" нь parent, Outlet нь child page-г байрлуулна.
          Ингэснээр Header + Footer нэг удаа зурагдаж, дотор нь л хуудас солигдоно.
        */}
        <Routes>
          {/* Layout-тай routes — Header, Footer нийтлэг */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
