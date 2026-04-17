import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Header from './Header'
import Footer from './Footer'

// Layout wraps every page route.
// <Outlet /> is where react-router renders the matched child page.
// Header and Footer are rendered once — not re-mounted on navigation.
export default function Layout() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
