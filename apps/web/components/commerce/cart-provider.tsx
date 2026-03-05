"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface CartItem {
  id: string
  title: string
  price: string
  image?: string
  size?: string
  color?: string
  quantity: number
}

interface Cart {
  id: string
  lines: CartItem[]
  totalQuantity: number
}

interface CartContextType {
  cart: Cart | null
  totalQuantity: number
  loading: boolean
  error: string | null
  addToCart: (product: {
    id: string
    title: string
    price: string
    image?: string
    size?: string
    color?: string
  }) => void
  removeFromCart: (itemId: string) => void
  updateLineQuantity: (itemId: string, quantity: number) => void
  clearError: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize cart on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('ec-cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
        } catch (error) {
          console.error('Failed to parse saved cart:', error)
          // Initialize empty cart
          const newCart: Cart = {
            id: 'cart-' + Date.now(),
            lines: [],
            totalQuantity: 0
          }
          setCart(newCart)
          localStorage.setItem('ec-cart', JSON.stringify(newCart))
        }
      } else {
        // Initialize empty cart
        const newCart: Cart = {
          id: 'cart-' + Date.now(),
          lines: [],
          totalQuantity: 0
        }
        setCart(newCart)
        localStorage.setItem('ec-cart', JSON.stringify(newCart))
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart && typeof window !== 'undefined') {
      localStorage.setItem('ec-cart', JSON.stringify(cart))
    }
  }, [cart])

  const addToCart = (product: {
    id: string
    title: string
    price: string
    image?: string
    size?: string
    color?: string
  }) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      const existingItemIndex = cart.lines.findIndex(
        item => item.id === product.id && item.size === product.size && item.color === product.color
      )

      let updatedLines: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedLines = cart.lines.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          size: product.size,
          color: product.color,
          quantity: 1
        }
        updatedLines = [...cart.lines, newItem]
      }

      const updatedCart: Cart = {
        ...cart,
        lines: updatedLines,
        totalQuantity: updatedLines.reduce((total, item) => total + item.quantity, 0)
      }

      setCart(updatedCart)
    } catch (err) {
      setError('Failed to add item to cart')
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = (itemId: string) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      const updatedLines = cart.lines.filter(item => item.id !== itemId)
      const updatedCart: Cart = {
        ...cart,
        lines: updatedLines,
        totalQuantity: updatedLines.reduce((total, item) => total + item.quantity, 0)
      }

      setCart(updatedCart)
    } catch (err) {
      setError('Failed to remove item from cart')
    } finally {
      setLoading(false)
    }
  }

  const updateLineQuantity = (itemId: string, quantity: number) => {
    if (!cart) return

    setLoading(true)
    setError(null)

    try {
      if (quantity <= 0) {
        removeFromCart(itemId)
        return
      }

      const updatedLines = cart.lines.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )

      const updatedCart: Cart = {
        ...cart,
        lines: updatedLines,
        totalQuantity: updatedLines.reduce((total, item) => total + item.quantity, 0)
      }

      setCart(updatedCart)
    } catch (err) {
      setError('Failed to update item quantity')
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: CartContextType = {
    cart,
    totalQuantity: cart?.totalQuantity || 0,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateLineQuantity,
    clearError
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
