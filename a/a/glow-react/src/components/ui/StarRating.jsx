import { HStack, Text } from '@chakra-ui/react'

// Converts a numeric rating into filled/empty star characters.
// Same logic as the old createStars() in components.js.
// Props: rating (number), showNumber (bool)
export default function StarRating({ rating = 0, showNumber = false, reviewCount }) {
  const full  = Math.floor(rating)
  const empty = 5 - full
  const stars = '★'.repeat(full) + '☆'.repeat(empty)

  return (
    <HStack spacing={1} display="inline-flex" align="center">
      <Text color="orange.400" fontSize="sm" letterSpacing="wider">
        {stars}
      </Text>
      {showNumber && (
        <Text fontSize="xs" color="gray.500">
          {rating} {reviewCount !== undefined && `(${reviewCount})`}
        </Text>
      )}
    </HStack>
  )
}
