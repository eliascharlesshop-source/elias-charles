"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useCart } from "@/components/commerce/cart-provider"
import { PageTitle, SectionTitle, BodyText } from "@/components/layout/typography"

export default function OrderConfirmationPage() {
  const cartContext = useCart()
  const cart = cartContext?.cart || { items: [], totalQuantity: 0 }

  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Generate a random order number
    setOrderNumber(`EC-${Math.floor(Math.random() * 10000)}`)
  }, [])

  // Calculate subtotal
  const subtotal = (cart?.items || []).reduce((total: number, item: any) => {
    const price = Number.parseFloat(item.price?.toString().replace("$", "") || "0")
    return total + price * item.quantity
  }, 0)

  // Calculate shipping (free over $100)
  const shipping = subtotal > 100 ? 0 : 10

  // Calculate tax
  const tax = subtotal * 0.08

  // Calculate total
  const total = subtotal + shipping + tax

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
          <PageTitle className="mt-4">Thank you for your order!</PageTitle>
          <BodyText className="mt-4 text-gray-500">Your order has been confirmed and will be shipping soon.</BodyText>
          <BodyText className="mt-2 text-gray-500">
            Order number: <span className="font-medium text-primary">{orderNumber}</span>
          </BodyText>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <SectionTitle>Your order summary</SectionTitle>

          <div className="mt-6 divide-y divide-gray-200 border-t border-gray-200">
            {(cart?.items || []).map((product: any) => (
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

          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
            <Link
              href="/"
              className="inline-block rounded-md bg-primary px-6 py-3 text-center text-base font-medium text-white shadow-sm hover:bg-dark"
            >
              Continue Shopping
            </Link>
            <Link
              href="/profile"
              className="inline-block rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-primary shadow-sm hover:bg-gray-50"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
