"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { cartApi, handleApiError } from "@/lib/api"
import { Cart, CartItem } from "@/lib/types"

interface CartContextType {
  cart: Cart | null
  totalQuantity: number
  loading: boolean
  error: string | null
  addToCart: (product: {
    id: string
    title: string
    price: number
    image: string
    size: string
    color: string
  }) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateLineQuantity: (itemId: string, quantity: number) => Promise<void>
  clearError: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [])

  const initializeCart = async () => {
    try {
      setLoading(true)
      const cartId = localStorage.getItem('cartId')
      const response = await cartApi.get(cartId || undefined)
      
      if (response.success && response.data) {
        setCart(response.data)
        localStorage.setItem('cartId', response.data.id)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product: {
    id: string
    title: string
    price: number
    image: string
    size: string
    color: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await cartApi.addItem({
        cartId: cart?.id,
        productId: product.id,
        quantity: 1,
        size: product.size,
        color: product.color
      })

      if (response.success && response.data) {
        setCart(response.data)
        localStorage.setItem('cartId', response.data.id)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await cartApi.updateItem({
        cartId: cart.id,
        itemId,
        quantity: 0
      })

      if (response.success && response.data) {
        setCart(response.data)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const updateLineQuantity = async (itemId: string, quantity: number) => {
    if (!cart) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await cartApi.updateItem({
        cartId: cart.id,
        itemId,
        quantity
      })

      if (response.success && response.data) {
        setCart(response.data)
      }
    } catch (err) {
      setError(handleApiError(err))
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
