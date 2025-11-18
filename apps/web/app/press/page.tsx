import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function PressPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="EC brand imagery"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Press & Media</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Resources and information for journalists, bloggers, and media professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Press Releases Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Press Releases</h2>
              <p className="mt-6 text-lg leading-8 text-primary">The latest news and announcements from EC.</p>
            </div>
            <div className="mt-16 space-y-8">
              {[
                {
                  title: "EC Launches Innovative Eco-Friendly Wetsuit Line",
                  date: "June 15, 2023",
                  excerpt:
                    "Revolutionary plant-based neoprene alternative offers superior performance with 80% lower carbon footprint.",
                  link: "#",
                },
                {
                  title: "EC Announces Partnership with Ocean Cleanup Foundation",
                  date: "April 22, 2023",
                  excerpt:
                    "Multi-year collaboration aims to remove 1 million pounds of plastic from the world's oceans by 2025.",
                  link: "#",
                },
                {
                  title: "EC Opens Flagship Store in Venice Beach",
                  date: "March 10, 2023",
                  excerpt:
                    "New retail location features innovative sustainable design and community space for events and workshops.",
                  link: "#",
                },
                {
                  title: "EC Achieves B Corp Certification",
                  date: "January 18, 2023",
                  excerpt:
                    "Certification recognizes EC's commitment to social and environmental performance, transparency, and accountability.",
                  link: "#",
                },
                {
                  title: "EC Introduces Circular Take-Back Program",
                  date: "November 5, 2022",
                  excerpt:
                    "New initiative allows customers to return worn EC products for repair, resale, or recycling.",
                  link: "#",
                },
              ].map((release) => (
                <div key={release.title} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm text-gray-500">
                      <time dateTime={release.date}>{release.date}</time>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-xl font-light text-primary">{release.title}</h3>
                      <p className="mt-3 text-primary">{release.excerpt}</p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={release.link}
                        className="text-sm font-medium text-primary hover:text-gray-500 border-b border-primary pb-1 hover:border-gray-500"
                      >
                        Read full release <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:text-gray-500 border-b border-primary pb-1 hover:border-gray-500"
              >
                View all press releases <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Media Coverage Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Media Coverage</h2>
            <p className="mt-6 text-lg leading-8 text-primary">Recent features and mentions of EC in the press.</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  outlet: "Surf Magazine",
                  title: "The Future of Sustainable Surfwear",
                  date: "July 2023",
                  image: "/placeholder.svg?height=300&width=400",
                  link: "#",
                },
                {
                  outlet: "Business Insider",
                  title: "How EC is Disrupting the Outdoor Apparel Industry",
                  date: "May 2023",
                  image: "/placeholder.svg?height=300&width=400",
                  link: "#",
                },
                {
                  outlet: "Vogue",
                  title: "Surf Style Meets Sustainability at EC",
                  date: "April 2023",
                  image: "/placeholder.svg?height=300&width=400",
                  link: "#",
                },
                {
                  outlet: "The Guardian",
                  title: "The Brands Leading the Charge in Ocean Conservation",
                  date: "March 2023",
                  image: "/placeholder.svg?height=300&width=400",
                  link: "#",
                },
                {
                  outlet: "Forbes",
                  title: "30 Under 30: EC Founders Reimagine Sustainable Business",
                  date: "February 2023",
                  image: "/placeholder.svg?height=300&width=400",
                  link: "#",
                },
                {
                  outlet: "Outside Magazine",
                  title: "Gear of the Year: EC's Eco-Friendly Wetsuit",
                  date: "January 2023",
                  image: "/placeholder.svg?height=300&width=400",
                  link: "#",
                },
              ].map((article) => (
                <div key={article.title} className="flex flex-col overflow-hidden rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between bg-gray-50 p-6">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">{article.outlet}</p>
                      <Link href={article.link} className="mt-2 block">
                        <p className="text-lg font-light text-primary">{article.title}</p>
                      </Link>
                    </div>
                    <div className="mt-6 flex items-center">
                      <div className="text-sm text-gray-500">
                        <time dateTime={article.date}>{article.date}</time>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Brand Assets Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Brand Assets</h2>
              <p className="mt-6 text-lg leading-8 text-primary">
                Download official EC logos, product images, and brand guidelines for media use.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
              <div>
                <h3 className="text-xl font-light text-primary">Logo Package</h3>
                <p className="mt-4 text-primary">
                  Our official logo in various formats and colorways for different applications.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <img
                    src="/placeholder.svg?height=100&width=200"
                    alt="EC Logo - Primary"
                    className="h-16 w-auto bg-white p-2 rounded"
                  />
                  <img
                    src="/placeholder.svg?height=100&width=200"
                    alt="EC Logo - White"
                    className="h-16 w-auto bg-gray-800 p-2 rounded"
                  />
                  <img
                    src="/placeholder.svg?height=100&width=200"
                    alt="EC Logo - Black"
                    className="h-16 w-auto bg-white p-2 rounded"
                  />
                </div>
                <div className="mt-6">
                  <Link
                    href="#"
                    className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                  >
                    Download Logo Package
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">Product Images</h3>
                <p className="mt-4 text-primary">High-resolution images of our latest products for editorial use.</p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <img src="/placeholder.svg?height=100&width=100" alt="Product Image 1" className="w-full rounded" />
                  <img src="/placeholder.svg?height=100&width=100" alt="Product Image 2" className="w-full rounded" />
                  <img src="/placeholder.svg?height=100&width=100" alt="Product Image 3" className="w-full rounded" />
                </div>
                <div className="mt-6">
                  <Link
                    href="#"
                    className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                  >
                    Download Product Images
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">Brand Guidelines</h3>
                <p className="mt-4 text-primary">
                  Comprehensive guide to our brand identity, including typography, color palette, and usage guidelines.
                </p>
                <div className="mt-6">
                  <Link
                    href="#"
                    className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                  >
                    Download Brand Guidelines
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">Lifestyle Photography</h3>
                <p className="mt-4 text-primary">Editorial images showcasing the EC lifestyle and brand ethos.</p>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <img src="/placeholder.svg?height=150&width=200" alt="Lifestyle Image 1" className="w-full rounded" />
                  <img src="/placeholder.svg?height=150&width=200" alt="Lifestyle Image 2" className="w-full rounded" />
                </div>
                <div className="mt-6">
                  <Link
                    href="#"
                    className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                  >
                    Download Lifestyle Images
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Inquiries Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Media Inquiries</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              For interview requests, additional information, or to be added to our press list, please contact our media
              relations team.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-light text-primary">Press Contact</h3>
                <p className="mt-2 text-primary">
                  Sarah Johnson
                  <br />
                  Director of Communications
                  <br />
                  press@ecstore.com
                  <br />
                  (310) 555-5678
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-primary">Interview Requests</h3>
                <p className="mt-2 text-primary">
                  For interview requests with EC founders or team members, please email us with your publication details
                  and specific request.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link
                href="#"
                className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
              >
                Contact Media Relations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
