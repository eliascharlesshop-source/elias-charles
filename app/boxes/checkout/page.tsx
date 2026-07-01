'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/src/components/layout/layout'

interface OrderData {
  boxName: string
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  cardNumber: string
  cardExp: string
  cardCvc: string
  frequency: 'one-time' | 'monthly' | 'annual'
}

export default function CheckoutPage() {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState<Partial<OrderData>>({
    frequency: 'monthly'
  })

  // Mock order total
  const orderTotal = 294.00

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      setStep('confirmation')
      setLoading(false)
    }, 1500)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header with Progress */}
        <div className="border-b border-gray-200 py-8 px-6 sm:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                ['shipping', 'payment', 'confirmation'].indexOf(step) >= 0 ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
              }`}>1</div>
              <div className={`h-1 flex-1 ${['payment', 'confirmation'].indexOf(step) >= 0 ? 'bg-black' : 'bg-gray-300'}`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                ['payment', 'confirmation'].indexOf(step) >= 0 ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
              }`}>2</div>
              <div className={`h-1 flex-1 ${step === 'confirmation' ? 'bg-black' : 'bg-gray-300'}`} />
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                step === 'confirmation' ? 'bg-black text-white' : 'bg-gray-300 text-gray-600'
              }`}>3</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {step === 'shipping' && 'Shipping Address'}
              {step === 'payment' && 'Payment Details'}
              {step === 'confirmation' && 'Order Confirmed'}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Forms */}
            <div className="lg:col-span-2">
              {/* Shipping Step */}
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Shipping Information</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        placeholder="State/Province"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <select
                      defaultValue="US"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>Mexico</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Payment Method</h2>
                    
                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          className="p-3 border-2 border-gray-300 rounded-lg hover:border-black transition-colors text-sm font-medium"
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Card Number"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" id="terms" defaultChecked className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the subscription terms and can cancel anytime
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Shipping
                  </button>
                </form>
              )}

              {/* Confirmation Step */}
              {step === 'confirmation' && (
                <div className="space-y-8">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✓</div>
                    <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                    <p className="text-gray-600">Thank you for your order. We&apos;ll send shipping details to your email shortly.</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Order Details</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order #:</span>
                        <span className="font-medium">EC-BOX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subscription:</span>
                        <span className="font-medium">Monthly • Cancel Anytime</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Delivery:</span>
                        <span className="font-medium">5-7 Business Days</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total Paid</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/collections"
                      className="block w-full py-3 px-4 text-center bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/"
                      className="block w-full py-3 px-4 text-center border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back Home
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg">Order Summary</h3>
                  <p className="text-sm text-gray-600 mt-1">Build Your Box</p>
                </div>

                <div className="space-y-3 border-t border-gray-300 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">$270.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">$24.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-300">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-600 space-y-2">
                  <p>✓ Free shipping on all orders</p>
                  <p>✓ 30-day return guarantee</p>
                  <p>✓ Cancel subscription anytime</p>
                  <p>✓ Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
