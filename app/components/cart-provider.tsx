"use client"

import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    lines: [],
    totalQuantity: 0,
  })

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingLine = prevCart.lines.find((line) => line.id === product.id)

      if (existingLine) {
        return {
          ...prevCart,
          lines: prevCart.lines.map((line) =>
            line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
          ),
          totalQuantity: prevCart.totalQuantity + 1,
        }
      } else {
        return {
          ...prevCart,
          lines: [...prevCart.lines, { ...product, quantity: 1 }],
          totalQuantity: prevCart.totalQuantity + 1,
        }
      }
    })
  }

  const removeFromCart = (lineId) => {
    setCart((prevCart) => {
      const lineToRemove = prevCart.lines.find((line) => line.id === lineId)

      if (!lineToRemove) return prevCart

      return {
        ...prevCart,
        lines: prevCart.lines.filter((line) => line.id !== lineId),
        totalQuantity: prevCart.totalQuantity - lineToRemove.quantity,
      }
    })
  }

  const updateLineQuantity = (lineId, quantity) => {
    setCart((prevCart) => {
      const lineToUpdate = prevCart.lines.find((line) => line.id === lineId)

      if (!lineToUpdate) return prevCart

      const quantityDifference = quantity - lineToUpdate.quantity

      return {
        ...prevCart,
        lines: prevCart.lines.map((line) => (line.id === lineId ? { ...line, quantity } : line)),
        totalQuantity: prevCart.totalQuantity + quantityDifference,
      }
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        totalQuantity: cart.totalQuantity,
        addToCart,
        removeFromCart,
        updateLineQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
