// TikTok Shop Product Catalog with SKU Schema
// All products follow EC-IV-* SKU format

export type ProductCategory = 
  | 'tops' | 'bottoms' | 'outerwear' | 'beach-essentials' 
  | 'headwear' | 'footwear' | 'bags' | 'accessories' 
  | 'outdoor-collection' | 'hydration'

export type MiniCollection = 
  | 'dawn-patrol' | 'beach-break' | 'sunset-session' 
  | 'campus-cruiser' | 'weekend-escape' | 'golden-hour' | 'salt-sand'

export interface TikTokProduct {
  sku: string // Required: EC-IV-* format
  name: string
  description: string
  category: ProductCategory
  price: number
  compareAtPrice?: number
  inventory: number
  collections: MiniCollection[]
  image?: string
  tags: string[]
  status: 'active' | 'draft' | 'archived'
}

// TOPS
export const TOPS: TikTokProduct[] = [
  {
    sku: 'EC-IV-CHN',
    name: 'Premium Chinos',
    description: 'Lightweight chinos perfect for everyday wear',
    category: 'tops',
    price: 68,
    inventory: 150,
    collections: ['beach-break', 'campus-cruiser', 'golden-hour', 'salt-sand'],
    tags: ['tops', 'casual', 'lightweight'],
    status: 'active'
  },
  {
    sku: 'EC-IV-SSD',
    name: 'Short Sleeve Button Down',
    description: 'Classic button down shirt for versatile styling',
    category: 'tops',
    price: 72,
    inventory: 120,
    collections: ['beach-break', 'golden-hour'],
    tags: ['tops', 'shirt', 'button-down'],
    status: 'active'
  },
  {
    sku: 'EC-IV-SSS',
    name: 'Short Sleeve Sweatshirt',
    description: 'Cozy sweatshirt for cooler ocean evenings',
    category: 'tops',
    price: 65,
    inventory: 100,
    collections: ['sunset-session'],
    tags: ['tops', 'sweatshirt', 'casual'],
    status: 'active'
  },
  {
    sku: 'EC-IV-TEE',
    name: 'Premium Tee',
    description: 'High-quality cotton tee in classic fit',
    category: 'tops',
    price: 48,
    inventory: 200,
    collections: ['dawn-patrol', 'salt-sand'],
    tags: ['tops', 'tee', 'casual'],
    status: 'active'
  },
  {
    sku: 'EC-IV-LST',
    name: 'Long Sleeve Tee',
    description: 'Comfortable long sleeve tee for layering',
    category: 'tops',
    price: 52,
    inventory: 130,
    collections: [],
    tags: ['tops', 'tee', 'layering'],
    status: 'active'
  },
  {
    sku: 'EC-IV-HDY',
    name: 'Lightweight Hoodie',
    description: 'Perfect for cooler beach days',
    category: 'tops',
    price: 75,
    inventory: 90,
    collections: ['weekend-escape'],
    tags: ['tops', 'hoodie', 'warm'],
    status: 'active'
  },
  {
    sku: 'EC-IV-HEN',
    name: 'Henley Shirt',
    description: 'Classic henley with ribbed texture',
    category: 'tops',
    price: 58,
    inventory: 110,
    collections: [],
    tags: ['tops', 'shirt', 'classic'],
    status: 'active'
  },
  {
    sku: 'EC-IV-POL',
    name: 'Polo Shirt',
    description: 'Timeless polo for casual elegance',
    category: 'tops',
    price: 62,
    inventory: 140,
    collections: ['campus-cruiser'],
    tags: ['tops', 'polo', 'elegant'],
    status: 'active'
  },
  {
    sku: 'EC-IV-TNK',
    name: 'Tank Top',
    description: 'Essential tank for warm days',
    category: 'tops',
    price: 38,
    inventory: 160,
    collections: [],
    tags: ['tops', 'tank', 'summer'],
    status: 'active'
  }
]

