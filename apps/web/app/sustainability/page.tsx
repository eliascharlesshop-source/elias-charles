import Layout from "@/components/layout/layout"

export default function SustainabilityPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Ocean conservation"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
              Our Commitment to Sustainability
            </h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Protecting the oceans and environments we love through responsible business practices and community
              action.
            </p>
          </div>
        </div>
      </div>

      {/* Our Approach Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Our Approach</h2>
            </div>
            <div className="mt-16 lg:flex lg:items-center lg:gap-x-12">
              <div className="lg:w-1/2">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="Beach cleanup"
                  className="w-full object-cover rounded-lg"
                />
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <p className="mt-6 text-lg text-primary">
                  At EC, sustainability isn't just a buzzword—it's a core value that guides every decision we make. As
                  surfers and outdoor enthusiasts, we have a deep connection to the natural world and a responsibility
                  to protect it for future generations.
                </p>
                <p className="mt-6 text-lg text-primary">
                  Our approach to sustainability is holistic, addressing environmental impact throughout our entire
                  business—from the materials we source and the products we create to our operations and community
                  initiatives.
                </p>
                <p className="mt-6 text-lg text-primary">
                  We believe that small actions add up to significant change, and we're committed to continuous
                  improvement in our sustainability journey. We're transparent about our progress, challenges, and goals
                  because we believe accountability drives meaningful action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Materials & Production Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Materials & Production</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              Creating high-quality products with minimal environmental impact.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Sustainable Materials</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    We prioritize organic, recycled, and renewable materials in our products. Our apparel line uses
                    organic cotton, recycled polyester from post-consumer plastic bottles, and plant-based alternatives
                    to traditional synthetics.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Ethical Manufacturing</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    We partner with factories that share our values and meet our strict standards for worker welfare,
                    fair wages, and safe working conditions. We regularly visit our manufacturing partners and maintain
                    transparent relationships.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Reduced Waste</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    We're committed to minimizing waste throughout our production process. This includes pattern
                    optimization to reduce fabric waste, upcycling scraps into new products, and implementing a
                    zero-waste policy in our facilities.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Environmental Initiatives Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Environmental Initiatives</h2>
              <p className="mt-6 text-lg leading-8 text-primary">
                Taking action to protect and restore the natural environments we love.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
              <div>
                <h3 className="text-xl font-light text-primary">Ocean Conservation</h3>
                <p className="mt-4 text-primary">
                  We partner with leading ocean conservation organizations to protect marine ecosystems. Our initiatives
                  include funding research, supporting marine protected areas, and advocating for policies that reduce
                  ocean pollution.
                </p>
                <p className="mt-4 text-primary">
                  Through our "1% for the Ocean" program, we donate 1% of annual sales to organizations working to
                  protect and restore ocean health around the world.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">Beach Clean-Ups</h3>
                <p className="mt-4 text-primary">
                  We organize regular beach clean-ups in coastal communities where we operate. These events bring
                  together our team, customers, and local residents to remove trash and debris from beaches and
                  waterways.
                </p>
                <p className="mt-4 text-primary">
                  To date, our clean-up initiatives have removed over 50,000 pounds of trash from beaches worldwide,
                  preventing it from entering the ocean and harming marine life.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">Carbon Footprint Reduction</h3>
                <p className="mt-4 text-primary">
                  We're committed to reducing our carbon footprint across all operations. This includes transitioning to
                  renewable energy in our facilities, optimizing shipping routes, and offsetting emissions we can't yet
                  eliminate.
                </p>
                <p className="mt-4 text-primary">
                  Our goal is to achieve carbon neutrality by 2025 and work toward becoming carbon negative by 2030.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">Education & Awareness</h3>
                <p className="mt-4 text-primary">
                  We believe education is key to creating lasting change. Through our blog, social media, and community
                  events, we share information about environmental issues and practical steps individuals can take to
                  reduce their impact.
                </p>
                <p className="mt-4 text-primary">
                  Our "Ocean Ambassadors" program supports athletes and influencers who use their platforms to raise
                  awareness about ocean conservation and sustainable living.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals & Progress Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Our Goals & Progress</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              Tracking our sustainability journey with transparent metrics and ambitious targets.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="space-y-16">
              <div>
                <h3 className="text-xl font-light text-primary">2023 Achievements</h3>
                <ul className="mt-4 space-y-4 text-primary">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Increased use of recycled materials to 65% across all product lines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Reduced packaging waste by 40% through redesigned, plastic-free packaging</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Transitioned headquarters to 100% renewable energy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Organized 25 beach clean-ups across 10 countries, removing 15,000 pounds of trash</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Launched repair program to extend product lifespan</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">2025 Goals</h3>
                <ul className="mt-4 space-y-4 text-primary">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Achieve 80% use of recycled, organic, or renewable materials across all products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Eliminate single-use plastics from our entire supply chain</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Reduce water usage in manufacturing by 30%</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Achieve carbon neutrality across all operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Implement take-back program for all product categories</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-light text-primary">2030 Vision</h3>
                <ul className="mt-4 space-y-4 text-primary">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Transition to 100% circular business model</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Achieve carbon negative status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Restore more ocean habitat than our business impacts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Lead industry-wide transformation in sustainable practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Get Involved Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Get Involved</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              Join us in our mission to protect the planet. Here's how you can make a difference:
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Join Our Clean-Ups</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Participate in our beach clean-up events around the world. Check our events calendar for upcoming
                    dates and locations.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Shop Consciously</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Support brands that prioritize sustainability. Look for our eco-collection, featuring products made
                    with the highest environmental standards.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Spread the Word</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Share our sustainability initiatives with your community. Follow us on social media and help amplify
                    our message.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  )
}
