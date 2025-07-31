"use client"

import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Ethereum, Polygon } from "@thirdweb-dev/chains"

const activeChain = process.env.NODE_ENV === "production" ? Ethereum : Ethereum

interface ThirdwebProviderWrapperProps {
  children: React.ReactNode
}

export function ThirdwebProviderWrapper({ children }: ThirdwebProviderWrapperProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      supportedChains={[Ethereum, Polygon]}
    >
      {children}
    </ThirdwebProvider>
  )
}
