import { SectionTitle, BodyText } from "./components/typography"
import { ProductCard } from "./components/product-card"
import { WaveAnimation } from "./components/wave-animation"

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-8 lg:w-full lg:max-w-2xl">
            <div className="relative px-4 sm:px-6 py-16 sm:py-24 lg:px-8 lg:py-32 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <div className="inline-block mb-4">
                  <span className="inline-flex items-center rounded-full bg-beach px-3 py-0.5 text-sm font-medium text-white">
                    New Collection
                  </span>
                </div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-normal tracking-widest uppercase text-primary leading-tight">
                  Spring Collection <span className="text-beach-darker">2023</span>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-primary max-w-[90%] lg:max-w-full">
                  If life gives you a break, ride it. Discover our latest collection of surf and skate apparel, designed
                  for those who live for the waves and streets.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-x-6">
                  <a href="/collections" className="beach-btn w-full sm:w-auto text-center text-sm font-medium">
                    <span className="relative z-10">Explore Collections</span>
                  </a>
                  <a
                    href="#"
                    className="cta-link text-primary hover:text-beach-darker hover:border-beach-darker mt-2 sm:mt-0"
                  >
                    Shop Now <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
          <img
            className="h-full w-full object-cover object-center"
            src="/placeholder.svg?height=800&width=1200"
            alt="Model wearing latest collection"
          />
        </div>
      </div>

      {/* Wave animation */}
      <div className="relative h-24 overflow-hidden bg-cream">
        <WaveAnimation height={100} color="#d0e1f2" />
      </div>

      {/* Featured categories */}
      <div className="bg-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <SectionTitle>
                Shop by <span className="text-beach-darker">Category</span>
              </SectionTitle>
            </div>
            <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 lg:gap-x-8">
              {[
                {
                  name: "Clothing",
                  href: "/collections/apparel",
                  imageSrc: "/placeholder.svg?height=600&width=400",
                },
                {
                  name: "Surf",
                  href: "/collections/boards/surf",
                  imageSrc: "/placeholder.svg?height=600&width=400",
                },
                {
                  name: "Skate",
                  href: "/collections/boards/skate",
                  imageSrc: "/placeholder.svg?height=600&width=400",
                },
              ].map((category) => (
                <div key={category.name} className="beach-card group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 rounded-sm">
                    <img
                      src={category.imageSrc || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-beach-darker/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="mt-4 sm:mt-6 text-base sm:text-lg text-primary text-center sm:text-left">
                    <a href={category.href} className="beach-link">
                      <span className="absolute inset-0" />
                      {category.name}
                    </a>
                  </h3>
                </div>
              ))}
            </div>
            <div className="mt-10 sm:mt-12 text-center">
              <a href="/collections" className="beach-btn inline-block text-sm font-normal tracking-wider uppercase">
                <span className="relative z-10">View All Collections</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Wave animation */}
      <div className="relative h-24 overflow-hidden bg-white">
        <WaveAnimation height={100} color="#d0e1f2" />
      </div>

      {/* Featured products */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex items-center justify-between">
              <SectionTitle>
                Featured <span className="text-beach-darker">Products</span>
              </SectionTitle>
              <a
                href="/collections"
                className="hidden text-sm font-semibold leading-6 text-beach-darker sm:block beach-link"
              >
                View all <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="mt-10 sm:mt-16 grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 lg:gap-x-8">
              {[
                {
                  id: 1,
                  name: "Relaxed Fit T-Shirt",
                  href: "/products/1",
                  price: "$35",
                  imageSrc: "/placeholder.svg?height=400&width=300",
                  imageAlt: "Relaxed Fit T-Shirt",
                },
                {
                  id: 2,
                  name: "Surf Board Shorts",
                  href: "/products/2",
                  price: "$65",
                  imageSrc: "/placeholder.svg?height=400&width=300",
                  imageAlt: "Surf Board Shorts",
                },
                {
                  id: 3,
                  name: "Classic Skate Deck",
                  href: "/products/3",
                  price: "$120",
                  imageSrc: "/placeholder.svg?height=400&width=300",
                  imageAlt: "Classic Skate Deck",
                },
                {
                  id: 4,
                  name: "Lightweight Hoodie",
                  href: "/products/4",
                  price: "$85",
                  imageSrc: "/placeholder.svg?height=400&width=300",
                  imageAlt: "Lightweight Hoodie",
                },
              ].map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <a href="/collections" className="text-sm font-semibold leading-6 text-beach-darker beach-link">
                View all <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lifestyle section */}
      <div className="relative bg-beach/10">
        <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
          <img
            className="h-full w-full object-cover"
            src="/placeholder.svg?height=600&width=800"
            alt="Lifestyle image"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-beach-darker/30 to-transparent"></div>
        </div>
        <div className="relative mx-auto max-w-7xl py-16 sm:py-24 lg:px-8 lg:py-32">
          <div className="pl-4 pr-4 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pl-24 lg:pr-0 xl:pl-32">
            <SectionTitle>
              The EC <span className="text-beach-darker">Lifestyle</span>
            </SectionTitle>
            <BodyText className="mt-4 sm:mt-6">
              More than just clothing and gear, EC represents a lifestyle. Our products are designed for those who
              embrace the ocean, the streets, and everything in between.
            </BodyText>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-x-6">
              <a
                href="/collections"
                className="cta-link text-primary hover:text-beach-darker hover:border-beach-darker"
              >
                Shop Collections <span aria-hidden="true">→</span>
              </a>
              <a
                href="/in-life"
                className="cta-link text-primary hover:text-beach-darker hover:border-beach-darker mt-4 sm:mt-0"
              >
                Explore our story <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="bg-cream py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-beach px-6 py-12 sm:py-16 sm:rounded-3xl sm:px-12 md:px-16 lg:flex lg:gap-x-20 lg:px-24 lg:py-20">
            <div className="absolute inset-0 -z-10 opacity-30">
              <svg
                className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-white/10 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                    width={200}
                    height={200}
                    x="50%"
                    y={-1}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M100 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <svg x="50%" y={-1} className="overflow-visible fill-white/5">
                  <path
                    d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                    strokeWidth={0}
                  />
                </svg>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
              </svg>
            </div>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-16 lg:text-left">
              <SectionTitle className="text-white">
                Join our <span className="text-white">community</span>
              </SectionTitle>
              <BodyText className="mt-4 sm:mt-6 text-white">
                Sign up for our newsletter to receive updates on new products, exclusive offers, and community events.
              </BodyText>
              <div className="mt-8 sm:mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <form className="flex w-full max-w-md flex-col sm:flex-row gap-4">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="min-w-0 flex-auto rounded-md border-0 bg-white px-3.5 py-2 text-primary shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
                    placeholder="Enter your email"
                  />
                  <button
                    type="submit"
                    className="flex-none rounded-md bg-white text-beach-darker px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
