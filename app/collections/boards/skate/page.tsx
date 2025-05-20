"use client"

import Layout from "../../../components/layout"
import { useState } from "react"
import { Filter, X } from "lucide-react"
import Link from "next/link"
import { ResponsiveProductGrid } from "../../../components/responsive-product-grid"

export default function SkateBoardsCollection() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("featured")

  // Placeholder products data
  const mockProducts = [
    {
      id: 1,
      title: "Classic Skateboard",
      price: "$135",
      image: "/skateboard.png",
    },
    {
      id: 2,
      title: "Longboard Skateboard",
      price: "$185",
      image: "/longboard.png",
    },
    {
      id: 3,
      title: "Cruiser Skateboard",
      price: "$155",
      image: "/cruiser-skateboard.png",
    },
    {
      id: 4,
      title: "Kids Skateboard",
      price: "$95",
      image: "/placeholder-5uk16.png",
    },
    {
      id: 5,
      title: "Pro Model Skateboard",
      price: "$165",
      image: "/placeholder.svg?height=400&width=300&query=pro skateboard",
    },
    {
      id: 6,
      title: "Penny Board",
      price: "$110",
      image: "/placeholder.svg?height=400&width=300&query=penny board",
    },
    {
      id: 7,
      title: "Electric Skateboard",
      price: "$495",
      image: "/placeholder.svg?height=400&width=300&query=electric skateboard",
    },
    {
      id: 8,
      title: "Skateboard Deck",
      price: "$65",
      image: "/placeholder.svg?height=400&width=300&query=skateboard deck",
    },
  ]

  // Filter options
  const filters = [
    {
      id: "type",
      name: "Board Type",
      options: [
        { value: "standard", label: "Standard", checked: false },
        { value: "longboard", label: "Longboard", checked: false },
        { value: "cruiser", label: "Cruiser", checked: false },
        { value: "penny", label: "Penny", checked: false },
        { value: "electric", label: "Electric", checked: false },
        { value: "kids", label: "Kids", checked: false },
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
        { value: "0-100", label: "Under $100", checked: false },
        { value: "100-150", label: "$100-$150", checked: false },
        { value: "150-200", label: "$150-$200", checked: false },
        { value: "200+", label: "$200 & Above", checked: false },
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
              src="/images/night-highway-2.jpeg"
              alt="Skate Boards Collection"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
          </div>
          <div className="relative px-4 sm:px-6 py-24 sm:py-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white sm:text-5xl">Skate Boards</h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-white">
                From street to park, our skateboards are designed for riders of all levels. Quality decks, trucks, and
                wheels for the perfect ride.
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
              <h2 className="text-xl sm:text-2xl font-light tracking-tight text-primary">Skate Boards</h2>
              <div className="mt-3 sm:mt-4">
                <Link
                  href="/collections/boards"
                  className="inline-flex items-center rounded-md border border-primary px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  ← All Boards
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <select
                    id="sort-select"
                    name="sort"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-primary"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
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
                <h3 className="sr-only">Categories</h3>

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
                <ResponsiveProductGrid products={mockProducts} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}
