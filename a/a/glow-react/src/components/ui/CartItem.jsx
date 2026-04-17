import { Link as RouterLink } from 'react-router-dom'
import {
  Flex, Box, Image, Text, HStack, IconButton,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'

// Props: item — one cart item object { id, name, image, imageAlt, price, qty, ... }
export default function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart()
  const borderCol = useColorModeValue('gray.100', 'gray.700')
  const muted     = useColorModeValue('gray.500', 'gray.400')

  return (
    <Flex
      gap={4}
      align="center"
      py={4}
      borderBottom="1px solid"
      borderColor={borderCol}
    >
      {/* Product image */}
      <Image
        src={item.image}
        alt={item.imageAlt}
        boxSize="90px"
        objectFit="cover"
        borderRadius="lg"
        flexShrink={0}
      />

      {/* Product info */}
      <Box flex="1">
        <Text
          as={RouterLink}
          to={`/products/${item.id}`}
          fontWeight="600"
          fontSize="sm"
          _hover={{ color: 'brand.500', textDecoration: 'none' }}
        >
          {item.name}
        </Text>
        <Text fontSize="xs" color={muted} mt={0.5}>
          {item.category}
        </Text>

        {/* Qty control — Chakra NumberInput handles all the +/- logic */}
        <HStack mt={3} spacing={2}>
          <NumberInput
            size="xs"
            value={item.qty}
            min={1}
            max={99}
            maxW="80px"
            onChange={(_, val) => updateQty(item.id, val)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <IconButton
            icon={<FiTrash2 />}
            aria-label="Remove"
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={() => removeFromCart(item.id)}
          />
        </HStack>
      </Box>

      {/* Line total */}
      <Text fontWeight="700" minW="60px" textAlign="right">
        ${(item.price * item.qty).toFixed(2)}
      </Text>
    </Flex>
  )
}
