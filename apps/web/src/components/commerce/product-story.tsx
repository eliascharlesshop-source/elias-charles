interface ProductStoryProps {
  story: string
}

export function ProductStory({ story }: ProductStoryProps) {
  return (
    <div className="bg-cream py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-primary text-center">The Story</h2>
          <div className="mt-4 sm:mt-6 border-l-2 sm:border-l-4 border-primary pl-4 sm:pl-6 italic text-base sm:text-lg text-primary">
            {story}
          </div>
        </div>
      </div>
    </div>
  )
}
