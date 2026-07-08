"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Heart, Share2, ShoppingBag } from "lucide-react"
import Layout from "@/components/layout/layout"
import { COASTLINE_SUBCOLLECTIONS, COASTLINE_BOX_SUGGESTION, getProductById } from "@/data/isla-vista-collection"

export default function CoastlinePage() {
  const [selectedSubCollection, setSelectedSubCollection] = useState("dawn-patrol")
  
  return (
    <Layout>
      <div className="bg-cream min-h-screen">
        {/* Hero Section */}
        <motion.section
          className="relative h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex items-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-screen blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-screen blur-3xl animate-pulse animation-delay-2000" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-widest font-light mb-6 text-cyan-300">Collection</p>
              <h1 className="text-7xl md:text-8xl font-light leading-tight mb-6">
                Coastline
              </h1>
              <p className="text-xl font-light max-w-2xl mb-8 text-gray-300">
                Where coastal living meets everyday adventure. Seven distinct lifestyle narratives captured in one collection.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#collections"
                  className="inline-block bg-white text-black px-8 py-3 font-bold text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors"
                >
                  Explore Collection
                </Link>
                <Link
                  href="https://www.tiktok.com/@eliascharles"
                  target="_blank"
                  className="inline-block border-2 border-white text-white px-8 py-3 font-bold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  Follow on TikTok
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Lifestyle Gallery Section */}
        <motion.section
          className="py-24 px-6 lg:px-12 bg-background"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <p className="text-sm uppercase tracking-widest font-light steel-text mb-4">Visual Stories</p>
              <h2 className="text-5xl md:text-6xl font-light text-foreground">The Elias Charles Lifestyle</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2421-MN5L8ERBeNVIYmcjM1BYDKPK0UWXP8.png",
                  title: "Modern Minimalist",
                  description: "Contemporary style meets everyday comfort"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2417-LWKh1xR0ZNZxXgkgE8nBH30N0W1Qvm.png",
                  title: "Effortless Elegance",
                  description: "Timeless pieces for the discerning individual"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2419-rxmOfBXoHBS26eKnDYIaR4DwErxC4j.png",
                  title: "Performance Meets Style",
                  description: "Designed for those who demand both"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2410-4qYmWFh9933jTFszd3NTSJs4ggJ57m.png",
                  title: "Premium Apparel",
                  description: "Quality craftsmanship in every detail"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2411-1KexFPcbOkonvjXHy4Dm0rFYcyVFm6.png",
                  title: "Comfort & Style",
                  description: "Perfect for relaxed moments"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2420-h39cyoGwUZsXHLsod0FTylQkq4lg9R.png",
                  title: "Daily Essentials",
                  description: "Accessories that complete the lifestyle"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2422-RzLuHfthv3RRkaPT6iuafFwgLTNamF.png",
                  title: "The Signature Tee",
                  description: "Wear the wave — the icon that defines the brand"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2418-HKQfIxpZmnjsDwyXiVrBuTPmncyMAc.png",
                  title: "Beach Towel",
                  description: "Take the brand to the sand"
                },
                {
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2416-7QmA2iBivptXRbcsu9MFsFxY4WF26V.png",
                  title: "Elias Charles Joggers",
                  description: "Luxury comfort for every occasion"
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg mb-4 bg-muted img-shadow img-gradient-overlay">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm steel-text">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Full-Width Brand Statement Banner */}
        <motion.section
          className="relative h-[70vh] overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2422-RzLuHfthv3RRkaPT6iuafFwgLTNamF.png"
            alt="Elias Charles signature tee back logo"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex items-center justify-center text-center text-white px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <p className="text-sm uppercase tracking-widest font-light mb-4 text-gray-300">The Icon</p>
              <h2 className="text-5xl md:text-7xl font-light mb-6">Wear The Wave</h2>
              <p className="text-lg font-light max-w-xl mx-auto mb-8 text-gray-200">
                Every piece tells a story. The Elias Charles wave logo is more than a mark — it is a way of life.
              </p>
              <Link
                href="/collections/apparel"
                className="inline-block border border-white text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Collections Grid */}
        <motion.section
          id="collections"
          className="py-24 px-6 lg:px-12 bg-cream"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-16"
            >
              <p className="text-sm uppercase tracking-widest font-light steel-text mb-4">Seven Stories</p>
              <h2 className="text-5xl md:text-6xl font-light text-foreground">Subcollections</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {COASTLINE_SUBCOLLECTIONS.map((subcollection, idx) => (
                <motion.button
                  key={subcollection.id}
                  onClick={() => setSelectedSubCollection(subcollection.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group text-left p-6 rounded-xl transition-all duration-300 ${
                    selectedSubCollection === subcollection.id
                      ? "bg-foreground text-background"
                      : "bg-background border border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="text-3xl mb-4">{subcollection.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{subcollection.name}</h3>
                  <p className={`text-sm ${selectedSubCollection === subcollection.id ? "opacity-70" : "steel-text"}`}>
                    {subcollection.tagline}
                  </p>
                  <div className="mt-4 pt-4 border-t border-current opacity-50">
                    <p className="text-xs uppercase tracking-wider">{subcollection.products.length} pieces</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Product Showcase */}
        <motion.section
          className="py-24 px-6 lg:px-12 bg-background"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection) && (
                <motion.div
                  key={selectedSubCollection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Subcollection Header */}
                  <div className="mb-16">
                    <h3 className="text-5xl md:text-6xl font-light mb-4">
                      {COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection)?.name}
                    </h3>
                    <p className="text-xl steel-text max-w-2xl">
                      {COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection)?.description}
                    </p>
                  </div>

                  {/* TikTok Embed */}
                  {COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection)?.tiktokVideoId && (
                    <div className="mb-16 flex justify-center">
                      <div className="w-full max-w-md">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center"
                        >
                          <iframe
                            src={`https://www.tiktok.com/embed/v2/${COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection)?.tiktokVideoId}`}
                            width="100%"
                            height="400"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="rounded-lg"
                          />
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  <div className="space-y-20">
                    {COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection)?.products.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                          idx % 2 === 1 ? "lg:grid-cols-2 lg:[&>*:nth-child(2)]:order-first" : ""
                        }`}
                      >
                        {/* Product Image */}
                        <motion.div
                          initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 + 0.1 }}
                          className="relative aspect-square overflow-hidden rounded-lg bg-muted img-shadow img-gradient-overlay"
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </motion.div>

                        {/* Product Details */}
                        <motion.div
                          initial={{ opacity: 0, x: idx % 2 === 0 ? 40 : -40 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 + 0.1 }}
                        >
                          <div className="mb-6">
                            <p className="text-sm uppercase tracking-widest font-light steel-text mb-2">
                              {COASTLINE_SUBCOLLECTIONS.find(sc => sc.id === selectedSubCollection)?.name}
                            </p>
                            <h3 className="text-4xl md:text-5xl font-light mb-4 text-foreground">{product.name}</h3>
                            <p className="text-lg steel-text mb-6">{product.description}</p>
                          </div>

                          <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-3xl font-bold text-foreground">${product.price}</span>
                            <span className="text-sm steel-text uppercase tracking-wider">{product.sku}</span>
                          </div>

                          <div className="mb-8 pb-8 border-b border-border">
                            <p className="text-xs uppercase tracking-widest steel-text mb-2">Material</p>
                            <p className="text-sm text-foreground">Premium technical fabric blend</p>
                          </div>

                          <div className="flex gap-4">
                            <Link
                              href={"/boxes?item=" + product.id}
                              className="flex-1 bg-foreground text-background px-6 py-3 font-bold text-sm uppercase tracking-wider rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Add to Box
                            </Link>
                            <button className="flex-1 border-2 border-foreground text-foreground px-6 py-3 font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-foreground/5 transition-colors flex items-center justify-center gap-2">
                              <Heart className="w-4 h-4" />
                              Wishlist
                            </button>
                          </div>

                          {product.tiktokUrl && (
                            <div className="mt-6 pt-6 border-t border-border">
                              <Link
                                href={product.tiktokUrl}
                                target="_blank"
                                className="flex items-center gap-2 text-sm steel-text hover:text-foreground transition-colors"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.7a2.94 2.94 0 1 1-5.92-2.82 2.93 2.93 0 0 1 2.31 1.39V9.58a6.47 6.47 0 1 0 10.86 3.28v-3.34a8.15 8.15 0 0 0 3.17-1.82v-3.62l-.01-.01z" />
                                </svg>
                                Watch on TikTok
                              </Link>
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Suggested Box Section */}
        <motion.section
          className="py-24 px-6 lg:px-12 bg-gradient-to-r from-black to-gray-900 text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm uppercase tracking-widest text-cyan-300 mb-4">Curated For You</p>
                <h2 className="text-5xl md:text-6xl font-light leading-tight mb-8">
                  {COASTLINE_BOX_SUGGESTION.name}
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {COASTLINE_BOX_SUGGESTION.description}
                </p>

                {/* Products List */}
                <div className="mb-8 pb-8 border-b border-gray-700">
                  <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">Includes</p>
                  <ul className="space-y-2">
                    {COASTLINE_BOX_SUGGESTION.products.map((productId) => {
                      const product = getProductById(productId)
                      return product ? (
                        <li key={productId} className="flex items-center gap-3 text-sm">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          {product.name}
                        </li>
                      ) : null
                    })}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-8 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60 mb-2">If Purchased Separately</p>
                    <p className="text-2xl font-bold">${COASTLINE_BOX_SUGGESTION.valueIfBought}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60 mb-2">Box Price</p>
                    <p className="text-2xl font-bold text-cyan-300">${COASTLINE_BOX_SUGGESTION.boxPrice}</p>
                  </div>
                </div>

                <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <p className="text-sm text-gray-300 mb-2">You Save</p>
                  <p className="text-3xl font-bold text-green-400">${COASTLINE_BOX_SUGGESTION.savings}</p>
                </div>

                <Link
                  href="/boxes"
                  className="inline-block bg-cyan-400 text-black px-8 py-4 font-bold text-sm uppercase tracking-wider rounded-lg hover:bg-cyan-300 transition-colors"
                >
                  Build Your Coastline Box
                </Link>
              </motion.div>

              {/* Box Visualization */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {COASTLINE_BOX_SUGGESTION.products.slice(0, 4).map((productId, idx) => {
                    const product = getProductById(productId)
                    return product ? (
                      <motion.div
                        key={productId}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-800"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ) : null
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-16 px-6 lg:px-12 bg-cream border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm uppercase tracking-widest font-light steel-text mb-6">Stay Connected</p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground mb-8">Follow the Journey</h2>
              <p className="text-lg steel-text mb-8 max-w-2xl mx-auto">
                Join our community on TikTok for daily Coastline moments, styling tips, and exclusive behind-the-scenes content.
              </p>
              <Link
                href="https://www.tiktok.com/@eliascharles"
                target="_blank"
                className="inline-block bg-foreground text-background px-8 py-3 font-bold text-sm uppercase tracking-wider rounded-lg hover:opacity-80 transition-opacity"
              >
                Follow @eliascharles on TikTok
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  )
}
