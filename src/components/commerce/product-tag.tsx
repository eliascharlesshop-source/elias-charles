import type { ReactNode } from "react"

interface ProductTagProps {
  children: ReactNode
  type?: "new" | "sale" | "limited" | "bestseller"
  className?: string
}

export function ProductTag({ children, type = "new", className = "" }: ProductTagProps) {
  const getTagStyles = () => {
    switch (type) {
      case "sale":
        return "bg-ocean text-white"
      case "new":
        return "bg-ocean-light text-white"
      case "limited":
        return "bg-ocean-dark text-white"
      case "bestseller":
        return "bg-ocean bg-opacity-90 text-white"
      default:
        return "bg-ocean text-white"
    }
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 text-xs font-medium uppercase tracking-wider rounded-sm ${getTagStyles()} ${className}`}
    >
      {children}
    </div>
  )
}
