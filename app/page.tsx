import { PullQuote } from "@/components/layout/pull-quote"
import Link from "next/link"

export default function Home() {
  return (
    <div className="magazine-layout">
      {/* Magazine Cover Hero */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src="/images/ocean-waves-bw.jpeg"
            alt="Ocean waves in black and white"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-md">
            <span className="inline-block mb-4 text-xs tracking-widest uppercase text-white border-b pb-1">
              Summer 2023 Issue
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase text-white mb-6">
              The Ocean <br /> Edition
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg mb-8 max-w-sm">
              Exploring the intersection of surf culture, sustainable fashion, and coastal living
            </p>
            <Link
              href="/collections"
              className="inline-block bg-white text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-100 transition-colors"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </section>

      {/* Table of Contents / Issue Navigation */}
      <section className="bg-cream py-12 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-300 pb-6">
            <div>
              <h2 className="text-sm uppercase tracking-widest steel-gradient mb-2">In This Issue</h2>
              <p className="text-xs steel-text">Volume 03 • Summer 2023</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/in-life" className="text-xs uppercase tracking-widest steel-text hover:underline">
                Subscribe to EC Magazine
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { title: "Surf Culture", link: "/collections/boards/surf" },
              { title: "Summer Apparel", link: "/collections/apparel" },
              { title: "Coastal Living", link: "/collections/life" },
              { title: "Self Care", link: "/collections/self-care" },
            ].map((item, index) => (
              <Link key={index} href={item.link} className="group">
                <span className="text-xs text-gray-400">{(index + 1).toString().padStart(2, "0")}</span>
                <h3 className="text-base sm:text-lg uppercase tracking-wider steel-gradient group-hover:opacity-70 transition-opacity">
                  {item.title}
                </h3>
                <span className="block mt-2 w-8 h-0.5 bg-beach-darker group-hover:w-12 transition-all duration-300"></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <PullQuote
        quote="If life gives you a break, ride it. Our designs are for those who live for the waves and streets."
        author="EC Design Team"
      />

      {/* Editorial Grid */}
      <section className="py-16 px-6 sm:px-12 lg:px-24" style={{ backgroundColor: "#fdf4ec" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-12">Trending Now</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "The Rise of Sustainable Surf Gear",
                excerpt: "How eco-conscious brands are changing the industry standard.",
                image: "/images/ocean-wave-1.jpeg",
              },
              {
                title: "Summer Essentials",
                excerpt: "The must-have pieces for your beach days and beyond.",
                image: "/images/ocean-wave-2.jpeg",
              },
              {
                title: "Skate Culture Meets High Fashion",
                excerpt: "The unexpected influence of skate aesthetics on runway trends.",
                image: "/images/ocean-wave-3.jpeg",
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
                  <h3 className="text-lg uppercase tracking-wider steel-gradient mt-2 group-hover:opacity-70 transition-opacity">
                    {article.title}
                  </h3>
                  <p className="steel-text mt-3">{article.excerpt}</p>
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

      {/* Category Feature */}
      <section className="py-16 px-6 sm:px-12 lg:px-24" style={{ backgroundColor: "#fdf4ec" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Collection</span>
              <h2 className="text-2xl sm:text-3xl uppercase tracking-wider steel-gradient mb-6">
                The Skate <br />
                Collection
              </h2>
              <p className="steel-text mb-6">
                From street to beach, our skate collection combines performance, style, and sustainability. Designed for
                those who see the world as their playground.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text">Sustainable materials that don't compromise on performance</p>
                </div>
                <div>
                  <span className="block w-8 h-0.5 bg-beach-darker mb-4"></span>
                  <p className="text-sm steel-text">Designed by skaters for skaters with coastal influences</p>
                </div>
              </div>
              <Link
                href="/collections/boards/skate"
                className="inline-block bg-white border border-gray-300 text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors"
              >
                Explore Collection
              </Link>
            </div>
            <div>
              <div className="aspect-[4/5] overflow-hidden">
                <img src="/images/night-highway-2.jpeg" alt="Skate collection" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Square Grid - Nature/Product Alternating Pattern */}
      <section className="bg-cream">
        <div className="grid grid-cols-2 md:grid-cols-2">
          {/* Row 1: Nature Product */}
          <div className="aspect-square">
            <img src="/images/ocean-wave-1.jpeg" alt="Ocean waves" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-4">Summer Essentials</h3>
              <p className="steel-text mb-6">
                Discover our curated collection of beach-ready items for the perfect summer.
              </p>
              <Link
                href="/collections"
                className="inline-block border border-gray-300 text-beach-darker px-4 py-2 text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Row 2: Product Nature */}
          <div className="aspect-square bg-cream flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-4">Surf Collection</h3>
              <p className="steel-text mb-6">Performance gear designed for those who live for the waves.</p>
              <Link
                href="/collections/boards/surf"
                className="inline-block border border-gray-300 text-beach-darker px-4 py-2 text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Explore
              </Link>
            </div>
          </div>
          <div className="aspect-square">
            <img src="/images/ocean-wave-2.jpeg" alt="Ocean landscape" className="h-full w-full object-cover" />
          </div>

          {/* Row 3: Nature Product */}
          <div className="aspect-square">
            <img src="/images/ocean-wave-3.jpeg" alt="Beach sunset" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-square bg-cream flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl uppercase tracking-wider steel-gradient mb-4">Coastal Living</h3>
              <p className="steel-text mb-6">Bring the beach home with our curated home and lifestyle products.</p>
              <Link
                href="/collections/life"
                className="inline-block border border-gray-300 text-beach-darker px-4 py-2 text-sm uppercase tracking-widest font-bold hover:bg-white transition-colors"
              >
                Discover
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Article / Editorial */}
      <section className="py-16 px-6 sm:px-12 lg:px-24" style={{ backgroundColor: "#fdf4ec" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src="/images/night-highway-1.jpeg"
                  alt="Night highway with streaking lights"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest steel-text mb-6">Featured Article</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider steel-gradient mb-6">
                The Art of Sustainable Surfwear
              </h2>
              <p className="steel-text mb-6">
                Our latest collection represents our commitment to sustainable fashion that doesn't compromise on style
                or performance. Each piece is crafted with attention to environmental impact, using organic cotton and
                eco-friendly dyes.
              </p>
              <p className="steel-text mb-8">
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
