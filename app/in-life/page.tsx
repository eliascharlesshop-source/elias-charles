"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Sunrise, Sun, Sunset, Coffee, Building, Music, Mountain, Compass, Tent, Plus, X, Package, Star } from "lucide-react"
import { BoxCard } from "@/components/boxes/box-card"
import { IE_BOXES } from "@/data/box-config"

// Interactive product hotspot component
const ProductHotspot = ({ x, y, product, color = "bg-white" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
        <button
          className={`${color} rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-md transition-transform hover:scale-110`}
          aria-label="View product details"
        >
          <Plus size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      <button
        className={`${color} rounded-full w-6 h-6 flex items-center justify-center z-10 shadow-md transition-transform hover:scale-110`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close product details" : "View product details"}
      >
        {isOpen ? <X size={14} /> : <Plus size={14} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-20 bg-white shadow-lg rounded-md p-3 w-48 -translate-x-1/2 mt-2"
            style={{ left: "50%" }}
          >
            <div className="relative h-32 mb-2">
              <Image
                src={product.image || "/icons/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover rounded-sm"
              />
            </div>
            <h4 className="font-medium text-sm mb-1">{product.title}</h4>
            <p className="text-xs mb-2">{product.price}</p>
            <Link href={product.url} className="text-xs font-medium underline hover:no-underline">
              Shop Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Magazine article component
const MagazineArticle = ({ title, excerpt, image, reverse = false, children }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center my-16 ${reverse ? "md:grid-flow-col-dense" : ""}`}
    >
      <div className={reverse ? "md:col-start-2" : ""}>
        <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">{title}</h3>
        <div className="prose prose-sm max-w-none mb-6">
          <p>{excerpt}</p>
        </div>
        {children}
      </div>

      <div className={`relative aspect-[4/5] ${reverse ? "md:col-start-1" : ""}`}>
        <Image src={image || "/icons/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
    </div>
  )
}

// Interactive product carousel
const ProductCarousel = ({ products }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleNext = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  if (!isMounted) {
    return (
      <div className="relative my-12">
        <div className="overflow-hidden" ref={containerRef}>
          <div className="flex">
            <div className="min-w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-square">
                  <Image
                    src={products[0]?.image || "/icons/placeholder.svg"}
                    alt={products[0]?.title || "Product"}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{products[0]?.title}</h3>
                  <p className="text-lg mb-2">{products[0]?.price}</p>
                  <p className="text-sm mb-4">{products[0]?.description}</p>
                  <div className="flex gap-2 mb-4">
                    {products[0]?.colors?.map((color, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full border ${color}`}
                      />
                    ))}
                  </div>
                  <Link
                    href={products[0]?.url || "#"}
                    className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative my-12">
      <div className="overflow-hidden" ref={containerRef}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {products.map((product, idx) => (
            <div key={idx} className="min-w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/icons/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover rounded-sm"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-lg mb-2">{product.price}</p>
                  <p className="text-sm mb-4">{product.description}</p>
                  <div className="flex gap-2 mb-4">
                    {product.colors?.map((color, i) => (
                      <button
                        key={i}
                        className={`w-6 h-6 rounded-full border ${color} transition hover:scale-110`}
                        aria-label={`Select ${color.replace("bg-", "")}`}
                      />
                    ))}
                  </div>
                  <Link
                    href={product.url}
                    className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
        onClick={handlePrev}
        aria-label="Previous product"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition"
        onClick={handleNext}
        aria-label="Next product"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="flex justify-center mt-4 gap-2">
        {products.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${idx === activeIndex ? "bg-black" : "bg-gray-300"}`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to product ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// Pull quote component
const PullQuote = ({ quote, author }) => {
  return (
    <blockquote className="relative my-16 mx-auto max-w-2xl px-4 text-center">
      <svg
        className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100"
        fill="currentColor"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
      <p className="relative text-xl md:text-2xl font-medium italic">{quote}</p>
      {author && (
        <footer className="mt-4">
          <p className="text-base font-semibold">— {author}</p>
        </footer>
      )}
    </blockquote>
  )
}

// Lifestyle section with parallax
const LifestyleSection = ({ title, image, children }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <section ref={ref} className="relative overflow-hidden py-24 my-16">
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <Image src={image || "/icons/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">{title}</h2>
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
    </section>
  )
}

// Shop the look component
const ShopTheLook = ({ image, products }) => {
  return (
    <div className="relative my-16">
      <div className="aspect-[3/4] relative">
        <Image src={image || "/icons/placeholder.svg"} alt="Shop the look" fill className="object-cover" />

        {products.map((product, idx) => (
          <ProductHotspot key={idx} x={product.x} y={product.y} product={product} />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wider mb-4">Shop The Look</p>
        <div className="flex flex-wrap justify-center gap-4">
          {products.map((product, idx) => (
            <Link key={idx} href={product.url} className="text-xs underline hover:no-underline">
              {product.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function InLifePage() {
  const [activeTab, setActiveTab] = useState("beach")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Sample beach products data
  const beachProducts = [
    {
      title: "Sunset Surf Board",
      price: "$599",
      image: "/products/beach-product.png",
      url: "/products/sunset-surf-board",
      description:
        "Our signature surfboard designed for both beginners and experienced surfers. Features a durable epoxy construction with a versatile shape that performs well in various conditions.",
      colors: ["bg-blue-400", "bg-orange-400", "bg-green-400"],
    },
    {
      title: "Beach Tote Bag",
      price: "$129",
      image: "/products/beach-tote-monochrome.png",
      url: "/products/beach-tote",
      description:
        "Handwoven from sustainable materials, our beach tote is spacious enough for all your essentials while remaining lightweight and stylish.",
      colors: ["bg-stone-200", "bg-stone-400", "bg-stone-600"],
    },
    {
      title: "Sun Protection Hat",
      price: "$89",
      image: "/products/sun-hat-monochrome.png",
      url: "/products/sun-hat",
      description:
        "Wide-brimmed hat offering UPF 50+ protection. Made from breathable, quick-drying materials perfect for long days at the beach.",
      colors: ["bg-stone-200", "bg-blue-200", "bg-black"],
    },
  ]

  // Shop the look data
  const beachLookProducts = [
    {
      x: 30,
      y: 20,
      title: "Linen Beach Shirt",
      price: "$129",
      image: "/products/men-casual-hoodie.png",
      url: "/products/linen-shirt",
    },
    {
      x: 70,
      y: 40,
      title: "Woven Beach Hat",
      price: "$89",
      image: "/products/diverse-beach-fashion.png",
      url: "/products/beach-hat",
    },
    {
      x: 50,
      y: 70,
      title: "Canvas Beach Shorts",
      price: "$99",
      image: "/products/men-urban-style.png",
      url: "/products/beach-shorts",
    },
  ]

  // City products data
  const cityProducts = [
    {
      title: "Urban Commuter Backpack",
      price: "$189",
      image: "/products/men-surf-style.png",
      url: "/products/urban-backpack",
      description:
        "Designed for the modern city dweller, this backpack features multiple compartments, water-resistant materials, and a sleek profile.",
      colors: ["bg-black", "bg-gray-400", "bg-blue-900"],
    },
    {
      title: "City Skateboard",
      price: "$249",
      image: "/products/cruiser-skateboard.png",
      url: "/products/city-skateboard",
      description:
        "Our city skateboard is perfect for navigating urban environments with a durable deck and smooth-rolling wheels designed for concrete surfaces.",
      colors: ["bg-red-500", "bg-black", "bg-white"],
    },
    {
      title: "Minimalist Watch",
      price: "$159",
      image: "/products/fashion-workshop.png",
      url: "/products/minimalist-watch",
      description:
        "A sleek timepiece with a clean design that complements any outfit. Features Japanese movement and scratch-resistant glass.",
      colors: ["bg-black", "bg-white", "bg-brown-400"],
    },
  ]

  // Mountain products data
  const mountainProducts = [
    {
      title: "Alpine Backpack",
      price: "$249",
      image: "/products/men-urban-style.png",
      url: "/products/alpine-backpack",
      description:
        "Engineered for mountain adventures, this backpack offers 35L of storage, weather-resistant materials, and ergonomic support for all-day comfort.",
      colors: ["bg-green-700", "bg-blue-700", "bg-black"],
    },
    {
      title: "Insulated Water Bottle",
      price: "$49",
      image: "/products/sustainable-fashion-collage.png",
      url: "/products/water-bottle",
      description:
        "Keeps beverages cold for 24 hours or hot for 12 hours. Made from durable stainless steel with a leak-proof cap design.",
      colors: ["bg-blue-500", "bg-black", "bg-white"],
    },
    {
      title: "Merino Wool Beanie",
      price: "$59",
      image: "/products/diverse-beach-fashion.png",
      url: "/products/wool-beanie",
      description:
        "Crafted from premium merino wool that regulates temperature and wicks moisture. Stylish enough for the city, functional enough for the mountains.",
      colors: ["bg-gray-700", "bg-red-700", "bg-blue-700"],
    },
  ]

  return (
    <div className="bg-fdf4ec">
      {/* Magazine header with issue number */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2">Issue 03 • Summer 2023</p>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">IN LIFE</h1>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest">Lifestyle & Products</p>
          </div>
        </div>
      </div>

      {/* Magazine-style tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <button
            className={`relative px-2 py-1 text-lg transition-colors ${
              activeTab === "beach"
                ? "font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => isMounted && setActiveTab("beach")}
          >
            Beach Life
          </button>
          <button
            className={`relative px-2 py-1 text-lg transition-colors ${
              activeTab === "city"
                ? "font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => isMounted && setActiveTab("city")}
          >
            City Style
          </button>
          <button
            className={`relative px-2 py-1 text-lg transition-colors ${
              activeTab === "mountains"
                ? "font-medium after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-black"
                : "text-gray-500 hover:text-black"
            }`}
            onClick={() => isMounted && setActiveTab("mountains")}
          >
            Mountain Escape
          </button>
        </div>
      </div>

      {/* Only render dynamic content after mount to prevent hydration errors */}
      {isMounted && (
        <React.Fragment>

      {/* Beach Life Content */}
      {activeTab === "beach" && (
        <div className="container mx-auto px-4">
          {/* Hero feature */}
          <div className="relative aspect-video mb-16">
            <Image src="/lifestyle/images/ocean-wave-1.png" alt="Beach lifestyle" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-12 text-white max-w-3xl">
                <p className="text-sm uppercase tracking-wider mb-4">Featured Story</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">The Art of Coastal Living</h2>
                <p className="text-lg md:text-xl mb-6">
                  Discover how the rhythm of the waves influences design, lifestyle, and our connection to nature.
                </p>
                <button className="px-6 py-2 bg-white text-black text-sm font-medium hover:bg-gray-100 transition">
                  Read Feature
                </button>
              </div>
            </div>
          </div>

          {/* Magazine article */}
          <MagazineArticle
            title="Morning Rituals: Sunrise Surf Sessions"
            excerpt="The early morning hours offer the most pristine surf conditions, with offshore winds creating glassy waves perfect for long rides. We explore the ritual of dawn patrol and how it sets the tone for a day lived in harmony with the ocean."
            image="/lifestyle/images/ocean-wave-2.png"
          >
            <Link
              href="/collections/boards/surf"
              className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
            >
              Explore Surfboards
            </Link>
          </MagazineArticle>

          {/* Product carousel */}
          <div className="my-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Beach Essentials</h2>
            <ProductCarousel products={beachProducts} />
          </div>

          {/* Pull quote */}
          <PullQuote
            quote="The ocean stirs the heart, inspires the imagination and brings eternal joy to the soul."
            author="Robert Wyland"
          />

          {/* Shop the look */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
            <div>
              <h3 className="text-2xl font-bold mb-6">The Perfect Beach Day</h3>
              <p className="mb-4">
                Our curated collection of beach essentials combines style, functionality, and sustainability. Each piece
                is designed to enhance your coastal experience while minimizing environmental impact.
              </p>
              <p className="mb-6">
                From UPF-protective apparel to biodegradable accessories, these products represent our commitment to
                ocean preservation and timeless design.
              </p>
              <Link
                href="/collections/life"
                className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
              >
                Shop Beach Collection
              </Link>
            </div>
            <ShopTheLook
              image="/products/beach-product.png"
              products={beachLookProducts}
            />
          </div>

          {/* Lifestyle section with parallax */}
          <LifestyleSection title="Beach Living, Day to Night" image="/products/surfboard-on-beach.png">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Sunrise className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Morning</h3>
                <p className="text-sm">
                  Begin your day with our lightweight beach robes and premium coffee accessories for the perfect sunrise
                  experience.
                </p>
                <Link href="/collections/self-care" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Morning Essentials
                </Link>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Sun className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Day</h3>
                <p className="text-sm">
                  Our UV-protective apparel and premium surfboards are designed for long days under the sun.
                </p>
                <Link href="/collections/apparel" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Daytime Collection
                </Link>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Sunset className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Evening</h3>
                <p className="text-sm">
                  Transition to evening with our coastal-inspired casual wear and beach-to-dinner accessories.
                </p>
                <Link href="/collections/life" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Evening Selection
                </Link>
              </div>
            </div>
          </LifestyleSection>

          {/* Editor's picks */}
          <div className="my-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gray-300 w-16"></div>
              <h2 className="text-xl font-bold px-4">EDITOR'S PICKS</h2>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative aspect-square mb-3 overflow-hidden">
                    <Image
                      src={`/products/beach-product.png`}
                      alt={`Editor's pick ${item}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium">Beach Essential {item}</h3>
                  <p className="text-sm">$99.00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* City Style Content */}
      {activeTab === "city" && (
        <div className="container mx-auto px-4">
          {/* Hero feature */}
          <div className="relative aspect-video mb-16">
            <Image src="/lifestyle/images/night-highway-1.png" alt="City lifestyle" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-12 text-white max-w-3xl">
                <p className="text-sm uppercase tracking-wider mb-4">Urban Living</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">The Pulse of City Life</h2>
                <p className="text-lg md:text-xl mb-6">
                  Navigate the concrete jungle with style, purpose, and a connection to urban rhythms.
                </p>
                <button className="px-6 py-2 bg-white text-black text-sm font-medium hover:bg-gray-100 transition">
                  Explore City Style
                </button>
              </div>
            </div>
          </div>

          {/* Magazine article */}
          <MagazineArticle
            title="Urban Movement: The Rise of City Skating"
            excerpt="Skateboarding has evolved from counterculture to mainstream urban transportation. We explore how modern city dwellers are embracing skateboards and longboards as sustainable, efficient ways to navigate urban environments while expressing personal style."
            image="/lifestyle/images/night-highway-2.png"
            reverse={true}
          >
            <Link
              href="/collections/boards/skate"
              className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
            >
              Shop Skateboards
            </Link>
          </MagazineArticle>

          {/* Product carousel */}
          <div className="my-16">
            <h2 className="text-2xl font-bold mb-8 text-center">City Essentials</h2>
            <ProductCarousel products={cityProducts} />
          </div>

          {/* Pull quote */}
          <PullQuote quote="The city is not a concrete jungle, it is a human zoo." author="Desmond Morris" />

          {/* Lifestyle section with parallax */}
          <LifestyleSection
            title="24 Hours in the City"
            image="/products/men-urban-style.png"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Coffee className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Morning</h3>
                <p className="text-sm">
                  Start your day with our commuter-friendly apparel and sustainable coffee accessories for the perfect
                  urban morning routine.
                </p>
                <Link href="/collections/self-care" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Morning Commute
                </Link>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Building className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Day</h3>
                <p className="text-sm">
                  Our versatile workwear and adaptable accessories are designed for busy days navigating the concrete
                  jungle.
                </p>
                <Link href="/collections/apparel" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Workday Essentials
                </Link>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Music className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Evening</h3>
                <p className="text-sm">
                  Transition to evening with our urban-inspired casual wear and day-to-night accessories perfect for
                  city adventures.
                </p>
                <Link href="/collections/life" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Night Out Collection
                </Link>
              </div>
            </div>
          </LifestyleSection>

          {/* Editor's picks */}
          <div className="my-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gray-300 w-16"></div>
              <h2 className="text-xl font-bold px-4">URBAN SELECTIONS</h2>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative aspect-square mb-3 overflow-hidden">
                    <Image
                      src={`/products/placeholder-ju3jl.png`}
                      alt={`Urban pick ${item}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium">City Essential {item}</h3>
                  <p className="text-sm">$129.00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mountain Escape Content */}
      {activeTab === "mountains" && (
        <div className="container mx-auto px-4">
          {/* Hero feature */}
          <div className="relative aspect-video mb-16">
            <Image
              src="/products/sustainable-fashion-collage.png"
              alt="Mountain lifestyle"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-12 text-white max-w-3xl">
                <p className="text-sm uppercase tracking-wider mb-4">Alpine Living</p>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">The Call of the Mountains</h2>
                <p className="text-lg md:text-xl mb-6">
                  Embrace the serenity and adventure of mountain living with gear designed for elevation.
                </p>
                <button className="px-6 py-2 bg-white text-black text-sm font-medium hover:bg-gray-100 transition">
                  Discover Mountain Gear
                </button>
              </div>
            </div>
          </div>

          {/* Magazine article */}
          <MagazineArticle
            title="Alpine Design: Form Meets Function"
            excerpt="In the mountains, gear isn't just about aesthetics—it's about survival and comfort in challenging conditions. We explore how our mountain collection balances technical performance with timeless design principles for products that excel at elevation."
            image="/products/men-urban-style.png"
          >
            <Link
              href="/collections/life"
              className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
            >
              Shop Mountain Collection
            </Link>
          </MagazineArticle>

          {/* Product carousel */}
          <div className="my-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Mountain Essentials</h2>
            <ProductCarousel products={mountainProducts} />
          </div>

          {/* Pull quote */}
          <PullQuote quote="The mountains are calling and I must go." author="John Muir" />

          {/* Lifestyle section with parallax */}
          <LifestyleSection
            title="Mountain Living Through the Seasons"
            image="/products/sustainable-fashion-collage.png"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Mountain className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Morning</h3>
                <p className="text-sm">
                  Begin your day with our insulated layers and outdoor cooking gear for the perfect alpine morning
                  experience.
                </p>
                <Link href="/collections/self-care" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Alpine Mornings
                </Link>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Compass className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Day</h3>
                <p className="text-sm">
                  Our technical apparel and adventure equipment are engineered for long days exploring rugged terrain.
                </p>
                <Link href="/collections/apparel" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Trail Essentials
                </Link>
              </div>

              <div className="bg-black/30 backdrop-blur-sm p-6 rounded-sm">
                <Tent className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Evening</h3>
                <p className="text-sm">
                  Wind down with our cozy mountain-inspired loungewear and fireside accessories for perfect evenings
                  under the stars.
                </p>
                <Link href="/collections/life" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Fireside Collection
                </Link>
              </div>
            </div>
          </LifestyleSection>

          {/* Editor's picks */}
          <div className="my-16">
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gray-300 w-16"></div>
              <h2 className="text-xl font-bold px-4">MOUNTAIN SELECTIONS</h2>
              <div className="h-px bg-gray-300 w-16"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="relative aspect-square mb-3 overflow-hidden">
                    <Image
                      src={`/products/mountain-product-text.png`}
                      alt={`Mountain pick ${item}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-sm font-medium">Mountain Essential {item}</h3>
                  <p className="text-sm">$149.00</p>
                </div>
              ))}
            </div>
          </div>

          {/* Box Model Integration */}
          <div className="my-16">
            <div className="flex items-center justify-center mb-8">
              <Package className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold px-4">CURATED BOXES FOR MOUNTAIN LIVING</h2>
              <Package className="w-6 h-6 text-blue-600 ml-2" />
            </div>
            
            <div className="bg-blue-50 p-8 rounded-xl mb-8">
              <p className="text-center text-gray-700 max-w-2xl mx-auto mb-6">
                Our Inland Empire boxes are designed around seasonal moments and lifestyle needs. 
                Perfect for mountain adventures, city exploration, and coastal living.
              </p>
              <div className="flex justify-center">
                <Link 
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Star className="w-5 h-5" />
                  Explore All Boxes
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {IE_BOXES.slice(0, 2).map((box) => (
                <BoxCard
                  key={box.id}
                  box={box}
                  onSubscribe={(boxId) => console.log('Subscribe:', boxId)}
                  onLearnMore={(boxId) => console.log('Learn more:', boxId)}
                  progress={0}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Magazine footer */}
      <div className="container mx-auto px-4 py-16 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About This Issue</h3>
            <p className="text-sm">
              Our "In Life" magazine explores the intersection of lifestyle and product design across different
              environments. Each issue celebrates the unique character of beach, city, and mountain living.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Next Issue Preview</h3>
            <p className="text-sm">
              Coming Fall 2023: "Transitions" - Exploring how our products adapt to changing seasons and environments.
              Subscribe to our newsletter to be notified when it's released.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-sm underline hover:no-underline">
                Instagram
              </a>
              <a href="#" className="text-sm underline hover:no-underline">
                Pinterest
              </a>
              <a href="#" className="text-sm underline hover:no-underline">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      </React.Fragment>)}
    </div>
  )
}
