import type { ReactNode } from "react"

interface EditorialProductFeatureProps {
  title: string
  content: string | ReactNode
  image: string
  imagePosition?: "left" | "right"
  backgroundColor?: string
}

export function EditorialProductFeature({
  title,
  content,
  image,
  imagePosition = "right",
  backgroundColor = "bg-white",
}: EditorialProductFeatureProps) {
  return (
    <div className={`${backgroundColor} py-16 sm:py-24`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center ${
            imagePosition === "left" ? "lg:grid-flow-col-dense" : ""
          }`}
        >
          {imagePosition === "left" && (
            <div className="aspect-h-4 aspect-w-3 lg:aspect-h-3 lg:aspect-w-4 overflow-hidden">
              <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover object-center" />
            </div>
          )}

          <div className={imagePosition === "left" ? "lg:col-start-2" : ""}>
            <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
            <div className="mt-6 max-w-xl">
              {typeof content === "string" ? <p className="text-lg">{content}</p> : content}
            </div>
          </div>

          {imagePosition === "right" && (
            <div className="aspect-h-4 aspect-w-3 lg:aspect-h-3 lg:aspect-w-4 overflow-hidden">
              <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover object-center" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
