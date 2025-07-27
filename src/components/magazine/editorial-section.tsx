interface EditorialSectionProps {
  title: string
  content: string
  image: string
}

export function EditorialSection({ title, content, image }: EditorialSectionProps) {
  return (
    <div className="bg-white py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-primary">{title}</h2>
          <div className="mt-6 sm:mt-8 md:mt-12 aspect-h-9 aspect-w-16 overflow-hidden rounded-lg">
            <img
              src={image || "/placeholder.svg"}
              alt="Editorial image"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <p className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-lg leading-7 sm:leading-8 text-primary">{content}</p>
        </div>
      </div>
    </div>
  )
}
