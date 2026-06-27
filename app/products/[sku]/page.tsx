'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag, Heart } from 'lucide-react'
import Layout from '@/components/layout/layout'

interface Product {
  sku: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  inventory: number
  category: string
  collections: string[]
  image?: string
  tags: string[]
  status: string
}

export default function ProductDetailPage({ params }: { params: { sku: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.sku}`)
        const data = await response.json()

        if (data.success) {
          setProduct(data.data.product)
          setRelatedProducts(data.data.related || [])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.sku])

  const handleAddToCart = async () => {
    if (!product) return

    setIsCheckingOut(true)
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: product.sku,
          quantity
        })
      })

      const data = await response.json()
      if (data.success && data.data.checkoutUrl) {
        window.location.href = data.data.checkoutUrl
      }
    } catch (error) {
      console.error('Error starting checkout:', error)
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-beach-darker"></div>
            <p className="mt-4 text-beach-darker">Loading product...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="bg-cream min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-beach-darker mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">Sorry, we couldn't find the product you're looking for.</p>
            <Link href="/collections" className="inline-block bg-beach-darker text-white px-6 py-3 rounded-md hover:bg-gray-900 transition-colors">
              View Collections
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <Layout>
      <div className="bg-cream min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/collections/${product.category}`}
            className="inline-flex items-center text-beach-darker hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {product.category}
          </Link>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div>
              <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
                <img
                  src={product.image || '/icons/placeholder.svg'}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4">
                  <span className="inline-block bg-beach-darker text-white px-3 py-1 text-xs font-medium rounded-full uppercase">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-beach-darker mb-4">{product.name}</h1>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-beach-darker">${product.price.toFixed(2)}</span>
                  {product.compareAtPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                      <span className="inline-block bg-red-100 text-red-800 px-3 py-1 text-sm font-semibold rounded">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-8">{product.description}</p>

                {/* Stock Status */}
                <div className="mb-8">
                  {product.inventory > 0 ? (
                    <p className="text-green-600 font-medium">
                      ✓ In Stock ({product.inventory} available)
                    </p>
                  ) : (
                    <p className="text-red-600 font-medium">Out of Stock</p>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mb-8">
                    <p className="text-sm font-medium text-gray-700 mb-3">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-800 px-3 py-1 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.inventory}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isCheckingOut || product.inventory === 0}
                  className="w-full bg-beach-darker text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isCheckingOut ? 'Processing...' : 'Buy Now'}
                </button>

                <button className="w-full border border-beach-darker text-beach-darker py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          {/* Collections */}
          {product.collections && product.collections.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-beach-darker mb-4">Part of Collections</h3>
              <div className="flex flex-wrap gap-3">
                {product.collections.map(collection => (
                  <Link
                    key={collection}
                    href={`/collections?mini=${collection}`}
                    className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors capitalize"
                  >
                    {collection.replace('-', ' ')}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-beach-darker mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(related => (
                  <Link
                    key={related.sku}
                    href={`/products/${related.sku}`}
                    className="group"
                  >
                    <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm mb-4">
                      <img
                        src={related.image || '/icons/placeholder.svg'}
                        alt={related.name}
                        className="h-full w-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-beach-darker group-hover:text-gray-900">
                      {related.name}
                    </h3>
                    <p className="text-sm font-semibold text-beach-darker mt-1">
                      ${related.price.toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
