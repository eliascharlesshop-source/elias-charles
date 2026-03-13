"use client"

import Layout from "@/components/layout/layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShopifyCollectionService, ShopifyDataTransformer } from "@/lib/shopify-services"
import { BoxShowcase } from "@/components/boxes/box-showcase"
import { IE_BOXES } from "@/data/box-config"

interface Collection {
  id: string
  title: string
  description: string
  handle: string
  image?: string
  productCount: number
}

// Fallback function to use when Shopify service fails
async function fetchCollectionsFallback(): Promise<Collection[]> {
  try {
    // Simple fetch to our API endpoint
    const response = await fetch('/api/collections')
    if (!response.ok) {
      throw new Error('Failed to fetch collections')
    }
    const apiData = await response.json()
    
    // Transform API response to match our Collection interface
    if (apiData.success && apiData.data) {
      return apiData.data.map((collection: any) => ({
        id: collection.id,
        title: collection.title,
        description: collection.description,
        handle: collection.handle,
        image: collection.image,
        productCount: collection.products?.length || 0
      }))
    }
    throw new Error('Invalid API response')
  } catch (error) {
    console.warn('Collections API fallback failed, using static data:', error)
    // Return static collections as ultimate fallback
    return [
      {
        id: "boards",
        title: "Boards",
        description: "Surf and skate boards for every level",
        handle: "boards",
        image: "/products/longboard.png",
        productCount: 12
      },
      {
        id: "apparel",
        title: "Apparel", 
        description: "Clothing and accessories for your active lifestyle",
        handle: "apparel",
        image: "/products/men-casual-hoodie.png",
        productCount: 24
      },
      {
        id: "self-care",
        title: "Self Care",
        description: "Products to help you look and feel your best",
        handle: "self-care",
        image: "/products/linen-dress-beach.png",
        productCount: 18
      }
    ]
  }
}

async function fetchFeaturedProductsFallback(): Promise<any[]> {
  try {
    const response = await fetch('/api/products?featured=true&limit=6')
    if (!response.ok) {
      throw new Error('Failed to fetch featured products')
    }
    const apiData = await response.json()
    
    // Handle different API response formats
    if (apiData.success && apiData.data) {
      return Array.isArray(apiData.data) ? apiData.data : []
    }
    
    if (Array.isArray(apiData)) {
      return apiData
    }
    
    throw new Error('Invalid API response format')
  } catch (error) {
    console.warn('Featured products API fallback failed, using static data:', error)
    // Return static featured products as fallback
    return [
      {
        id: "1",
        title: "Classic Surf T-Shirt",
        handle: "classic-surf-tshirt",
        price: 45,
        compareAtPrice: null,
        images: ["/products/men-casual-hoodie.png"],
        vendor: "Elias Charles"
      },
      {
        id: "2", 
        title: "Relaxed Fit Hoodie",
        handle: "relaxed-fit-hoodie",
        price: 85,
        compareAtPrice: 95,
        images: ["/products/men-surf-style.png"],
        vendor: "Elias Charles"
      },
      {
        id: "3",
        title: "Longboard Skateboard", 
        handle: "longboard-skateboard",
        price: 120,
        compareAtPrice: null,
        images: ["/products/longboard.png"],
        vendor: "Elias Charles"
      }
    ]
  }
}

