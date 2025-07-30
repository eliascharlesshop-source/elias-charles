import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function CareersPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
                    <img
            src="/images/hero/streetlights-night-1.jpg"
            alt="Beach and ocean view"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Join Our Team</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Build a career with purpose at EC. We're always looking for passionate individuals who share our values.
            </p>
          </div>
        </div>
      </div>

      {/* Why Work With Us Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Why Work With Us</h2>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
              <div>
                <h3 className="text-xl font-light text-primary">Our Culture</h3>
                <p className="mt-6 text-lg text-primary">
                  At EC, we've built a culture that values creativity, authenticity, and balance. We believe that the
                  best work happens when people feel inspired, supported, and connected to a purpose larger than
                  themselves.
                </p>
                <p className="mt-6 text-lg text-primary">
                  Our team is a diverse group of individuals united by a shared passion for the ocean, outdoor
                  lifestyle, and creating products that make a positive impact. We celebrate different perspectives and
                  believe that inclusion drives innovation.
                </p>
              </div>
              <div>
                                <img
                  src="/images/lifestyle/palm-trees-sky-2.jpg"
                  alt="Office environment"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Benefits & Perks</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              We take care of our team so they can focus on what matters most.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Work-Life Balance</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Flexible work arrangements, generous PTO, and surf breaks when the waves are good. We believe in
                    working hard and living well.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Health & Wellness</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Comprehensive health insurance, mental health resources, wellness stipends, and on-site fitness
                    classes to keep you feeling your best.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Growth & Development</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Professional development opportunities, mentorship programs, and a learning stipend to help you grow
                    your skills and advance your career.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Employee Discounts</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Generous discounts on all EC products, as well as special pricing with our partner brands and
                    retailers.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Sustainability Initiatives</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Paid time off for volunteer work, matching donations to environmental nonprofits, and company-wide
                    beach clean-up days.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-xl font-light leading-7 text-primary">Community Events</dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary">
                  <p className="flex-auto">
                    Regular team outings, surf trips, community events, and celebrations that strengthen our bonds and
                    keep us connected to our mission.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Open Positions</h2>
              <p className="mt-6 text-lg leading-8 text-primary">
                Join our team and help shape the future of EC. We're currently hiring for the following roles:
              </p>
            </div>
            <div className="mt-16 space-y-8">
              {[
                {
                  title: "Senior Product Designer",
                  department: "Design",
                  location: "Venice Beach, CA (Hybrid)",
                  type: "Full-time",
                },
                {
                  title: "E-Commerce Manager",
                  department: "Marketing",
                  location: "Venice Beach, CA (Hybrid)",
                  type: "Full-time",
                },
                {
                  title: "Sustainability Coordinator",
                  department: "Operations",
                  location: "Venice Beach, CA (On-site)",
                  type: "Full-time",
                },
                {
                  title: "Content Creator",
                  department: "Marketing",
                  location: "Remote",
                  type: "Contract",
                },
                {
                  title: "Retail Associate",
                  department: "Retail",
                  location: "Multiple Locations",
                  type: "Part-time",
                },
              ].map((job) => (
                <div key={job.title} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-light text-primary">{job.title}</h3>
                      <p className="mt-1 text-primary">
                        {job.department} • {job.location}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{job.type}</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Link
                        href="#"
                        className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <p className="text-lg text-primary">
                Don't see a position that matches your skills? We're always interested in connecting with talented
                individuals.
              </p>
              <Link
                href="#"
                className="mt-6 inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
              >
                Send Us Your Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Application Process Section */}
      <div className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-light tracking-tight text-primary sm:text-4xl">Our Hiring Process</h2>
            <p className="mt-6 text-lg leading-8 text-primary">
              We've designed our hiring process to be thoughtful, transparent, and respectful of your time.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl">
            <ol className="relative border-l border-gray-200">
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-white">
                  1
                </span>
                <h3 className="text-lg font-light text-primary">Application Review</h3>
                <p className="mt-2 text-primary">
                  Our team reviews your application and resume to assess your qualifications and alignment with our
                  values.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-white">
                  2
                </span>
                <h3 className="text-lg font-light text-primary">Initial Conversation</h3>
                <p className="mt-2 text-primary">
                  A brief call with our recruiting team to discuss your background, interests, and answer any questions
                  you may have.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-white">
                  3
                </span>
                <h3 className="text-lg font-light text-primary">Skills Assessment</h3>
                <p className="mt-2 text-primary">
                  Depending on the role, we may ask you to complete a practical assessment that reflects the type of
                  work you'd be doing.
                </p>
              </li>
              <li className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-white">
                  4
                </span>
                <h3 className="text-lg font-light text-primary">Team Interviews</h3>
                <p className="mt-2 text-primary">
                  Meet with potential teammates and cross-functional partners to discuss your experience and approach to
                  work.
                </p>
              </li>
              <li className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -left-3 text-white">
                  5
                </span>
                <h3 className="text-lg font-light text-primary">Final Decision & Offer</h3>
                <p className="mt-2 text-primary">
                  We'll make a decision and extend an offer to the selected candidate, followed by onboarding and
                  welcome activities.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  )
}
