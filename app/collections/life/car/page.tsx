"use client"

import Layout from "@/components/layout/layout"
import { useState } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import Link from "next/link"

export default function CarCollection() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("featured")

  // Placeholder products data
  const mockProducts = [
    {
      id: 1,
      title: "Car Surfboard Carrier",
      price: "$75",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 2,
      title: "Waterproof Car Seat Cover",
      price: "$65",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 3,
      title: "Beach Parking Permit Holder",
      price: "$18",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 4,
      title: "Car Air Freshener",
      price: "$12",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 5,
      title: "Trunk Organizer",
      price: "$45",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 6,
      title: "Roof Rack Pads",
      price: "$38",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  // Filter options
  const filters = [
    {
      id: "type",
      name: "Product Type",
      options: [
        { value: "carriers", label: "Carriers", checked: false },
        { value: "covers", label: "Covers", checked: false },
        { value: "accessories", label: "Accessories", checked: false },
        { value: "organization", label: "Organization", checked: false },
      ],
    },
    {
      id: "features",
      name: "Features",
      options: [
        { value: "waterproof", label: "Waterproof", checked: false },
        { value: "durable", label: "Durable", checked: false },
        { value: "easy-install", label: "Easy Install", checked: false },
        { value: "universal-fit", label: "Universal Fit", checked: false },
      ],
    },
    {
      id: "price",
      name: "Price Range",
      options: [
        { value: "0-25", label: "Under $25", checked: false },
        { value: "25-50", label: "$25-$50", checked: false },
        { value: "50+", label: "$50 & Above", checked: false },
      ],
    },
  ]

  return (
    <Layout>
      <div className="bg-cream">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src="/images/ocean-wave-1.jpeg" alt="Car Collection" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
          </div>
          <div className="relative px-4 sm:px-6 py-24 sm:py-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white sm:text-5xl">Car</h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-white">
                Essential accessories for your beach and surf adventures on the road.
              </p>
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
            <div>
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-primary">Car</h2>
              <div className="mt-3 sm:mt-4">
                <Link
                  href="/collections/life"
                  className="inline-flex items-center rounded-md border border-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  ← All Life
                </Link>
              </div>
            </div>

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
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-6">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="group relative">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 flex justify-between">
                        <div>
                          <h3 className="text-xs sm:text-sm text-primary">
                            <Link href={`/products/${product.id}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.title}
                            </Link>
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-primary">{product.price}</p>
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
