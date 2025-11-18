"use client"

import { useEffect, useState } from "react"

type FontSizeMap = {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  "2xl": string
  "3xl": string
  "4xl": string
  "5xl": string
}

const defaultSizes: FontSizeMap = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
}

const mobileSizes: FontSizeMap = {
  xs: "0.75rem",
  sm: "0.75rem",
  base: "0.875rem",
  lg: "1rem",
  xl: "1.125rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
  "4xl": "1.875rem",
  "5xl": "2.25rem",
}

const tabletSizes: FontSizeMap = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "2.5rem",
}

export function useResponsiveFont(size: keyof FontSizeMap = "base"): string {
  const [fontSize, setFontSize] = useState(defaultSizes[size])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setFontSize(mobileSizes[size])
      } else if (width >= 640 && width < 768) {
        setFontSize(tabletSizes[size])
      } else {
        setFontSize(defaultSizes[size])
      }
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [size])

  return fontSize
}
