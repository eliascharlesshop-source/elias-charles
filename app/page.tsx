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
                  title: "The Rise of Sustainable Surf Gear",
                  excerpt: "How eco-conscious brands are changing the industry standard.",
                  image: "/images/ocean-bw-2.jpg",
                },
                {
                  title: "Summer Essentials",
                  excerpt: "The must-have pieces for your beach days and beyond.",
                  image: "/images/ocean-bw-3.jpg",
                },
                {
                  title: "Skate Culture Meets High Fashion",
                  excerpt: "The unexpected influence of skate aesthetics on runway trends.",
                  image: "/images/lifestyle/palm-trees-street-1.jpg",
                },
              ].map((article, index) => (
                <div key={index} className="group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-widest text-beach-darker mb-3">Trending</span>
                    <h3 className="text-lg sm:text-xl uppercase tracking-wider text-gray-900 mt-2 group-hover:opacity-70 transition-opacity leading-tight">
                      {article.title}
                    </h3>
                    <p className="steel-text mt-3 text-sm sm:text-base leading-relaxed">{article.excerpt}</p>
                    <Link
                      href="/in-life"
                      className="inline-block mt-4 text-xs uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Rest of the static content that always shows */}
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
                  <p className="text-sm steel-text leading-relaxed">Sustainable materials that don't compromise on performance</p>
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
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/brand/highway-lights-2.jpg" alt="Skate collection" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Square Grid - Nature/Product Alternating Pattern */}
      <section className="bg-cream">
        <div className="grid grid-cols-2 md:grid-cols-2">
          {/* Row 1: Nature Product */}
          <div className="aspect-square overflow-hidden">
            <img src="/images/ocean-bw-4.jpg" alt="Ocean waves" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Summer Essentials</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Discover our curated collection of beach-ready items for the perfect summer.
              </p>
              <GlassmorphicButton href="/collections">Shop Now</GlassmorphicButton>
            </div>
          </div>

          {/* Row 2: Product Nature */}
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Surf Collection</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Performance gear designed for those who live for the waves.</p>
              <GlassmorphicButton href="/collections/boards">Explore</GlassmorphicButton>
            </div>
          </div>
          <div className="aspect-square overflow-hidden">
            <img src="/images/lifestyle/palm-trees-sky-1.jpg" alt="Ocean landscape" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Row 3: Nature Product */}
          <div className="aspect-square overflow-hidden">
            <img src="/images/ocean-bw-5.jpg" alt="Beach sunset" className="h-full w-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center max-w-xs lg:max-w-sm">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl uppercase tracking-wider text-gray-900 mb-3 sm:mb-4 leading-tight">Coastal Living</h3>
              <p className="steel-text mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">Bring the beach home with our curated home and lifestyle products.</p>
              <GlassmorphicButton href="/collections/life">Discover</GlassmorphicButton>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Article / Editorial */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/brand/highway-lights-1.jpg"
                  alt="Night highway with streaking lights"
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center max-w-2xl">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Article</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider steel-gradient mb-6 leading-tight">
                The Art of Sustainable Surfwear
              </h2>
              <p className="steel-text mb-6 text-sm sm:text-base leading-relaxed">
                Our latest collection represents our commitment to sustainable fashion that doesn't compromise on style
                or performance. Each piece is crafted with attention to environmental impact, using organic cotton and
                eco-friendly dyes.
              </p>
              <p className="steel-text mb-8 text-sm sm:text-base leading-relaxed">
                We spoke with our designers about the inspiration behind the collection and the challenges of creating
                high-performance gear that respects our oceans.
              </p>
              <Link
                href="/in-life"
                className="inline-block text-sm uppercase tracking-widest steel-text border-b border-gray-400 pb-1 hover:border-beach-darker"
              >
                Read the full story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
