import { type ButtonHTMLAttributes, forwardRef } from "react"

interface BeachButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const BeachButton = forwardRef<HTMLButtonElement, BeachButtonProps>(
  ({ children, className = "", variant = "default", size = "md", ...props }, ref) => {
    const baseClasses =
      "relative inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d0e1f2] focus:ring-offset-2"

    const variantClasses = {
      default: "bg-[#d0e1f2] text-white hover:bg-[#a8c5e0]",
      outline: "border border-[#d0e1f2] text-[#a8c5e0] hover:bg-[#d0e1f2]/10",
      ghost: "text-[#a8c5e0] hover:bg-[#d0e1f2]/10",
    }

    const sizeClasses = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    }

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
        {variant === "default" && (
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute left-0 top-0 h-full w-0 bg-white/10 transition-all duration-500 group-hover:w-full" />
          </span>
        )}
      </button>
    )
  },
)

BeachButton.displayName = "BeachButton"
