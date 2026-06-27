"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "../layout/auth-provider"
import { CartProvider } from "@/components/commerce/cart-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
