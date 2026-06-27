"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
    <section className="relative h-screen overflow-hidden">
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
      <div className="absolute inset-0 flex flex-col justify-center items-center px-6 sm:px-12 lg:px-24">
        <div className="max-w-md text-center">
          <span className="inline-block mb-4 text-xs tracking-widest uppercase text-white border-b pb-1">
            {slides[currentSlide].subtitle}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-widest uppercase text-white mb-6">
            {slides[currentSlide].title}
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg mb-8">
            {slides[currentSlide].description}
          </p>
          <Link
            href={slides[currentSlide].ctaLink}
            className="inline-block bg-white text-beach-darker px-6 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-100 transition-colors text-center"
          >
            {slides[currentSlide].cta}
          </Link>
        </div>
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 sm:left-12 lg:left-24 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-beach-lighter transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-6 sm:right-12 lg:right-24 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-beach-lighter transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-2">
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
