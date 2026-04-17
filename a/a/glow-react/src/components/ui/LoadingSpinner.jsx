import { VStack, Spinner, Text } from '@chakra-ui/react'

// Shown while products are being fetched from JSONBin.
// role="status" + aria-live make it accessible for screen readers.
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <VStack py={20} spacing={4} role="status" aria-live="polite">
      <Spinner size="xl" color="brand.500" thickness="3px" speed="0.7s" />
      <Text color="gray.500" fontSize="sm">{message}</Text>
    </VStack>
  )
}
