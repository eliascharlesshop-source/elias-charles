import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/src/components/providers/providers"
import { ThemeProvider } from "@/src/components/theme-provider"
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle"

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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={`${inter.className} h-full flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <Header shop={{ name: "EC" }} />
            <main className="flex-grow bg-cream dark:bg-background">
              {children}
              <DarkModeToggle />
            </main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
