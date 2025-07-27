"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"

interface ProductToastProps {
  title: string
  description?: string
  type?: "success" | "info" | "warning" | "error"
  onClose?: () => void
  children?: ReactNode
}

export function ProductToast({ title, description, type = "info", onClose, children }: ProductToastProps) {
  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "border-l-4 border-green-500 bg-green-50"
      case "warning":
        return "border-l-4 border-yellow-500 bg-yellow-50"
      case "error":
        return "border-l-4 border-red-500 bg-red-50"
      case "info":
      default:
        return "border-l-4 border-ocean bg-ocean/10"
    }
  }

  const getTitleStyles = () => {
    switch (type) {
      case "success":
        return "text-green-800"
      case "warning":
        return "text-yellow-800"
      case "error":
        return "text-red-800"
      case "info":
      default:
        return "text-ocean-dark"
    }
  }

  const getDescriptionStyles = () => {
    switch (type) {
      case "success":
        return "text-green-700"
      case "warning":
        return "text-yellow-700"
      case "error":
        return "text-red-700"
      case "info":
      default:
        return "text-ocean"
    }
  }

  return (
    <div className={`rounded-md shadow-md ${getToastStyles()}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className={`text-sm font-medium ${getTitleStyles()}`}>{title}</h3>
            {description && <div className={`mt-1 text-sm ${getDescriptionStyles()}`}>{description}</div>}
            {children && <div className="mt-3">{children}</div>}
          </div>
          {onClose && (
            <button
              type="button"
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
