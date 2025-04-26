"use client"

import type { ReactNode } from "react"
import { useResponsiveFont } from "../hooks/use-responsive-font"

type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl"

interface ResponsiveTextProps {
  children: ReactNode
  size?: TextSize
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
}

export function ResponsiveText({ children, size = "base", className = "", as: Component = "p" }: ResponsiveTextProps) {
  const fontSize = useResponsiveFont(size)

  return (
    <Component className={`${className} text-pretty`} style={{ fontSize, lineHeight: `calc(${fontSize} * 1.5)` }}>
      {children}
    </Component>
  )
}

export function ResponsiveHeading({
  children,
  size = "2xl",
  className = "",
  as: Component = "h2",
}: ResponsiveTextProps) {
  const fontSize = useResponsiveFont(size as TextSize)

  return (
    <Component
      className={`${className} font-normal tracking-widest uppercase text-primary text-balance`}
      style={{ fontSize, lineHeight: `calc(${fontSize} * 1.2)` }}
    >
      {children}
    </Component>
  )
}
