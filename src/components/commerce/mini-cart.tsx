"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import { X, Plus, Minus } from "lucide-react"
import { useCart } from "./cart-provider"

export function MiniCart({ isOpen, onClose }) {
  const { cart, removeFromCart, updateLineQuantity } = useCart() || {
    cart: { lines: [], totalQuantity: 0 },
    removeFromCart: () => {},
    updateLineQuantity: () => {},
  }
  const cartRef = useRef(null)

  // Close cart when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  // Calculate subtotal
  const subtotal = cart?.items?.reduce((total, item) => {
    const price = Number.parseFloat(item.price?.toString().replace("$", "") || "0")
    return total + price * item.quantity
  }, 0) || 0

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div
          ref={cartRef}
          className={`transform transition-transform duration-300 ease-in-out w-full max-w-md ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-primary">Your Cart</h2>
                <button type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500" onClick={onClose}>
                  <span className="sr-only">Close panel</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8">
                {(cart?.items?.length || 0) === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {cart?.items?.map((product) => (
                        <li key={product.id} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={product.image || "/placeholder.svg?height=96&width=96"}
                              alt={product.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-primary">
                                <h3>
                                  <Link href={`/products/${product.id}`} onClick={onClose}>
                                    {product.title}
                                  </Link>
                                </h3>
                                <p className="ml-4">{product.price}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                {product.color && <span>{product.color}</span>}
                                {product.size && <span className="ml-2">{product.size}</span>}
                              </p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center border border-gray-200 rounded">
                                <button
                                  type="button"
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => updateLineQuantity(product.id, Math.max(1, product.quantity - 1))}
                                >
                                  <span className="sr-only">Decrease quantity</span>
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-2 text-xs text-primary">{product.quantity}</span>
                                <button
                                  type="button"
                                  className="p-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => updateLineQuantity(product.id, product.quantity + 1)}
                                >
                                  <span className="sr-only">Increase quantity</span>
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                className="font-medium text-primary hover:text-gray-500"
                                onClick={() => removeFromCart(product.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {(cart?.items?.length || 0) > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-primary">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-dark"
                    onClick={onClose}
                  >
                    Checkout
                  </Link>
                </div>
                <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{" "}
                    <button type="button" className="font-medium text-primary hover:text-gray-500" onClick={onClose}>
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
