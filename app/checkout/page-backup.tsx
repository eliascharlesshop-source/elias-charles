"use client"

import { useState } from "react"
import Link from "next/link"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <p className="text-gray-600">Your checkout page is being prepared...</p>
              
              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/cart"
                  className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors mr-4"
                >
                  Back to Cart
                </Link>
                <button
                  disabled={loading}
                  className="bg-primary text-white px-6 py-2 rounded-md hover:bg-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
