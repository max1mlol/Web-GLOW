import { memo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Image, Badge, Text, Button, IconButton,
  VStack, HStack, useColorModeValue, Tooltip,
} from '@chakra-ui/react'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import StarRating from './StarRating'

// ProductCard is wrapped in React.memo — it will only re-render if its props
// actually change. Since we render many cards in a grid, this prevents
// all cards from re-rendering when only the cart state changes.
// (react-best-practices: rerender-memo)
const ProductCard = memo(function ProductCard({ product }) {
  const { addToCart, items } = useCart()

  // Local wishlist state — per card, no need to lift this up
  const [wishlisted, setWishlisted] = useState(false)
  // Local "just added" flash state for button feedback
  const [added, setAdded] = useState(false)

  const cardBg    = useColorModeValue('white', 'gray.800')
  const borderCol = useColorModeValue('gray.100', 'gray.700')
  const textMuted = useColorModeValue('gray.500', 'gray.400')

  // Check if product already in cart
  const inCart = items.some(i => i.id === product.id)

  function handleAddToCart() {
    addToCart(product)
    // Show "Added!" for 1.5s then revert — functional setState for stability
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Box
      bg={cardBg}
      border="1px solid"
      borderColor={borderCol}
      borderRadius="xl"
      overflow="hidden"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
      role="group"
    >
      {/* Image area */}
      <Box position="relative" overflow="hidden">
        <Image
          src={product.image}
          alt={product.imageAlt}
          w="full"
          h="240px"
          objectFit="cover"
          loading="lazy"
          transition="transform 0.4s"
          _groupHover={{ transform: 'scale(1.04)' }}
        />

        {/* Sale / new badge */}
        {product.badge && (
          <Badge
            position="absolute" top={3} left={3}
            colorScheme={product.badge === 'Шинэ' ? 'green' : 'red'}
            borderRadius="full" px={3} fontSize="xs"
          >
            {product.badge}
          </Badge>
        )}

        {/* Wishlist button */}
        <Tooltip label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            icon={<FiHeart />}
            aria-label="Wishlist"
            position="absolute" top={3} right={3}
            size="sm"
            borderRadius="full"
            bg="whiteAlpha.800"
            color={wishlisted ? 'red.500' : 'gray.600'}
            _hover={{ bg: 'white', color: 'red.500' }}
            onClick={() => setWishlisted(w => !w)}
          />
        </Tooltip>
      </Box>

      {/* Card body */}
      <VStack align="start" spacing={2} p={4}>
        <Text fontSize="xs" color="brand.500" fontWeight="600" textTransform="uppercase" letterSpacing="wider">
          {product.category}
        </Text>

        <Text
          as={RouterLink}
          to={`/products/${product.id}`}
          fontFamily="heading"
          fontSize="lg"
          fontWeight="600"
          lineHeight="short"
          _hover={{ color: 'brand.500', textDecoration: 'none' }}
          noOfLines={2}
        >
          {product.name}
        </Text>

        <Text fontSize="sm" color={textMuted} noOfLines={2}>
          {product.description}
        </Text>

        <StarRating rating={product.rating} showNumber reviewCount={product.reviewCount} />

        {/* Price row */}
        <HStack spacing={2} align="baseline">
          <Text fontWeight="700" fontSize="lg">
            ${product.price}
          </Text>
          {product.originalPrice && (
            <Text fontSize="sm" color={textMuted} textDecoration="line-through">
              ${product.originalPrice}
            </Text>
          )}
        </HStack>

        {/* Add to cart button */}
        <Button
          id={`add-cart-${product.id}`}
          leftIcon={<FiShoppingCart />}
          size="sm"
          w="full"
          mt={1}
          colorScheme={added ? 'green' : 'brand'}
          bg={added ? 'green.500' : 'brand.500'}
          color="white"
          _hover={{ bg: added ? 'green.600' : 'brand.600' }}
          onClick={handleAddToCart}
          transition="background 0.2s"
        >
          {added ? 'Added!' : inCart ? 'Add more' : 'Add to cart'}
        </Button>
      </VStack>
    </Box>
  )
})

export default ProductCard
