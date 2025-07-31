"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "../../components/commerce/cart-provider"
import { CheckCircle, ExternalLink, CreditCard, Lock } from "lucide-react"
import { SectionTitle } from "@/components/layout/typography"

interface CartItem {
  id: string
  title: string
  price: string
  image?: string
  size?: string
  color?: string
  quantity: number
  variantId?: string
}

interface LocalCart {
  id?: string
  lines: CartItem[]
  totalQuantity: number
}

interface ShopifyCheckout {
  id: string
  webUrl: string
  subtotal: number
  tax: number
  total: number
  currencyCode: string
}

export default function CheckoutPage() {
  const cartContext = useCart()
  const cart: LocalCart = cartContext?.cart || { lines: [], totalQuantity: 0 }
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [orderComplete, setOrderComplete] = useState(false)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)
  const [shopifyCheckout, setShopifyCheckout] = useState<ShopifyCheckout | null>(null)
  const [useShopifyCheckout, setUseShopifyCheckout] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "United States",
    state: "",
    postalCode: "",
    phone: "",
    sameAsBilling: true,
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingCountry: "United States",
    billingState: "",
    billingPostalCode: "",
    paymentMethod: "shopify",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  })

  // Check if Shopify is enabled
  useEffect(() => {
    const shopifyEnabled = process.env.NEXT_PUBLIC_USE_SHOPIFY === 'true'
    setUseShopifyCheckout(shopifyEnabled)
  }, [])

  // Calculate subtotal
  const subtotal = (cart?.lines || []).reduce((total: number, item: any) => {
    const price = Number.parseFloat(item.price?.toString().replace("$", "") || "0")
    return total + price * item.quantity
  }, 0)

  // Calculate shipping (free over $100)
  const shipping = subtotal > 100 ? 0 : 10

  // Calculate tax
  const tax = subtotal * 0.08

  // Calculate total
  const total = subtotal + shipping + tax

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const createShopifyCheckout = async () => {
    setIsCreatingCheckout(true)
    try {
      // Transform cart items for Shopify
      const lineItems = cart.lines.map(item => ({
        variantId: item.variantId || `gid://shopify/ProductVariant/${item.id}`,
        quantity: item.quantity
      }))

      const response = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lineItems })
      })

      const result = await response.json()

      if (result.success) {
        setShopifyCheckout(result.data)
        return result.data
      } else {
        throw new Error(result.error || 'Failed to create checkout')
      }
    } catch (error) {
      console.error('Checkout creation error:', error)
      alert('Failed to create checkout. Please try again.')
      return null
    } finally {
      setIsCreatingCheckout(false)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Final step - handle payment
      if (useShopifyCheckout && formData.paymentMethod === "shopify") {
        // Create Shopify checkout and redirect
        const checkout = shopifyCheckout || await createShopifyCheckout()
        
        if (checkout) {
          // Redirect to Shopify checkout
          window.location.href = checkout.webUrl
        }
      } else {
        // Simulate regular checkout completion
        setTimeout(() => {
          setOrderComplete(true)
        }, 1500)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const proceedToShopifyCheckout = async () => {
    const checkout = shopifyCheckout || await createShopifyCheckout()
    
    if (checkout) {
      // Redirect to Shopify's hosted checkout
      window.location.href = checkout.webUrl
    }
  }

  if (orderComplete) {
    return (
      <div className="bg-cream dark:bg-dark-bg min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-3xl font-light tracking-widest uppercase text-primary">
              Thank you for your order!
            </h1>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-300">Your order has been confirmed and will be shipping soon.</p>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
              Order number: <span className="font-medium text-primary">EC-{Math.floor(Math.random() * 10000)}</span>
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <SectionTitle className="text-xl font-light tracking-widest uppercase text-primary">
              Your order summary
            </SectionTitle>

            <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
              {(cart?.lines || []).map((product: any) => (
                <div key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg?height=96&width=96"}
                      alt={product.title}
                      className="h-20 w-20 rounded-md object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-primary">{product.title}</h3>
                        <p className="ml-4 text-sm font-medium text-primary">{product.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.color && <span>{product.color}</span>}
                        {product.size && <span className="ml-2">{product.size}</span>}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {product.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Subtotal</p>
                <p className="text-primary">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Shipping</p>
                <p className="text-primary">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Tax</p>
                <p className="text-primary">${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <p className="text-base font-medium text-primary">Total</p>
                <p className="text-base font-medium text-primary">${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-block rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-dark transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <h1 className="sr-only">Checkout</h1>

        <div className="mx-auto max-w-lg xl:max-w-none xl:grid xl:grid-cols-12 xl:gap-x-12">
          <div className="xl:col-span-7">
            <div className="mb-8">
              <nav className="flex justify-center" aria-label="Progress">
                <ol role="list" className="flex items-center space-x-5 sm:space-x-8">
                  <li>
                    <button
                      onClick={() => setStep(1)}
                      className={`block ${step >= 1 ? "text-primary" : "text-gray-400"} hover:text-gray-500 transition-colors duration-200`}
                    >
                      <span className="text-sm font-medium">Information</span>
                    </button>
                  </li>
                  <li>
                    <svg
                      className="h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  </li>
                  <li>
                    <button
                      onClick={() => step >= 2 && setStep(2)}
                      className={`block ${
                        step >= 2 ? "text-primary" : "text-gray-400"
                      } ${step >= 2 ? "hover:text-gray-500" : "cursor-not-allowed"} transition-colors duration-200`}
                      disabled={step < 2}
                    >
                      <span className="text-sm font-medium">Shipping</span>
                    </button>
                  </li>
                  <li>
                    <svg
                      className="h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  </li>
                  <li>
                    <button
                      onClick={() => step >= 3 && setStep(3)}
                      className={`block ${
                        step >= 3 ? "text-primary" : "text-gray-400"
                      } ${step >= 3 ? "hover:text-gray-500" : "cursor-not-allowed"} transition-colors duration-200`}
                      disabled={step < 3}
                    >
                      <span className="text-sm font-medium">Payment</span>
                    </button>
                  </li>
                </ol>
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Information */}
              {step === 1 && (
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
                  <div>
                    <SectionTitle className="text-lg font-medium text-primary">Contact information</SectionTitle>

                    <div className="mt-4">
                      <label htmlFor="email" className="block text-sm font-medium text-primary">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          required
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <SectionTitle className="text-lg font-medium text-primary">Shipping information</SectionTitle>

                    <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-primary">
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            autoComplete="given-name"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-primary">
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            autoComplete="family-name"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-primary">
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="address"
                            name="address"
                            autoComplete="street-address"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="apartment" className="block text-sm font-medium text-primary">
                          Apartment, suite, etc.
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="apartment"
                            name="apartment"
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.apartment}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-primary">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            autoComplete="address-level2"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-primary">
                          Country
                        </label>
                        <div className="mt-1">
                          <select
                            id="country"
                            name="country"
                            autoComplete="country-name"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.country}
                            onChange={handleChange}
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-primary">
                          State / Province
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="state"
                            name="state"
                            autoComplete="address-level1"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-primary">
                          Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            autoComplete="postal-code"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.postalCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-primary">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            autoComplete="tel"
                            required
                            className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
                  <div>
                    <SectionTitle className="text-lg font-medium text-primary">Shipping method</SectionTitle>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="shipping-standard"
                          name="shippingMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          defaultChecked
                        />
                        <label htmlFor="shipping-standard" className="ml-3 block text-sm font-medium text-primary">
                          Standard (3-5 business days)
                          <span className="ml-2 text-gray-500">
                            {subtotal > 100 ? "Free" : `$${shipping.toFixed(2)}`}
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="shipping-express"
                          name="shippingMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="shipping-express" className="ml-3 block text-sm font-medium text-primary">
                          Express (1-2 business days)
                          <span className="ml-2 text-gray-500">$15.00</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle className="text-lg font-medium text-primary">Billing information</SectionTitle>

                    <div className="mt-4">
                      <div className="flex items-center">
                        <input
                          id="same-as-shipping"
                          name="sameAsBilling"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={formData.sameAsBilling}
                          onChange={handleChange}
                        />
                        <label htmlFor="same-as-shipping" className="ml-3 block text-sm font-medium text-primary">
                          Same as shipping address
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
                  <div>
                    <SectionTitle className="text-lg font-medium text-primary">Payment method</SectionTitle>

                    <div className="mt-4 space-y-4">
                      {useShopifyCheckout && (
                        <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center">
                            <input
                              id="payment-shopify"
                              name="paymentMethod"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                              value="shopify"
                              checked={formData.paymentMethod === "shopify"}
                              onChange={handleChange}
                            />
                            <label htmlFor="payment-shopify" className="ml-3 flex items-center text-sm font-medium text-primary">
                              <Lock className="h-4 w-4 mr-2 text-green-600" />
                              Secure Shopify Checkout
                              <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded">Recommended</span>
                            </label>
                          </div>
                          <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 ml-7">
                            Complete your purchase securely with Shopify's trusted checkout system
                          </p>
                        </div>
                      )}

                      <div className="flex items-center">
                        <input
                          id="payment-credit-card"
                          name="paymentMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          value="credit-card"
                          checked={formData.paymentMethod === "credit-card"}
                          onChange={handleChange}
                        />
                        <label htmlFor="payment-credit-card" className="ml-3 flex items-center text-sm font-medium text-primary">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit card
                        </label>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        <div className="sm:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-primary">
                            Card number
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              required
                              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="cardName" className="block text-sm font-medium text-primary">
                            Name on card
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              required
                              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                              value={formData.cardName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-primary">
                            Expiration date (MM/YY)
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              required
                              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cardCvc" className="block text-sm font-medium text-primary">
                            CVC
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardCvc"
                              name="cardCvc"
                              required
                              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                              value={formData.cardCvc}
                              onChange={handleChange}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shopify Checkout Button */}
                  {useShopifyCheckout && formData.paymentMethod === "shopify" && (
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-primary">Ready to complete your purchase?</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            You'll be redirected to Shopify's secure checkout
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={proceedToShopifyCheckout}
                          disabled={isCreatingCheckout}
                          className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                        >
                          {isCreatingCheckout ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              Continue to Shopify
                              <ExternalLink className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                  >
                    Back
                  </button>
                ) : (
                  <Link
                    href="/cart"
                    className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                  >
                    Return to cart
                  </Link>
                )}
                
                {/* Only show Continue/Place Order for non-Shopify payments or if not on payment step with Shopify selected */}
                {!(step === 3 && useShopifyCheckout && formData.paymentMethod === "shopify") && (
                  <button
                    type="submit"
                    className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                  >
                    {step < 3 ? "Continue" : "Place order"}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-10 lg:mt-0 xl:col-span-5">
            <div className="sticky top-6 rounded-lg bg-white dark:bg-dark-card shadow-sm p-4 sm:p-6 lg:p-8">
              <SectionTitle className="text-lg font-medium text-primary">Order summary</SectionTitle>

              <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200 dark:divide-gray-700">
                  {(cart?.lines || []).map((product: any) => (
                    <li key={product.id} className="flex py-4 space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg?height=64&width=64"}
                          alt={product.title}
                          className="h-16 w-16 rounded-md object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-primary">
                            <h3>{product.title}</h3>
                            <p className="ml-4">{product.price}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.color && <span>{product.color}</span>}
                            {product.size && <span className="ml-2">{product.size}</span>}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {product.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-primary">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Shipping</p>
                  <p className="text-primary">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Tax</p>
                  <p className="text-primary">${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <p className="text-base font-medium text-primary">Total</p>
                  <p className="text-base font-medium text-primary">${total.toFixed(2)}</p>
                </div>
              </div>

              {/* Security badges */}
              <div className="mt-6 flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure checkout
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  SSL encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

  if (orderComplete) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-4 text-3xl font-light tracking-widest uppercase text-primary">
              Thank you for your order!
            </h1>
            <p className="mt-4 text-base text-gray-500">Your order has been confirmed and will be shipping soon.</p>
            <p className="mt-2 text-base text-gray-500">
              Order number: <span className="font-medium text-primary">EC-{Math.floor(Math.random() * 10000)}</span>
            </p>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <SectionTitle className="text-xl font-light tracking-widest uppercase text-primary">
              Your order summary
            </SectionTitle>

            <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
              {(cart?.lines || []).map((product: any) => (
                <div key={product.id} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg?height=96&width=96"}
                      alt={product.title}
                      className="h-20 w-20 rounded-md object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-primary">{product.title}</h3>
                        <p className="ml-4 text-sm font-medium text-primary">{product.price}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.color && <span>{product.color}</span>}
                        {product.size && <span className="ml-2">{product.size}</span>}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {product.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Subtotal</p>
                <p className="text-primary">${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Shipping</p>
                <p className="text-primary">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-500">Tax</p>
                <p className="text-primary">${tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <p className="text-base font-medium text-primary">Total</p>
                <p className="text-base font-medium text-primary">${total.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/"
                className="inline-block rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-dark"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pt-4 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8 xl:px-2 xl:pt-14">
        <h1 className="sr-only">Checkout</h1>

        <div className="mx-auto max-w-lg xl:max-w-none xl:grid xl:grid-cols-12 xl:gap-x-12">
          <div className="xl:col-span-7">
            <div className="mb-8">
              <nav className="flex justify-center" aria-label="Progress">
                <ol role="list" className="flex items-center space-x-5 sm:space-x-8">
                  <li>
                    <button
                      onClick={() => setStep(1)}
                      className={`block ${step >= 1 ? "text-primary" : "text-gray-400"} hover:text-gray-500`}
                    >
                      <span className="text-sm font-medium">Information</span>
                    </button>
                  </li>
                  <li>
                    <svg
                      className="h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  </li>
                  <li>
                    <button
                      onClick={() => step >= 2 && setStep(2)}
                      className={`block ${
                        step >= 2 ? "text-primary" : "text-gray-400"
                      } ${step >= 2 ? "hover:text-gray-500" : "cursor-not-allowed"}`}
                      disabled={step < 2}
                    >
                      <span className="text-sm font-medium">Shipping</span>
                    </button>
                  </li>
                  <li>
                    <svg
                      className="h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  </li>
                  <li>
                    <button
                      onClick={() => step >= 3 && setStep(3)}
                      className={`block ${
                        step >= 3 ? "text-primary" : "text-gray-400"
                      } ${step >= 3 ? "hover:text-gray-500" : "cursor-not-allowed"}`}
                      disabled={step < 3}
                    >
                      <span className="text-sm font-medium">Payment</span>
                    </button>
                  </li>
                </ol>
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Information */}
              {step === 1 && (
                <div>
                  <div>
                    <SectionTitle className="text-lg font-medium text-primary">Contact information</SectionTitle>

                    <div className="mt-4">
                      <label htmlFor="email" className="block text-sm font-medium text-primary">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="email"
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <SectionTitle className="text-lg font-medium text-primary">Shipping information</SectionTitle>

                    <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-primary">
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            autoComplete="given-name"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-primary">
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            autoComplete="family-name"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-primary">
                          Address
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="address"
                            name="address"
                            autoComplete="street-address"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="apartment" className="block text-sm font-medium text-primary">
                          Apartment, suite, etc.
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="apartment"
                            name="apartment"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.apartment}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-primary">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            autoComplete="address-level2"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-primary">
                          Country
                        </label>
                        <div className="mt-1">
                          <select
                            id="country"
                            name="country"
                            autoComplete="country-name"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.country}
                            onChange={handleChange}
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-primary">
                          State / Province
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="state"
                            name="state"
                            autoComplete="address-level1"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.state}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-primary">
                          Postal code
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            autoComplete="postal-code"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.postalCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-primary">
                          Phone
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            autoComplete="tel"
                            required
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div>
                  <div>
                    <SectionTitle className="text-lg font-medium text-primary">Shipping method</SectionTitle>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="shipping-standard"
                          name="shippingMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
                          defaultChecked
                        />
                        <label htmlFor="shipping-standard" className="ml-3 block text-sm font-medium text-primary">
                          Standard (3-5 business days)
                          <span className="ml-2 text-gray-500">
                            {subtotal > 100 ? "Free" : `$${shipping.toFixed(2)}`}
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="shipping-express"
                          name="shippingMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
                        />
                        <label htmlFor="shipping-express" className="ml-3 block text-sm font-medium text-primary">
                          Express (1-2 business days)
                          <span className="ml-2 text-gray-500">$15.00</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle className="text-lg font-medium text-primary">Billing information</SectionTitle>

                    <div className="mt-4">
                      <div className="flex items-center">
                        <input
                          id="same-as-shipping"
                          name="sameAsBilling"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                          checked={formData.sameAsBilling}
                          onChange={handleChange}
                        />
                        <label htmlFor="same-as-shipping" className="ml-3 block text-sm font-medium text-primary">
                          Same as shipping address
                        </label>
                      </div>
                    </div>

                    {!formData.sameAsBilling && (
                      <div className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        <div className="sm:col-span-2">
                          <label htmlFor="billingAddress" className="block text-sm font-medium text-primary">
                            Address
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="billingAddress"
                              name="billingAddress"
                              required={!formData.sameAsBilling}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.billingAddress}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="billingApartment" className="block text-sm font-medium text-primary">
                            Apartment, suite, etc.
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="billingApartment"
                              name="billingApartment"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.billingApartment}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="billingCity" className="block text-sm font-medium text-primary">
                            City
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="billingCity"
                              name="billingCity"
                              required={!formData.sameAsBilling}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.billingCity}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="billingCountry" className="block text-sm font-medium text-primary">
                            Country
                          </label>
                          <div className="mt-1">
                            <select
                              id="billingCountry"
                              name="billingCountry"
                              required={!formData.sameAsBilling}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.billingCountry}
                              onChange={handleChange}
                            >
                              <option>United States</option>
                              <option>Canada</option>
                              <option>Mexico</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="billingState" className="block text-sm font-medium text-primary">
                            State / Province
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="billingState"
                              name="billingState"
                              required={!formData.sameAsBilling}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.billingState}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="billingPostalCode" className="block text-sm font-medium text-primary">
                            Postal code
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="billingPostalCode"
                              name="billingPostalCode"
                              required={!formData.sameAsBilling}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.billingPostalCode}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <div>
                    <SectionTitle className="text-lg font-medium text-primary">Payment method</SectionTitle>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="payment-credit-card"
                          name="paymentMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
                          value="credit-card"
                          checked={formData.paymentMethod === "credit-card"}
                          onChange={handleChange}
                        />
                        <label htmlFor="payment-credit-card" className="ml-3 block text-sm font-medium text-primary">
                          Credit card
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="payment-paypal"
                          name="paymentMethod"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-accent focus:ring-accent"
                          value="paypal"
                          checked={formData.paymentMethod === "paypal"}
                          onChange={handleChange}
                        />
                        <label htmlFor="payment-paypal" className="ml-3 block text-sm font-medium text-primary">
                          PayPal
                        </label>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "credit-card" && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                        <div className="sm:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-primary">
                            Card number
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="cardName" className="block text-sm font-medium text-primary">
                            Name on card
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.cardName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-primary">
                            Expiration date (MM/YY)
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/YY"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="cardCvc" className="block text-sm font-medium text-primary">
                            CVC
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              id="cardCvc"
                              name="cardCvc"
                              required
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                              value={formData.cardCvc}
                              onChange={handleChange}
                              placeholder="123"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Back
                  </button>
                ) : (
                  <Link
                    href="/cart"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  >
                    Return to cart
                  </Link>
                )}
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  {step < 3 ? "Continue" : "Place order"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 lg:mt-0 xl:col-span-5">
            <div className="sticky top-6 rounded-lg bg-gray-50 p-4 sm:p-6 lg:p-8">
              <SectionTitle className="text-lg font-medium text-primary">Order summary</SectionTitle>

              <div className="mt-6 flow-root">
                <ul role="list" className="-my-4 divide-y divide-gray-200">
                  {(cart?.lines || []).map((product: any) => (
                    <li key={product.id} className="flex py-4 space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg?height=64&width=64"}
                          alt={product.title}
                          className="h-16 w-16 rounded-md object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-primary">
                            <h3>{product.title}</h3>
                            <p className="ml-4">{product.price}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.color && <span>{product.color}</span>}
                            {product.size && <span className="ml-2">{product.size}</span>}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {product.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-primary">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Shipping</p>
                  <p className="text-primary">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Tax</p>
                  <p className="text-primary">${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <p className="text-base font-medium text-primary">Total</p>
                  <p className="text-base font-medium text-primary">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
