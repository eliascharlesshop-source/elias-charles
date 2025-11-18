import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function AccessibilityPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Diverse group of people at beach"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Accessibility Statement</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Our commitment to making our website and products accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Content */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="prose prose-lg max-w-none text-primary">
                <p className="text-sm text-gray-500">Last Updated: March 1, 2023</p>

                <h2 className="text-2xl font-light mt-8">Our Commitment to Accessibility</h2>
                <p>
                  EC is committed to ensuring digital accessibility for people with disabilities. We are continually
                  improving the user experience for everyone and applying the relevant accessibility standards to ensure
                  we provide equal access to all users.
                </p>

                <h2 className="text-2xl font-light mt-8">Conformance Status</h2>
                <p>
                  The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to
                  improve accessibility for people with disabilities. It defines three levels of conformance: Level A,
                  Level AA, and Level AAA.
                </p>
                <p>
                  Our website is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts
                  of the content do not fully conform to the accessibility standard.
                </p>
                <p>
                  We are working to achieve full compliance with WCAG 2.1 level AA and are actively addressing known
                  issues.
                </p>

                <h2 className="text-2xl font-light mt-8">Accessibility Features</h2>
                <p>Our website includes the following accessibility features:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Semantic HTML structure with appropriate headings and landmarks</li>
                  <li>Text alternatives for non-text content</li>
                  <li>Keyboard navigation support</li>
                  <li>Sufficient color contrast</li>
                  <li>Resizable text without loss of content or functionality</li>
                  <li>Clear focus indicators</li>
                  <li>ARIA attributes where appropriate</li>
                  <li>Skip navigation links</li>
                  <li>Form labels and error messages</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">Assistive Technology Compatibility</h2>
                <p>We aim to ensure our website is compatible with various assistive technologies, including:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Screen readers (such as JAWS, NVDA, VoiceOver, and TalkBack)</li>
                  <li>Screen magnification software</li>
                  <li>Speech recognition software</li>
                  <li>Alternative input devices</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">Known Limitations</h2>
                <p>Despite our efforts to ensure accessibility, there may be some limitations, including:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Some older content may not be fully accessible</li>
                  <li>Some third-party content or functionality may not be fully accessible</li>
                  <li>Some interactive elements may not be fully keyboard accessible</li>
                  <li>Some images may lack appropriate alternative text</li>
                </ul>
                <p>We are actively working to address these issues and improve the accessibility of our website.</p>

                <h2 className="text-2xl font-light mt-8">Feedback and Assistance</h2>
                <p>
                  We welcome your feedback on the accessibility of our website. If you encounter accessibility barriers
                  or have suggestions for improvement, please contact us using the information provided below.
                </p>
                <p>
                  If you need assistance with a particular page or feature on our website, please contact us and provide
                  the following information:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>The URL (web address) of the content</li>
                  <li>The specific issue you are experiencing</li>
                  <li>Your contact information</li>
                  <li>The assistive technology you are using, if applicable</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">In-Store Accessibility</h2>
                <p>
                  In addition to our digital accessibility efforts, we are committed to making our physical stores
                  accessible to people with disabilities. Our stores feature:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Wheelchair accessible entrances and pathways</li>
                  <li>Accessible fitting rooms</li>
                  <li>Service animal accommodation</li>
                  <li>Staff trained to assist customers with disabilities</li>
                  <li>Accessible parking spaces (where applicable)</li>
                </ul>
                <p>
                  For specific information about the accessibility features of a particular store location, please visit
                  our
                  <Link href="/store-locator" className="text-primary hover:text-gray-500 underline">
                    {" "}
                    Store Locator
                  </Link>{" "}
                  page or contact the store directly.
                </p>

                <h2 className="text-2xl font-light mt-8">Continuous Improvement</h2>
                <p>We are committed to ongoing accessibility improvements. Our accessibility efforts include:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Regular accessibility audits and testing</li>
                  <li>Accessibility training for our web development and content teams</li>
                  <li>Incorporation of accessibility into our design and development processes</li>
                  <li>Engagement with users with disabilities to gather feedback</li>
                  <li>Staying informed about new accessibility technologies and best practices</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">Contact Us</h2>
                <p>
                  If you have any questions, concerns, or feedback about the accessibility of our website or stores,
                  please contact us at:
                </p>
                <p className="mt-4">
                  EC
                  <br />
                  Attn: Accessibility Team
                  <br />
                  123 Ocean Avenue
                  <br />
                  Venice Beach, CA 90291
                  <br />
                  Email: accessibility@ecstore.com
                  <br />
                  Phone: (310) 555-1234
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-primary">Need assistance or have feedback about our accessibility efforts?</p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
