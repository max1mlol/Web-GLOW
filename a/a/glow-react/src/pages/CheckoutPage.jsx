import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box, Grid, VStack, HStack, Text, Button, Input,
  FormControl, FormLabel, FormErrorMessage, Select,
  Divider, Image, useColorModeValue, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalBody,
  Alert, AlertIcon,
} from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

const COUNTRIES = ['Mongolia', 'United States', 'Canada', 'United Kingdom', 'Australia']

// Simple required-field validator
function validate(form) {
  const errors = {}
  const required = ['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'country', 'cardName', 'cardNumber', 'expDate', 'cvv']
  required.forEach(k => { if (!form[k]?.trim()) errors[k] = 'Required' })
  if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Invalid email'
  return errors
}

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const { isOpen, onOpen } = useDisclosure()

  const [form, setForm] = useState({
    email: '', phone: '', firstName: '', lastName: '',
    address: '', address2: '', city: '', state: '', zip: '', country: '',
    cardName: '', cardNumber: '', expDate: '', cvv: '',
  })
  const [errors, setErrors] = useState({})

  const TAX      = cartTotal * 0.08
  const shipping = cartTotal >= 75 ? 0 : 9.99
  const total    = cartTotal + TAX + shipping

  const muted   = useColorModeValue('gray.500', 'gray.400')
  const cardBg  = useColorModeValue('white',    'gray.800')
  const borderC = useColorModeValue('gray.200', 'gray.700')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error as user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    clearCart()
    onOpen()  // show success modal
  }

  function Field({ name, label, placeholder, type = 'text', as: AsComp }) {
    return (
      <FormControl isInvalid={!!errors[name]}>
        <FormLabel fontSize="sm">{label}</FormLabel>
        {AsComp ? (
          <AsComp name={name} value={form[name]} onChange={handleChange} className="form-select"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${errors[name] ? '#E53E3E' : '#CBD5E0'}`, fontSize: '14px' }}>
            <option value="">Select country</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
          </AsComp>
        ) : (
          <Input name={name} value={form[name]} onChange={handleChange}
            placeholder={placeholder} type={type} size="sm" borderRadius="md"
            borderColor={errors[name] ? 'red.400' : borderC}
          />
        )}
        {errors[name] && <FormErrorMessage fontSize="xs">{errors[name]}</FormErrorMessage>}
      </FormControl>
    )
  }

  return (
    <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      <Text as="h1" fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="600" mb={8}>
        Checkout
      </Text>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 360px' }} gap={8}>
        {/* Form */}
        <Box as="form" onSubmit={handleSubmit} noValidate>
          <VStack spacing={6} align="stretch">

            {/* Contact */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderC}>
              <Text fontWeight="600" mb={4}>Contact Information</Text>
              <Grid templateColumns={{ base: '1fr', sm: '1fr 1fr' }} gap={4}>
                <Field name="email" label="Email *" placeholder="you@example.com" type="email" />
                <Field name="phone" label="Phone *" placeholder="+976 ..." />
              </Grid>
            </Box>

            {/* Shipping */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderC}>
              <Text fontWeight="600" mb={4}>Shipping Address</Text>
              <VStack spacing={4}>
                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <Field name="firstName" label="First name *" />
                  <Field name="lastName"  label="Last name *" />
                </Grid>
                <Field name="address"  label="Address *" placeholder="Street address" />
                <Field name="address2" label="Apt, suite, etc. (optional)" />
                <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                  <Field name="city"  label="City *" />
                  <Field name="state" label="Province *" />
                  <Field name="zip"   label="Postal code *" />
                </Grid>
                <Field name="country" label="Country *" as="select" />
              </VStack>
            </Box>

            {/* Payment */}
            <Box bg={cardBg} p={6} borderRadius="xl" border="1px solid" borderColor={borderC}>
              <Text fontWeight="600" mb={4}>Payment Information</Text>
              <VStack spacing={4}>
                <Field name="cardName"   label="Name on card *" />
                <Field name="cardNumber" label="Card number *" placeholder="1234 5678 9012 3456" />
                <Grid templateColumns="1fr 1fr" gap={4} w="full">
                  <Field name="expDate" label="Expiry *" placeholder="MM/YY" />
                  <Field name="cvv"     label="CVV *" placeholder="123" />
                </Grid>
              </VStack>
            </Box>

            <HStack justify="space-between">
              <Button as={RouterLink} to="/cart" variant="outline" size="lg">Back to cart</Button>
              <Button type="submit" size="lg" bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>
                Place Order
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Summary sidebar */}
        <Box>
          <Box bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={borderC} position="sticky" top="80px">
            <Text fontWeight="600" mb={4}>Order Summary</Text>
            <VStack spacing={3} align="stretch" mb={4}>
              {items.map(item => (
                <HStack key={item.id} justify="space-between" fontSize="sm">
                  <HStack>
                    <Image src={item.image} boxSize="40px" objectFit="cover" borderRadius="md" />
                    <Text noOfLines={1}>{item.name}</Text>
                    <Text color={muted}>×{item.qty}</Text>
                  </HStack>
                  <Text fontWeight="500">${(item.price * item.qty).toFixed(2)}</Text>
                </HStack>
              ))}
            </VStack>
            <Divider mb={4} />
            <VStack spacing={2} fontSize="sm" align="stretch">
              <Flex justify="space-between"><Text color={muted}>Subtotal</Text><Text>${cartTotal.toFixed(2)}</Text></Flex>
              <Flex justify="space-between"><Text color={muted}>Shipping</Text><Text>{shipping === 0 ? 'Free' : `$${shipping}`}</Text></Flex>
              <Flex justify="space-between"><Text color={muted}>Tax</Text><Text>${TAX.toFixed(2)}</Text></Flex>
              <Divider />
              <Flex justify="space-between" fontWeight="700"><Text>Total</Text><Text>${total.toFixed(2)}</Text></Flex>
            </VStack>
          </Box>
        </Box>
      </Grid>

      {/* Success modal */}
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="sm" closeOnOverlayClick={false}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalBody py={10} textAlign="center">
            <Box bg="green.100" borderRadius="full" w="64px" h="64px" display="flex" alignItems="center" justifyContent="center" mx="auto" mb={4}>
              <FiCheck size={28} color="#22543D" />
            </Box>
            <Text fontFamily="heading" fontSize="2xl" fontWeight="600" mb={2}>Order Placed!</Text>
            <Text color={muted} mb={6} fontSize="sm">Thank you for your purchase. We'll email you when it ships.</Text>
            <Button as={RouterLink} to="/" bg="brand.500" color="white" _hover={{ bg: 'brand.600' }}>
              Back to Home
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
