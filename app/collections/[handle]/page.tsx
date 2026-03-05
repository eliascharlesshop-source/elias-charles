"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import MagazineProductCard from "@/components/commerce/magazine-product-card"
import { ShopifyCollectionService, ShopifyProductService, ShopifyDataTransformer } from "@/lib/shopify-services"

interface Product {
  id: string
  title: string
  handle: string
  price: number
  images: string[]
  description: string
  vendor: string
  featured?: boolean
  tagline?: string
}

interface CollectionData {
  id: string
  title: string
  description: string
  handle: string
  image?: string
  products: Product[]
}

export default function CollectionPage() {
  const params = useParams()
  const handle = params?.handle as string
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("featured")
  const [viewMode, setViewMode] = useState("grid") // grid or magazine
  const [shopifyCollection, setShopifyCollection] = useState<CollectionData | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch collection and products data from Shopify
  useEffect(() => {
    async function fetchCollectionData() {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch the specific collection by handle
        const collection = await ShopifyCollectionService.getCollectionByHandle(handle)
        
        if (collection) {
          const transformedCollection = {
            ...ShopifyDataTransformer.collectionToAppFormat(collection),
            products: [] // We'll populate this separately
          }
          setShopifyCollection(transformedCollection)
          
          // Fetch products for this collection
          // Since we don't have collection-specific products endpoint yet,
          // we'll fetch all products and filter by collection handle or type
          const allProducts = await ShopifyProductService.getAllProducts(50)
          const transformedProducts = allProducts
            .map(product => ShopifyDataTransformer.productToAppFormat(product))
            .filter(product => {
              // Filter products that might belong to this collection
              // This is a basic implementation - in reality you'd want collection-specific API calls
              const categoryMatch = product.category?.toLowerCase().includes(handle.toLowerCase())
              const typeMatch = product.productType?.toLowerCase().includes(handle.toLowerCase())
              const handleMatch = handle === 'featured' ? product.featured : false
              
              return categoryMatch || typeMatch || handleMatch
            })
            .slice(0, 12) // Limit to 12 products for performance
          
          setProducts(transformedProducts)
        } else {
          // If no specific collection found, use fallback data and fetch general products
          setShopifyCollection(null)
          
          // Fetch general products that might fit this collection
          const allProducts = await ShopifyProductService.getAllProducts(20)
          const transformedProducts = allProducts
            .map(product => ShopifyDataTransformer.productToAppFormat(product))
            .slice(0, 8)
          
          setProducts(transformedProducts)
        }
      } catch (err) {
        console.error('Error fetching collection data:', err)
        setError('Failed to load collection data')
        // Keep the fallback data structure for now
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (handle) {
      fetchCollectionData()
    }
  }, [handle])

  // Collection data mapping
  const collectionsData = {
    boards: {
      title: "Boards",
      code: "BO",
      description: "Surf and skate boards for every level",
      subcategories: [
        { id: "surf", code: "BO-SU", title: "Surf" },
        { id: "skate", code: "BO-SK", title: "Skate" },
      ],
      featuredImage: "/icons/placeholder.svg",
      editorial:
        "Our boards are crafted with precision and passion, designed for riders who demand performance and style.",
    },
    apparel: {
      title: "Apparel",
      code: "AP",
      description: "Clothing and accessories for your active lifestyle",
      subcategories: [
        { id: "hats", code: "AP-HA", title: "Hats" },
        { id: "sunglasses", code: "AP-SU", title: "Sunglasses" },
        { id: "tops", code: "AP-TO", title: "Tops" },
        { id: "bottoms", code: "AP-BO", title: "Bottoms" },
        { id: "jewelry", code: "AP-JE", title: "Jewelry" },
      ],
      featuredImage: "/icons/placeholder.svg",
      editorial:
        "Our apparel collection blends comfort, functionality, and style for those who live life on their own terms.",
    },
    "self-care": {
      title: "Self Care",
      code: "SE",
      description: "Products to help you look and feel your best",
      subcategories: [
        { id: "body", code: "SE-BO", title: "Body" },
        { id: "nutrition", code: "SE-NU", title: "Nutrition" },
        { id: "supplements", code: "SE-SU", title: "Supplements" },
      ],
      featuredImage: "/icons/placeholder.svg",
      editorial: "Our self-care products are formulated with natural ingredients that nourish your body and mind.",
    },
    life: {
      title: "Life",
      code: "LI",
      description: "Everything for your home, car, travel, and family",
      subcategories: [
        { id: "house", code: "LI-HO", title: "House" },
        { id: "car", code: "LI-CA", title: "Car" },
        { id: "travel", code: "LI-TR", title: "Travel" },
        { id: "family", code: "LI-FA", title: "Family" },
      ],
      featuredImage: "/icons/placeholder.svg",
      editorial: "Our life collection brings quality and intention to every aspect of your daily experience.",
    },
    men: {
      title: "Men's Collection",
      description: "Shop our latest men's apparel, surf gear, and accessories.",
      featuredImage: "/icons/placeholder.svg",
      editorial: "Designed for the modern man who values quality, comfort, and style in equal measure.",
    },
    women: {
      title: "Women's Collection",
      description: "Shop our latest women's apparel, surf gear, and accessories.",
      featuredImage: "/icons/placeholder.svg",
      editorial: "Crafted for the woman who moves through life with purpose and grace.",
    },
    sale: {
      title: "Sale",
      description: "Special offers and discounted items across all categories.",
      featuredImage: "/icons/placeholder.svg",
      editorial: "Don't miss these limited-time offers on our premium products.",
    },
  }

  // Get current collection data
  const currentCollection = collectionsData[handle] || {
    title: "Collection",
    description: "Products in this collection",
    subcategories: [],
  }

  // Filter options
  const filters = [
    {
      id: "category",
      name: "Category",
      options: [
        { value: "clothing", label: "Clothing", checked: false },
        { value: "surf", label: "Surf", checked: false },
        { value: "skate", label: "Skate", checked: false },
        { value: "accessories", label: "Accessories", checked: false },
      ],
    },
    {
      id: "size",
      name: "Size",
      options: [
        { value: "xs", label: "XS", checked: false },
        { value: "s", label: "S", checked: false },
        { value: "m", label: "M", checked: false },
        { value: "l", label: "L", checked: false },
        { value: "xl", label: "XL", checked: false },
      ],
    },
    {
      id: "color",
      name: "Color",
      options: [
        { value: "black", label: "Black", checked: false },
        { value: "white", label: "White", checked: false },
        { value: "blue", label: "Blue", checked: false },
        { value: "beige", label: "Beige", checked: false },
        { value: "gray", label: "Gray", checked: false },
      ],
    },
  ]

  const sortOptions = [
    { name: "Featured", value: "featured" },
    { name: "Price: Low to High", value: "price-asc" },
    { name: "Price: High to Low", value: "price-desc" },
    { name: "Newest", value: "newest" },
  ]

  return (
    <div className="bg-cream">
      <div>
        {/* Magazine-style hero section */}
        <div className="relative">
          <div className="aspect-h-2 aspect-w-5 w-full overflow-hidden">
            <img
              src={currentCollection.featuredImage || "/icons/placeholder.svg"}
              alt={currentCollection.title}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12 md:p-16">
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white md:text-5xl">
                  {shopifyCollection?.title || currentCollection.title}
                </h1>
                {shopifyCollection?.description && (
                  <p className="mt-1 text-sm sm:text-lg text-white/80">ID: {shopifyCollection.id}</p>
                )}
                <p className="mt-2 sm:mt-4 text-base sm:text-lg text-white">
                  {shopifyCollection?.description || currentCollection.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial section */}
        {(shopifyCollection?.description || currentCollection.editorial) && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl italic text-primary">
                {shopifyCollection?.description || currentCollection.editorial}
              </p>
              {products.length > 0 && (
                <p className="mt-4 text-sm text-gray-600">
                  Showing {products.length} products from Shopify
                </p>
              )}
            </div>
          </div>
        )}

        {/* Mobile filter dialog */}
        <div
          className={mobileFiltersOpen ? "relative z-40 lg:hidden" : "relative z-40 lg:hidden hidden"}
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25"></div>

          <div className="fixed inset-0 z-40 flex">
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-cream py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-primary">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-cream p-2 text-primary"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <div key={section.id} className="border-t border-gray-200 px-4 py-6">
                    <h3 className="text-sm font-medium text-primary">{section.name}</h3>
                    <div className="mt-4 space-y-4">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-mobile-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            defaultChecked={option.checked}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-accent"
                          />
                          <label
                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                            className="ml-3 text-sm text-primary"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
            <div>
              {/* Subcategories */}
              {currentCollection.subcategories && currentCollection.subcategories.length > 0 && (
                <div className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {currentCollection.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/collections/${handle}/${subcategory.id}`}
                        className="inline-flex items-center rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary hover:bg-primary hover:text-white"
                      >
                        {subcategory.title}{" "}
                        {subcategory.code && <span className="ml-1 text-xs opacity-70">({subcategory.code})</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  ← All Collections
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              {/* View mode toggle */}
              <div className="mr-6 flex border border-gray-200 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "px-3 py-1 text-sm bg-primary text-white"
                      : "px-3 py-1 text-sm bg-white text-primary"
                  }
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("magazine")}
                  className={
                    viewMode === "magazine"
                      ? "px-3 py-1 text-sm bg-primary text-white"
                      : "px-3 py-1 text-sm bg-white text-primary"
                  }
                >
                  Magazine
                </button>
              </div>

              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="group inline-flex justify-center text-sm font-medium text-primary hover:text-gray-500"
                    id="menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    Sort
                    <ChevronDown
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-primary group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="ml-4 p-2 text-primary hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <Filter className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                {filters.map((section) => (
                  <div key={section.id} className="border-b border-gray-200 py-6">
                    <h3 className="text-sm font-medium text-primary">{section.name}</h3>
                    <div className="mt-4 space-y-4">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            defaultChecked={option.checked}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-accent"
                          />
                          <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-primary">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3 text-primary">Loading products...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-primary mb-4">No products found in this collection.</p>
                    <p className="text-sm text-gray-600">
                      {shopifyCollection ? 
                        "This collection is set up but doesn't have products assigned yet." :
                        "This collection will be available once products are added to your Shopify store."
                      }
                    </p>
                    <Link 
                      href="/collections" 
                      className="inline-block mt-4 text-primary hover:underline"
                    >
                      ← Browse all collections
                    </Link>
                  </div>
                ) : (
                  <>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 gap-y-8 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6">
                        {products.map((product) => (
                          <div key={product.id} className="group relative">
                            <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded-lg">
                              <img
                                src={product.images[0] || "/icons/placeholder.svg"}
                                alt={product.title}
                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                              />
                            </div>
                            <div className="mt-4 flex justify-between">
                              <div>
                                <h3 className="text-sm text-primary">
                                  <Link href={`/products/${product.handle}`}>
                                    <span aria-hidden="true" className="absolute inset-0" />
                                    {product.title}
                                  </Link>
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{product.vendor}</p>
                              </div>
                              <p className="text-sm font-medium text-primary">${product.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Magazine layout
                      <div className="grid grid-cols-12 gap-2 sm:gap-4">
                        {products.map((product, index) => {
                          // Create a more dynamic magazine layout
                          const isLarge = product.featured || index % 4 === 0
                          const spanClasses = isLarge
                            ? "col-span-12 sm:col-span-6 md:col-span-8"
                            : "col-span-12 sm:col-span-6 md:col-span-4"

                          // Alternate layout for visual interest
                          const isAlternate = index % 3 === 0

                          return (
                            <div key={product.id} className={spanClasses}>
                              <MagazineProductCard
                                id={product.id}
                                title={product.title}
                                price={`$${product.price.toFixed(2)}`}
                                image={product.images[0] || "/icons/placeholder.svg"}
                                aspectRatio={isLarge ? "portrait" : "square"}
                                featured={product.featured}
                                tagline={product.tagline}
                              />

                              {/* Add editorial content for featured products */}
                              {isLarge && (
                                <div className="mt-4 border-l-4 border-primary pl-4">
                                  <p className="italic text-primary text-sm">
                                    {isAlternate
                                      ? `${product.description?.slice(0, 100)}...` || "Premium quality, designed for those who demand excellence."
                                      : "Crafted with attention to detail and sustainable practices."}
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })}

                        {/* Editorial block - only show if we have products */}
                        {products.length > 0 && (
                          <div className="col-span-12 mt-8 sm:mt-12 border-t border-gray-200 pt-8 sm:pt-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-light text-primary">
                                  The Story Behind the Collection
                                </h3>
                                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-primary">
                                  {shopifyCollection?.description || currentCollection.editorial || 
                                   "Each piece in this collection tells a story of craftsmanship and intention. We believe in creating products that not only look good but feel good—both on your body and in your conscience."}
                                </p>
                                <div className="mt-4 sm:mt-6">
                                  <Link
                                    href="/in-life"
                                    className="text-xs sm:text-sm font-semibold leading-6 text-primary border-b border-primary pb-1 hover:border-gray-500 hover:text-gray-500"
                                  >
                                    Read more in IN LIFE <span aria-hidden="true">→</span>
                                  </Link>
                                </div>
                              </div>
                              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                                <img
                                  src={shopifyCollection?.image || "/icons/placeholder.svg"}
                                  alt="Behind the scenes"
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
