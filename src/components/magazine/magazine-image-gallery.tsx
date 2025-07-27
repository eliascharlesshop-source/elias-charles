"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MagazineImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
}

export function MagazineImageGallery({ images }: MagazineImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  return (
    <div className="relative my-12 sm:my-16">
      <div className="aspect-h-9 aspect-w-16 overflow-hidden">
        <img
          src={images[currentIndex].src || "/placeholder.svg"}
          alt={images[currentIndex].alt}
          className="h-full w-full object-cover object-center"
        />
      </div>

      {images[currentIndex].caption && (
        <p className="mt-2 text-sm text-gray-500 italic">{images[currentIndex].caption}</p>
      )}

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-primary" />
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-primary" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-white/60"}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
