"use client"

import Layout from "../components/layout"
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
      <div className="bg-[#fcf5ed]">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img
              src="/placeholder.svg?height=800&width=1600"
              alt="Collections"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
          </div>
          <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Collections</h1>
              <p className="mt-6 text-lg leading-8 text-white">
                Don't react, wait for the pullback. Explore our curated collections of quality products for your
                lifestyle.
              </p>
            </div>
          </div>
        </div>

        {/* Main collections grid */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-y-20 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
            {collections.map((collection) => (
              <div key={collection.id} className="group">
                <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                  <div className="flex items-end p-4">
                    <div className="bg-white bg-opacity-90 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-[#373737]">
                        <Link href={`/collections/${collection.id}`}>
                          <span className="absolute inset-0" />
                          {collection.title} <span className="text-sm text-gray-500">({collection.code})</span>
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-[#373737]">{collection.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-[#373737]">Subcategories:</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {collection.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/collections/${collection.id}/${subcategory.id}`}
                        className="inline-flex items-center rounded-full border border-[#373737] px-3 py-1 text-xs font-medium text-[#373737] hover:bg-[#373737] hover:text-white"
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
        <div className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-light tracking-tight text-[#373737] sm:text-4xl">Shop by Category</h2>
              </div>
              <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3">
                {[
                  {
                    name: "Men",
                    href: "/collections/men",
                    imageSrc: "/placeholder.svg?height=600&width=400",
                  },
                  {
                    name: "Women",
                    href: "/collections/women",
                    imageSrc: "/placeholder.svg?height=600&width=400",
                  },
                  {
                    name: "Sale",
                    href: "/collections/sale",
                    imageSrc: "/placeholder.svg?height=600&width=400",
                  },
                ].map((category) => (
                  <div key={category.name} className="group relative">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
                      <img
                        src={category.imageSrc || "/placeholder.svg"}
                        alt={category.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h3 className="mt-6 text-lg text-[#373737] text-center">
                      <Link href={category.href}>
                        <span className="absolute inset-0" />
                        {category.name}
                      </Link>
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
