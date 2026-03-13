export interface BoxContents {
  id: string
  name: string
  category: 'apparel' | 'footwear' | 'accessories'
  image?: string
  retailValue: number
}

export interface IEBox {
  id: string
  name: string
  description: string
  targetPrice: {
    min: number
    max: number
  }
  positioning: string
  contents: BoxContents[]
  margin: number
  availability: 'available' | 'limited' | 'coming-soon'
  launchWeek?: number
  theme?: string
  isLimited?: boolean
}

export interface BoxAddOn {
  id: string
  name: string
  description: string
  price: {
    min: number
    max: number
  }
  type: 'footwear'
}

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  boxes: string[]
  frequency: 'monthly' | 'quarterly'
  discount: number
  price: number
}

export type BoxTier = 'hero' | 'profit' | 'culture'

export interface BoxCategory {
  tier: BoxTier
  focus: string[]
  role: string
  suggestedShare: number
  priceBand: {
    min: number
    max: number
  }
}
