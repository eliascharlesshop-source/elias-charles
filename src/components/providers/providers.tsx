"use client"

import { SessionProvider } from "next-auth/react"
import { ThirdwebProviderWrapper } from "./thirdweb-provider"
import { AuthProvider } from "../layout/auth-provider"
import { CartProvider } from "@/components/commerce/cart-provider"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThirdwebProviderWrapper>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </ThirdwebProviderWrapper>
    </SessionProvider>
  )
}
