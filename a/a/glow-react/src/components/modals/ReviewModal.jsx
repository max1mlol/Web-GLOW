import { useState } from 'react'
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter,
  Button, Textarea, VStack, HStack, Text,
  Alert, AlertIcon, useColorModeValue,
} from '@chakra-ui/react'

// ReviewModal — lets a user pick a star rating and write a comment.
// Props:
//   isOpen   — boolean, controlled by parent via useDisclosure
//   onClose  — function to close the modal
//   product  — the product being reviewed
//   onSubmit — callback(review) when user submits
export default function ReviewModal({ isOpen, onClose, product, onSubmit }) {
  // Form state — all local, doesn't need to go into global context
  const [rating,  setRating]  = useState(0)
  const [hovered, setHovered] = useState(0)   // which star the cursor is over
  const [comment, setComment] = useState('')
  const [name,    setName]    = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const starColor     = useColorModeValue('orange.400', 'orange.300')
  const starEmptyCol  = useColorModeValue('gray.300',   'gray.600')
  const inputBg       = useColorModeValue('gray.50',    'gray.700')

  function handleSubmit() {
    // Basic validation
    if (!rating)          return setError('Please select a star rating.')
    if (!comment.trim())  return setError('Please write a comment.')
    if (!name.trim())     return setError('Please enter your name.')

    const review = {
      id:        Date.now(),
      productId: product?.id,
      rating,
      comment:   comment.trim(),
      name:      name.trim(),
      date:      new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
    }

    onSubmit?.(review)
    setSubmitted(true)
  }

  function handleClose() {
    // Reset all form state when modal closes — clean slate for next time
    setRating(0); setHovered(0); setComment(''); setName('')
    setSubmitted(false); setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader>
          Write a Review
          {product && (
            <Text fontSize="sm" fontWeight="400" color="gray.500" mt={1}>
              {product.name}
            </Text>
          )}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {submitted ? (
            // Success state — shown after submit
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              Thank you! Your review has been submitted.
            </Alert>
          ) : (
            <VStack spacing={4} align="start">
              {error && (
                <Alert status="error" borderRadius="md" py={2}>
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}

              {/* Star picker — interactive star rating */}
              <VStack align="start" spacing={1} w="full">
                <Text fontSize="sm" fontWeight="500">Your Rating *</Text>
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Text
                      key={star}
                      as="button"
                      fontSize="2xl"
                      color={(hovered || rating) >= star ? starColor : starEmptyCol}
                      cursor="pointer"
                      transition="color 0.1s, transform 0.1s"
                      _hover={{ transform: 'scale(1.2)' }}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => { setRating(star); setError('') }}
                      aria-label={`${star} star`}
                    >
                      ★
                    </Text>
                  ))}
                </HStack>
                {rating > 0 && (
                  <Text fontSize="xs" color="gray.500">
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </Text>
                )}
              </VStack>

              {/* Name input */}
              <VStack align="start" spacing={1} w="full">
                <Text fontSize="sm" fontWeight="500">Your Name *</Text>
                <input
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  placeholder="e.g. Sarah M."
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: '6px',
                    border: '1px solid #CBD5E0', background: inputBg === 'gray.50' ? '#F7FAFC' : '#2D3748',
                    fontSize: '14px',
                  }}
                />
              </VStack>

              {/* Comment textarea */}
              <VStack align="start" spacing={1} w="full">
                <Text fontSize="sm" fontWeight="500">Your Review *</Text>
                <Textarea
                  value={comment}
                  onChange={e => { setComment(e.target.value); setError('') }}
                  placeholder="Share your experience with this product..."
                  rows={4}
                  resize="none"
                  bg={inputBg}
                  fontSize="sm"
                />
              </VStack>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter gap={2}>
          {submitted ? (
            <Button onClick={handleClose} colorScheme="brand" bg="brand.500" color="white">
              Close
            </Button>
          ) : (
            <>
              <Button variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button
                colorScheme="brand" bg="brand.500" color="white"
                _hover={{ bg: 'brand.600' }}
                onClick={handleSubmit}
              >
                Submit Review
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
