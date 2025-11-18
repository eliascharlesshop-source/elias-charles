import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img src="/images/hero/streetlights-night-2.jpg" alt="Ocean waves" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Privacy Policy</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              How we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="prose prose-lg max-w-none text-primary">
                <p className="text-sm text-gray-500">Last Updated: March 1, 2023</p>

                <h2 className="text-2xl font-light mt-8">Introduction</h2>
                <p>
                  EC ("we," "our," or "us") respects your privacy and is committed to protecting your personal
                  information. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you visit our website, use our mobile application, shop in our stores, or otherwise
                  interact with us.
                </p>
                <p>
                  Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that
                  you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do
                  not agree with our policies and practices, please do not use our services.
                </p>

                <h2 className="text-2xl font-light mt-8">Information We Collect</h2>
                <p>We collect several types of information from and about users of our services, including:</p>
                <h3 className="text-xl font-light mt-6">Personal Information</h3>
                <p>
                  Personal information is data that can be used to identify you individually. We may collect the
                  following personal information:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Contact information (such as name, email address, mailing address, and phone number)</li>
                  <li>Account information (such as username and password)</li>
                  <li>Payment information (such as credit card details and billing address)</li>
                  <li>Purchase history and transaction information</li>
                  <li>Shipping information</li>
                  <li>Communication preferences</li>
                  <li>Demographic information (such as age, gender, and location)</li>
                </ul>

                <h3 className="text-xl font-light mt-6">Usage Information</h3>
                <p>We may also collect information about how you access and use our services, including:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Browser and device information</li>
                  <li>IP address and other network identifiers</li>
                  <li>Operating system and platform</li>
                  <li>Pages you visit on our website and how you interact with them</li>
                  <li>Products you view or search for</li>
                  <li>Referral source (how you came to our website)</li>
                  <li>Time spent on our website and visit dates and times</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">How We Collect Information</h2>
                <p>We collect information through various methods, including:</p>
                <h3 className="text-xl font-light mt-6">Direct Interactions</h3>
                <p>Information you provide when you:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Create an account or profile</li>
                  <li>Make a purchase</li>
                  <li>Sign up for our newsletter</li>
                  <li>Participate in a survey, contest, or promotion</li>
                  <li>Contact our customer service</li>
                  <li>Post reviews or comments</li>
                </ul>

                <h3 className="text-xl font-light mt-6">Automated Technologies</h3>
                <p>When you use our services, we may use the following technologies to collect information:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Cookies:</strong> Small data files stored on your device that help us improve our services
                    and your experience, remember your preferences, and provide personalized content and advertisements.
                  </li>
                  <li>
                    <strong>Web Beacons:</strong> Electronic images that help us deliver cookies, count visits, and
                    understand usage patterns.
                  </li>
                  <li>
                    <strong>Log Files:</strong> Track actions occurring on our website and collect data including IP
                    address, browser type, referring/exit pages, and date/time stamps.
                  </li>
                  <li>
                    <strong>Analytics Tools:</strong> We use services like Google Analytics to collect and analyze
                    information about how users interact with our services.
                  </li>
                </ul>

                <h2 className="text-2xl font-light mt-8">How We Use Your Information</h2>
                <p>We may use the information we collect for various purposes, including to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Process and fulfill your orders, including shipping and delivery</li>
                  <li>Create and manage your account</li>
                  <li>Provide customer service and respond to your inquiries</li>
                  <li>Send transactional emails (such as order confirmations and shipping updates)</li>
                  <li>Send marketing communications (if you've opted in)</li>
                  <li>
                    Personalize your experience and deliver content and product offerings relevant to your interests
                  </li>
                  <li>Improve our website, products, and services</li>
                  <li>Administer promotions, surveys, and contests</li>
                  <li>Detect, prevent, and address fraud, security issues, and technical issues</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">How We Share Your Information</h2>
                <p>We may share your personal information with:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> Third parties that perform services on our behalf, such as
                    payment processing, shipping, data analysis, email delivery, hosting, customer service, and
                    marketing assistance.
                  </li>
                  <li>
                    <strong>Business Partners:</strong> With your consent, we may share your information with business
                    partners to offer you certain products, services, or promotions.
                  </li>
                  <li>
                    <strong>Affiliates:</strong> We may share your information with our affiliates and subsidiaries for
                    business purposes.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information to comply with applicable laws
                    and regulations, to respond to a subpoena, search warrant, or other lawful request for information,
                    or to otherwise protect our rights.
                  </li>
                </ul>
                <p>We do not sell your personal information to third parties for their marketing purposes.</p>

                <h2 className="text-2xl font-light mt-8">Your Choices and Rights</h2>
                <p>You have certain choices and rights regarding your personal information:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    <strong>Account Information:</strong> You can review and update your account information by logging
                    into your account.
                  </li>
                  <li>
                    <strong>Marketing Communications:</strong> You can opt out of receiving marketing emails by
                    following the unsubscribe instructions in any marketing email we send. Note that you will continue
                    to receive transactional emails.
                  </li>
                  <li>
                    <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually
                    choose to set your browser to remove or reject cookies. Please note that if you choose to remove or
                    reject cookies, this could affect certain features of our services.
                  </li>
                  <li>
                    <strong>Do Not Track:</strong> Some browsers have a "Do Not Track" feature that signals to websites
                    that you visit that you do not want your online activity tracked. Our website currently does not
                    respond to "Do Not Track" signals.
                  </li>
                </ul>

                <h3 className="text-xl font-light mt-6">Your Privacy Rights</h3>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, such as:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>The right to access and receive a copy of your personal information</li>
                  <li>The right to correct inaccurate personal information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to restrict or object to processing of your personal information</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided in the "Contact Us" section
                  below.
                </p>

                <h2 className="text-2xl font-light mt-8">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect the security of your
                  personal information. However, please be aware that no method of transmission over the internet or
                  electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="text-2xl font-light mt-8">Children's Privacy</h2>
                <p>
                  Our services are not intended for children under 16 years of age. We do not knowingly collect personal
                  information from children under 16. If you are a parent or guardian and believe that your child has
                  provided us with personal information, please contact us, and we will delete such information from our
                  records.
                </p>

                <h2 className="text-2xl font-light mt-8">International Data Transfers</h2>
                <p>
                  Your personal information may be transferred to, and processed in, countries other than the country in
                  which you reside. These countries may have data protection laws that are different from the laws of
                  your country. We have taken appropriate safeguards to ensure that your personal information remains
                  protected in accordance with this Privacy Policy.
                </p>

                <h2 className="text-2xl font-light mt-8">Changes to Our Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. If we make material changes, we will notify you by
                  email or by posting a notice on our website prior to the change becoming effective. We encourage you
                  to review this Privacy Policy periodically for the latest information on our privacy practices.
                </p>

                <h2 className="text-2xl font-light mt-8">Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our privacy practices, please
                  contact us at:
                </p>
                <p className="mt-4">
                  EC
                  <br />
                  Attn: Privacy Officer
                  <br />
                  123 Ocean Avenue
                  <br />
                  Venice Beach, CA 90291
                  <br />
                  Email: privacy@ecstore.com
                  <br />
                  Phone: (310) 555-1234
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-primary">Have questions about our privacy practices?</p>
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
