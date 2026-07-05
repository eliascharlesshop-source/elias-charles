"use client"

import Link from "next/link"
import { PullQuote } from "@/components/layout/pull-quote"
import { HeroCarousel } from "@/components/home/hero-carousel"
import { GlassmorphicButton } from "@/components/ui/glassmorphic-button"

export default function Home() {

  return (
    <div className="magazine-layout">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Editorial Grid - Always shows */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-12">Trending Now</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Lifestyle Photography",
                  excerpt: "Capturing the essence of Elias Charles through authentic moments.",
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2421-MN5L8ERBeNVIYmcjM1BYDKPK0UWXP8.png",
                },
                {
                  title: "Summer Essentials",
                  excerpt: "The must-have pieces for your beach days and beyond.",
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2420-h39cyoGwUZsXHLsod0FTylQkq4lg9R.png",
                },
                {
                  title: "Timeless Style",
                  excerpt: "Premium apparel designed for those who live the Elias Charles lifestyle.",
                  image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2410-4qYmWFh9933jTFszd3NTSJs4ggJ57m.png",
                },
              ].map((article, index) => (
                <div key={index} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden img-shadow img-gradient-overlay rounded-sm">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-widest text-beach-darker mb-3">Trending</span>
                    <h3 className="text-lg sm:text-xl uppercase tracking-wider text-foreground mt-2 group-hover:opacity-70 transition-opacity leading-tight">
                      {article.title}
                    </h3>
                    <p className="steel-text mt-3 text-sm sm:text-base leading-relaxed">{article.excerpt}</p>
                    <Link
                      href="/in-life"
                      className="inline-block mt-4 text-xs uppercase tracking-widest steel-text border-b border-gray-400 dark:border-gray-600 pb-1 hover:border-beach-darker"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Category Feature */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Collection</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                The Skate <br />
                Collection
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                From street to beach, our skate collection combines performance, style, and sustainability. Designed for
                those who see the world as their playground.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text leading-relaxed">Sustainable materials that don&apos;t compromise on performance</p>
                </div>
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text leading-relaxed">Designed by skaters for skaters with coastal influences</p>
                </div>
              </div>
              <GlassmorphicButton href="/collections/boards">
                Explore Collection
              </GlassmorphicButton>
            </div>
            <div>
              <div className="relative aspect-[4/5] overflow-hidden img-shadow img-gradient-overlay rounded-sm">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2422-RzLuHfthv3RRkaPT6iuafFwgLTNamF.png"
                  alt="Elias Charles signature tee back logo"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Square Grid - Nature/Product Alternating Pattern */}
      <section className="bg-cream">
        <div className="grid grid-cols-2 md:grid-cols-2">
          {/* Row 1: Lifestyle Product */}
          <div className="aspect-square overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2417-LWKh1xR0ZNZxXgkgE8nBH30N0W1Qvm.png"
              alt="Modern minimalist style"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-foreground mb-3 sm:mb-4 leading-tight">Premium Quality</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Discover our curated collection of apparel and accessories for the everyday lifestyle.
              </p>
              <GlassmorphicButton href="/collections/apparel">Shop Now</GlassmorphicButton>
            </div>
          </div>

          {/* Row 2: Product Apparel */}
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-foreground mb-3 sm:mb-4 leading-tight">Brand Essentials</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Performance apparel designed for style and comfort throughout your day.</p>
              <GlassmorphicButton href="/collections/apparel">Explore</GlassmorphicButton>
            </div>
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2416-7QmA2iBivptXRbcsu9MFsFxY4WF26V.png"
              alt="Comfortable lounge wear"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Row 3: Lifestyle Accessories */}
          <div className="aspect-square overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2415-Vx9lUDoUBGp5ioLTfHrEGlNQdQe8ZE.png"
              alt="Signature cap"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-foreground mb-3 sm:mb-4 leading-tight">Accessories &amp; More</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Complete your look with our curated selection of hats and accessories.</p>
              <GlassmorphicButton href="/collections/apparel/hats">Discover</GlassmorphicButton>
            </div>
          </div>

          {/* Row 4: Signature Statement */}
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-foreground mb-3 sm:mb-4 leading-tight">The Signature Tee</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Wear the wave. Our iconic back-logo tee is the cornerstone of the Elias Charles identity.</p>
              <GlassmorphicButton href="/collections/apparel">Shop Tees</GlassmorphicButton>
            </div>
          </div>
          <div className="aspect-square overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2422-RzLuHfthv3RRkaPT6iuafFwgLTNamF.png"
              alt="Elias Charles signature tee back logo"
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Feature Article / Editorial */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden img-shadow img-gradient-overlay rounded-sm">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_2419-rxmOfBXoHBS26eKnDYIaR4DwErxC4j.png"
                  alt="Modern minimalist lifestyle"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center max-w-2xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Story</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                Elias Charles Lifestyle
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                Experience the Elias Charles aesthetic—a seamless blend of premium quality, timeless design, and contemporary style.
                Every piece is crafted with meticulous attention to detail for those who appreciate the finer things in life.
              </p>
              <p className="steel-text mb-8 text-sm sm:text-base leading-relaxed">
                From apparel to accessories, discover how our collection complements the modern lifestyle with elegance and purpose.
              </p>
              <Link
                href="/in-life"
                className="inline-block text-sm uppercase tracking-widest steel-text border-b border-gray-400 dark:border-gray-600 pb-1 hover:border-beach-darker"
              >
                Explore the collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
