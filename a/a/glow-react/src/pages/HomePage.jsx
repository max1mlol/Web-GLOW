import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Grid, VStack, HStack, Text, Button,
  Image, useColorModeValue, Badge, Avatar,
  Input, InputGroup, InputRightElement, IconButton,
} from '@chakra-ui/react'
import { FiArrowRight, FiMail } from 'react-icons/fi'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ui/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Static testimonial data — lives here, not in a server
const TESTIMONIALS = [
  { name: 'Sarah M.',   initial: 'S', color: 'pink',   rating: 5, quote: 'This serum changed my skin. Dark spots faded within 2 weeks. Life-changing product!' },
  { name: 'Sarnai G.', initial: 'D', color: 'orange', rating: 5, quote: 'GLOW products are genuinely amazing. 100% recommend to everyone in my family.' },
  { name: 'Olivia H.', initial: 'O', color: 'rose',   rating: 5, quote: 'A few drops of the face oil mixed into my night cream — skin is glowing every morning.' },
]

const CATEGORIES = [
  { label: 'Serum',      param: 'Серум',           gradient: 'linear(to-br, #d6c4b8, #b89a5e)' },
  { label: 'Moisturizer', param: 'Чийгшүүлэгч',   gradient: 'linear(to-br, #c4d4ce, #7a9e94)' },
  { label: 'Cleanser',   param: 'Цэвэрлэгч',       gradient: 'linear(to-br, #e5d0c8, #c4806a)' },
  { label: 'Sunscreen',  param: 'Нарны тос',        gradient: 'linear(to-br, #d4c9b8, #9a8560)' },
]

