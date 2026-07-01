"use client"

import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function SunglassesCollection() {

  return (
    <Layout>
      <div className="bg-cream">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src="/images/sunglasses-header.png" alt="Sunglasses Collection" className="h-full w-full object-cover" />
          </div>
          <div className="relative px-4 sm:px-6 py-24 sm:py-32 lg:px-8 lg:py-48">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white sm:text-5xl">Sunglasses</h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-white">
                Protect your eyes in style with our premium sunglasses collection.
              </p>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-light text-primary">Sunglasses Collection</h2>
            <p className="text-sm text-primary/70 mt-4">Browse our sunglasses collection</p>
            <div className="mt-8">
              <Link
                href="/collections/apparel"
                className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white transition"
              >
                ← Back to Apparel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
