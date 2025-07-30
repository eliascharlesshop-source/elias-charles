"use client"

import { useCart } from './cart-provider'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'

export default function OrderSummary() {
  const { cart } = useCart()

  if (!cart || cart.lines.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <p className="text-muted-foreground">Your cart is empty</p>
      </Card>
    )
  }

  // Calculate subtotal
  const subtotal = cart.lines.reduce((total: number, item) => {
    const price = typeof item.price === 'string' 
      ? Number.parseFloat((item.price as string).replace("$", "") || "0")
      : item.price || 0
    return total + price * item.quantity
  }, 0)

  // Calculate shipping cost based on method and subtotal
  const getShippingCost = (method: string) => {
    if (method === "standard") {
      return subtotal > 100 ? 0 : 10
    } else if (method === "express") {
      return 15
    } else if (method === "overnight") {
      return 25
    }
    return 0
  }

  // Default shipping method for now - could be made dynamic
  const shippingMethod = "standard"
  const shipping = getShippingCost(shippingMethod)

  // Calculate tax
  const tax = subtotal * 0.08

  // Calculate total
  const total = subtotal + shipping + tax

  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-primary">Order summary</h2>

      <div className="mt-6 flow-root">
        <ul role="list" className="-my-4 divide-y divide-gray-200">
          {cart.lines.map((product) => (
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
  )
}
