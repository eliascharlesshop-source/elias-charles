"use client"

import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function WomensCollection() {

  return (
    <Layout>
      <div className="bg-cream">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img
              src="/images/lifestyle/palm-trees-street-2.jpg"
              alt="Women's Collection"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative px-4 sm:px-6 py-12 sm:py-16 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white sm:text-4xl">
                Women's Collection
              </h1>
              <p className="mt-2 sm:mt-3 text-base sm:text-lg leading-7 sm:leading-8 text-white">
                Discover our latest women's apparel, surf gear, and accessories.
              </p>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="text-center">
            <p className="text-sm text-primary/70 mt-4">Browse our women's collection</p>
            <div className="mt-8">
              <Link
                href="/collections/apparel"
                className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition"
              >
                ← Back to Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
