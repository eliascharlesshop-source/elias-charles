"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Sunrise, Sun, Sunset, Coffee, Building, Music, Mountain, Compass, Tent, Star } from "lucide-react"
import Layout from "@/components/layout/layout"

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
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.2"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1])
  const y = useTransform(scrollYProgress, [0, 1], [40, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center my-16 ${reverse ? "md:grid-flow-col-dense" : ""}`}
    >
      <div className={reverse ? "md:col-start-2" : ""}>
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold mb-4 tracking-tight"
        >
          {title}
        </motion.h3>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="prose prose-sm max-w-none mb-6"
        >
          <p>{excerpt}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>

      <motion.div 
        className="relative aspect-[4/5] overflow-hidden rounded-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Image placeholder - add real image when available */}
        <div className="w-full h-full bg-gray-200" />
      </motion.div>
    </motion.div>
  )
}

// Lifestyle section component
const LifestyleSection = ({ title, image, children }) => {
  return (
    <div className="relative my-24 overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 py-24 px-6 md:px-12 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">{title}</h2>
        {children}
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
      <p className="relative text-xl md:text-2xl font-medium italic">Give Life A Break.</p>
      <footer className="mt-4">
        <p className="text-base font-semibold">— Elias Charles</p>
      </footer>
    </blockquote>
  )
}

export default function InLifePage() {
  const [activeTab, setActiveTab] = useState("beach")

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">In Life</h1>
            <p className="text-lg text-gray-600">Stories from the EC Community</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 sticky top-0 bg-white z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("beach")}
                className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "beach"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Beach Living
              </button>
              <button
                onClick={() => setActiveTab("city")}
                className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "city"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                City Style
              </button>
              <button
                onClick={() => setActiveTab("mountain")}
                className={`py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "mountain"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Mountain Living
              </button>
            </div>
          </div>
        </div>

        {/* Beach Content */}
        {activeTab === "beach" && (
          <div className="container mx-auto px-4">
            {/* Beach content here */}
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



          {/* Pull quote */}
          <PullQuote quote="The city is not a concrete jungle, it is a human zoo." author="Desmond Morris" />

          {/* Lifestyle section with parallax */}
          <LifestyleSection
            title="24 Hours in the City"
            image="/products/men-urban-style.png"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <motion.div 
                className="bg-black/30 backdrop-blur-sm p-6 rounded-sm hover:bg-black/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <Coffee className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Morning</h3>
                <p className="text-sm">
                  Start your day with our commuter-friendly apparel and sustainable coffee accessories for the perfect
                  urban morning routine.
                </p>
                <Link href="/collections/self-care" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Morning Commute
                </Link>
              </motion.div>

              <motion.div 
                className="bg-black/30 backdrop-blur-sm p-6 rounded-sm hover:bg-black/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Building className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Day</h3>
                <p className="text-sm">
                  Our versatile workwear and adaptable accessories are designed for busy days navigating the concrete
                  jungle.
                </p>
                <Link href="/collections/apparel" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Workday Essentials
                </Link>
              </motion.div>

              <motion.div 
                className="bg-black/30 backdrop-blur-sm p-6 rounded-sm hover:bg-black/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <Music className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Evening</h3>
                <p className="text-sm">
                  Transition to evening with our urban-inspired casual wear and day-to-night accessories perfect for
                  city adventures.
                </p>
                <Link href="/collections/life" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Night Out Collection
                </Link>
              </motion.div>
            </div>
          </LifestyleSection>

          {/* Urban editorial feature */}
          <motion.div 
            className="my-24 p-8 md:p-12 border-l-4 border-black bg-gray-50 rounded-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <Package className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-2">Urban Dispatch</p>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">The Future of Sustainable City Living</h3>
                <p className="text-lg mb-6">
                  As cities evolve, so do the demands we place on our wardrobes and gear. Discover how EC is pioneering sustainable urban fashion for the next generation of city dwellers.
                </p>
                <Link
                  href="/collections/boards/skate"
                  className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
                >
                  Explore Urban Collection
                </Link>
              </div>
            </div>
          </motion.div>
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



          {/* Pull quote */}
          <PullQuote quote="The mountains are calling and I must go." author="John Muir" />

          {/* Lifestyle section with parallax */}
          <LifestyleSection
            title="Mountain Living Through the Seasons"
            image="/products/sustainable-fashion-collage.png"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <motion.div 
                className="bg-black/30 backdrop-blur-sm p-6 rounded-sm hover:bg-black/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <Mountain className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Morning</h3>
                <p className="text-sm">
                  Begin your day with our insulated layers and outdoor cooking gear for the perfect alpine morning
                  experience.
                </p>
                <Link href="/collections/self-care" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Alpine Mornings
                </Link>
              </motion.div>

              <motion.div 
                className="bg-black/30 backdrop-blur-sm p-6 rounded-sm hover:bg-black/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Compass className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Day</h3>
                <p className="text-sm">
                  Our technical apparel and adventure equipment are engineered for long days exploring rugged terrain.
                </p>
                <Link href="/collections/apparel" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Trail Essentials
                </Link>
              </motion.div>

              <motion.div 
                className="bg-black/30 backdrop-blur-sm p-6 rounded-sm hover:bg-black/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <Tent className="w-8 h-8 mb-6 text-white" />
                <h3 className="text-xl font-bold mb-2">Evening</h3>
                <p className="text-sm">
                  Wind down with our cozy mountain-inspired loungewear and fireside accessories for perfect evenings
                  under the stars.
                </p>
                <Link href="/collections/life" className="text-sm mt-4 inline-block underline hover:no-underline">
                  Fireside Collection
                </Link>
              </motion.div>
            </div>
          </LifestyleSection>

          {/* Alpine editorial feature */}
          <motion.div 
            className="my-24 p-8 md:p-12 border-l-4 border-black bg-gray-50 rounded-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-4 mb-4">
              <Compass className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-2">Alpine Chronicle</p>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Designing for Elevation: The Mountain Philosophy</h3>
                <p className="text-lg mb-6">
                  High altitude demands uncompromising performance. Learn how our design team engineers every product with the mountains in mind, merging technical innovation with timeless style.
                </p>
                <Link
                  href="/collections/life"
                  className="inline-block px-6 py-2 bg-black text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition"
                >
                  Read the Full Story
                </Link>
              </div>
            </div>
          </motion.div>

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
    </div>
  )
}
