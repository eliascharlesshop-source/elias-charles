import { MagazineProductCard } from "./magazine-product-card"

export function MagazineFeaturedProducts() {
  // Sample featured products
  const featuredProducts = [
    {
      id: "featured-1",
      title: "Summer Collection Highlight: Organic Cotton Tee",
      price: "$45",
      image: "/placeholder.svg?height=800&width=600",
      aspectRatio: "portrait",
      featured: true,
      tagline: "If life gives you a break, ride it",
    },
    {
      id: "featured-2",
      title: "Handcrafted Surf Pendant",
      price: "$28",
      image: "/placeholder.svg?height=400&width=400",
      aspectRatio: "square",
      tagline: "Sustainable materials, timeless design",
    },
    {
      id: "featured-3",
      title: "Classic Board Shorts",
      price: "$65",
      image: "/placeholder.svg?height=400&width=600",
      aspectRatio: "landscape",
      tagline: "Perfect for waves or wandering",
    },
    {
      id: "featured-4",
      title: "Lightweight Beach Hoodie",
      price: "$85",
      image: "/placeholder.svg?height=400&width=400",
      aspectRatio: "square",
      tagline: "For cool evenings by the shore",
    },
  ]

  return (
    <div className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-light tracking-tight text-primary">The Edit</h2>
          <a href="/collections" className="text-sm font-semibold leading-6 text-primary hover:text-gray-600">
            View all collections <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <MagazineProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              aspectRatio={product.aspectRatio as any}
              featured={product.featured}
              tagline={product.tagline}
            />
          ))}
        </div>

        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-2">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Magazine editorial"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-light text-primary">The Art of Sustainable Surfwear</h3>
              <p className="mt-4 text-base text-primary">
                Our latest collection represents our commitment to sustainable fashion that doesn't compromise on style
                or performance. Each piece is crafted with attention to environmental impact, using organic cotton and
                eco-friendly dyes.
              </p>
              <div className="mt-6">
                <a
                  href="/in-life"
                  className="text-sm font-semibold leading-6 text-primary border-b border-primary pb-1 hover:border-gray-500 hover:text-gray-500"
                >
                  Read the story <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
