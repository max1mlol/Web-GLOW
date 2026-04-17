import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Flex, Grid, VStack, HStack, Text, Button,
  Divider, useColorModeValue,
} from '@chakra-ui/react'
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import CartItem from '../components/ui/CartItem'

export default function CartPage() {
  const { items, cartTotal, cartCount, clearCart } = useCart()

  const muted   = useColorModeValue('gray.500', 'gray.400')
  const cardBg  = useColorModeValue('white',    'gray.800')
  const borderC = useColorModeValue('gray.100', 'gray.700')

  const TAX_RATE    = 0.08
  const FREE_SHIP   = 75
  const tax         = cartTotal * TAX_RATE
  const shipping    = cartTotal >= FREE_SHIP ? 0 : 9.99
  const orderTotal  = cartTotal + tax + shipping

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={24}>
        <Text fontSize="5xl" mb={4}>🛒</Text>
        <Text fontFamily="heading" fontSize="2xl" fontWeight="600" mb={2}>Your cart is empty</Text>
        <Text color={muted} mb={6}>Add some products to get started.</Text>
        <Button as={RouterLink} to="/products" colorScheme="brand" bg="brand.500" color="white" leftIcon={<FiShoppingBag />}>
          Browse Products
        </Button>
      </Box>
    )
  }

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      <HStack justify="space-between" mb={8}>
        <Text as="h1" fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="600">
          Cart ({cartCount} items)
        </Text>
        <Button size="sm" variant="ghost" colorScheme="red" onClick={clearCart}>Clear cart</Button>
      </HStack>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 360px' }} gap={8}>
        {/* Cart items list */}
        <Box bg={cardBg} borderRadius="xl" p={6} border="1px solid" borderColor={borderC}>
          {items.map(item => <CartItem key={item.id} item={item} />)}

          <Button
            as={RouterLink} to="/products"
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            size="sm"
            mt={4}
          >
            Continue shopping
          </Button>
        </Box>

        {/* Order summary */}
        <Box>
          <Box bg={cardBg} borderRadius="xl" p={6} border="1px solid" borderColor={borderC} position="sticky" top="80px">
            <Text fontFamily="heading" fontSize="xl" fontWeight="600" mb={5}>Order Summary</Text>

            <VStack spacing={3} align="stretch">
              <Flex justify="space-between" fontSize="sm">
                <Text color={muted}>Subtotal ({cartCount} items)</Text>
                <Text fontWeight="500">${cartTotal.toFixed(2)}</Text>
              </Flex>
              <Flex justify="space-between" fontSize="sm">
                <Text color={muted}>Shipping</Text>
                <Text fontWeight="500" color={shipping === 0 ? 'green.500' : 'inherit'}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </Flex>
              <Flex justify="space-between" fontSize="sm">
                <Text color={muted}>Tax (8%)</Text>
                <Text fontWeight="500">${tax.toFixed(2)}</Text>
              </Flex>
              {shipping > 0 && (
                <Text fontSize="xs" color="brand.500">
                  Add ${(FREE_SHIP - cartTotal).toFixed(2)} more for free shipping
                </Text>
              )}
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="700">Total</Text>
                <Text fontWeight="700" fontSize="xl">${orderTotal.toFixed(2)}</Text>
              </Flex>
            </VStack>

            <Button
              as={RouterLink} to="/checkout"
              w="full" mt={5} size="lg"
              bg="brand.500" color="white"
              _hover={{ bg: 'brand.600' }}
            >
              Checkout
            </Button>
            <Text fontSize="xs" color={muted} textAlign="center" mt={3}>
              256-bit SSL secure checkout
            </Text>
          </Box>
        </Box>
      </Grid>
    </Box>
  )
}
