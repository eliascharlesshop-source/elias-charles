"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlassmorphicButton } from "@/components/ui/glassmorphic-button"

interface CarouselSlide {
  image: string
  alt: string
  title: string
  subtitle: string
  description: string
  cta: string
  ctaLink: string
}

const slides: CarouselSlide[] = [
  {
    image: "/images/ocean-bw-1.jpg",
    alt: "Ocean waves in black and white",
    title: "Inland Empire",
    subtitle: "Spring 2026 Collection",
    description: "Premium curated boxes for the desert lifestyle.",
    cta: "Explore Collections",
    ctaLink: "/boxes?region=ie"
  },
  {
    image: "/images/ocean-bw-2.jpg",
    alt: "Ocean landscape",
    title: "Isla Vista",
    subtitle: "Coastal Living",
    description: "Island-inspired collections for the beach lifestyle.",
    cta: "Explore Collections",
    ctaLink: "/boxes?region=iv"
  },
  {
    image: "/images/lifestyle/palm-trees-street-1.jpg",
    alt: "Palm trees and street scene",
    title: "Shop the Store",
    subtitle: "Complete Collection",
    description: "Discover our full range of apparel, accessories, and lifestyle products.",
    cta: "Shop Now",
    ctaLink: "/collections"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative min-h-screen sm:h-screen lg:h-screen overflow-hidden flex flex-col">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-0">
        <div className="max-w-md text-center space-y-3 sm:space-y-4 md:space-y-6">
          <span className="inline-block text-xs tracking-widest uppercase text-white border-b pb-1">
            {slides[currentSlide].subtitle}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-widest uppercase text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
            {slides[currentSlide].title}
          </h1>
          <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg">
            {slides[currentSlide].description}
          </p>
          <div className="pt-2 sm:pt-4">
            <GlassmorphicButton href={slides[currentSlide].ctaLink}>
              {slides[currentSlide].cta}
            </GlassmorphicButton>
          </div>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 text-white hover:text-beach-lighter transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-3 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 text-white hover:text-beach-lighter transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
