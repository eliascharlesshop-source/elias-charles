"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductHotspot } from "./product-hotspot"

interface ProductImage {
  src: string
  alt: string
  hotspots?: Array<{
    id: number
    x: number
    y: number
    product: {
      id: string
      title: string
      price: string
      description: string
      image: string
    }
  }>
}

interface ProductImageGalleryProps {
  images: ProductImage[]
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)

  const nextImage = () => {
    setActiveHotspot(null)
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setActiveHotspot(null)
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const toggleHotspot = (hotspotId: number) => {
    if (activeHotspot === hotspotId) {
      setActiveHotspot(null)
    } else {
      setActiveHotspot(hotspotId)
    }
  }

  const currentImage = images[currentImageIndex]
  const hotspots = currentImage.hotspots || []

  return (
    <div className="relative">
      <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg">
        <img
          src={currentImage.src || "/placeholder.svg"}
          alt={currentImage.alt}
          className="h-full w-full object-cover object-center"
        />

        {/* Hotspots */}
        {hotspots.map((hotspot) => (
          <ProductHotspot
            key={hotspot.id}
            id={hotspot.id}
            x={hotspot.x}
            y={hotspot.y}
            product={hotspot.product}
            isActive={activeHotspot === hotspot.id}
            onToggle={toggleHotspot}
          />
        ))}

        {/* Image navigation */}
        <button
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 sm:p-2 hover:bg-white"
          onClick={prevImage}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </button>
        <button
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 sm:p-2 hover:bg-white"
          onClick={nextImage}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </button>

        {/* Image indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                index === currentImageIndex ? "bg-primary" : "bg-white/60"
              }`}
              onClick={() => {
                setActiveHotspot(null)
                setCurrentImageIndex(index)
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Hotspot instruction */}
        {hotspots.length > 0 && !activeHotspot && (
          <div className="absolute bottom-4 left-4 bg-white/80 rounded-lg px-2 py-1 sm:px-3 sm:py-1 text-xs text-primary">
            Click + to explore featured items
          </div>
        )}
      </div>

      {/* Thumbnail navigation */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-h-1 aspect-w-1 overflow-hidden rounded-md ${
              index === currentImageIndex ? "ring-2 ring-primary" : "opacity-70"
            }`}
            onClick={() => {
              setActiveHotspot(null)
              setCurrentImageIndex(index)
            }}
            aria-label={`Thumbnail ${index + 1}`}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
