"use client"

import { useState } from "react"

export function ShippingMethods({ subtotal, onSelect }) {
  const [selectedMethod, setSelectedMethod] = useState("standard")

  const handleSelect = (method) => {
    setSelectedMethod(method)
    onSelect(method)
  }

  // Calculate shipping cost based on method and subtotal
  const getShippingCost = (method) => {
    if (method === "standard") {
      return subtotal > 100 ? 0 : 10
    } else if (method === "express") {
      return 15
    } else if (method === "overnight") {
      return 25
    }
    return 0
  }

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div
          className={`relative border rounded-md p-4 flex cursor-pointer ${
            selectedMethod === "standard" ? "border-primary bg-gray-50" : "border-gray-300"
          }`}
          onClick={() => handleSelect("standard")}
        >
          <div className="flex items-center h-5">
            <input
              id="standard-shipping"
              name="shipping-method"
              type="radio"
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === "standard"}
              onChange={() => handleSelect("standard")}
            />
          </div>
          <div className="ml-3 flex flex-1 justify-between">
            <div>
              <label htmlFor="standard-shipping" className="block text-sm font-medium text-primary">
                Standard Shipping
              </label>
              <p className="text-gray-500 text-xs mt-1">3-5 business days</p>
            </div>
            <div className="text-sm font-medium text-primary">
              {getShippingCost("standard") === 0 ? "Free" : `$${getShippingCost("standard").toFixed(2)}`}
            </div>
          </div>
        </div>

        <div
          className={`relative border rounded-md p-4 flex cursor-pointer ${
            selectedMethod === "express" ? "border-primary bg-gray-50" : "border-gray-300"
          }`}
          onClick={() => handleSelect("express")}
        >
          <div className="flex items-center h-5">
            <input
              id="express-shipping"
              name="shipping-method"
              type="radio"
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === "express"}
              onChange={() => handleSelect("express")}
            />
          </div>
          <div className="ml-3 flex flex-1 justify-between">
            <div>
              <label htmlFor="express-shipping" className="block text-sm font-medium text-primary">
                Express Shipping
              </label>
              <p className="text-gray-500 text-xs mt-1">1-2 business days</p>
            </div>
            <div className="text-sm font-medium text-primary">${getShippingCost("express").toFixed(2)}</div>
          </div>
        </div>

        <div
          className={`relative border rounded-md p-4 flex cursor-pointer ${
            selectedMethod === "overnight" ? "border-primary bg-gray-50" : "border-gray-300"
          }`}
          onClick={() => handleSelect("overnight")}
        >
          <div className="flex items-center h-5">
            <input
              id="overnight-shipping"
              name="shipping-method"
              type="radio"
              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              checked={selectedMethod === "overnight"}
              onChange={() => handleSelect("overnight")}
            />
          </div>
          <div className="ml-3 flex flex-1 justify-between">
            <div>
              <label htmlFor="overnight-shipping" className="block text-sm font-medium text-primary">
                Overnight Shipping
              </label>
              <p className="text-gray-500 text-xs mt-1">Next business day</p>
            </div>
            <div className="text-sm font-medium text-primary">${getShippingCost("overnight").toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