export default function HomePage() {
  // Fetch all products — no filters — and grab just the top 4 by rating for "Featured"
  const { products, loading } = useProducts({ sort: 'rating' })
  const featured = products.slice(0, 4)

  const heroBg    = useColorModeValue('gray.900', 'gray.900')
  const sectionAlt = useColorModeValue('gray.50', 'gray.800')
  const muted     = useColorModeValue('gray.600', 'gray.400')
  const cardBg    = useColorModeValue('white', 'gray.700')

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Box
        as="section"
        position="relative"
        minH={{ base: '80vh', md: '92vh' }}
        display="flex"
        alignItems="center"
        overflow="hidden"
        bg={heroBg}
      >
        {/* Background image */}
        <Image
          src="/images/hero.jpg"
          alt="Skincare products on marble"
          position="absolute" inset={0}
          w="full" h="full" objectFit="cover"
          opacity={0.55}
        />
        {/* Gradient overlay */}
        <Box position="absolute" inset={0} bgGradient="linear(to-r, blackAlpha.700, blackAlpha.300)" />

        {/* Hero content */}
        <Box position="relative" maxW="1200px" mx="auto" px={{ base: 6, md: 12 }} color="white">
          <Text fontSize="sm" letterSpacing="widest" textTransform="uppercase" mb={4} opacity={0.8}>
            2026 New Collection
          </Text>
          <Text
            as="h1"
            fontFamily="heading"
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            fontWeight="700"
            lineHeight="1.1"
            mb={8}
          >
            Reveal your skin's
            <br />natural radiance.
          </Text>
          <HStack spacing={4} flexWrap="wrap">
            <Button
              as={RouterLink} to="/products"
              size="lg" bg="white" color="gray.900"
              _hover={{ bg: 'brand.50', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              rightIcon={<FiArrowRight />}
            >
              Shop Now
            </Button>
            <Button
              as={RouterLink} to="/products"
              size="lg" variant="outline" color="white"
              borderColor="whiteAlpha.600"
              _hover={{ bg: 'whiteAlpha.100', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              View Collection
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <Box as="section" py={{ base: 16, md: 20 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
          <VStack spacing={2} mb={10} textAlign="center">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="brand.500">Collection</Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="600">
              Shop by Category
            </Text>
            <Text color={muted}>Find the perfect product for your skincare routine.</Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={4}>
            {CATEGORIES.map(cat => (
              <Box
                key={cat.label}
                as={RouterLink}
                to={`/products?category=${encodeURIComponent(cat.param)}`}
                borderRadius="2xl"
                overflow="hidden"
                position="relative"
                h={{ base: '180px', md: '240px' }}
                bgGradient={cat.gradient}
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', textDecoration: 'none' }}
                transition="all 0.3s"
                display="flex" alignItems="flex-end"
              >
                <Box p={4} color="white">
                  <Text fontFamily="heading" fontSize="xl" fontWeight="600">{cat.label}</Text>
                  <Text fontSize="xs" opacity={0.85}>Shop now →</Text>
                </Box>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <Box as="section" py={{ base: 16, md: 20 }} bg={sectionAlt}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
          <VStack spacing={2} mb={10} textAlign="center">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="brand.500">Best Sellers</Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="600">
              Top Rated
            </Text>
            <Text color={muted}>Our customers' most loved products.</Text>
          </VStack>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Grid
                templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                gap={6}
              >
                {featured.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Grid>
              <Flex justify="center" mt={10}>
                <Button
                  as={RouterLink} to="/products"
                  variant="outline" colorScheme="brand"
                  rightIcon={<FiArrowRight />}
                  size="lg"
                >
                  View All Products
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Box>

      {/* ── BRAND STORY ──────────────────────────────────────────────────── */}
      <Box as="section" py={{ base: 16, md: 24 }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={12} alignItems="center">
            <VStack align="start" spacing={5}>
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="brand.500">About Us</Text>
              <Text as="h2" fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="600" lineHeight="1.2">
                Skincare rooted in science, not trends.
              </Text>
              <Text color={muted} lineHeight="tall">
                In a market that launches a new product every day, GLOW chose a different path. We combine deep scientific research with the purest natural ingredients to create formulas that actually work.
              </Text>
              <Text color={muted} lineHeight="tall">
                Every formula is dermatologist-tested and crafted for all skin types.
              </Text>
              <Button
                as={RouterLink} to="/products"
                colorScheme="brand" bg="brand.500" color="white"
                _hover={{ bg: 'brand.600' }} rightIcon={<FiArrowRight />}
              >
                View Collection
              </Button>
            </VStack>

            {/* Visual block with year badge */}
            <Box
              position="relative"
              h="380px"
              bgGradient="linear(to-br, brand.100, brand.300)"
              borderRadius="3xl"
              overflow="hidden"
            >
              <Image src="/images/category-essentials.jpg" alt="GLOW essentials" w="full" h="full" objectFit="cover" />
              <Box
                position="absolute" bottom={6} right={6}
                bg="white" borderRadius="2xl" p={4}
                boxShadow="xl" textAlign="center"
              >
                <Text fontFamily="heading" fontSize="3xl" fontWeight="700" color="brand.500">2016</Text>
                <Text fontSize="xs" color="gray.500">Since</Text>
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <Box as="section" py={{ base: 16, md: 20 }} bg={sectionAlt}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
          <VStack spacing={2} mb={10} textAlign="center">
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="widest" color="brand.500">Reviews</Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="600">
              What Customers Say
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
            {TESTIMONIALS.map(t => (
              <Box key={t.name} bg={cardBg} p={6} borderRadius="2xl" boxShadow="sm">
                <Text fontSize="4xl" color="brand.300" lineHeight={1} mb={2}>"</Text>
                <Text fontSize="sm" color={muted} lineHeight="tall" mb={4}>{t.quote}</Text>
                <HStack>
                  <Avatar name={t.name} size="sm" bg={`${t.color}.400`} color="white" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="600">{t.name}</Text>
                    <Text fontSize="xs" color={muted}>Verified Buyer</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <Box as="section" py={{ base: 16, md: 20 }} bg="brand.500" color="white">
        <VStack maxW="500px" mx="auto" px={4} spacing={4} textAlign="center">
          <FiMail size={32} />
          <Text as="h2" fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="600">
            Join GLOW
          </Text>
          <Text opacity={0.85} fontSize="sm">
            Get exclusive offers, skincare tips, and early access to new products.
          </Text>
          <InputGroup size="lg" maxW="420px">
            <Input
              placeholder="Your email address"
              bg="whiteAlpha.200"
              border="1px solid"
              borderColor="whiteAlpha.400"
              color="white"
              _placeholder={{ color: 'whiteAlpha.700' }}
              _focus={{ bg: 'whiteAlpha.300', borderColor: 'white' }}
            />
            <InputRightElement width="auto" pr={1}>
              <Button size="sm" bg="white" color="brand.500" _hover={{ bg: 'brand.50' }}>
                Subscribe
              </Button>
            </InputRightElement>
          </InputGroup>
          <Text fontSize="xs" opacity={0.65}>No spam. Unsubscribe anytime.</Text>
        </VStack>
      </Box>
    </>
  )
}
