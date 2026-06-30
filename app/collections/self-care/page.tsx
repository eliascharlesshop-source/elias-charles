"use client"

import Layout from "@/components/layout/layout"
import { useState } from "react"
import Link from "next/link"

export default function SelfCareCollection() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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
            <img src="/images/lifestyle/palm-trees-sky-1.jpg" alt="Self-Care Collection" className="h-full w-full object-cover" />
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

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-light steel-gradient">Self Care Collection</h2>
              <p className="text-sm text-gray-500 mt-4">Browse self-care products through our curated collections</p>
            </div>
          </div>
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
