import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'

// ─── GLOW Custom Theme ───────────────────────────────────────────────────────
// extendTheme — Chakra UI-ийн default theme-г өргөтгөнө.
// Бид зөвхөн өөрчлөх хэсгүүдийг тодорхойлно, бусад нь default-р үлдэнэ.
const glowTheme = extendTheme({
  // Анхны горим: light. LocalStorage-д хадгалагдана.
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },

  // Өнгийн palette — GLOW брэндийн өнгөнүүд
  colors: {
    brand: {
      50:  '#fdf6f0',
      100: '#f8e8d8',
      200: '#f0ccaa',
      300: '#e5a878',
      400: '#d4845a',
      500: '#b8643c',   // Үндсэн brand өнгө
      600: '#9a4e2e',
      700: '#7c3b22',
      800: '#5e2a17',
      900: '#3d1a0c',
    },
    rose: {
      50:  '#fff5f7',
      500: '#c4806a',
      700: '#8b4a38',
    },
  },

  // Үсгийн font — Google Fonts-аас (index.html-д link нэмнэ)
  fonts: {
    heading: `'Cormorant Garamond', Georgia, serif`,
    body:    `'Inter', system-ui, sans-serif`,
  },

  // Global CSS дүрмүүд
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      },
      // Smooth scroll
      html: { scrollBehavior: 'smooth' },
    }),
  },
})

// ─── Root Render ──────────────────────────────────────────────────────────────
// ColorModeScript — localStorage-аас dark/light mode-г уншдаг inline script.
// HashRouter — бүх route-уудыг /#/ дарааллаар удирдана.
// ChakraProvider — бүх компонентод theme дамжуулна.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorModeScript initialColorMode={glowTheme.config.initialColorMode} />
    <HashRouter>
      <ChakraProvider theme={glowTheme}>
        <App />
      </ChakraProvider>
    </HashRouter>
  </StrictMode>
)
