import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Modal, ModalOverlay, ModalContent, ModalBody,
  ModalCloseButton, Button, Flex, Box, Image,
  Text, HStack, VStack, Badge, useColorModeValue,
} from '@chakra-ui/react'
import { FiShoppingCart, FiExternalLink } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import StarRating from '../ui/StarRating'

// QuickViewModal — shows a product preview without leaving the current page.
// Props:
//   isOpen   — boolean
//   onClose  — function
//   product  — Product object (or null)
export default function QuickViewModal({ isOpen, onClose, product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const muted = useColorModeValue('gray.500', 'gray.400')

  if (!product) return null  // guard — don't render if no product passed

  function handleAdd() {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent>
        <ModalCloseButton zIndex={10} />
        <ModalBody p={0}>
          <Flex direction={{ base: 'column', md: 'row' }} minH="380px">

            {/* Left — product image */}
            <Box flex="1" bg="gray.50" borderRadius="xl">
              <Image
                src={product.image}
                alt={product.imageAlt}
                w="full"
                h={{ base: '240px', md: 'full' }}
                objectFit="cover"
                borderLeftRadius="xl"
              />
            </Box>

            {/* Right — product info */}
            <VStack
              flex="1"
              align="start"
              spacing={3}
              p={6}
              justify="center"
            >
              <Badge colorScheme="brand" variant="subtle" fontSize="xs">
                {product.category}
              </Badge>

              <Text fontFamily="heading" fontSize="xl" fontWeight="600" lineHeight="short">
                {product.name}
              </Text>

              <StarRating rating={product.rating} showNumber reviewCount={product.reviewCount} />

              <Text fontSize="sm" color={muted} lineHeight="tall">
                {product.description}
              </Text>

              {/* Price */}
              <HStack spacing={2} align="baseline">
                <Text fontSize="2xl" fontWeight="700">
                  ${product.price}
                </Text>
                {product.originalPrice && (
                  <>
                    <Text fontSize="sm" color={muted} textDecoration="line-through">
                      ${product.originalPrice}
                    </Text>
                    <Badge colorScheme="red" fontSize="xs">
                      -{product.getDiscountPercent()}% off
                    </Badge>
                  </>
                )}
              </HStack>

              {/* Actions */}
              <VStack w="full" spacing={2} pt={2}>
                <Button
                  leftIcon={<FiShoppingCart />}
                  w="full"
                  colorScheme="brand"
                  bg={added ? 'green.500' : 'brand.500'}
                  color="white"
                  _hover={{ bg: added ? 'green.600' : 'brand.600' }}
                  onClick={handleAdd}
                  transition="background 0.2s"
                >
                  {added ? 'Added to cart!' : 'Add to cart'}
                </Button>

                <Button
                  as={RouterLink}
                  to={`/products/${product.id}`}
                  rightIcon={<FiExternalLink />}
                  w="full"
                  variant="outline"
                  onClick={onClose}
                >
                  View full details
                </Button>
              </VStack>
            </VStack>

          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
