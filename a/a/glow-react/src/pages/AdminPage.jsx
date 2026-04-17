import { useState } from 'react'
import {
  Box, Grid, Flex, VStack, HStack, Text, Button, Input,
  Badge, Image, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, ModalFooter,
  FormControl, FormLabel, NumberInput, NumberInputField,
  useDisclosure, useColorModeValue, Stat, StatLabel,
  StatNumber, StatHelpText,
} from '@chakra-ui/react'
import { FiPlus, FiTrash2, FiEdit2, FiPackage, FiShoppingCart, FiDollarSign, FiStar } from 'react-icons/fi'
import { useProducts } from '../hooks/useProducts'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const EMPTY_FORM = { name: '', category: '', price: '', description: '', image: '' }

export default function AdminPage() {
  const { products, loading } = useProducts({})
  // Local admin-only product list — starts from the fetched list,
  // then allows adding/removing without touching the real API
  const [localProducts, setLocalProducts] = useState(null)
  const displayProducts = localProducts ?? products

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editTarget, setEditTarget] = useState(null)  // null = adding new
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')

  const cardBg  = useColorModeValue('white',    'gray.800')
  const borderC = useColorModeValue('gray.100', 'gray.700')
  const muted   = useColorModeValue('gray.500', 'gray.400')
  const tableBg = useColorModeValue('white',    'gray.800')

  // Sync local list from fetched products on first load
  if (!localProducts && products.length > 0 && !loading) {
    setLocalProducts([...products])
  }

  // Summary stats
  const totalRevenue  = displayProducts.reduce((s, p) => s + p.price, 0).toFixed(0)
  const avgRating     = displayProducts.length
    ? (displayProducts.reduce((s, p) => s + p.rating, 0) / displayProducts.length).toFixed(1)
    : 0
  const onSaleCount   = displayProducts.filter(p => p.isOnSale()).length

  const filtered = displayProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    onOpen()
  }

  function openEdit(product) {
    setEditTarget(product)
    setForm({
      name: product.name, category: product.category,
      price: String(product.price), description: product.description,
      image: product.image,
    })
    onOpen()
  }

  function handleDelete(id) {
    setLocalProducts(prev => prev.filter(p => p.id !== id))
  }

  function handleSave() {
    if (!form.name || !form.price) return
    if (editTarget) {
      // Update existing
      setLocalProducts(prev =>
        prev.map(p => p.id === editTarget.id
          ? { ...p, ...form, price: Number(form.price) }
          : p
        )
      )
    } else {
      // Add new — generate a temporary id
      const newProduct = {
        ...EMPTY_FORM, ...form,
        id: Date.now(),
        price: Number(form.price),
        rating: 0, reviewCount: 0, originalPrice: null, badge: null,
        skinType: 'All', imageAlt: form.name,
        isOnSale: () => false,
        getDiscountPercent: () => 0,
      }
      setLocalProducts(prev => [newProduct, ...prev])
    }
    onClose()
  }

  return (
    <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={3}>
        <Box>
          <Text as="h1" fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="600">
            Admin Dashboard
          </Text>
          <Text fontSize="sm" color={muted}>Product management</Text>
        </Box>
        <Button leftIcon={<FiPlus />} bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} onClick={openAdd}>
          Add Product
        </Button>
      </Flex>

      {/* Stats row */}
      <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={8}>
        {[
          { icon: FiPackage,     label: 'Total Products', value: displayProducts.length, sub: 'in catalog' },
          { icon: FiShoppingCart, label: 'On Sale',       value: onSaleCount,            sub: 'discounted' },
          { icon: FiDollarSign,  label: 'Avg Price',      value: `$${(displayProducts.reduce((s,p)=>s+p.price,0)/Math.max(displayProducts.length,1)).toFixed(0)}`, sub: 'per product' },
          { icon: FiStar,        label: 'Avg Rating',     value: avgRating,              sub: 'out of 5' },
        ].map(stat => (
          <Box key={stat.label} bg={cardBg} p={5} borderRadius="xl" border="1px solid" borderColor={borderC}>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color={muted}>{stat.label}</StatLabel>
                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
                <StatHelpText fontSize="xs">{stat.sub}</StatHelpText>
              </Stat>
              <Box color="brand.500" opacity={0.7}><stat.icon size={24} /></Box>
            </Flex>
          </Box>
        ))}
      </Grid>

      {/* Product table */}
      <Box bg={tableBg} borderRadius="xl" border="1px solid" borderColor={borderC} overflow="hidden">
        <Box p={4} borderBottom="1px solid" borderColor={borderC}>
          <Input
            placeholder="Search products by name or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="sm"
            borderRadius="md"
            maxW="360px"
          />
        </Box>

        {loading ? <LoadingSpinner /> : (
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th isNumeric>Price</Th>
                  <Th isNumeric>Rating</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map(p => (
                  <Tr key={p.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                    <Td>
                      <HStack spacing={3}>
                        <Image src={p.image} boxSize="40px" objectFit="cover" borderRadius="md" />
                        <Text fontSize="sm" fontWeight="500" noOfLines={1} maxW="180px">{p.name}</Text>
                      </HStack>
                    </Td>
                    <Td fontSize="sm" color={muted}>{p.category}</Td>
                    <Td isNumeric fontSize="sm">
                      <VStack spacing={0} align="end">
                        <Text fontWeight="600">${p.price}</Text>
                        {p.originalPrice && <Text fontSize="xs" color={muted} textDecoration="line-through">${p.originalPrice}</Text>}
                      </VStack>
                    </Td>
                    <Td isNumeric fontSize="sm">{p.rating} ★</Td>
                    <Td>
                      {p.badge ? (
                        <Badge colorScheme={p.badge === 'Шинэ' ? 'green' : 'red'} fontSize="xs">{p.badge}</Badge>
                      ) : (
                        <Badge colorScheme="gray" fontSize="xs">Regular</Badge>
                      )}
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Button size="xs" variant="ghost" leftIcon={<FiEdit2 />} onClick={() => openEdit(p)}>Edit</Button>
                        <Button size="xs" variant="ghost" colorScheme="red" leftIcon={<FiTrash2 />} onClick={() => handleDelete(p.id)}>
                          Delete
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Add / Edit modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>{editTarget ? 'Edit Product' : 'Add Product'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Product Name *</FormLabel>
                <Input size="sm" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Category</FormLabel>
                <Input size="sm" value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Price ($) *</FormLabel>
                <NumberInput size="sm" value={form.price} min={0}
                  onChange={val => setForm(f => ({ ...f, price: val }))}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Description</FormLabel>
                <Input size="sm" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Image URL</FormLabel>
                <Input size="sm" value={form.image}
                  onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button bg="brand.500" color="white" _hover={{ bg: 'brand.600' }} onClick={handleSave}>
              {editTarget ? 'Save Changes' : 'Add Product'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
