import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box, Grid, Flex, Image, Text, Button, VStack, HStack,
  Badge, Divider, useDisclosure, useColorModeValue, Avatar,
} from '@chakra-ui/react'
import { FiShoppingCart, FiEdit2, FiArrowLeft } from 'react-icons/fi'
import { fetchProducts, getProductById } from '../services/api'
import { useCart } from '../context/CartContext'
import StarRating from '../components/ui/StarRating'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ReviewModal from '../components/modals/ReviewModal'

export default function ProductDetailPage() {
  const { id } = useParams()   // /products/:id — React Router extracts the id
  const { addToCart } = useCart()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added,   setAdded]   = useState(false)
  // Reviews stored in local state — in a real app this would come from a backend
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Sarah M.',   rating: 5, date: 'March 15, 2026', comment: 'Absolutely love this product! My skin has never felt better.' },
    { id: 2, name: 'Sarnai G.', rating: 4, date: 'March 10, 2026', comment: 'Great results after 2 weeks of consistent use.' },
  ])

  const muted   = useColorModeValue('gray.500', 'gray.400')
  const borderC = useColorModeValue('gray.100', 'gray.700')
  const cardBg  = useColorModeValue('gray.50',  'gray.800')

  // Fetch product on mount — useEffect with [id] dependency
  // Re-runs if the id changes (user navigates from one product to another)
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        await fetchProducts()  // ensures cache is populated
        const p = getProductById(id)
        if (!cancelled) setProduct(p)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  function handleAddToCart() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleReviewSubmit(review) {
    // Prepend new review so it shows first
    setReviews(prev => [review, ...prev])
  }

  if (loading) return <LoadingSpinner message="Loading product..." />

  if (!product) return (
    <Box textAlign="center" py={20}>
      <Text fontSize="xl" mb={4}>Product not found.</Text>
      <Button as={RouterLink} to="/products" leftIcon={<FiArrowLeft />}>Back to Products</Button>
    </Box>
  )

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      {/* Breadcrumb */}
      <HStack spacing={2} mb={8} fontSize="sm" color={muted}>
        <RouterLink to="/">Home</RouterLink>
        <Text>/</Text>
        <RouterLink to="/products">Products</RouterLink>
        <Text>/</Text>
        <Text color="inherit" noOfLines={1}>{product.name}</Text>
      </HStack>

      {/* Product detail grid */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={12} mb={16}>

        {/* Left — image */}
        <Box>
          <Image
            src={product.image}
            alt={product.imageAlt}
            w="full"
            borderRadius="2xl"
            objectFit="cover"
            h={{ base: '320px', md: '500px' }}
          />
          {product.badge && (
            <Badge
              mt={3}
              colorScheme={product.badge === 'Шинэ' ? 'green' : 'red'}
              borderRadius="full" px={3}
            >
              {product.badge}
            </Badge>
          )}
        </Box>

        {/* Right — info */}
        <VStack align="start" spacing={5}>
          <Badge colorScheme="brand" variant="subtle">{product.category}</Badge>

          <Text as="h1" fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="600" lineHeight="short">
            {product.name}
          </Text>

          <StarRating rating={product.rating} showNumber reviewCount={product.reviewCount} />

          {/* Price */}
          <HStack spacing={3} align="baseline">
            <Text fontSize="3xl" fontWeight="700">${product.price}</Text>
            {product.originalPrice && (
              <>
                <Text fontSize="lg" color={muted} textDecoration="line-through">${product.originalPrice}</Text>
                <Badge colorScheme="red" fontSize="sm">-{product.getDiscountPercent()}% off</Badge>
              </>
            )}
          </HStack>

          <Text color={muted} lineHeight="tall">{product.description}</Text>

          <Text fontSize="sm" color={muted}>
            Skin type: <strong>{product.skinType}</strong>
          </Text>

          <Divider />

          <VStack w="full" spacing={3}>
            <Button
              id={`add-cart-${product.id}`}
              leftIcon={<FiShoppingCart />}
              w="full"
              size="lg"
              bg={added ? 'green.500' : 'brand.500'}
              color="white"
              _hover={{ bg: added ? 'green.600' : 'brand.600' }}
              onClick={handleAddToCart}
              transition="background 0.2s"
            >
              {added ? 'Added to cart!' : 'Add to cart'}
            </Button>

            <Button
              leftIcon={<FiEdit2 />}
              w="full"
              variant="outline"
              onClick={onOpen}
            >
              Write a Review
            </Button>
          </VStack>
        </VStack>
      </Grid>

      {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontFamily="heading" fontSize="2xl" fontWeight="600">
            Customer Reviews ({reviews.length})
          </Text>
          <Button size="sm" leftIcon={<FiEdit2 />} variant="outline" onClick={onOpen}>
            Write a Review
          </Button>
        </Flex>

        <VStack spacing={4} align="stretch">
          {reviews.map(review => (
            <Box key={review.id} bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={borderC}>
              <Flex justify="space-between" mb={2}>
                <HStack>
                  <Avatar name={review.name} size="sm" bg="brand.500" color="white" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="600">{review.name}</Text>
                    <Text fontSize="xs" color={muted}>{review.date}</Text>
                  </VStack>
                </HStack>
                <StarRating rating={review.rating} />
              </Flex>
              <Text fontSize="sm" color={muted} lineHeight="tall">{review.comment}</Text>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Review modal */}
      <ReviewModal
        isOpen={isOpen}
        onClose={onClose}
        product={product}
        onSubmit={handleReviewSubmit}
      />
    </Box>
  )
}
