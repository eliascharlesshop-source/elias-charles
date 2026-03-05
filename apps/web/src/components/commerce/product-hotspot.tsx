"use client"
import { X, ChevronRight } from "lucide-react"
import Link from "next/link"

interface HotspotProduct {
  id: string
  title: string
  price: string
  description: string
  image: string
}

interface HotspotProps {
  id: number
  x: number
  y: number
  product: HotspotProduct
  isActive: boolean
  onToggle: (id: number) => void
}

export function ProductHotspot({ id, x, y, product, isActive, onToggle }: HotspotProps) {
  // Calculate position to ensure popover stays within image
  const isRightSide = x > 50
  const isBottomHalf = y > 50

  return (
    <>
      {/* Hotspot marker */}
      <div
        className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-primary flex items-center justify-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={() => onToggle(id)}
        aria-label={`View ${product.title}`}
      >
        <span className="text-primary text-[8px] sm:text-xs font-bold">+</span>
      </div>

      {/* Popover */}
      {isActive && (
        <div
          className={`absolute bg-white shadow-lg rounded-lg p-3 sm:p-4 w-48 sm:w-64 z-10 ${
            isRightSide ? "right-0" : "left-0"
          } ${isBottomHalf ? "bottom-0" : "top-0"}`}
          style={{
            [isRightSide ? "right" : "left"]: "10%",
            [isBottomHalf ? "bottom" : "top"]: "10%",
          }}
        >
          <button
            className="absolute top-1 right-1 sm:top-2 sm:right-2 text-gray-400 hover:text-gray-600"
            onClick={() => onToggle(id)}
            aria-label="Close"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
            />
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-primary">{product.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{product.price}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{product.description}</p>
              <Link
                href={`/products/${product.id}`}
                className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-medium text-primary hover:text-gray-600 inline-flex items-center"
              >
                View product
                <ChevronRight className="ml-1 h-2 w-2 sm:h-3 sm:w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
