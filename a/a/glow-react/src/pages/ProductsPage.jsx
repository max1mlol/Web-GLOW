import { useState, useCallback } from 'react'
import {
  Box, Flex, Grid, Text, Select, Input, InputGroup,
  InputLeftElement, HStack, Badge, Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiSearch, FiX } from 'react-icons/fi'
import { useProducts } from '../hooks/useProducts'
import Sidebar from '../components/layout/Sidebar'
import ProductCard from '../components/ui/ProductCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Initial filter state — defined outside so it's a stable reference
const DEFAULT_FILTERS = { category: '', skinType: '', minPrice: '', maxPrice: '', q: '', sort: 'featured' }

export default function ProductsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const { products, loading, error } = useProducts(filters)

  const muted  = useColorModeValue('gray.500', 'gray.400')
  const pageBg = useColorModeValue('gray.50',  'gray.900')

  // useCallback — stable function reference so Sidebar doesn't re-render unnecessarily
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  function clearAllFilters() {
    setFilters(DEFAULT_FILTERS)
  }

  // Count how many filters are active (excluding sort and q)
  const activeFilterCount = ['category', 'skinType', 'minPrice', 'maxPrice']
    .filter(k => filters[k]).length

  return (
    <Box bg={pageBg} minH="100vh">
      {/* Page header */}
      <Box bg="white" borderBottom="1px solid" borderColor={useColorModeValue('gray.100', 'gray.700')} _dark={{ bg: 'gray.800' }}>
        <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={6}>
          <Text fontSize="xs" color="brand.500" textTransform="uppercase" letterSpacing="wider" mb={1}>
            Shop
          </Text>
          <Text as="h1" fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="600">
            {filters.category || 'All Products'}
          </Text>
        </Box>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Flex gap={8} align="start" direction={{ base: 'column', md: 'row' }}>

          {/* Sidebar — filter panel */}
          <Sidebar filters={filters} onChange={handleFilterChange} />

          {/* Main content */}
          <Box flex="1">
            {/* Toolbar */}
            <Flex
              justify="space-between"
              align={{ base: 'start', sm: 'center' }}
              direction={{ base: 'column', sm: 'row' }}
              gap={3}
              mb={6}
            >
              {/* Search input */}
              <InputGroup maxW="260px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Search products..."
                  value={filters.q}
                  onChange={e => handleFilterChange('q', e.target.value)}
                  size="sm"
                  borderRadius="md"
                />
              </InputGroup>

              <HStack spacing={3}>
                {/* Active filter count badge */}
                {activeFilterCount > 0 && (
                  <Button size="xs" variant="ghost" colorScheme="red" leftIcon={<FiX />} onClick={clearAllFilters}>
                    Clear ({activeFilterCount})
                  </Button>
                )}

                {/* Sort select */}
                <Select
                  id="sort-select"
                  size="sm"
                  value={filters.sort}
                  onChange={e => handleFilterChange('sort', e.target.value)}
                  maxW="180px"
                  borderRadius="md"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name A–Z</option>
                </Select>
              </HStack>
            </Flex>

            {/* Active filter badges */}
            {activeFilterCount > 0 && (
              <HStack mb={4} flexWrap="wrap" gap={2}>
                {Object.entries(filters).map(([key, val]) => {
                  if (!val || key === 'sort' || key === 'q') return null
                  const label = key === 'minPrice' ? `From $${val}` : key === 'maxPrice' ? `Up to $${val}` : val
                  return (
                    <Badge
                      key={key}
                      colorScheme="brand"
                      variant="subtle"
                      borderRadius="full"
                      px={3} py={1}
                      cursor="pointer"
                      onClick={() => handleFilterChange(key, '')}
                    >
                      {label} ×
                    </Badge>
                  )
                })}
              </HStack>
            )}

            {/* Product count */}
            {!loading && (
              <Text fontSize="sm" color={muted} mb={4}>
                <strong>{products.length}</strong> products
              </Text>
            )}

            {/* Grid / states */}
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <Text color="red.500" textAlign="center" py={12}>{error}</Text>
            ) : products.length === 0 ? (
              <Box textAlign="center" py={16}>
                <Text fontSize="3xl" mb={3}>🔍</Text>
                <Text fontWeight="600" mb={1}>No products found</Text>
                <Text color={muted} fontSize="sm" mb={4}>Try adjusting your filters.</Text>
                <Button size="sm" onClick={clearAllFilters}>Clear filters</Button>
              </Box>
            ) : (
              <Grid
                templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Grid>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
