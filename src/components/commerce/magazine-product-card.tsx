"use client"

import Link from "next/link"

interface ProductCardProps {
  id: string | number
  title: string
  price: string
  image: string
  aspectRatio?: "square" | "portrait" | "landscape"
  featured?: boolean
  tagline?: string
}

export function MagazineProductCard({
  id,
  title,
  price,
  image,
  aspectRatio = "square",
  featured = false,
  tagline,
}: ProductCardProps) {
  const aspectClasses = {
    square: "aspect-h-1 aspect-w-1",
    portrait: "aspect-h-4 aspect-w-3",
    landscape: "aspect-h-2 aspect-w-3",
  }

  return (
    <div className={`group relative ${featured ? "col-span-2 row-span-2" : ""}`}>
      <div className={`${aspectClasses[aspectRatio]} w-full overflow-hidden rounded-sm bg-gray-100`}>
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
        />
        {tagline && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 p-1.5 sm:p-2 md:p-3">
            <p className="text-[10px] xs:text-xs sm:text-sm font-light italic text-primary">{tagline}</p>
          </div>
        )}
      </div>
      <div className="mt-2 xs:mt-3 sm:mt-4">
        <h3 className="text-[10px] xs:text-xs sm:text-sm font-normal tracking-wider text-primary group-hover:underline">
          <Link href={`/products/${id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {title}
          </Link>
        </h3>
        <p className="mt-0.5 xs:mt-1 text-[10px] xs:text-xs sm:text-sm font-normal text-primary">{price}</p>
      </div>
    </div>
  )
}

export default MagazineProductCard
