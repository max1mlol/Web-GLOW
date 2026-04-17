import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box, VStack, Text, Input, Button, FormControl,
  FormLabel, FormErrorMessage, Divider, HStack,
  useColorModeValue, Alert, AlertIcon, InputGroup,
  InputRightElement, IconButton,
} from '@chakra-ui/react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form,   setForm]   = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPw, setShowPw] = useState(false)
  const [apiErr, setApiErr] = useState('')

  const cardBg  = useColorModeValue('white',    'gray.800')
  const borderC = useColorModeValue('gray.200', 'gray.700')
  const muted   = useColorModeValue('gray.500', 'gray.400')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    setApiErr('')
  }

  function validate() {
    const errs = {}
    if (!form.email.trim())    errs.email    = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password.trim()) errs.password = 'Password is required'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // Demo login — in production this would be an API call
    // Any email + password >= 6 chars is accepted
    if (form.password.length < 6) {
      setApiErr('Incorrect email or password.')
      return
    }

    login({ name: form.email.split('@')[0], email: form.email })
    navigate('/')
  }

  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={12}
    >
      <Box w="full" maxW="420px">
        {/* Logo */}
        <Text
          fontFamily="heading"
          fontSize="3xl"
          fontWeight="700"
          color="brand.500"
          textAlign="center"
          mb={2}
        >
          GLOW
        </Text>
        <Text textAlign="center" color={muted} fontSize="sm" mb={8}>
          Sign in to your account
        </Text>

        <Box bg={cardBg} p={8} borderRadius="2xl" border="1px solid" borderColor={borderC} boxShadow="sm">
          {apiErr && (
            <Alert status="error" borderRadius="md" mb={4} fontSize="sm">
              <AlertIcon />
              {apiErr}
            </Alert>
          )}

          <VStack as="form" onSubmit={handleSubmit} spacing={4} noValidate>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel fontSize="sm">Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                size="sm"
                borderRadius="md"
              />
              <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel fontSize="sm">Password</FormLabel>
              <InputGroup size="sm">
                <Input
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  borderRadius="md"
                />
                <InputRightElement>
                  <IconButton
                    size="xs"
                    variant="ghost"
                    icon={showPw ? <FiEyeOff /> : <FiEye />}
                    aria-label="Toggle password"
                    onClick={() => setShowPw(s => !s)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              w="full"
              bg="brand.500"
              color="white"
              _hover={{ bg: 'brand.600' }}
              mt={2}
            >
              Sign In
            </Button>
          </VStack>

          <Divider my={5} />

          <Text fontSize="sm" textAlign="center" color={muted}>
            Don't have an account?{' '}
            <Text as={RouterLink} to="/register" color="brand.500" fontWeight="500" _hover={{ textDecoration: 'underline' }}>
              Sign up
            </Text>
          </Text>
        </Box>

        <Text fontSize="xs" color={muted} textAlign="center" mt={4}>
          Demo: use any email + password with 6+ characters
        </Text>
      </Box>
    </Box>
  )
}
