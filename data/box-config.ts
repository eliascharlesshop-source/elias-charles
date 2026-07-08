import { IEBox, BoxAddOn, SubscriptionPlan, BoxCategory } from '@/types/box-model'

export const IV_BOXES: IEBox[] = [
  {
    id: 'iv-starter',
    name: 'IV Starter Box',
    description: 'Your introduction to the Coastline collection. Coastal essentials with island vibes.',
    targetPrice: { min: 59, max: 69 },
    positioning: 'Entry box / giftable',
    contents: [
      { id: 'linen-tee', name: 'Linen Tee', category: 'apparel', retailValue: 38 },
      { id: 'sea-salt-spray', name: 'Sea Salt Spray', category: 'accessories', retailValue: 18 },
      { id: 'palm-sticker-card', name: 'Palm Sticker Card', category: 'accessories', retailValue: 8 }
    ],
    margin: 0.68,
    availability: 'available',
    launchWeek: 1,
    theme: 'Coastal'
  },
  {
    id: 'iv-beach',
    name: 'IV Beach Box',
    description: 'Everything you need for Coastline living. Premium beach wear and accessories.',
    targetPrice: { min: 119, max: 139 },
    positioning: 'Core bestseller',
    contents: [
      { id: 'linen-shirt', name: 'Linen Shirt', category: 'apparel', retailValue: 52 },
      { id: 'straw-hat', name: 'Straw Hat', category: 'accessories', retailValue: 35 },
      { id: 'linen-shorts', name: 'Linen Shorts', category: 'apparel', retailValue: 48 }
    ],
    margin: 0.67,
    availability: 'available',
    launchWeek: 1,
    theme: 'Coastal'
  },
  {
    id: 'iv-tropical',
    name: 'IV Tropical Box',
    description: 'Premium Coastline collection with organic materials. The ultimate coastal experience.',
    targetPrice: { min: 179, max: 219 },
    positioning: 'Premium island fit',
    contents: [
      { id: 'linen-jacket', name: 'Linen Jacket', category: 'apparel', retailValue: 95 },
      { id: 'linen-pants', name: 'Linen Pants', category: 'apparel', retailValue: 88 },
      { id: 'socks', name: 'Socks', category: 'accessories', retailValue: 14 }
    ],
    margin: 0.66,
    availability: 'available',
    launchWeek: 2,
    theme: 'Coastal'
  },
  {
    id: 'iv-paradise',
    name: 'IV Paradise Box',
    description: 'Limited edition luxury Coastline collection. The epitome of coastal lifestyle.',
    targetPrice: { min: 249, max: 299 },
    positioning: 'Limited edition',
    contents: [
      { id: 'linen-resort-wear', name: 'Linen Resort Wear', category: 'apparel', retailValue: 120 },
      { id: 'silk-shirt', name: 'Silk Shirt', category: 'apparel', retailValue: 85 },
      { id: 'canvas-shorts', name: 'Canvas Shorts', category: 'apparel', retailValue: 65 },
      { id: 'luxury-hat', name: 'Luxury Hat', category: 'accessories', retailValue: 45 }
    ],
    margin: 0.65,
    availability: 'limited',
    launchWeek: 3,
    theme: 'Coastal',
    isLimited: true
  }
]

