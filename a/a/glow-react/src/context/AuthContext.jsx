import { createContext, useContext, useState } from 'react'

// ─── 1. Context үүсгэх ───────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── 2. Provider ─────────────────────────────────────────────────────────────
// Нэвтрэх/гарах логикийг энд хадгална.
// Жишээ аппликейшн тул localStorage-д хэрэглэгчийн нэрийг хадгалах замаар
// хуудас refresh хийхэд session хадгалагдана.
export function AuthProvider({ children }) {
  // useState: user объект эсвэл null
  const [user, setUser] = useState(() => {
    // Lazy init — localStorage-аас нэвтэрсэн хэрэглэгчийг уншина
    try {
      const saved = localStorage.getItem('glow_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // isLoggedIn — user байвал true, байхгүй бол false
  const isLoggedIn = Boolean(user)

  // ─── login ────────────────────────────────────────────────────────────────
  // userData: { name, email } — жишээ аппликейшн тул API дуудахгүй
  function login(userData) {
    setUser(userData)
    localStorage.setItem('glow_user', JSON.stringify(userData))
  }

  // ─── register ─────────────────────────────────────────────────────────────
  // Бүртгүүлмэгц автоматаар нэвтэрсэн гэж тооцно
  function register(userData) {
    login(userData)
  }

  // ─── logout ───────────────────────────────────────────────────────────────
  function logout() {
    setUser(null)
    localStorage.removeItem('glow_user')
  }

  const value = {
    user,
    isLoggedIn,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

export default AuthContext
