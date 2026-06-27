import Layout from "@/components/layout/layout"
import Link from "next/link"
import { GlassmorphicButton } from "@/components/ui/glassmorphic-button"

export default function TermsPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Beach landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Terms of Service</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              The rules and guidelines for using our website and services.
            </p>
          </div>
        </div>
      </div>

      {/* Terms of Service Content */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="prose prose-lg max-w-none text-primary">
                <p className="text-sm text-gray-500">Last Updated: March 1, 2023</p>

                <h2 className="text-2xl font-light mt-8">Introduction</h2>
                <p>
                  Welcome to EC. These Terms of Service ("Terms") govern your access to and use of our website, mobile
                  application, and services (collectively, the "Services"). By accessing or using our Services, you
                  agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
                </p>
                <p>
                  Please read these Terms carefully before using our Services. These Terms constitute a legally binding
                  agreement between you and EC ("we," "our," or "us").
                </p>

                <h2 className="text-2xl font-light mt-8">Eligibility</h2>
                <p>
                  You must be at least 16 years old to use our Services. By using our Services, you represent and
                  warrant that you are at least 16 years old and have the legal capacity to enter into these Terms. If
                  you are using our Services on behalf of a company, organization, or other entity, you represent and
                  warrant that you have the authority to bind that entity to these Terms.
                </p>

                <h2 className="text-2xl font-light mt-8">Account Registration</h2>
                <p>
                  To access certain features of our Services, you may need to create an account. When you create an
                  account, you must provide accurate, current, and complete information. You are responsible for
                  maintaining the confidentiality of your account credentials and for all activities that occur under
                  your account. You agree to notify us immediately of any unauthorized use of your account or any other
                  breach of security.
                </p>
                <p>
                  We reserve the right to suspend or terminate your account at our discretion, without notice, for
                  conduct that we determine violates these Terms or is harmful to other users of our Services, us, or
                  third parties, or for any other reason.
                </p>

                <h2 className="text-2xl font-light mt-8">Use of Services</h2>
                <p>
                  Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable,
                  and revocable license to access and use our Services for your personal, non-commercial use.
                </p>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Use our Services in any way that violates any applicable law or regulation</li>
                  <li>Use our Services for any illegal or unauthorized purpose</li>
                  <li>
                    Interfere with or disrupt the operation of our Services or servers or networks connected to our
                    Services
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any portion of our Services or any other accounts, computer
                    systems, or networks connected to our Services
                  </li>
                  <li>Use any robot, spider, crawler, scraper, or other automated means to access our Services</li>
                  <li>Bypass or circumvent measures we may use to prevent or restrict access to our Services</li>
                  <li>
                    Reproduce, duplicate, copy, sell, resell, or exploit any portion of our Services without our express
                    written permission
                  </li>
                  <li>Use our Services to transmit any malware, spyware, or other malicious code</li>
                  <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our Services</li>
                </ul>

                <h2 className="text-2xl font-light mt-8">Products and Purchases</h2>
                <p>
                  All product descriptions, prices, and availability are subject to change without notice. We reserve
                  the right to limit quantities of any products or services and to discontinue any product or service at
                  any time.
                </p>
                <p>
                  When you place an order through our Services, you are making an offer to purchase the products or
                  services at the listed price. We reserve the right to accept or decline your order for any reason,
                  including product unavailability, errors in product or pricing information, or problems with your
                  account or payment method.
                </p>
                <p>
                  You agree to provide current, complete, and accurate purchase and account information for all
                  purchases made through our Services. You agree to promptly update your account and other information,
                  including your email address and credit card numbers and expiration dates, so that we can complete
                  your transactions and contact you as needed.
                </p>

                <h2 className="text-2xl font-light mt-8">Shipping and Delivery</h2>
                <p>
                  We will make reasonable efforts to ship products within the estimated timeframes provided at checkout.
                  However, shipping times are estimates only and are not guaranteed. We are not responsible for delays
                  in shipping or delivery due to circumstances beyond our control, including but not limited to weather
                  conditions, natural disasters, customs processing, or carrier delays.
                </p>
                <p>
                  Risk of loss and title for items purchased from our Services pass to you upon delivery of the items to
                  the carrier.
                </p>

                <h2 className="text-2xl font-light mt-8">Returns and Refunds</h2>
                <p>
                  Our return and refund policy is available on our{" "}
                  <Link href="/shipping-returns" className="text-primary hover:text-gray-500 underline">
                    Shipping & Returns
                  </Link>{" "}
                  page. By making a purchase through our Services, you agree to the terms of our return and refund
                  policy.
                </p>

                <h2 className="text-2xl font-light mt-8">Intellectual Property</h2>
                <p>
                  Our Services and their entire contents, features, and functionality (including but not limited to all
                  information, software, text, displays, images, video, and audio, and the design, selection, and
                  arrangement thereof) are owned by us, our licensors, or other providers of such material and are
                  protected by United States and international copyright, trademark, patent, trade secret, and other
                  intellectual property or proprietary rights laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly
                  perform, republish, download, store, or transmit any of the material on our Services, except as
                  follows:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>
                    Your computer may temporarily store copies of such materials in RAM incidental to your accessing and
                    viewing those materials
                  </li>
                  <li>
                    You may store files that are automatically cached by your web browser for display enhancement
                    purposes
                  </li>
                  <li>
                    You may print or download one copy of a reasonable number of pages of the website for your own
                    personal, non-commercial use and not for further reproduction, publication, or distribution
                  </li>
                </ul>
                <p>
                  No right, title, or interest in or to our Services or any content on our Services is transferred to
                  you, and all rights not expressly granted are reserved by us. Any use of our Services not expressly
                  permitted by these Terms is a breach of these Terms and may violate copyright, trademark, and other
                  laws.
                </p>

                <h2 className="text-2xl font-light mt-8">User Content</h2>
                <p>
                  Our Services may allow you to post, submit, publish, display, or transmit content, such as product
                  reviews, comments, or social media posts (collectively, "User Content"). All User Content must comply
                  with these Terms and must not:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Be false, misleading, or deceptive</li>
                  <li>Be defamatory, obscene, pornographic, vulgar, or offensive</li>
                  <li>
                    Promote discrimination, bigotry, racism, hatred, harassment, or harm against any individual or group
                  </li>
                  <li>Promote violence or actions that are threatening to any person or entity</li>
                  <li>
                    Infringe any patent, trademark, trade secret, copyright, or other intellectual property or other
                    rights of any other person
                  </li>
                  <li>
                    Violate the legal rights (including the rights of publicity and privacy) of others or contain any
                    material that could give rise to any civil or criminal liability under applicable laws or
                    regulations
                  </li>
                  <li>
                    Contain any material that contains software viruses or any other computer code, files, or programs
                    designed to interrupt, destroy, or limit the functionality of any computer software or hardware or
                    telecommunications equipment
                  </li>
                </ul>
                <p>
                  By posting User Content, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully
                  sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works
                  from, distribute, perform, and display such User Content throughout the world in any media. You
                  represent and warrant that you own or control all rights in and to the User Content and have the right
                  to grant the license granted above.
                </p>

                <h2 className="text-2xl font-light mt-8">Disclaimer of Warranties</h2>
                <p>
                  YOUR USE OF OUR SERVICES IS AT YOUR SOLE RISK. OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS
                  AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE EXPRESSLY DISCLAIM ALL
                  WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED
                  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT ANY
                  DEFECTS WILL BE CORRECTED. WE DO NOT WARRANT THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF OUR
                  SERVICES WILL BE ACCURATE OR RELIABLE.
                </p>

                <h2 className="text-2xl font-light mt-8">Limitation of Liability</h2>
                <p>
                  IN NO EVENT WILL WE, OUR AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS,
                  OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN
                  CONNECTION WITH YOUR USE, OR INABILITY TO USE, OUR SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL,
                  INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, PERSONAL INJURY, PAIN
                  AND SUFFERING, EMOTIONAL DISTRESS, LOSS OF REVENUE, LOSS OF PROFITS, LOSS OF BUSINESS OR ANTICIPATED
                  SAVINGS, LOSS OF USE, LOSS OF GOODWILL, LOSS OF DATA, AND WHETHER CAUSED BY TORT (INCLUDING
                  NEGLIGENCE), BREACH OF CONTRACT, OR OTHERWISE, EVEN IF FORESEEABLE.
                </p>
                <p>
                  THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                </p>

                <h2 className="text-2xl font-light mt-8">Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless us, our affiliates, licensors, and service
                  providers, and our and their respective officers, directors, employees, contractors, agents,
                  licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages,
                  judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out
                  of or relating to your violation of these Terms or your use of our Services.
                </p>

                <h2 className="text-2xl font-light mt-8">Governing Law and Jurisdiction</h2>
                <p>
                  These Terms and any dispute or claim arising out of or related to them, their subject matter, or their
                  formation (in each case, including non-contractual disputes or claims) shall be governed by and
                  construed in accordance with the laws of the State of California, without giving effect to any choice
                  or conflict of law provision or rule.
                </p>
                <p>
                  Any legal suit, action, or proceeding arising out of, or related to, these Terms or our Services shall
                  be instituted exclusively in the federal courts of the United States or the courts of the State of
                  California, in each case located in Los Angeles County. You waive any and all objections to the
                  exercise of jurisdiction over you by such courts and to venue in such courts.
                </p>

                <h2 className="text-2xl font-light mt-8">Arbitration</h2>
                <p>
                  At our sole discretion, we may require you to submit any disputes arising from these Terms or your use
                  of our Services, including disputes arising from or concerning their interpretation, violation,
                  invalidity, non-performance, or termination, to final and binding arbitration under the Rules of
                  Arbitration of the American Arbitration Association applying California law.
                </p>

                <h2 className="text-2xl font-light mt-8">Waiver and Severability</h2>
                <p>
                  No waiver by us of any term or condition set out in these Terms shall be deemed a further or
                  continuing waiver of such term or condition or a waiver of any other term or condition, and any
                  failure by us to assert a right or provision under these Terms shall not constitute a waiver of such
                  right or provision.
                </p>
                <p>
                  If any provision of these Terms is held by a court or other tribunal of competent jurisdiction to be
                  invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to
                  the minimum extent such that the remaining provisions of the Terms will continue in full force and
                  effect.
                </p>

                <h2 className="text-2xl font-light mt-8">Changes to Terms</h2>
                <p>
                  We may revise and update these Terms from time to time at our sole discretion. All changes are
                  effective immediately when we post them and apply to all access to and use of our Services thereafter.
                  Your continued use of our Services following the posting of revised Terms means that you accept and
                  agree to the changes.
                </p>

                <h2 className="text-2xl font-light mt-8">Contact Us</h2>
                <p>If you have any questions or concerns about these Terms, please contact us at:</p>
                <p className="mt-4">
                  EC
                  <br />
                  Attn: Legal Department
                  <br />
                  123 Ocean Avenue
                  <br />
                  Venice Beach, CA 90291
                  <br />
                  Email: legal@ecstore.com
                  <br />
                  Phone: (310) 555-1234
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-primary">Have questions about our terms of service?</p>
              <div className="mt-6">
                <GlassmorphicButton href="/contact">Contact Us</GlassmorphicButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
