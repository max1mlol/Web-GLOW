import { Link as RouterLink } from 'react-router-dom'
import {
  Box, VStack, Text, Heading, Divider,
  useColorModeValue,
} from '@chakra-ui/react'

const CATEGORIES = ['Серум', 'Чийгшүүлэгч', 'Цэвэрлэгч', 'Тонер', 'Нарны тос', 'Маск', 'Нүдний арчилгаа', 'Тос']
const SKIN_TYPES = ['Хуурай арьс', 'Тослог арьс', 'Мэдрэмтгий арьс', 'Холимог арьс']
const PRICE_RANGES = [
  { label: 'Under $30',    params: '?maxPrice=30' },
  { label: '$30 – $50',   params: '?minPrice=30&maxPrice=50' },
  { label: '$50 – $70',   params: '?minPrice=50&maxPrice=70' },
  { label: 'Over $70',    params: '?minPrice=70' },
]

// Props:
//   filters   — current active filters { category, skinType, minPrice, maxPrice, q }
//   onChange  — callback(key, value) when a filter is clicked
export default function Sidebar({ filters = {}, onChange }) {
  const activeBg    = useColorModeValue('brand.50',  'brand.900')
  const activeColor = useColorModeValue('brand.600', 'brand.200')
  const hoverBg     = useColorModeValue('gray.50',   'gray.700')
  const mutedColor  = useColorModeValue('gray.500',  'gray.400')

  // Renders a single clickable filter row
  function FilterItem({ label, isActive, onClick }) {
    return (
      <Box
        as="button"
        w="full"
        textAlign="left"
        px={3}
        py={1.5}
        borderRadius="md"
        fontSize="sm"
        fontWeight={isActive ? '600' : '400'}
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : 'inherit'}
        _hover={{ bg: hoverBg }}
        transition="all 0.15s"
        onClick={onClick}
      >
        {label}
      </Box>
    )
  }

  return (
    <Box
      w={{ base: 'full', md: '220px' }}
      flexShrink={0}
      as="aside"
      aria-label="Product filters"
    >
      <VStack align="start" spacing={6}>

        {/* ── Category ── */}
        <Box w="full">
          <Heading size="xs" textTransform="uppercase" letterSpacing="wider" mb={3}>
            Category
          </Heading>
          <VStack align="start" spacing={1}>
            {/* "All" option */}
            <FilterItem
              label="All"
              isActive={!filters.category}
              onClick={() => onChange('category', '')}
            />
            {CATEGORIES.map(cat => (
              <FilterItem
                key={cat}
                label={cat}
                isActive={filters.category === cat}
                onClick={() => onChange('category', cat)}
              />
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* ── Skin Type ── */}
        <Box w="full">
          <Heading size="xs" textTransform="uppercase" letterSpacing="wider" mb={3}>
            Skin Type
          </Heading>
          <VStack align="start" spacing={1}>
            <FilterItem
              label="All skin types"
              isActive={!filters.skinType}
              onClick={() => onChange('skinType', '')}
            />
            {SKIN_TYPES.map(st => (
              <FilterItem
                key={st}
                label={st}
                isActive={filters.skinType === st}
                onClick={() => onChange('skinType', st)}
              />
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* ── Price Range ── */}
        <Box w="full">
          <Heading size="xs" textTransform="uppercase" letterSpacing="wider" mb={3}>
            Price
          </Heading>
          <VStack align="start" spacing={1}>
            <FilterItem
              label="Any price"
              isActive={!filters.minPrice && !filters.maxPrice}
              onClick={() => { onChange('minPrice', ''); onChange('maxPrice', '') }}
            />
            {PRICE_RANGES.map(r => {
              const params = new URLSearchParams(r.params)
              const min = params.get('minPrice') || ''
              const max = params.get('maxPrice') || ''
              const isActive =
                filters.minPrice === min && filters.maxPrice === max
              return (
                <FilterItem
                  key={r.label}
                  label={r.label}
                  isActive={isActive}
                  onClick={() => { onChange('minPrice', min); onChange('maxPrice', max) }}
                />
              )
            })}
          </VStack>
        </Box>

      </VStack>
    </Box>
  )
}
