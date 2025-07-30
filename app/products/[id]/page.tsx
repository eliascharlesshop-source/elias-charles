"use client"

import { useParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Heart, Share2, ChevronRight } from "lucide-react"
import { useCart } from "../../../components/commerce/cart-provider"
import { transformShopifyProduct } from "@/src/lib/shopify"
import shopifyService from "../../../lib/shopify-service"

interface ProductVariant {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  availableForSale: boolean
  selectedOptions: { name: string; value: string }[]
}

interface ShopifyProductData {
  id: string
  title: string
  description: string
  handle: string
  images: string[]
  variants: ProductVariant[]
  options: { name: string; values: string[] }[]
  price: number
  compareAtPrice?: number
  category: string
  vendor: string
  tags: string[]
  inStock: boolean
}

export default function ProductPage() {
  const params = useParams()
  const handle = params?.id as string // Actually handle for Shopify
  const [product, setProduct] = useState<ShopifyProductData | null>(null)
  const [recommendations, setRecommendations] = useState<ShopifyProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  const cartContext = useCart()
  const addToCart = cartContext?.addToCart

  if (!addToCart) {
    console.error('addToCart function not available')
    return
  }

  console.log('ProductPage component mounted, handle:', handle, 'params:', params)

  // Fetch product data using GraphQL-enhanced service
  useEffect(() => {
    if (!handle) return
    
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Use the enhanced GraphQL service for better performance and caching
        const shopifyProduct = await shopifyService.getProduct(handle)
        
        if (shopifyProduct) {
          const transformedProduct = transformShopifyProduct(shopifyProduct)
          setProduct({ ...transformedProduct, options: [] })
          
          // Set default selected variant
          if (transformedProduct.variants.length > 0) {
            setSelectedVariant(transformedProduct.variants[0])
            
            // Set default selected options
            const defaultOptions: Record<string, string> = {}
            transformedProduct.variants[0].selectedOptions.forEach(option => {
              defaultOptions[option.name] = option.value
            })
            setSelectedOptions(defaultOptions)
          }
          
          // Fetch product recommendations using GraphQL
          try {
            const relatedProducts = await shopifyService.getProductRecommendations(
              shopifyProduct.id, 
              'RELATED'
            )
            setRecommendations(relatedProducts.slice(0, 3).map(p => ({ ...p, options: [] }))) // Show 3 recommendations
          } catch (recError) {
            console.warn('Failed to load recommendations:', recError)
          }
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Failed to load product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [handle])

  // Update selected variant when options change
  useEffect(() => {
    if (!product || Object.keys(selectedOptions).length === 0) return
    
    const variant = product.variants.find(v => 
      v.selectedOptions.every(option => 
        selectedOptions[option.name] === option.value
      )
    )
    
    if (variant) {
      setSelectedVariant(variant)
    }
  }, [selectedOptions, product])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary">Loading product... Handle: {handle}</p>
          <p className="text-sm text-gray-500 mt-2">Enhanced with GraphQL caching</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
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
    if (!selectedVariant || !addToCart) {
      alert("Please select product options")
      return
    }

    if (!selectedVariant.availableForSale) {
      alert("This variant is currently out of stock")
      return
    }

    try {
      const cartItem = {
        id: selectedVariant.id,
        title: `${product.title} - ${selectedVariant.title}`,
        price: `$${selectedVariant.price.toFixed(2)}`,
        image: product.images[selectedImage] || '',
        size: selectedOptions.Size || '',
        color: selectedOptions.Color || '',
      }
      
      addToCart(cartItem)
      
      alert("Product added to cart!")
    } catch (error) {
      console.error('Add to cart error:', error)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  const currentPrice = selectedVariant?.price || product.price
  const compareAtPrice = selectedVariant?.compareAtPrice || product.compareAtPrice

  return (
    <div className="bg-cream">
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
                src={product.images[selectedImage] || "/images/lifestyle/palm-trees-street-3.jpg"}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
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
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider">{product.vendor}</span>
              {product.tags.includes('featured') && (
                <span className="bg-primary text-white px-2 py-1 text-xs uppercase tracking-wider">Featured</span>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-primary">{product.title}</h1>
            
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl text-primary">${currentPrice.toFixed(2)}</span>
              {compareAtPrice && compareAtPrice > currentPrice && (
                <span className="text-lg text-gray-500 line-through">${compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="mt-6 prose prose-sm text-gray-700">
              <p className="text-lg">{product.description}</p>
            </div>

            {/* Product Options */}
            {product.options.map((option) => (
              <div key={option.name} className="mt-6">
                <h3 className="text-sm font-medium mb-2">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      className={`px-4 py-2 border ${
                        selectedOptions[option.name] === value 
                          ? "border-primary bg-primary text-white" 
                          : "border-gray-300 text-primary hover:border-primary"
                      }`}
                      onClick={() => handleOptionChange(option.name, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <div className="flex items-center gap-2">
                <button 
                  className="border border-gray-300 px-3 py-1 text-primary hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <span className="border border-gray-300 px-4 py-1 min-w-[3rem] text-center">{quantity}</span>
                <button 
                  className="border border-gray-300 px-3 py-1 text-primary hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                className={`flex-1 px-6 py-3 flex items-center justify-center gap-2 transition-colors ${
                  selectedVariant?.availableForSale 
                    ? "bg-primary text-white hover:bg-opacity-90" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
              >
                {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
              </button>
              <button className="flex-1 border border-primary text-primary px-6 py-3 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors">
                <Heart size={20} />
                Save
              </button>
              <button className="sm:flex-none border border-primary text-primary px-4 py-3 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Status: <span className={selectedVariant?.availableForSale ? "text-green-600" : "text-red-600"}>
                  {selectedVariant?.availableForSale ? "In Stock" : "Out of Stock"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-semibold">Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium">Category</h3>
              <p className="mt-2 text-primary">{product.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Vendor</h3>
              <p className="mt-2 text-primary">{product.vendor}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Tags</h3>
              <p className="mt-2 text-primary">{product.tags.join(", ")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Availability</h3>
              <p className="mt-2 text-primary">{product.inStock ? "In Stock" : "Out of Stock"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products - GraphQL Enhanced */}
      {recommendations.length > 0 && (
        <div className="bg-cream py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-semibold">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((recommendedProduct) => (
                <div key={recommendedProduct.id} className="group">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden">
                    <img
                      src={recommendedProduct.images[0] || "/placeholder.svg"}
                      alt={recommendedProduct.title}
                      className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm text-primary group-hover:underline">
                      <Link href={`/products/${recommendedProduct.handle}`}>
                        {recommendedProduct.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      ${recommendedProduct.price.toFixed(2)}
                      {recommendedProduct.compareAtPrice && recommendedProduct.compareAtPrice > recommendedProduct.price && (
                        <span className="ml-2 text-xs text-gray-500 line-through">
                          ${recommendedProduct.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">{recommendedProduct.vendor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
