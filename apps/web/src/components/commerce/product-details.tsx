"use client"
import { useState } from "react"
import { Minus, Plus } from "lucide-react"

interface ProductDetailsProps {
  product: {
    id: string
    title: string
    description: string
    price: string
    sizes: string[]
    colors: string[]
    details: string[]
  }
  onAddToCart: (product: any) => void
}

export function ProductDetails({ product, onAddToCart }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const incrementQuantity = () => {
    setQuantity(quantity + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color")
      return
    }

    onAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
  }

  return (
    <div className="lg:pl-6 xl:pl-8">
      <div className="prose prose-sm max-w-none text-primary">
        <p className="text-lg">{product.description}</p>

        <div className="mt-6 sm:mt-8">
          <h3 className="text-sm font-medium">Details</h3>
          <ul className="mt-2 sm:mt-4 list-disc pl-5 text-xs sm:text-sm">
            {product.details.map((detail, index) => (
              <li key={index} className="text-primary mb-1">
                {detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 sm:mt-8">
          <h3 className="text-sm font-medium">Size</h3>
          <div className="mt-2 sm:mt-4 grid grid-cols-5 gap-2 sm:gap-4">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex items-center justify-center rounded-md border py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                  selectedSize === size
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-primary hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <h3 className="text-sm font-medium">Color</h3>
          <div className="mt-2 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-4">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex items-center justify-center rounded-md border py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                  selectedColor === color
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 bg-white text-primary hover:bg-gray-50"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <h3 className="text-sm font-medium">Quantity</h3>
          <div className="mt-2 sm:mt-4 flex items-center">
            <button
              onClick={decrementQuantity}
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-primary hover:bg-gray-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <span className="mx-3 sm:mx-4 text-sm sm:text-base font-medium text-primary">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-primary hover:bg-gray-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 sticky bottom-0 bg-cream py-4 z-10 lg:relative lg:py-0 lg:z-0">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-md bg-primary px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white hover:bg-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
