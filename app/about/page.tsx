import Layout from "../components/layout"

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img src="/placeholder.svg?height=800&width=1600" alt="Ocean view" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">About EC</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              If life gives you a break, ride it. Our story of passion, purpose, and the pursuit of perfect waves.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Our Story</h2>
            </div>
            <div className="mt-16 lg:flex lg:items-center lg:gap-x-12">
              <div className="lg:w-1/2">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Founders on the beach"
                  className="w-full object-cover rounded-lg"
                />
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <p className="mt-6 text-lg text-primary">
                  EC was born in 2010 on the sun-drenched shores of California, founded by lifelong friends and surf
                  enthusiasts Alex Chen and Maya Rodriguez. What began as a small operation crafting custom surfboards
                  quickly evolved into a lifestyle brand that celebrates the harmony between humans and the ocean.
                </p>
                <p className="mt-6 text-lg text-primary">
                  Our philosophy is simple: don't react, wait for the pullback. This mantra guides not only how we
                  approach waves but how we approach life and business. We believe in patience, sustainability, and
                  creating products that stand the test of time.
                </p>
                <p className="mt-6 text-lg text-primary">
                  Today, EC has grown into a global community of surfers, skaters, and free spirits who share our
                  passion for the ocean, quality craftsmanship, and responsible living. While we've expanded beyond our
                  original surfboard workshop, our commitment to quality, community, and the environment remains
                  unwavering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              The principles that guide everything we do, from product design to community engagement.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Quality Craftsmanship</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    We believe in creating products that are built to last. Every item we make is crafted with attention
                    to detail, using premium materials and techniques that honor traditional craftsmanship while
                    embracing innovation.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Environmental Stewardship</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    The ocean is our playground and our responsibility. We are committed to sustainable practices
                    throughout our supply chain, from using recycled and organic materials to reducing waste and our
                    carbon footprint.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Community Connection</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    We believe in the power of community to create positive change. We support local surf and skate
                    communities, beach clean-ups, and educational initiatives that foster a deeper connection to the
                    ocean.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Our Team</h2>
              <p className="mt-6 text-lg leading-8 text-primary">
                Meet the passionate individuals behind EC who bring our vision to life every day.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "Alex Chen",
                  role: "Co-Founder & CEO",
                  imageUrl: "/placeholder.svg?height=400&width=400",
                  bio: "Lifelong surfer with a background in sustainable business practices.",
                },
                {
                  name: "Maya Rodriguez",
                  role: "Co-Founder & Creative Director",
                  imageUrl: "/placeholder.svg?height=400&width=400",
                  bio: "Former professional surfer and designer with a passion for functional aesthetics.",
                },
                {
                  name: "Kai Johnson",
                  role: "Head of Product Development",
                  imageUrl: "/placeholder.svg?height=400&width=400",
                  bio: "Master craftsman with over 15 years of experience shaping boards.",
                },
                {
                  name: "Olivia Park",
                  role: "Sustainability Officer",
                  imageUrl: "/placeholder.svg?height=400&width=400",
                  bio: "Environmental scientist dedicated to reducing our ecological footprint.",
                },
                {
                  name: "Liam Wilson",
                  role: "Community Manager",
                  imageUrl: "/placeholder.svg?height=400&width=400",
                  bio: "Former competitive skater who now builds bridges between communities.",
                },
                {
                  name: "Sofia Reyes",
                  role: "Head of Marketing",
                  imageUrl: "/placeholder.svg?height=400&width=400",
                  bio: "Storyteller who captures the essence of the EC lifestyle.",
                },
              ].map((person) => (
                <div key={person.name} className="text-center">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                    <img
                      className="h-full w-full object-cover object-center"
                      src={person.imageUrl || "/placeholder.svg"}
                      alt={person.name}
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-light leading-8 tracking-tight text-primary">{person.name}</h3>
                  <p className="text-base leading-7 text-gray-600">{person.role}</p>
                  <p className="mt-4 text-sm leading-6 text-primary">{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Get in Touch</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              Have questions about our story, products, or mission? We'd love to hear from you.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-light text-primary">Visit Our Flagship Store</h3>
                <p className="mt-2 text-primary">
                  123 Ocean Avenue
                  <br />
                  Venice Beach, CA 90291
                  <br />
                  United States
                </p>
                <p className="mt-4 text-primary">
                  Monday-Saturday: 10am-7pm
                  <br />
                  Sunday: 11am-5pm
                </p>
              </div>
              <div>
                <h3 className="text-lg font-light text-primary">Contact Information</h3>
                <p className="mt-2 text-primary">
                  Email: hello@ecstore.com
                  <br />
                  Phone: (310) 555-1234
                </p>
                <p className="mt-4 text-primary">
                  For press inquiries:
                  <br />
                  press@ecstore.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
