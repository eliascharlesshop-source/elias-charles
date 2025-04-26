"use client"

import Layout from "../../components/layout"
import { useState } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import Link from "next/link"

export default function BoardsCollection() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("featured")

  // Placeholder products data
  const mockProducts = [
    {
      id: 1,
      title: "Classic Shortboard",
      price: "$695",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 2,
      title: "Performance Longboard",
      price: "$895",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 3,
      title: "Beginner Foam Board",
      price: "$325",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 4,
      title: "Fish Surfboard",
      price: "$745",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 5,
      title: "Classic Skateboard",
      price: "$135",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 6,
      title: "Longboard Skateboard",
      price: "$185",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 7,
      title: "Cruiser Skateboard",
      price: "$155",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 8,
      title: "Kids Skateboard",
      price: "$95",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  // Filter options
  const filters = [
    {
      id: "category",
      name: "Category",
      options: [
        { value: "surf", label: "Surf Boards", checked: false },
        { value: "skate", label: "Skate Boards", checked: false },
      ],
    },
    {
      id: "level",
      name: "Skill Level",
      options: [
        { value: "beginner", label: "Beginner", checked: false },
        { value: "intermediate", label: "Intermediate", checked: false },
        { value: "advanced", label: "Advanced", checked: false },
        { value: "pro", label: "Professional", checked: false },
      ],
    },
    {
      id: "price",
      name: "Price Range",
      options: [
        { value: "0-200", label: "Under $200", checked: false },
        { value: "200-500", label: "200-500", checked: false },
        { value: "500-800", label: "500-800", checked: false },
        { value: "800+", label: "$800 & Above", checked: false },
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
    <Layout>
      <div className="bg-cream">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img
              src="/placeholder.svg?height=600&width=1600"
              alt="Boards Collection"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
          </div>
          <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Boards</h1>
              <p className="mt-6 text-lg leading-8 text-white">
                Surf and skate boards for every level and style. Crafted with precision and designed for performance.
              </p>
            </div>
          </div>
        </div>

        {/* Subcategories */}
        <div className="bg-white py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-6">
              <Link
                href="/collections/boards/surf"
                className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
              >
                Surf Boards
              </Link>
              <Link
                href="/collections/boards/skate"
                className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
              >
                Skate Boards
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile filter dialog */}
        <div className={`relative z-40 lg:hidden ${mobileFiltersOpen ? "" : "hidden"}`} role="dialog" aria-modal="true">
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
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-accent"
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
            <h2 className="text-2xl font-light tracking-tight text-primary">All Boards</h2>

            <div className="flex items-center">
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
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-primary">
                            <Link href={`/products/${product.id}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.title}
                            </Link>
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-primary">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}
