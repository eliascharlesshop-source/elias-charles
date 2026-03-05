// Shared UI components for both web and mobile apps

// Product Card Component (shared interface)
export interface ProductCardProps {
  product: {
    id: string
    title: string
    price: number
    salePrice?: number
    images: string[]
    handle: string
    category: string
    inStock: boolean
  }
  onPress?: () => void
  style?: any
}

// Collection Card Component (shared interface)
export interface CollectionCardProps {
  collection: {
    id: string
    title: string
    description: string
    image?: string
    handle: string
    productCount: number
  }
  onPress?: () => void
  style?: any
}

// Cart Item Component (shared interface)
export interface CartItemProps {
  item: {
    id: string
    quantity: number
    merchandise: {
      id: string
      title: string
      product: {
        title: string
        handle: string
      }
      price: {
        amount: number
        currencyCode: string
      }
      image?: string
    }
  }
  onUpdateQuantity?: (quantity: number) => void
  onRemove?: () => void
  style?: any
}

// Button Component (shared interface)
export interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  style?: any
}

// Input Component (shared interface)
export interface InputProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  multiline?: boolean
  secure?: boolean
  style?: any
}

// Loading Component (shared interface)
export interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  style?: any
}

// Header Component (shared interface)
export interface HeaderProps {
  title: string
  leftIcon?: string
  rightIcon?: string
  onLeftPress?: () => void
  onRightPress?: () => void
  style?: any
}

// Search Bar Component (shared interface)
export interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  onSubmit?: () => void
  placeholder?: string
  style?: any
}

// Price Display Component (shared interface)
export interface PriceDisplayProps {
  price: number
  salePrice?: number
  currency?: string
  style?: any
}

// Rating Component (shared interface)
export interface RatingProps {
  rating: number
  maxRating?: number
  size?: number
  color?: string
  style?: any
}

// Badge Component (shared interface)
export interface BadgeProps {
  text: string
  variant?: 'success' | 'warning' | 'error' | 'info'
  style?: any
}

// Color theme for consistent styling - Matching EC Store web app design
export const theme = {
  colors: {
    // EC Store color palette (matching globals.css)
    primary: '#0f172a', // Steel dark (matching --primary)
    primaryForeground: '#f8fafc', // Light foreground
    secondary: '#4a4e52', // Steel grey (.steel-text)
    accent: '#d0e1f2', // Beach color
    accentDark: '#7ba3c9', // Beach darker
    background: '#fdf4ec', // Cream background (matching web app)
    surface: '#ffffff', // White surface
    card: '#ffffff',
    text: '#4a4e52', // Steel text (matching .steel-text)
    textSecondary: '#71767b', // Muted steel (steel gradient)
    border: '#e5e7eb', // Light border
    ocean: '#0077b6', // Ocean blue
    oceanLight: '#0096c7',
    oceanDark: '#023e8a',
    error: '#dc2626',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
    // CSS custom properties as hex (from globals.css)
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    // Dark theme variants
    dark: {
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },
  typography: {
    // Matching web app typography from globals.css
    fontFamily: {
      sans: 'Helvetica Neue, Helvetica, Arial, sans-serif', // Matching web app
    },
    h1: {
      fontSize: 28, // Mobile equivalent of web's responsive h1
      fontWeight: '800', // font-extrabold
      letterSpacing: 2.8, // tracking-widest (0.1em)
      textTransform: 'uppercase' as const,
      lineHeight: 32, // leading-tight (1.25)
    },
    h2: {
      fontSize: 24, // Mobile equivalent of web's responsive h2
      fontWeight: '800', // font-extrabold
      letterSpacing: 1.2, // tracking-wider (0.05em)
      textTransform: 'uppercase' as const,
      lineHeight: 28, // leading-tight
    },
    h3: {
      fontSize: 20, // Mobile equivalent of web's responsive h3
      fontWeight: '800', // font-extrabold
      letterSpacing: 0.5, // tracking-wide (0.025em)
      textTransform: 'uppercase' as const,
      lineHeight: 24, // leading-snug
    },
    body: {
      fontSize: 16,
      fontWeight: '500', // font-medium
      lineHeight: 24, // leading-relaxed (1.625)
    },
    navLink: {
      fontSize: 12,
      fontWeight: '700', // font-bold
      letterSpacing: 2.4, // tracking-widest
      textTransform: 'uppercase' as const,
    },
    productTitle: {
      fontSize: 14,
      fontWeight: '700', // font-bold
      letterSpacing: 0.5, // tracking-wide
    },
    productPrice: {
      fontSize: 14,
      fontWeight: '500', // font-medium
    },
    caption: {
      fontSize: 14,
      fontWeight: '500', // font-medium
    },
    small: {
      fontSize: 12,
      fontWeight: '500', // font-medium
      letterSpacing: 0.5, // tracking-wider
      textTransform: 'uppercase' as const,
    }
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  }
}

// Format currency utility
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Format date utility
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Truncate text utility
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Calculate discount percentage
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Validate email utility
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate product URL
export const generateProductUrl = (handle: string): string => {
  return `/products/${handle}`
}

// Generate collection URL
export const generateCollectionUrl = (handle: string): string => {
  return `/collections/${handle}`
}

// Image loading utility
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url) return ''
  
  // Add Shopify image transformation parameters if needed
  const params = []
  if (width) params.push(`width=${width}`)
  if (height) params.push(`height=${height}`)
  
  if (params.length > 0) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${params.join('&')}`
  }
  
  return url
}
