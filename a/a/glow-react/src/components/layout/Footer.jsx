import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Grid, Text, VStack, HStack,
  Divider, useColorModeValue,
} from '@chakra-ui/react'
import { FiInstagram, FiFacebook } from 'react-icons/fi'

// Static data outside component — no need to recreate on re-render
const SHOP_LINKS = [
  { label: 'All Products',   to: '/products' },
  { label: 'Serum',          to: '/products?category=Серум' },
  { label: 'Moisturizer',    to: '/products?category=Чийгшүүлэгч' },
  { label: 'Cleanser',       to: '/products?category=Цэвэрлэгч' },
  { label: 'Sunscreen',      to: '/products?category=Нарны тос' },
]

const COMPANY_LINKS = [
  { label: 'About Us',      to: '/' },
  { label: 'Our Story',     to: '/' },
  { label: 'Sustainability', to: '/' },
  { label: 'Contact',       to: '/' },
]

const HELP_LINKS = [
  { label: 'FAQ',          to: '/' },
  { label: 'Shipping',     to: '/' },
  { label: 'Returns',      to: '/' },
  { label: 'My Account',   to: '/login' },
]

function FooterLink({ to, children }) {
  const color = useColorModeValue('gray.600', 'gray.400')
  return (
    <Text
      as={RouterLink}
      to={to}
      fontSize="sm"
      color={color}
      _hover={{ color: 'brand.500', textDecoration: 'none' }}
      transition="color 0.2s"
    >
      {children}
    </Text>
  )
}

export default function Footer() {
  const bg     = useColorModeValue('gray.50',  'gray.900')
  const border = useColorModeValue('gray.200', 'gray.700')
  const muted  = useColorModeValue('gray.500', 'gray.500')

  return (
    <Box as="footer" bg={bg} borderTop="1px solid" borderColor={border} mt="auto">
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={12}>
        <Grid
          templateColumns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }}
          gap={8}
        >
          {/* Brand column */}
          <VStack align="start" spacing={4}>
            <Text fontFamily="heading" fontSize="2xl" fontWeight="700" color="brand.500">
              GLOW
            </Text>
            <Text fontSize="sm" color={muted} maxW="220px">
              Science-backed formulas with the finest natural ingredients. Caring for your skin since 2016.
            </Text>
            <HStack spacing={3}>
              <Box
                as="a" href="https://www.instagram.com/b_dukk/" target="_blank"
                color={muted} _hover={{ color: 'brand.500' }} transition="color 0.2s"
              >
                <FiInstagram size={18} />
              </Box>
              <Box
                as="a" href="#" color={muted}
                _hover={{ color: 'brand.500' }} transition="color 0.2s"
              >
                <FiFacebook size={18} />
              </Box>
            </HStack>
          </VStack>

          {/* Shop column */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
              Shop
            </Text>
            {SHOP_LINKS.map(l => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
          </VStack>

          {/* Company column */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
              Company
            </Text>
            {COMPANY_LINKS.map(l => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
          </VStack>

          {/* Help column */}
          <VStack align="start" spacing={3}>
            <Text fontWeight="600" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
              Help
            </Text>
            {HELP_LINKS.map(l => <FooterLink key={l.label} to={l.to}>{l.label}</FooterLink>)}
          </VStack>
        </Grid>

        <Divider my={8} />

        <Flex
          justify="space-between"
          align="center"
          flexWrap="wrap"
          gap={2}
          fontSize="sm"
          color={muted}
        >
          <Text>© 2026 GLOW Skincare. All rights reserved.</Text>
          <HStack spacing={4}>
            <FooterLink to="/">Privacy Policy</FooterLink>
            <FooterLink to="/">Terms of Service</FooterLink>
          </HStack>
        </Flex>
      </Box>
    </Box>
  )
}
