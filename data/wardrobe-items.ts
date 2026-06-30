export type ItemCategory = 'tops' | 'bottoms' | 'outerwear' | 'accessories' | 'footwear'
export type ItemSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'

export interface WardrobeItem {
  id: string
  name: string
  category: ItemCategory
  image: string
  price: number
  sizes: ItemSize[]
  color: string
  description: string
}

export const WARDROBE_ITEMS: WardrobeItem[] = [
  // TOPS
  {
    id: 'top-1',
    name: 'Ocean Breeze Linen Shirt',
    category: 'tops',
    image: '/products/men-urban-style.png',
    price: 89,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'White',
    description: 'Breathable linen shirt perfect for coastal living'
  },
  {
    id: 'top-2',
    name: 'City Essentials Tee',
    category: 'tops',
    image: '/products/men-casual-hoodie.png',
    price: 45,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Black',
    description: 'Versatile basic tee for any season'
  },
  {
    id: 'top-3',
    name: 'Mountain Thermal Base',
    category: 'tops',
    image: '/products/linen-dress-beach.png',
    price: 65,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Charcoal',
    description: 'Moisture-wicking base layer for outdoor adventures'
  },
  {
    id: 'top-4',
    name: 'Lightweight Polo',
    category: 'tops',
    image: '/products/men-surf-style.png',
    price: 75,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    color: 'Navy',
    description: 'Classic polo with sustainable fabric'
  },

  // BOTTOMS
  {
    id: 'bottom-1',
    name: 'Sustainable Denim Jeans',
    category: 'bottoms',
    image: '/products/sustainable-fashion-collage.png',
    price: 120,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Indigo',
    description: 'Eco-friendly denim with perfect fit'
  },
  {
    id: 'bottom-2',
    name: 'Hiking Trail Pants',
    category: 'bottoms',
    image: '/products/diverse-beach-fashion.png',
    price: 95,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Olive',
    description: 'Durable technical pants for outdoor activities'
  },
  {
    id: 'bottom-3',
    name: 'Urban Joggers',
    category: 'bottoms',
    image: '/products/fashion-workshop.png',
    price: 85,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Gray',
    description: 'Comfortable joggers for city commuting'
  },
  {
    id: 'bottom-4',
    name: 'Linen Beach Shorts',
    category: 'bottoms',
    image: '/products/surfboard-on-beach.png',
    price: 55,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Cream',
    description: 'Perfect for warm beach days'
  },

  // OUTERWEAR
  {
    id: 'outer-1',
    name: 'Lightweight Windbreaker',
    category: 'outerwear',
    image: '/products/men-urban-style.png',
    price: 110,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Black',
    description: 'Water-resistant layer for unpredictable weather'
  },
  {
    id: 'outer-2',
    name: 'Wool Blend Cardigan',
    category: 'outerwear',
    image: '/products/linen-dress-beach.png',
    price: 145,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Oatmeal',
    description: 'Cozy cardigan for layering in colder seasons'
  },
  {
    id: 'outer-3',
    name: 'Insulated Jacket',
    category: 'outerwear',
    image: '/products/men-casual-hoodie.png',
    price: 185,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Navy',
    description: 'Warm and lightweight for mountain adventures'
  },

  // ACCESSORIES
  {
    id: 'acc-1',
    name: 'Canvas Crossbody Bag',
    category: 'accessories',
    image: '/products/sustainable-fashion-collage.png',
    price: 75,
    sizes: ['S'],
    color: 'Khaki',
    description: 'Durable canvas with leather accents'
  },
  {
    id: 'acc-2',
    name: 'Wool Knit Beanie',
    category: 'accessories',
    image: '/products/diverse-beach-fashion.png',
    price: 35,
    sizes: ['S', 'M', 'L'],
    color: 'Black',
    description: 'Warm winter essential'
  },
  {
    id: 'acc-3',
    name: 'Leather Belt',
    category: 'accessories',
    image: '/products/fashion-workshop.png',
    price: 65,
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Brown',
    description: 'Versatile classic leather belt'
  },
  {
    id: 'acc-4',
    name: 'Sunglasses Classic',
    category: 'accessories',
    image: '/images/sunglasses-header.png',
    price: 120,
    sizes: ['S'],
    color: 'Black',
    description: 'UV-protective classic frames'
  },

  // FOOTWEAR
  {
    id: 'shoe-1',
    name: 'Canvas Sneakers',
    category: 'footwear',
    image: '/products/men-urban-style.png',
    price: 85,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'White',
    description: 'Versatile everyday sneakers'
  },
  {
    id: 'shoe-2',
    name: 'Hiking Boots',
    category: 'footwear',
    image: '/products/linen-dress-beach.png',
    price: 155,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Brown',
    description: 'Rugged boots for trail adventures'
  },
  {
    id: 'shoe-3',
    name: 'Casual Loafers',
    category: 'footwear',
    image: '/products/men-casual-hoodie.png',
    price: 110,
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Tan',
    description: 'Comfortable slip-on loafers'
  },
  {
    id: 'shoe-4',
    name: 'Beach Sandals',
    category: 'footwear',
    image: '/products/sustainable-fashion-collage.png',
    price: 45,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    color: 'Natural',
    description: 'Eco-friendly sustainable sandals'
  }
]

export const CATEGORIES: { id: ItemCategory; label: string }[] = [
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'footwear', label: 'Footwear' }
]

export function getItemsByCategory(category: ItemCategory): WardrobeItem[] {
  return WARDROBE_ITEMS.filter(item => item.category === category)
}
