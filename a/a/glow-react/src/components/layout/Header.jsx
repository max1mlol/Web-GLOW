import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box, Flex, HStack, Text, IconButton, Badge,
  useColorMode, useColorModeValue, useDisclosure,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton,
  DrawerBody, VStack, Button,
} from '@chakra-ui/react'
import { FiShoppingCart, FiSun, FiMoon, FiMenu, FiUser } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

// Nav links config — defined outside component so it's not recreated on every render
// (react-best-practices: rendering-hoist-jsx)
const NAV_LINKS = [
  { label: 'Home',     to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Cart',     to: '/cart' },
  { label: 'Admin',    to: '/admin' },
]

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { cartCount } = useCart()
  const { isLoggedIn, user, logout } = useAuth()
  const location = useLocation()

  // Mobile drawer state — useDisclosure gives us isOpen, onOpen, onClose
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Color tokens — change automatically between light/dark mode
  const bg      = useColorModeValue('white', 'gray.900')
  const border  = useColorModeValue('gray.100', 'gray.700')
  const navHover = useColorModeValue('brand.500', 'brand.300')

  // Check if a nav link is active based on current URL
  function isActive(to) {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  return (
    <>
      {/* Announcement bar */}
      <Box bg="brand.500" color="white" textAlign="center" py={2} fontSize="sm">
        Free shipping on orders over $50 &nbsp;·&nbsp; New collection available
      </Box>

      {/* Main header */}
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={100}
        bg={bg}
        borderBottom="1px solid"
        borderColor={border}
        backdropFilter="blur(12px)"
        boxShadow="sm"
      >
        <Flex
          maxW="1200px"
          mx="auto"
          px={{ base: 4, md: 8 }}
          h="64px"
          align="center"
          justify="space-between"
        >
          {/* Logo */}
          <Text
            as={RouterLink}
            to="/"
            fontFamily="heading"
            fontSize="2xl"
            fontWeight="700"
            letterSpacing="widest"
            color="brand.500"
            _hover={{ textDecoration: 'none', opacity: 0.85 }}
          >
            GLOW
          </Text>

          {/* Desktop nav */}
          <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
            {NAV_LINKS.map(link => (
              <Text
                key={link.to}
                as={RouterLink}
                to={link.to}
                fontSize="sm"
                fontWeight={isActive(link.to) ? '600' : '400'}
                color={isActive(link.to) ? 'brand.500' : 'inherit'}
                borderBottom={isActive(link.to) ? '2px solid' : '2px solid transparent'}
                borderColor={isActive(link.to) ? 'brand.500' : 'transparent'}
                pb={1}
                _hover={{ color: navHover, textDecoration: 'none' }}
                transition="all 0.2s"
              >
                {link.label}
              </Text>
            ))}
          </HStack>

          {/* Action buttons */}
          <HStack spacing={2}>
            {/* Dark / light toggle */}
            <IconButton
              aria-label="Toggle dark mode"
              icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
              variant="ghost"
              size="sm"
              onClick={toggleColorMode}
            />

            {/* Cart icon with badge */}
            <Box position="relative">
              <IconButton
                as={RouterLink}
                to="/cart"
                aria-label="Cart"
                icon={<FiShoppingCart />}
                variant="ghost"
                size="sm"
              />
              {cartCount > 0 && (
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  colorScheme="red"
                  borderRadius="full"
                  fontSize="10px"
                  minW="18px"
                  textAlign="center"
                >
                  {cartCount}
                </Badge>
              )}
            </Box>

            {/* Login / user */}
            {isLoggedIn ? (
              <Button size="sm" variant="ghost" onClick={logout} leftIcon={<FiUser />}>
                {user?.name?.split(' ')[0]}
              </Button>
            ) : (
              <Button
                as={RouterLink}
                to="/login"
                size="sm"
                colorScheme="brand"
                bg="brand.500"
                color="white"
                _hover={{ bg: 'brand.600' }}
              >
                Login
              </Button>
            )}

            {/* Mobile hamburger */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
              icon={<FiMenu />}
              variant="ghost"
              size="sm"
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={12}>
            <VStack align="start" spacing={6}>
              {NAV_LINKS.map(link => (
                <Text
                  key={link.to}
                  as={RouterLink}
                  to={link.to}
                  fontSize="lg"
                  fontWeight={isActive(link.to) ? '600' : '400'}
                  color={isActive(link.to) ? 'brand.500' : 'inherit'}
                  onClick={onClose}
                  _hover={{ color: 'brand.500', textDecoration: 'none' }}
                >
                  {link.label}
                </Text>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