export default function CollectionsPage() {
  const [loading, setLoading] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)

  const handleSubscribe = (boxId: string) => {
    console.log('Subscribe to box:', boxId)
    // TODO: Implement subscription logic
  }

  const handleLearnMore = (boxId: string) => {
    console.log('Learn more about box:', boxId)
    // TODO: Navigate to box details
  }

  return (
    <Layout>
      <div className="bg-[#fdf4ec]">
        {/* Header Section */}
        <div className="text-center py-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Inland Empire Boxes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Curated collections around seasonal moments. Simplified decisions, elevated experience.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>4 Core Boxes</span>
            <span>•</span>
            <span>Seasonal Themes</span>
            <span>•</span>
            <span>Limited Editions</span>
          </div>
        </div>

        {/* Box Showcase */}
        <div className="px-6 pb-16">
          <BoxShowcase 
            boxes={IE_BOXES}
            onSubscribe={handleSubscribe}
            onLearnMore={handleLearnMore}
            currentWeek={currentWeek}
          />
        </div>
      </div>
    </Layout>
  )
}

        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src="/images/lifestyle/palm-trees-street-3.jpg" alt="Collections" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-40" />
          </div>
          <div className="relative px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 text-xs uppercase tracking-widest text-white opacity-80">Summer 2023 • Issue 03</div>
              <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">Collections</h1>
              <p className="mt-4 text-base leading-7 text-white">
                Don't react, wait for the pullback. Explore our curated collections of quality products for your
                lifestyle.
              </p>
              {loading && (
                <div className="mt-4 text-sm text-white/80">
                  Loading collections with GraphQL caching...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shopify Collections Display */}
        {collections.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mb-12 text-center">
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">Live from Shopify</div>
              <h2 className="text-2xl sm:text-3xl font-light steel-gradient">Our Collections</h2>
              <p className="mt-4 text-gray-600">Enhanced with GraphQL caching for optimal performance</p>
            </div>
            
            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {collections.map((collection) => (
                <div key={collection.id} className="group relative">
                  <div className="aspect-square w-full overflow-hidden rounded-lg">
                    <img
                      src={collection.image || "/images/lifestyle/palm-trees-street-1.jpg"}
                      alt={collection.title}
                      className="h-full w-full object-cover object-center group-hover:opacity-90 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-lg font-medium text-white">
                        <Link href={`/collections/${collection.handle}`}>
                          <span className="absolute inset-0" />
                          {collection.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-white/80">{collection.description}</p>
                      <p className="mt-2 text-xs text-white/60">{collection.productCount} products</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main collections grid - Magazine Style */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-12 text-center">
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">The Collections</div>
            <h2 className="text-2xl sm:text-3xl font-light steel-gradient">Curated Categories</h2>
          </div>
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
            {staticCollections.map((collection, index) => (
              <div key={collection.id} className="group">
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                  <img
                    src={collection.image || "/images/ocean-bw-2.jpg"}
                    alt={collection.title}
                    className="h-full w-full object-cover object-center group-hover:opacity-90 transition duration-300"
                  />
                  <div className="flex items-end p-4">
                    <div className="bg-white bg-opacity-90 p-4 rounded-md backdrop-blur-sm">
                      <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">Collection {index + 1}</div>
                      <h3 className="text-lg font-medium steel-gradient">
                        <Link href={`/collections/${collection.id}`}>
                          <span className="absolute inset-0" />
                          {collection.title} <span className="text-sm text-gray-500">({collection.code})</span>
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{collection.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Featured Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {collection.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/collections/${collection.id}/${subcategory.id}`}
                        className="inline-flex items-center rounded-full border border-gray-400 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition duration-200"
                      >
                        {subcategory.title} <span className="ml-1 text-xs opacity-70">({subcategory.code})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="bg-[#fdf4ec] py-24 border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">Featured Products</div>
                <h2 className="text-2xl sm:text-3xl font-light steel-gradient">Trending Now</h2>
                <p className="mt-4 text-gray-600">Powered by GraphQL recommendations</p>
              </div>
              
              <div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="group relative">
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                      <img
                        src={product.images[0] || "/images/lifestyle/palm-trees-sky-1.jpg"}
                        alt={product.title}
                        className="h-full w-full object-cover object-center group-hover:opacity-90 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:underline">
                        <Link href={`/products/${product.handle}`}>
                          {product.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{product.vendor}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Shop by category section */}
        <div className="bg-[#fdf4ec] py-24 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center mb-12">
                <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">Featured Selections</div>
                <h2 className="text-2xl sm:text-3xl font-light steel-gradient">Shop by Category</h2>
              </div>
              <div className="mt-12 grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3">
                {[
                  {
                    name: "Men",
                    href: "/collections/men",
                    imageSrc: "/products/surfboard-on-beach.png",
                    description: "Curated styles for the modern man",
                  },
                  {
                    name: "Women",
                    href: "/collections/women",
                    imageSrc: "/images/palm-trees-street-2.jpeg",
                    description: "Effortless style for every occasion",
                  },
                  {
                    name: "Sale",
                    href: "/collections/sale",
                    imageSrc: "/products/sustainable-fashion-collage.png",
                    description: "Limited time offers on premium items",
                  },
                ].map((category, index) => (
                  <div key={category.name} className="group relative">
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                      <img
                        src={category.imageSrc || "/images/brand/highway-lights-2.jpg"}
                        alt={category.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-90 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="text-xs uppercase tracking-widest text-white mb-2">Featured {index + 1}</div>
                        <h3 className="text-xl font-light text-white">
                          <Link href={category.href}>
                            <span className="absolute inset-0" />
                            {category.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-white/80">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-auto max-w-7xl my-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-800">Failed to Load Collections</h3>
              <p className="mt-2 text-sm text-red-600">{error}</p>
              <p className="mt-2 text-xs text-red-500">Using fallback collection structure</p>
            </div>
          </div>
        )}

        {/* Magazine-style footer */}
        <div className="bg-[#fdf4ec] py-12 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-4">Summer 2023 • Issue 03</div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Our collections are curated with intention, designed for those who understand that style is a reflection
              of values, not just aesthetics.
            </p>
            {!loading && collections.length > 0 && (
              <p className="mt-2 text-xs text-gray-400">
                Powered by GraphQL • {collections.length} collections loaded with caching
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
