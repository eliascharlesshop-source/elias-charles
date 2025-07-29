"use client"

import Layout from "@/components/layout/layout"
import { useState } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import Link from "next/link"

export default function SelfCareCollection() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("featured")

  // Placeholder products data
  const mockProducts = [
    {
      id: 1,
      title: "Ocean Face Wash",
      price: "$28",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 2,
      title: "Surf Sunscreen SPF 50",
      price: "$24",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 3,
      title: "Sea Salt Hair Spray",
      price: "$22",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 4,
      title: "After-Sun Aloe Gel",
      price: "$18",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 5,
      title: "Protein Powder",
      price: "$45",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 6,
      title: "Vitamin D Supplements",
      price: "$32",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 7,
      title: "Natural Energy Bars",
      price: "$24",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 8,
      title: "Hydration Electrolytes",
      price: "$19",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  // Filter options
  const filters = [
    {
      id: "category",
      name: "Category",
      options: [
        { value: "body", label: "Body", checked: false },
        { value: "nutrition", label: "Nutrition", checked: false },
        { value: "supplements", label: "Supplements", checked: false },
      ],
    },
    {
      id: "concerns",
      name: "Concerns",
      options: [
        { value: "hydration", label: "Hydration", checked: false },
        { value: "sun", label: "Sun Protection", checked: false },
        { value: "recovery", label: "Recovery", checked: false },
        { value: "energy", label: "Energy", checked: false },
      ],
    },
    {
      id: "ingredients",
      name: "Ingredients",
      options: [
        { value: "vegan", label: "Vegan", checked: false },
        { value: "organic", label: "Organic", checked: false },
        { value: "gluten-free", label: "Gluten-Free", checked: false },
        { value: "natural", label: "All Natural", checked: false },
      ],
    },
  ]

  const sortOptions = [
    { name: "Featured", value: "featured" },
    { name: "Price: Low to High", value: "price-asc" },
    { name: "Price: High to Low", value: "price-desc" },
    { name: "Newest", value: "newest" },
  ]

  // Subcategories
  const subcategories = [
    { id: "body", name: "Body" },
    { id: "nutrition", name: "Nutrition" },
    { id: "supplements", name: "Supplements" },
  ]

  return (
    <Layout>
      <div className="bg-[#fdf4ec]">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src="/products/woven-beach-tote.png" alt="Self-Care Collection" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
          </div>
          <div className="relative px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-6 text-xs uppercase tracking-widest text-white opacity-80">Summer 2023 • Issue 03</div>
              <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl">Self Care</h1>
              <p className="mt-4 text-base leading-7 text-white">
                Products to help you look and feel your best. Nourish your body and mind.
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        <div className="bg-[#fdf4ec] py-8 border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">Featured Categories</div>
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/collections/self-care/${subcategory.id}`}
                  className="inline-flex items-center rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition duration-200"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile filter dialog */}
        <div className={`relative z-40 lg:hidden ${mobileFiltersOpen ? "" : "hidden"}`} role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black bg-opacity-25"></div>

          <div className="fixed inset-0 z-40 flex">
            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-[#fdf4ec] py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-600">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-[#fdf4ec] p-2 text-gray-600"
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
                    <h3 className="text-sm font-medium text-gray-600">{section.name}</h3>
                    <div className="mt-4 space-y-4">
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-mobile-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            defaultChecked={option.checked}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-accent"
                          />
                          <label
                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
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
              <h2 className="text-xl sm:text-2xl font-light steel-gradient">Self Care Products</h2>
              <div className="text-sm text-gray-500 mt-1">Showing {mockProducts.length} products</div>
            </div>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="group inline-flex justify-center text-sm font-medium text-gray-600 hover:text-gray-800"
                    id="menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    Sort
                    <ChevronDown
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="ml-4 p-2 text-gray-600 hover:text-gray-800 sm:ml-6 lg:hidden"
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
                <div className="text-sm uppercase tracking-widest text-gray-500 mb-4">Filter By</div>
                {filters.map((section) => (
                  <div key={section.id} className="border-b border-gray-200 py-6">
                    <h3 className="text-sm font-medium text-gray-600">{section.name}</h3>
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
                          <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
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
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {mockProducts.map((product, index) => (
                    <div key={product.id} className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-90 transition duration-300"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                            Editor's Pick
                          </div>
                        )}
                        {index === 1 && (
                          <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            Best Seller
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-600">
                            <Link href={`/products/${product.id}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.title}
                            </Link>
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">{index % 2 === 0 ? "In Stock" : "Limited Stock"}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-600">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Magazine-style footer */}
        <div className="bg-[#fdf4ec] py-12 border-t border-gray-200">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-4">Summer 2023 • Issue 03</div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Our self-care products are formulated with natural ingredients that nourish your body and mind.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
