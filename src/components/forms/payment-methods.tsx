"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"

export function PaymentMethods({ onSelect }) {
  const [selectedMethod, setSelectedMethod] = useState("credit-card")

  const handleSelect = (method) => {
    setSelectedMethod(method)
    onSelect(method)
  }

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div
          className={`relative border rounded-md p-4 flex cursor-pointer ${
            selectedMethod === "credit-card" ? "border-primary bg-gray-50" : "border-gray-300"
          }`}
          onClick={() => handleSelect("credit-card")}
        >
          <div className="flex items-center h-5">
            <input
              id="credit-card"
              name="payment-method"
              type="radio"
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === "credit-card"}
              onChange={() => handleSelect("credit-card")}
            />
          </div>
          <div className="ml-3 flex flex-1">
            <div className="flex flex-col">
              <label htmlFor="credit-card" className="block text-sm font-medium text-primary">
                Credit / Debit Card
              </label>
              <p className="text-gray-500 text-xs mt-1">Pay with Visa, Mastercard, American Express, or Discover</p>
            </div>
            <div className="ml-auto flex items-center">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div
          className={`relative border rounded-md p-4 flex cursor-pointer ${
            selectedMethod === "paypal" ? "border-primary bg-gray-50" : "border-gray-300"
          }`}
          onClick={() => handleSelect("paypal")}
        >
          <div className="flex items-center h-5">
            <input
              id="paypal"
              name="payment-method"
              type="radio"
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === "paypal"}
              onChange={() => handleSelect("paypal")}
            />
          </div>
          <div className="ml-3 flex flex-1">
            <div className="flex flex-col">
              <label htmlFor="paypal" className="block text-sm font-medium text-primary">
                PayPal
              </label>
              <p className="text-gray-500 text-xs mt-1">Pay with your PayPal account</p>
            </div>
            <div className="ml-auto flex items-center">
              {/* Replace with actual PayPal logo */}
              <span className="text-blue-600 font-bold">Pay</span>
              <span className="text-blue-800 font-bold">Pal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
