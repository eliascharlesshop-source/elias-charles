"use client"

import { PullQuote } from "@/src/components/layout/pull-quote"
import { DevNotice } from "@/src/components/ui/dev-notice"
import { LoadingSkeleton } from "@/src/components/ui/loading-skeleton"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Product {
  id: string
  title: string
  handle: string
  price: number
  compareAtPrice?: number
  images: string[]
  vendor: string
  description: string
}

interface Collection {
  id: string
  title: string
  handle: string
  description: string
  image?: string
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [newArrivals, setNewArrivals] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Load Shopify data lazily after component mounts
  useEffect(() => {
    const loadShopifyData = async () => {
      // Only try to load Shopify data if environment variables are set
      const hasShopifyConfig = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
      
      if (!hasShopifyConfig) {
        setDataLoaded(true)
        return
      }

      try {
        setLoading(true)
        
        // Dynamically import shopify service only when needed
        const { shopifyService } = await import('../lib/shopify-service')

        // Fetch data with timeout
        const fetchWithTimeout = (promise: Promise<any>, timeout = 5000) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
          ])
        }

        const [featured, collectionsData, arrivals] = await Promise.allSettled([
          fetchWithTimeout(shopifyService.getFeaturedProducts(6)),
          fetchWithTimeout(shopifyService.getCollections(4)),
          fetchWithTimeout(shopifyService.getNewArrivals(4))
        ])

        if (featured.status === 'fulfilled') setFeaturedProducts(featured.value || [])
        if (collectionsData.status === 'fulfilled') setCollections(collectionsData.value || [])
        if (arrivals.status === 'fulfilled') setNewArrivals(arrivals.value || [])

      } catch (error) {
        console.warn('Shopify data loading failed, using fallback content:', error)
      } finally {
        setLoading(false)
        setDataLoaded(true)
      }
    }

    // Delay loading by 100ms to ensure smooth initial render
    const timer = setTimeout(loadShopifyData, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="magazine-layout">
      {/* Magazine Cover Hero - Always shows immediately */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/ocean-bw-1.jpg"
            alt="Ocean waves in black and white"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-md">
            <span className="inline-block mb-4 text-xs tracking-widest uppercase text-white border-b pb-1">
              Summer 2023 Issue
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase text-white mb-6">
              The Ocean <br /> Edition
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg mb-8 max-w-sm">
              Exploring the intersection of surf culture, sustainable fashion, and coastal living
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/collections"
                className="inline-block bg-white text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-100 transition-colors text-center"
              >
                Explore Collections
              </Link>
              {dataLoaded && featuredProducts.length > 0 && (
                <Link
                  href="/products"
                  className="inline-block border border-white text-white px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-white hover:text-beach-darker transition-colors text-center"
                >
                  Shop Featured
                </Link>
              )}
            </div>
            {loading && (
              <div className="mt-4 text-xs text-white/80">
                Loading products...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Table of Contents / Issue Navigation - Always shows */}
      <section className="bg-cream py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 pb-6">
            <div>
              <h2 className="text-sm uppercase tracking-widest steel-gradient mb-2">In This Issue</h2>
              <p className="text-xs steel-text">Volume 03 • Summer 2023</p>
              {dataLoaded && collections.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{collections.length} live collections loaded</p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/in-life" className="text-xs uppercase tracking-widest steel-text hover:underline">
                Subscribe to EC Magazine
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {loading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="space-y-2">
                  <LoadingSkeleton type="text" className="w-8 h-3" />
                  <LoadingSkeleton type="text" className="w-full h-5" />
                  <LoadingSkeleton type="text" className="w-3/4 h-3" />
                </div>
              ))
            ) : collections.length > 0 ? (
              collections.slice(0, 4).map((collection, index) => (
                <Link key={collection.id} href={`/collections/${collection.handle}`} className="group">
                  <span className="text-xs text-gray-400">{(index + 1).toString().padStart(2, "0")}</span>
                  <h3 className="text-base sm:text-lg uppercase tracking-wider steel-gradient group-hover:opacity-70 transition-opacity">
                    {collection.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{collection.description}</p>
                  <span className="block mt-2 w-8 h-0.5 bg-beach-darker group-hover:w-12 transition-all duration-300"></span>
                </Link>
              ))
            ) : (
              // Fallback static content
              [
                { title: "Surf Culture", link: "/collections/boards/surf" },
                { title: "Summer Apparel", link: "/collections/apparel" },
                { title: "Coastal Living", link: "/collections/life" },
                { title: "Self Care", link: "/collections/self-care" },
              ].map((item, index) => (
                <Link key={index} href={item.link} className="group">
                  <span className="text-xs text-gray-400">{(index + 1).toString().padStart(2, "0")}</span>
                  <h3 className="text-base sm:text-lg uppercase tracking-wider steel-gradient group-hover:opacity-70 transition-opacity">
                    {item.title}
                  </h3>
                  <span className="block mt-2 w-8 h-0.5 bg-beach-darker group-hover:w-12 transition-all duration-300"></span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pull Quote - Always shows */}
      <PullQuote
        quote="If life gives you a break, ride it. Our designs are for those who live for the waves and streets."
        author="EC Design Team"
      />

      {/* Featured Products Section - Shows when loaded */}
      {dataLoaded && featuredProducts.length > 0 && (
        <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient">Featured Products</h2>
                <p className="text-xs text-gray-500 mt-2">Powered by GraphQL • Real-time Shopify data</p>
              </div>
              <Link
                href="/products"
                className="text-xs uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
              >
                View All Products
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product, index) => (
                <div key={product.id} className="group">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-widest text-beach-darker mb-3">{product.vendor}</span>
                    <h3 className="text-lg uppercase tracking-wider steel-gradient mt-2 group-hover:opacity-70 transition-opacity">
                      {product.title}
                    </h3>
                    <p className="steel-text mt-3 line-clamp-2">{product.description}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <Link
                      href={`/products/${product.handle}`}
                      className="inline-block mt-4 text-xs uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading state for featured products */}
      {loading && (
        <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <LoadingSkeleton type="text" className="w-48 h-8 mb-2" />
                <LoadingSkeleton type="text" className="w-64 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Editorial Grid - Always shows */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-12">Trending Now</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "The Rise of Sustainable Surf Gear",
                  excerpt: "How eco-conscious brands are changing the industry standard.",
                  image: "/images/ocean-bw-2.jpg",
                },
                {
                  title: "Summer Essentials",
                  excerpt: "The must-have pieces for your beach days and beyond.",
                  image: "/images/ocean-bw-3.jpg",
                },
                {
                  title: "Skate Culture Meets High Fashion",
                  excerpt: "The unexpected influence of skate aesthetics on runway trends.",
                  image: "/images/lifestyle/palm-trees-street-1.jpg",
                },
              ].map((article, index) => (
                <div key={index} className="group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-widest text-beach-darker mb-3">Trending</span>
                    <h3 className="text-lg sm:text-xl uppercase tracking-wider text-gray-900 mt-2 group-hover:opacity-70 transition-opacity leading-tight">
                      {article.title}
                    </h3>
                    <p className="steel-text mt-3 text-sm sm:text-base leading-relaxed">{article.excerpt}</p>
                    <Link
                      href="/in-life"
                      className="inline-block mt-4 text-xs uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Rest of the static content that always shows */}
      {/* Category Feature */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Collection</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                The Skate <br />
                Collection
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                From street to beach, our skate collection combines performance, style, and sustainability. Designed for
                those who see the world as their playground.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text leading-relaxed">Sustainable materials that don't compromise on performance</p>
                </div>
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text leading-relaxed">Designed by skaters for skaters with coastal influences</p>
                </div>
              </div>
              <Link
                href="/collections/boards"
                className="inline-block bg-white border border-gray-300 text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors"
              >
                Explore Collection
              </Link>
            </div>
            <div>
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/brand/highway-lights-2.jpg" alt="Skate collection" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Square Grid - Nature/Product Alternating Pattern */}
      <section className="bg-cream">
        <div className="grid grid-cols-2 md:grid-cols-2">
          {/* Row 1: Nature Product */}
          <div className="aspect-square">
            <img src="/images/ocean-bw-4.jpg" alt="Ocean waves" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Summer Essentials</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Discover our curated collection of beach-ready items for the perfect summer.
              </p>
              <Link
                href="/collections"
                className="inline-block border border-gray-300 text-beach-darker px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Row 2: Product Nature */}
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Surf Collection</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Performance gear designed for those who live for the waves.</p>
              <Link
                href="/collections/boards"
                className="inline-block border border-gray-300 text-beach-darker px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="aspect-square">
            <img src="/images/lifestyle/palm-trees-sky-1.jpg" alt="Ocean landscape" className="h-full w-full object-cover" />
          </div>

          {/* Row 3: Nature Product */}
          <div className="aspect-square">
            <img src="/images/ocean-bw-5.jpg" alt="Beach sunset" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Coastal Living</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Bring the beach home with our curated home and lifestyle products.</p>
              <Link
                href="/collections/life"
                className="inline-block border border-gray-300 text-beach-darker px-3 sm:px-4 py-2 text-xs sm:text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Discover
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Article / Editorial */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/brand/highway-lights-1.jpg"
                  alt="Night highway with streaking lights"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center max-w-2xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Article</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                The Art of Sustainable Surfwear
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                Our latest collection represents our commitment to sustainable fashion that doesn't compromise on style
                or performance. Each piece is crafted with attention to environmental impact, using organic cotton and
                eco-friendly dyes.
              </p>
              <p className="steel-text mb-8 text-sm sm:text-base leading-relaxed">
                We spoke with our designers about the inspiration behind the collection and the challenges of creating
                high-performance gear that respects our oceans.
              </p>
              <Link
                href="/in-life"
                className="inline-block text-sm uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
              >
                Read the full story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
