import type React from "react"
import "./globals.css"
import "./styles/text-utils.css"
import { Inter } from "next/font/google"
import { Header } from "@/src/components/layout/header"
import { Footer } from "@/src/components/layout/footer"
import { CartProvider } from "@/components/commerce/cart-provider"
import { AuthProvider } from "@/components/layout/auth-provider"
import { DarkModeToggle } from "@/src/components/ui/dark-mode-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EC - Surf & Skate Lifestyle",
  description: "Premium surf and skate apparel and equipment",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={`${inter.className} h-full flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <Header shop={{ name: "EC" }} />
            <main className="flex-grow" style={{ backgroundColor: "#fdf4ec" }}>
              {children}
              <DarkModeToggle />
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
