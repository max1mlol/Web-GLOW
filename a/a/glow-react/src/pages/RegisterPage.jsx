import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box, VStack, Text, Input, Button, FormControl,
  FormLabel, FormErrorMessage, Divider, InputGroup,
  InputRightElement, IconButton, useColorModeValue,
} from '@chakra-ui/react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form,   setForm]   = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)

  const cardBg  = useColorModeValue('white',    'gray.800')
  const borderC = useColorModeValue('gray.200', 'gray.700')
  const muted   = useColorModeValue('gray.500', 'gray.400')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())     errs.name     = 'Name is required'
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    register({ name: form.name, email: form.email })
    navigate('/')
  }

  return (
    <Box minH="80vh" display="flex" alignItems="center" justifyContent="center" px={4} py={12}>
      <Box w="full" maxW="420px">
        <Text fontFamily="heading" fontSize="3xl" fontWeight="700" color="brand.500" textAlign="center" mb={2}>
          GLOW
        </Text>
        <Text textAlign="center" color={muted} fontSize="sm" mb={8}>
          Create your account
        </Text>

        <Box bg={cardBg} p={8} borderRadius="2xl" border="1px solid" borderColor={borderC} boxShadow="sm">
          <VStack as="form" onSubmit={handleSubmit} spacing={4} noValidate>

            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize="sm">Full Name</FormLabel>
              <Input name="name" value={form.name} onChange={handleChange}
                placeholder="Your name" size="sm" borderRadius="md" />
              <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" size="sm" borderRadius="md" />
              <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel fontSize="sm">Password</FormLabel>
              <InputGroup size="sm">
                <Input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Minimum 6 characters" borderRadius="md"
                />
                <InputRightElement>
                  <IconButton size="xs" variant="ghost"
                    icon={showPw ? <FiEyeOff /> : <FiEye />}
                    aria-label="Toggle password" onClick={() => setShowPw(s => !s)} />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.confirm}>
              <FormLabel fontSize="sm">Confirm Password</FormLabel>
              <Input name="confirm" type={showPw ? 'text' : 'password'}
                value={form.confirm} onChange={handleChange}
                placeholder="Repeat password" size="sm" borderRadius="md" />
              <FormErrorMessage fontSize="xs">{errors.confirm}</FormErrorMessage>
            </FormControl>

            <Button type="submit" w="full" bg="brand.500" color="white"
              _hover={{ bg: 'brand.600' }} mt={2}>
              Create Account
            </Button>
          </VStack>

          <Divider my={5} />

          <Text fontSize="sm" textAlign="center" color={muted}>
            Already have an account?{' '}
            <Text as={RouterLink} to="/login" color="brand.500" fontWeight="500"
              _hover={{ textDecoration: 'underline' }}>
              Sign in
            </Text>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