export const IE_BOXES: IEBox[] = [
  {
    id: 'ie-starter',
    name: 'IE Starter Box',
    description: 'Perfect entry point to the Inland Empire collection. Essential basics with signature IE style.',
    targetPrice: { min: 59, max: 69 },
    positioning: 'Entry box / giftable',
    contents: [
      { id: 'white-tee', name: 'White Tee', category: 'apparel', retailValue: 38 },
      { id: 'socks', name: 'Socks', category: 'accessories', retailValue: 14 },
      { id: 'sticker-card', name: 'Sticker Card', category: 'accessories', retailValue: 8 }
    ],
    margin: 0.68,
    availability: 'available',
    launchWeek: 1,
    theme: 'Easter/Mother\'s Day'
  },
  {
    id: 'ie-street',
    name: 'IE Street Box',
    description: 'Core streetwear essentials that define the IE aesthetic. Built for everyday wear.',
    targetPrice: { min: 119, max: 139 },
    positioning: 'Core bestseller',
    contents: [
      { id: 'graphic-tee', name: 'Graphic Tee', category: 'apparel', retailValue: 45 },
      { id: 'fitted-hat', name: 'Fitted Hat', category: 'accessories', retailValue: 38 },
      { id: 'athleisure-shorts', name: 'Athleisure Shorts', category: 'apparel', retailValue: 52 }
    ],
    margin: 0.67,
    availability: 'available',
    launchWeek: 1,
    theme: 'Easter/Mother\'s Day'
  },
  {
    id: 'ie-layered',
    name: 'IE Layered Box',
    description: 'Premium layered look with our signature hoodie and denim. Complete street-ready outfit.',
    targetPrice: { min: 179, max: 219 },
    positioning: 'Premium street fit',
    contents: [
      { id: 'graphic-hoodie', name: 'Graphic Hoodie', category: 'apparel', retailValue: 88 },
      { id: 'jeans', name: 'Jeans', category: 'apparel', retailValue: 95 },
      { id: 'socks', name: 'Socks', category: 'accessories', retailValue: 14 }
    ],
    margin: 0.66,
    availability: 'available',
    launchWeek: 2,
    theme: 'Memorial Day/Father\'s Day'
  },
  {
    id: 'ie-diamond',
    name: 'IE Diamond Box',
    description: 'Limited edition premium collection. The ultimate IE experience with exclusive pieces.',
    targetPrice: { min: 249, max: 299 },
    positioning: 'Limited edition',
    contents: [
      { id: 'jacket', name: 'Jacket', category: 'apparel', retailValue: 145 },
      { id: 'button-down', name: 'Button Down', category: 'apparel', retailValue: 72 },
      { id: 'chino-shorts', name: 'Chino Shorts', category: 'apparel', retailValue: 65 },
      { id: 'hat', name: 'Hat', category: 'accessories', retailValue: 42 }
    ],
    margin: 0.65,
    availability: 'limited',
    launchWeek: 3,
    theme: 'Independence Day',
    isLimited: true
  }
]

export const FOOTWORK_ADD_ON: BoxAddOn = {
  id: 'footwork-addon',
  name: 'IE Footwork Add-On',
  description: 'Complete your box with premium footwear. Choose from low tops, high tops, or classic chucks.',
  price: { min: 75, max: 120 },
  type: 'footwear'
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'ie-starter-subscription',
    name: 'IE Starter Subscription',
    description: 'Receive a curated IE Starter Box every month. Perfect for building your basics collection.',
    boxes: ['ie-starter'],
    frequency: 'monthly',
    discount: 0.15,
    price: 59
  },
  {
    id: 'ie-street-subscription',
    name: 'IE Street Subscription',
    description: 'Monthly delivery of our core Street Box. Never run out of IE essentials.',
    boxes: ['ie-street'],
    frequency: 'monthly',
    discount: 0.15,
    price: 119
  },
  {
    id: 'ie-complete-subscription',
    name: 'IE Complete Subscription',
    description: 'Rotate through all IE boxes quarterly. The full Inland Empire experience.',
    boxes: ['ie-starter', 'ie-street', 'ie-layered'],
    frequency: 'quarterly',
    discount: 0.20,
    price: 179
  }
]

export const BOX_CATEGORIES: BoxCategory[] = [
  {
    tier: 'hero',
    focus: ['Graphic Tees', 'White Tees', 'Graphic Hoodies', 'Fitted Hats', 'Jeans'],
    role: 'Traffic + conversion',
    suggestedShare: 45,
    priceBand: { min: 38, max: 110 }
  },
  {
    tier: 'profit',
    focus: ['Jackets', 'Short Sleeve Button Downs', 'Chino Shorts', 'Athleisure Pants', 'Athleisure Shorts'],
    role: 'Margin + AOV lift',
    suggestedShare: 40,
    priceBand: { min: 58, max: 160 }
  },
  {
    tier: 'culture',
    focus: ['Baseball Shirts', 'Socks', 'Low/High Tops', 'Boots', 'Chucks'],
    role: 'Brand depth + styling',
    suggestedShare: 15,
    priceBand: { min: 14, max: 180 }
  }
]

export const SEASONAL_THEMES = [
  { name: 'Easter', colors: ['#E8F4FD', '#87CEEB', '#4682B4'] },
  { name: 'Mother\'s Day', colors: ['#FFE4E1', '#FFB6C1', '#FF69B4'] },
  { name: 'Memorial Day', colors: ['#F0F8FF', '#4169E1', '#000080'] },
  { name: 'Father\'s Day', colors: ['#F5F5DC', '#8B7355', '#654321'] },
  { name: 'Independence Day', colors: ['#FF0000', '#FFFFFF', '#0000FF'] }
]
