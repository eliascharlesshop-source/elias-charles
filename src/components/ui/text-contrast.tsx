import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextContrastProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "on-image" | "on-dark-image" | "primary" | "secondary"
  as?: React.ElementType
}

/**
 * TextContrast component ensures proper text readability in different contexts:
 * - default: Uses theme-aware text colors (dark in light mode, light in dark mode)
 * - on-image: White text with shadow for readability over images
 * - on-dark-image: White text with stronger shadow for dark images
 * - primary: Primary theme text color
 * - secondary: Secondary theme text color
 */
const TextContrast = React.forwardRef<HTMLElement, TextContrastProps>(
  ({ className, variant = "default", as: Component = "span", ...props }, ref) => {
    const variants = {
      default: "text-foreground", // Uses CSS custom property for theme-aware color
      "on-image": "text-on-image", // White text with shadow
      "on-dark-image": "text-on-dark-image", // White text with stronger shadow
      primary: "text-primary-contrast", // Primary theme color
      secondary: "text-secondary-contrast", // Secondary theme color
    }

    return (
      <Component
        className={cn(variants[variant], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
TextContrast.displayName = "TextContrast"

export { TextContrast }
