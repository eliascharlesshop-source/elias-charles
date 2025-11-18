import Layout from "@/components/layout/layout"
import Link from "next/link"

export default function ShippingReturnsPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="Shipping packages"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Shipping & Returns</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Everything you need to know about our shipping policies and return process.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-3xl font-light tracking-tight text-primary">Shipping Information</h2>

              <div className="mt-8 space-y-12">
                <div>
                  <h3 className="text-xl font-light text-primary">Domestic Shipping</h3>
                  <p className="mt-4 text-primary">
                    We offer several shipping options for orders within the United States:
                  </p>
                  <div className="mt-6 border-t border-b border-gray-200">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Standard Shipping</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          <p>$5.95 or FREE on orders over $75</p>
                          <p className="text-sm text-gray-500">Delivery in 5-7 business days</p>
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Expedited Shipping</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          <p>$12.95</p>
                          <p className="text-sm text-gray-500">Delivery in 2-3 business days</p>
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Overnight Shipping</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          <p>$24.95</p>
                          <p className="text-sm text-gray-500">Next business day delivery (order by 1pm PT)</p>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <p className="mt-4 text-sm text-primary">
                    Please note that business days are Monday through Friday, excluding holidays. Orders placed after
                    1pm PT will be processed the following business day.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">International Shipping</h3>
                  <p className="mt-4 text-primary">
                    We ship to most countries worldwide. International shipping rates are calculated based on
                    destination, weight, and value of items. You can see the exact shipping cost during checkout before
                    completing your purchase.
                  </p>
                  <div className="mt-6 border-t border-b border-gray-200">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Standard International</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          <p>Starting at $15.95</p>
                          <p className="text-sm text-gray-500">Delivery in 7-21 business days</p>
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Express International</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          <p>Starting at $29.95</p>
                          <p className="text-sm text-gray-500">Delivery in 3-5 business days</p>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <p className="mt-4 text-sm text-primary">
                    International customers are responsible for all duties, import taxes, and any other fees that may be
                    imposed by your local customs authorities. These fees are not included in the purchase price or
                    shipping cost.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">Shipping Restrictions</h3>
                  <p className="mt-4 text-primary">
                    Due to shipping regulations, certain items may have shipping restrictions to specific countries. If
                    you encounter any issues during checkout, please contact our customer service team for assistance.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">Order Tracking</h3>
                  <p className="mt-4 text-primary">
                    Once your order ships, you'll receive a shipping confirmation email with tracking information. You
                    can also track your order by logging into your account and viewing your order history.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-3xl font-light tracking-tight text-primary">Returns & Exchanges</h2>

              <div className="mt-8 space-y-12">
                <div>
                  <h3 className="text-xl font-light text-primary">Return Policy</h3>
                  <p className="mt-4 text-primary">
                    We want you to be completely satisfied with your purchase. If for any reason you're not happy with
                    your order, we offer a simple return process.
                  </p>
                  <ul className="mt-4 list-disc pl-5 text-primary space-y-2">
                    <li>Returns must be initiated within 30 days of delivery</li>
                    <li>Items must be unworn, unwashed, and in original condition with all tags attached</li>
                    <li>Original receipt or proof of purchase is required</li>
                    <li>Sale items marked as "Final Sale" are not eligible for return or exchange</li>
                    <li>Swimwear, underwear, and face masks are final sale for hygiene reasons</li>
                    <li>Custom or personalized items cannot be returned unless defective</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">Return Process</h3>
                  <p className="mt-4 text-primary">To initiate a return, please follow these steps:</p>
                  <ol className="mt-4 list-decimal pl-5 text-primary space-y-2">
                    <li>Log into your account and go to your order history</li>
                    <li>Select the order containing the item(s) you wish to return</li>
                    <li>Click "Return Items" and follow the instructions</li>
                    <li>Print the prepaid return shipping label (for domestic returns)</li>
                    <li>Pack the items securely in the original packaging if possible</li>
                    <li>Attach the return shipping label to the outside of the package</li>
                    <li>Drop off the package at any authorized shipping location</li>
                  </ol>
                  <p className="mt-4 text-sm text-primary">
                    You can also initiate a return by contacting our customer service team if you prefer.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">Exchanges</h3>
                  <p className="mt-4 text-primary">
                    If you'd like to exchange an item for a different size or color, you can request an exchange during
                    the return process. Exchanges are subject to availability. If the item you want is not available for
                    exchange, we'll issue a refund for the returned item, and you can place a new order for the desired
                    item.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">Refunds</h3>
                  <p className="mt-4 text-primary">
                    Once we receive and inspect your return, we'll process your refund. Refunds are issued to the
                    original payment method used for the purchase.
                  </p>
                  <div className="mt-6 border-t border-b border-gray-200">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Processing Time</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          3-5 business days after we receive your return
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Credit Card Refunds</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          3-7 business days to appear on your statement after processing
                        </dd>
                      </div>
                      <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-primary">Other Payment Methods</dt>
                        <dd className="mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
                          5-10 business days depending on the payment provider
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <p className="mt-4 text-sm text-primary">
                    Original shipping charges are non-refundable unless the return is due to our error or a defective
                    product.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-light text-primary">Damaged or Defective Items</h3>
                  <p className="mt-4 text-primary">
                    If you receive a damaged or defective item, please contact our customer service team within 7 days
                    of delivery. We'll arrange for a return, replacement, or refund at our expense. Please provide
                    photos of the damaged or defective item to help us improve our quality control.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-2xl font-light text-primary">Need more help?</h2>
              <p className="mt-4 text-primary">
                If you have any questions about shipping, returns, or exchanges, our customer service team is here to
                assist you.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  Contact Customer Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
