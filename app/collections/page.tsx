"use client"

import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function CollectionsPage() {
  // Main collection categories with their codes and subcategories
  const collections = [
    {
      id: "boards",
      code: "BO",
      title: "Boards",
      description: "Surf and skate boards for every level",
      image: "/placeholder.svg?height=600&width=800",
      subcategories: [
        { id: "surf", code: "BO-SU", title: "Surf" },
        { id: "skate", code: "BO-SK", title: "Skate" },
      ],
    },
    {
      id: "apparel",
      code: "AP",
      title: "Apparel",
      description: "Clothing and accessories for your active lifestyle",
      image: "/placeholder.svg?height=600&width=800",
      subcategories: [
        { id: "hats", code: "AP-HA", title: "Hats" },
        { id: "sunglasses", code: "AP-SU", title: "Sunglasses" },
        { id: "tops", code: "AP-TO", title: "Tops" },
        { id: "bottoms", code: "AP-BO", title: "Bottoms" },
        { id: "jewelry", code: "AP-JE", title: "Jewelry" },
      ],
    },
    {
      id: "self-care",
      code: "SE",
      title: "Self Care",
      description: "Products to help you look and feel your best",
      image: "/placeholder.svg?height=600&width=800",
      subcategories: [
        { id: "body", code: "SE-BO", title: "Body" },
        { id: "nutrition", code: "SE-NU", title: "Nutrition" },
        { id: "supplements", code: "SE-SU", title: "Supplements" },
      ],
    },
    {
      id: "life",
      code: "LI",
      title: "Life",
      description: "Everything for your home, car, travel, and family",
      image: "/placeholder.svg?height=600&width=800",
      subcategories: [
        { id: "house", code: "LI-HO", title: "House" },
        { id: "car", code: "LI-CA", title: "Car" },
        { id: "travel", code: "LI-TR", title: "Travel" },
        { id: "family", code: "LI-FA", title: "Family" },
      ],
    },
  ]

  return (
    <Layout>
      <div className="bg-[#fdf4ec]">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src="/images/palm-trees-sky.jpeg" alt="Collections" className="h-full w-full object-cover" />
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
            </div>
          </div>
        </div>

        {/* Main collections grid - Magazine Style */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-12 text-center">
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">The Collections</div>
            <h2 className="text-2xl sm:text-3xl font-light steel-gradient">Curated Categories</h2>
          </div>
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
            {collections.map((collection, index) => (
              <div key={collection.id} className="group">
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                  <img
                    src={collection.image || "/placeholder.svg"}
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
                    imageSrc: "/images/palm-trees-street-1.jpeg",
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
                    imageSrc: "/images/palm-trees-sky.jpeg",
                    description: "Limited time offers on premium items",
                  },
                ].map((category, index) => (
                  <div key={category.name} className="group relative">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                      <img
                        src={category.imageSrc || "/placeholder.svg"}
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

        {/* Magazine-style footer */}
        <div className="bg-[#fdf4ec] py-12 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-4">Summer 2023 • Issue 03</div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Our collections are curated with intention, designed for those who understand that style is a reflection
              of values, not just aesthetics.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
