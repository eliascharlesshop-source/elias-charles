"use client"

import Layout from "@/components/layout/layout"

export default function MensCollection() {

  return (
    <Layout>
      <div className="bg-cream">
        {/* Hero section */}
        <div className="relative">
          <div className="absolute inset-0">
            <img src="/images/ocean-bw-3.jpg" alt="Men's Collection" className="h-full w-full object-cover" />
            <div className="absolute inset-0 backdrop-blur-sm bg-white/20 border-b border-white/30" />
          </div>
          <div className="relative px-4 sm:px-6 py-12 sm:py-16 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white sm:text-4xl">
                Men's Collection
              </h1>
              <p className="mt-2 sm:mt-3 text-base sm:text-lg leading-7 sm:leading-8 text-white">
                Discover our latest men's apparel, surf gear, and accessories.
              </p>
            </div>
          </div>
        </div>


      </div>
    </Layout>
  )
}