// BOTTOMS
export const BOTTOMS: TikTokProduct[] = [
  {
    sku: 'EC-IV-SHO',
    name: 'Casual Shorts',
    description: 'Comfortable shorts for everyday wear',
    category: 'bottoms',
    price: 54,
    inventory: 170,
    collections: ['beach-break', 'salt-sand'],
    tags: ['bottoms', 'shorts', 'casual'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CHN',
    name: 'Chino Pants',
    description: 'Versatile chino pants for any occasion',
    category: 'bottoms',
    price: 68,
    inventory: 130,
    collections: ['beach-break', 'campus-cruiser', 'golden-hour', 'salt-sand'],
    tags: ['bottoms', 'pants', 'versatile'],
    status: 'active'
  },
  {
    sku: 'EC-IV-JOG',
    name: 'Joggers',
    description: 'Relaxed fit joggers for comfort',
    category: 'bottoms',
    price: 62,
    inventory: 110,
    collections: ['weekend-escape'],
    tags: ['bottoms', 'joggers', 'casual'],
    status: 'active'
  },
  {
    sku: 'EC-IV-SWM',
    name: 'Swim Shorts',
    description: 'Quick-dry swim shorts for water activities',
    category: 'bottoms',
    price: 58,
    inventory: 140,
    collections: ['dawn-patrol'],
    tags: ['bottoms', 'swim', 'water'],
    status: 'active'
  },
  {
    sku: 'EC-IV-LNN',
    name: 'Linen Pants',
    description: 'Breathable linen for hot weather',
    category: 'bottoms',
    price: 74,
    inventory: 95,
    collections: [],
    tags: ['bottoms', 'linen', 'breathable'],
    status: 'active'
  }
]

// OUTERWEAR
export const OUTERWEAR: TikTokProduct[] = [
  {
    sku: 'EC-IV-WDB',
    name: 'Windbreaker',
    description: 'Lightweight windbreaker for variable conditions',
    category: 'outerwear',
    price: 85,
    inventory: 75,
    collections: ['weekend-escape'],
    tags: ['outerwear', 'jacket', 'weather-resistant'],
    status: 'active'
  },
  {
    sku: 'EC-IV-LJK',
    name: 'Lightweight Jacket',
    description: 'Perfect layer for cooler evenings',
    category: 'outerwear',
    price: 95,
    inventory: 60,
    collections: [],
    tags: ['outerwear', 'jacket', 'layering'],
    status: 'active'
  },
  {
    sku: 'EC-IV-VST',
    name: 'Utility Vest',
    description: 'Functional vest with multiple pockets',
    category: 'outerwear',
    price: 78,
    inventory: 70,
    collections: [],
    tags: ['outerwear', 'vest', 'functional'],
    status: 'active'
  },
  {
    sku: 'EC-IV-RNB',
    name: 'Rain Shell',
    description: 'Waterproof shell for rainy days',
    category: 'outerwear',
    price: 105,
    inventory: 50,
    collections: [],
    tags: ['outerwear', 'jacket', 'waterproof'],
    status: 'active'
  }
]

// BEACH ESSENTIALS
export const BEACH_ESSENTIALS: TikTokProduct[] = [
  {
    sku: 'EC-IV-TWL',
    name: 'Beach Towel',
    description: 'Premium quality beach towel',
    category: 'beach-essentials',
    price: 48,
    inventory: 200,
    collections: ['beach-break'],
    tags: ['beach', 'towel', 'essentials'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BKT',
    name: 'Beach Blanket',
    description: 'Soft beach blanket for sand comfort',
    category: 'beach-essentials',
    price: 52,
    inventory: 150,
    collections: [],
    tags: ['beach', 'blanket', 'essentials'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CLR',
    name: 'Soft Cooler',
    description: 'Insulated cooler for beach trips',
    category: 'beach-essentials',
    price: 68,
    inventory: 100,
    collections: [],
    tags: ['beach', 'cooler', 'insulated'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BAG',
    name: 'Beach Tote',
    description: 'Spacious tote for beach essentials',
    category: 'beach-essentials',
    price: 58,
    inventory: 120,
    collections: ['beach-break'],
    tags: ['beach', 'bag', 'tote'],
    status: 'active'
  },
  {
    sku: 'EC-IV-DRY',
    name: 'Dry Bag',
    description: 'Waterproof bag for water activities',
    category: 'beach-essentials',
    price: 45,
    inventory: 130,
    collections: [],
    tags: ['beach', 'bag', 'waterproof'],
    status: 'active'
  },
  {
    sku: 'EC-IV-WTB',
    name: 'Stainless Water Bottle',
    description: 'Keep drinks cold or hot all day',
    category: 'beach-essentials',
    price: 35,
    inventory: 250,
    collections: ['dawn-patrol', 'salt-sand'],
    tags: ['hydration', 'bottle', 'stainless'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CUP',
    name: 'Insulated Tumbler',
    description: 'Perfect for your morning coffee',
    category: 'beach-essentials',
    price: 32,
    inventory: 180,
    collections: ['campus-cruiser'],
    tags: ['hydration', 'tumbler', 'insulated'],
    status: 'active'
  },
  {
    sku: 'EC-IV-KOO',
    name: 'Can Cooler',
    description: 'Keep your beverage cold',
    category: 'beach-essentials',
    price: 12,
    inventory: 300,
    collections: [],
    tags: ['beach', 'cooler', 'beverage'],
    status: 'active'
  },
  {
    sku: 'EC-IV-FRS',
    name: 'Frisbee',
    description: 'Fun beach activity essential',
    category: 'beach-essentials',
    price: 18,
    inventory: 150,
    collections: [],
    tags: ['beach', 'sports', 'fun'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BVB',
    name: 'Beach Volleyball',
    description: 'Professional beach volleyball',
    category: 'beach-essentials',
    price: 28,
    inventory: 80,
    collections: [],
    tags: ['beach', 'sports', 'volleyball'],
    status: 'active'
  }
]

// HEADWEAR
export const HEADWEAR: TikTokProduct[] = [
  {
    sku: 'EC-IV-CAP',
    name: 'Dad Cap',
    description: 'Classic dad cap style',
    category: 'headwear',
    price: 32,
    inventory: 180,
    collections: ['dawn-patrol', 'sunset-session', 'campus-cruiser', 'salt-sand'],
    tags: ['headwear', 'cap', 'classic'],
    status: 'active'
  },
  {
    sku: 'EC-IV-TRK',
    name: 'Trucker Hat',
    description: 'Vintage trucker hat style',
    category: 'headwear',
    price: 38,
    inventory: 120,
    collections: [],
    tags: ['headwear', 'hat', 'trucker'],
    status: 'active'
  },
  {
    sku: 'EC-IV-RPE',
    name: 'Rope Hat',
    description: 'Coastal rope hat design',
    category: 'headwear',
    price: 42,
    inventory: 100,
    collections: ['dawn-patrol'],
    tags: ['headwear', 'hat', 'rope'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BKT',
    name: 'Bucket Hat',
    description: 'Sun protection bucket hat',
    category: 'headwear',
    price: 45,
    inventory: 110,
    collections: [],
    tags: ['headwear', 'hat', 'sun-protection'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BNI',
    name: 'Beanie',
    description: 'Warm beanie for cool weather',
    category: 'headwear',
    price: 28,
    inventory: 140,
    collections: [],
    tags: ['headwear', 'beanie', 'warm'],
    status: 'active'
  }
]

// FOOTWEAR
export const FOOTWEAR: TikTokProduct[] = [
  {
    sku: 'EC-IV-SND',
    name: 'Sandals',
    description: 'Comfortable everyday sandals',
    category: 'footwear',
    price: 48,
    inventory: 160,
    collections: ['beach-break', 'golden-hour', 'salt-sand'],
    tags: ['footwear', 'sandals', 'casual'],
    status: 'active'
  },
  {
    sku: 'EC-IV-SLD',
    name: 'Slides',
    description: 'Easy slip-on slides',
    category: 'footwear',
    price: 42,
    inventory: 170,
    collections: ['dawn-patrol'],
    tags: ['footwear', 'slides', 'casual'],
    status: 'active'
  },
  {
    sku: 'EC-IV-ESP',
    name: 'Espadrilles',
    description: 'Classic canvas espadrilles',
    category: 'footwear',
    price: 58,
    inventory: 90,
    collections: ['golden-hour'],
    tags: ['footwear', 'espadrilles', 'classic'],
    status: 'active'
  },
  {
    sku: 'EC-IV-WTR',
    name: 'Water Shoes',
    description: 'Protective water shoes',
    category: 'footwear',
    price: 52,
    inventory: 110,
    collections: [],
    tags: ['footwear', 'water-shoes', 'protective'],
    status: 'active'
  }
]

// BAGS
export const BAGS: TikTokProduct[] = [
  {
    sku: 'EC-IV-DPK',
    name: 'Day Pack',
    description: 'Lightweight day backpack',
    category: 'bags',
    price: 65,
    inventory: 100,
    collections: [],
    tags: ['bags', 'backpack', 'travel'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CRS',
    name: 'Crossbody Bag',
    description: 'Convenient crossbody bag',
    category: 'bags',
    price: 58,
    inventory: 120,
    collections: [],
    tags: ['bags', 'crossbody', 'travel'],
    status: 'active'
  },
  {
    sku: 'EC-IV-DFL',
    name: 'Duffel Bag',
    description: 'Spacious duffel for trips',
    category: 'bags',
    price: 78,
    inventory: 70,
    collections: ['weekend-escape'],
    tags: ['bags', 'duffel', 'travel'],
    status: 'active'
  },
  {
    sku: 'EC-IV-WST',
    name: 'Waist Pack',
    description: 'Hands-free waist pack',
    category: 'bags',
    price: 35,
    inventory: 150,
    collections: [],
    tags: ['bags', 'waist-pack', 'hands-free'],
    status: 'active'
  },
  {
    sku: 'EC-IV-LPT',
    name: 'Laptop Backpack',
    description: 'Protective laptop backpack',
    category: 'bags',
    price: 88,
    inventory: 60,
    collections: [],
    tags: ['bags', 'laptop', 'backpack'],
    status: 'active'
  }
]

// ACCESSORIES
export const ACCESSORIES: TikTokProduct[] = [
  {
    sku: 'EC-IV-SGL',
    name: 'Sunglasses',
    description: 'UV protection sunglasses',
    category: 'accessories',
    price: 68,
    inventory: 140,
    collections: ['beach-break', 'golden-hour'],
    tags: ['accessories', 'sunglasses', 'uv-protection'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CLT',
    name: 'Cleaning Cloth',
    description: 'Microfiber cleaning cloth',
    category: 'accessories',
    price: 8,
    inventory: 300,
    collections: [],
    tags: ['accessories', 'cloth', 'care'],
    status: 'active'
  },
  {
    sku: 'EC-IV-KCH',
    name: 'Keychain',
    description: 'Durable keychain',
    category: 'accessories',
    price: 12,
    inventory: 250,
    collections: [],
    tags: ['accessories', 'keychain', 'small'],
    status: 'active'
  },
  {
    sku: 'EC-IV-STK',
    name: 'Sticker Pack',
    description: 'Set of quality stickers',
    category: 'accessories',
    price: 6,
    inventory: 400,
    collections: [],
    tags: ['accessories', 'sticker', 'small'],
    status: 'active'
  },
  {
    sku: 'EC-IV-PAT',
    name: 'Patch Set',
    description: 'Collectable patch set',
    category: 'accessories',
    price: 14,
    inventory: 200,
    collections: [],
    tags: ['accessories', 'patch', 'collectible'],
    status: 'active'
  },
  {
    sku: 'EC-IV-PIN',
    name: 'Enamel Pins',
    description: 'Colorful enamel pins',
    category: 'accessories',
    price: 16,
    inventory: 180,
    collections: [],
    tags: ['accessories', 'pins', 'collectible'],
    status: 'active'
  },
  {
    sku: 'EC-IV-WLT',
    name: 'Wallet',
    description: 'Slim wallet design',
    category: 'accessories',
    price: 42,
    inventory: 110,
    collections: [],
    tags: ['accessories', 'wallet', 'functional'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BLT',
    name: 'Belt',
    description: 'Versatile belt',
    category: 'accessories',
    price: 38,
    inventory: 120,
    collections: [],
    tags: ['accessories', 'belt', 'functional'],
    status: 'active'
  },
  {
    sku: 'EC-IV-SCK',
    name: 'Premium Socks',
    description: 'High-quality socks',
    category: 'accessories',
    price: 14,
    inventory: 250,
    collections: [],
    tags: ['accessories', 'socks', 'comfort'],
    status: 'active'
  },
  {
    sku: 'EC-IV-BND',
    name: 'Bandana',
    description: 'Versatile bandana',
    category: 'accessories',
    price: 16,
    inventory: 200,
    collections: [],
    tags: ['accessories', 'bandana', 'versatile'],
    status: 'active'
  },
  {
    sku: 'EC-IV-LNY',
    name: 'Lanyard',
    description: 'Durable lanyard',
    category: 'accessories',
    price: 12,
    inventory: 280,
    collections: [],
    tags: ['accessories', 'lanyard', 'functional'],
    status: 'active'
  }
]

// OUTDOOR COLLECTION
export const OUTDOOR_COLLECTION: TikTokProduct[] = [
  {
    sku: 'EC-IV-HMK',
    name: 'Hammock',
    description: 'Portable camping hammock',
    category: 'outdoor-collection',
    price: 58,
    inventory: 80,
    collections: ['weekend-escape'],
    tags: ['outdoor', 'hammock', 'camping'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CHR',
    name: 'Beach Chair',
    description: 'Lightweight beach chair',
    category: 'outdoor-collection',
    price: 65,
    inventory: 70,
    collections: [],
    tags: ['outdoor', 'chair', 'beach'],
    status: 'active'
  },
  {
    sku: 'EC-IV-UMB',
    name: 'Beach Umbrella',
    description: 'UV protection beach umbrella',
    category: 'outdoor-collection',
    price: 48,
    inventory: 100,
    collections: [],
    tags: ['outdoor', 'umbrella', 'sun-protection'],
    status: 'active'
  },
  {
    sku: 'EC-IV-MAT',
    name: 'Picnic Mat',
    description: 'Waterproof picnic mat',
    category: 'outdoor-collection',
    price: 38,
    inventory: 120,
    collections: [],
    tags: ['outdoor', 'mat', 'picnic'],
    status: 'active'
  },
  {
    sku: 'EC-IV-LTN',
    name: 'Camp Lantern',
    description: 'LED camp lantern',
    category: 'outdoor-collection',
    price: 42,
    inventory: 90,
    collections: ['weekend-escape'],
    tags: ['outdoor', 'lantern', 'camping'],
    status: 'active'
  }
]

// HYDRATION
export const HYDRATION: TikTokProduct[] = [
  {
    sku: 'EC-IV-WTB',
    name: 'Water Bottle',
    description: 'Stainless steel water bottle',
    category: 'hydration',
    price: 35,
    inventory: 250,
    collections: ['dawn-patrol', 'salt-sand'],
    tags: ['hydration', 'bottle', 'stainless'],
    status: 'active'
  },
  {
    sku: 'EC-IV-TMB',
    name: 'Travel Mug',
    description: 'Insulated travel mug',
    category: 'hydration',
    price: 32,
    inventory: 180,
    collections: [],
    tags: ['hydration', 'mug', 'travel'],
    status: 'active'
  },
  {
    sku: 'EC-IV-FSK',
    name: 'Insulated Flask',
    description: 'Premium insulated flask',
    category: 'hydration',
    price: 45,
    inventory: 100,
    collections: [],
    tags: ['hydration', 'flask', 'insulated'],
    status: 'active'
  },
  {
    sku: 'EC-IV-CUP',
    name: 'Coffee Cup',
    description: 'Ceramic coffee cup',
    category: 'hydration',
    price: 22,
    inventory: 150,
    collections: [],
    tags: ['hydration', 'cup', 'coffee'],
    status: 'active'
  }
]

// Get all products by category
export const getAllProductsByCategory = (category: ProductCategory): TikTokProduct[] => {
  const categoryMap: Record<ProductCategory, TikTokProduct[]> = {
    'tops': TOPS,
    'bottoms': BOTTOMS,
    'outerwear': OUTERWEAR,
    'beach-essentials': BEACH_ESSENTIALS,
    'headwear': HEADWEAR,
    'footwear': FOOTWEAR,
    'bags': BAGS,
    'accessories': ACCESSORIES,
    'outdoor-collection': OUTDOOR_COLLECTION,
    'hydration': HYDRATION
  }
  return categoryMap[category] || []
}

// Get all products
export const getAllProducts = (): TikTokProduct[] => {
  return [
    ...TOPS,
    ...BOTTOMS,
    ...OUTERWEAR,
    ...BEACH_ESSENTIALS,
    ...HEADWEAR,
    ...FOOTWEAR,
    ...BAGS,
    ...ACCESSORIES,
    ...OUTDOOR_COLLECTION,
    ...HYDRATION
  ]
}

// Get products by mini collection
export const getProductsByMiniCollection = (collection: MiniCollection): TikTokProduct[] => {
  return getAllProducts().filter(product => product.collections.includes(collection))
}

// Get product by SKU
export const getProductBySku = (sku: string): TikTokProduct | undefined => {
  return getAllProducts().find(product => product.sku === sku)
}
