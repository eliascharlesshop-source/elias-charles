"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Heart, Share2 } from "lucide-react"
import { useCart } from "../../components/cart-provider"

export default function ProductPage() {
  const params = useParams()
  const handle = params?.handle as string
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart() || { addToCart: () => {} }

  // Mock product data
  const product = {
    id: handle || "1",
    title: "Classic Surf T-Shirt",
    price: "$45.00",
    description:
      "Our classic surf t-shirt is made from 100% organic cotton for a soft, comfortable feel. Perfect for beach days or casual wear.",
    features: [
      "100% organic cotton",
      "Regular fit",
      "Crew neck",
      "Short sleeves",
      "Screen-printed graphic",
      "Machine washable",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "White", value: "#FFFFFF", border: true },
      { name: "Black", value: "#000000" },
      { name: "Navy", value: "#0A192F" },
      { name: "Sand", value: "#E2D2B4", border: true },
    ],
    images: [
      "/placeholder.svg?height=800&width=600&text=Product+Front",
      "/placeholder.svg?height=800&width=600&text=Product+Back",
      "/placeholder.svg?height=800&width=600&text=Product+Detail",
      "/placeholder.svg?height=800&width=600&text=Product+Lifestyle",
    ],
    category: "Apparel",
    tags: ["surf", "t-shirt", "organic", "cotton"],
    sku: "TS-CLS-001",
    inStock: true,
    relatedProducts: [
      {
        id: "2",
        title: "Relaxed Fit Hoodie",
        price: "$85.00",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "3",
        title: "Board Shorts",
        price: "$65.00",
        image: "/placeholder.svg?height=400&width=400",
      },
      {
        id: "4",
        title: "Surf Wax",
        price: "$12.00",
        image: "/placeholder.svg?height=400&width=400",
      },
    ],
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color")
      return
    }

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
    })
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/collections" className="text-sm text-gray-500 hover:text-gray-700">
                Collections
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link href="/collections/apparel" className="text-sm text-gray-500 hover:text-gray-700">
                Apparel
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-sm text-gray-900">{product.title}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-md ${selectedImage === index ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-light tracking-tight text-primary">{product.title}</h1>
              <p className="mt-2 text-2xl text-primary">{product.price}</p>
            </div>

            <div className="prose prose-sm text-gray-700 mb-8">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-primary mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border ${selectedSize === size ? "border-primary bg-primary text-white" : "border-gray-300 text-primary"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-primary mb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={`h-8 w-8 rounded-full ${selectedColor === color.name ? "ring-2 ring-primary ring-offset-2" : ""} ${color.border ? "border border-gray-300" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-primary mb-2">Quantity</h3>
              <div className="flex items-center border border-gray-300 w-32">
                <button className="px-3 py-2 text-primary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  -
                </button>
                <input
                  type="number"
                  className="w-full text-center border-0 focus:ring-0"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button className="px-3 py-2 text-primary" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                className="flex-1 bg-primary text-white px-6 py-3 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button className="flex-1 border border-primary text-primary px-6 py-3 flex items-center justify-center gap-2">
                <Heart size={20} />
                Save
              </button>
              <button className="sm:flex-none border border-primary text-primary px-4 py-3 flex items-center justify-center">
                <Share2 size={20} />
              </button>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-primary mb-4">Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 mt-8 pt-8">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-primary">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">SKU</p>
                  <p className="font-medium text-primary">{product.sku}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tags</p>
                  <p className="font-medium text-primary">{product.tags.join(", ")}</p>
                </div>
                <div>
                  <p className="text-gray-500">Availability</p>
                  <p className="font-medium text-primary">{product.inStock ? "In Stock" : "Out of Stock"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <h2 className="text-2xl font-light tracking-tight text-primary mb-8">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.title}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
                <h3 className="mt-4 text-sm text-primary">{relatedProduct.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{relatedProduct.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
