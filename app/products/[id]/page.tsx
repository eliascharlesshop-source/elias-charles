"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Heart, Share2, ChevronRight } from "lucide-react"
import { useCart } from "../../components/cart-provider"
import { SectionTitle, SubsectionTitle, BodyText, SmallText } from "../../components/typography"
import { productApi, handleApiError } from "@/lib/api"
import { Product } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)

  const { addToCart } = useCart()

  console.log('ProductPage component mounted, id:', id, 'params:', params)

  // Fetch product data
  useEffect(() => {
    if (!id) return
    
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await productApi.getById(id)
        
        if (response.success && response.data) {
          setProduct(response.data)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fdf4ec" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading product... ID: {id}</p>
          <p className="text-sm text-gray-500 mt-2">Debug: {JSON.stringify({ id, loading, error })}</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fdf4ec" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/collections" className="bg-primary text-white px-6 py-3 hover:bg-opacity-90 transition-colors">
            Browse Collections
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select a size and color")
      return
    }

    if (!product) return

    try {
      await addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0] || '',
        size: selectedSize,
        color: selectedColor,
      })
      
      // Show success message or toast
      alert("Product added to cart!")
    } catch (error) {
      alert("Failed to add product to cart. Please try again.")
    }
  }

  return (
    <div style={{ backgroundColor: "#fdf4ec" }}>
      {/* Breadcrumb */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-xs">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/collections" className="ml-2 text-gray-500 hover:text-gray-700">
              Collections
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/collections/apparel" className="ml-2 text-gray-500 hover:text-gray-700">
              Apparel
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="ml-2 text-gray-900">{product.title}</span>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Main Image */}
          <div className="relative">
            <div className="aspect-h-4 aspect-w-3 overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-h-1 aspect-w-1 overflow-hidden ${selectedImage === index ? "ring-2 ring-primary" : "opacity-70"}`}
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

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-primary">{product.title}</h1>
            <p className="mt-2 text-2xl text-primary">${product.price}</p>

            <div className="mt-6 prose prose-sm text-gray-700">
              <BodyText>{product.description}</BodyText>
            </div>

            {/* Designer Quote */}
            <div className="mt-8 border-l-2 border-primary pl-4 italic">
              <SmallText>"{product.designerQuote}"</SmallText>
              <p className="mt-2 text-xs text-primary">— {product.designer}, Designer</p>
            </div>

            {/* Size Selection */}
            <div className="mt-8">
              <SubsectionTitle className="text-sm font-medium mb-2">Size</SubsectionTitle>
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
            <div className="mt-6">
              <SubsectionTitle className="text-sm font-medium mb-2">Color</SubsectionTitle>
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

            {/* Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-primary text-white px-6 py-3 flex items-center justify-center gap-2"
                onClick={handleAddToCart}
              >
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
          </div>
        </div>
      </div>

      {/* Editorial Section */}
      <div className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div>
              <SectionTitle className="text-2xl sm:text-3xl">{product.editorial.title}</SectionTitle>
              <div className="mt-6 max-w-xl">
                <BodyText>{product.editorial.content}</BodyText>
              </div>
            </div>
            <div className="aspect-h-4 aspect-w-3 lg:aspect-h-3 lg:aspect-w-4 overflow-hidden">
              <img
                src={product.editorial.image || "/placeholder.svg"}
                alt="Editorial image"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Story */}
      <div style={{ backgroundColor: "#fdf4ec" }} className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle>The Story</SectionTitle>
          <div className="mt-8 text-lg sm:text-xl leading-relaxed text-primary">{product.story}</div>
        </div>
      </div>

      {/* Product Features */}
      <div className="bg-gradient-to-b from-cream to-[#fdf4ec] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            <div className="transform transition-all hover:scale-[1.01] duration-300">
              <SectionTitle className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-[2px] after:bg-primary">
                Features
              </SectionTitle>
              <ul className="mt-8 space-y-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 h-7 w-7 flex items-center justify-center rounded-full bg-primary text-white text-sm group-hover:bg-accent transition-colors duration-300">
                      {index + 1}
                    </span>
                    <span className="ml-4 text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative transform transition-all hover:scale-[1.01] duration-300">
              <SectionTitle className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-[2px] after:bg-primary">
                Sustainability
              </SectionTitle>
              <div className="mt-8 prose prose-sm">
                <BodyText>{product.sustainabilityInfo}</BodyText>
              </div>
              <div className="mt-6 inline-block px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                Learn More About Our Practices
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div style={{ backgroundColor: "#fdf4ec" }} className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle className="mb-8">Details</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <SubsectionTitle className="text-sm font-medium">Category</SubsectionTitle>
              <p className="mt-2 text-primary">{product.category}</p>
            </div>
            <div>
              <SubsectionTitle className="text-sm font-medium">SKU</SubsectionTitle>
              <p className="mt-2 text-primary">{product.sku}</p>
            </div>
            <div>
              <SubsectionTitle className="text-sm font-medium">Tags</SubsectionTitle>
              <p className="mt-2 text-primary">{product.tags.join(", ")}</p>
            </div>
            <div>
              <SubsectionTitle className="text-sm font-medium">Availability</SubsectionTitle>
              <p className="mt-2 text-primary">{product.inStock ? "In Stock" : "Out of Stock"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle className="mb-8">You May Also Like</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {product.relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="group">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden">
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
