"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/commerce/cart-provider"
import { PageTitle, SectionTitle, BodyText, SmallText } from "@/components/layout/typography"

interface CartItem {
  id: string
  title: string
  price: string
  image?: string
  size?: string
  color?: string
  quantity: number
}

interface LocalCart {
  id: string
  lines: CartItem[]
  totalQuantity: number
}

export default function CartPage() {
  // Defensive fallback for SSR/prerender: always provide a cart object
  const cartContext = useCart();
  const cart: LocalCart = cartContext?.cart ?? { id: 'temp', lines: [], totalQuantity: 0 };
  const removeFromCart = cartContext?.removeFromCart ?? (() => {});
  const updateLineQuantity = cartContext?.updateLineQuantity ?? (() => {});
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
    }
  };

  // Calculate subtotal
  const subtotal = (cart?.lines ?? []).reduce((total, item) => {
    const price = Number.parseFloat(item.price?.replace("$", "") || "0");
    return total + price * item.quantity;
  }, 0);

  // Calculate discount
  const discount = promoApplied ? subtotal * 0.1 : 0;

  // Calculate shipping (free over $100)
  const shipping = subtotal > 100 ? 0 : 10;

  // Calculate tax
  const tax = (subtotal - discount) * 0.08;

  // Calculate total
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="bg-cream dark:bg-dark-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12">
          <PageTitle className="text-center mb-8 sm:mb-12">Your Cart</PageTitle>

          {(cart?.lines?.length ?? 0) === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <SectionTitle className="mt-4 text-lg font-medium text-primary">Your cart is empty</SectionTitle>
              <BodyText className="mt-2 text-gray-500">
                Looks like you haven't added anything to your cart yet.
              </BodyText>
              <div className="mt-6">
                <Link
                  href="/collections"
                  className="inline-block rounded-md bg-primary px-4 py-3 text-base font-normal tracking-wider uppercase text-white hover:bg-dark transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
              <div className="lg:col-span-7">
                <div className="bg-card rounded-lg shadow-sm p-6">
                  <ul role="list" className="divide-y divide-border">
                    {(cart?.lines ?? []).map((product) => (
                      <li key={product.id} className="flex py-6 sm:py-8">
                        <div className="flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg?height=96&width=96"}
                            alt={product.title}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-primary">
                                <Link href={`/products/${product.id}`} className="hover:text-dark transition-colors duration-200">
                                  {product.title}
                                </Link>
                              </h3>
                              <p className="ml-4 text-sm font-medium text-primary">{product.price}</p>
                            </div>
                            <p className="mt-1 text-sm steel-text">
                              {product.color && <span>{product.color}</span>}
                              {product.size && <span className="ml-2">{product.size}</span>}
                            </p>
                          </div>

                          <div className="mt-4 flex flex-1 items-end justify-between">
                            <div className="flex items-center border border-border rounded-md">
                              <button
                                type="button"
                                className="p-2 steel-text hover:text-foreground transition-colors duration-200"
                                onClick={() => updateLineQuantity(product.id, Math.max(1, product.quantity - 1))}
                              >
                                <span className="sr-only">Decrease quantity</span>
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-4 text-sm text-primary">{product.quantity}</span>
                              <button
                                type="button"
                                className="p-2 steel-text hover:text-foreground transition-colors duration-200"
                                onClick={() => updateLineQuantity(product.id, product.quantity + 1)}
                              >
                                <span className="sr-only">Increase quantity</span>
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>

                            <button
                              type="button"
                              className="ml-4 text-sm font-medium text-primary hover:text-red-600 transition-colors duration-200"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t border-border">
                    <Link href="/collections" className="text-sm font-medium text-primary hover:text-dark transition-colors duration-200">
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-10 lg:col-span-5 lg:mt-0">
                <div className="sticky top-6 rounded-lg bg-card shadow-sm px-4 py-6 sm:p-6 lg:p-8">
                  <SectionTitle className="text-lg font-medium text-primary">Order summary</SectionTitle>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm steel-text">Subtotal</p>
                      <p className="text-sm font-medium text-primary">${subtotal.toFixed(2)}</p>
                    </div>

                    {promoApplied && (
                      <div className="flex items-center justify-between text-green-600">
                        <p className="text-sm">Discount (10%)</p>
                        <p className="text-sm font-medium">-${discount.toFixed(2)}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm steel-text">Shipping</p>
                      <p className="text-sm font-medium text-primary">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm steel-text">Tax</p>
                      <p className="text-sm font-medium text-primary">${tax.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-base font-medium text-primary">Order total</p>
                      <p className="text-base font-medium text-primary">${total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <form onSubmit={handleApplyPromo}>
                      <SmallText className="block text-sm font-medium text-primary">Promo code</SmallText>
                      <div className="mt-1 flex space-x-2">
                        <input
                          type="text"
                          id="promo-code"
                          name="promo-code"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter promo code"
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && <p className="mt-2 text-sm text-red-600">{promoError}</p>}
                      {promoApplied && <p className="mt-2 text-sm text-green-600">Promo code applied!</p>}
                      <p className="mt-1 text-xs text-gray-500">Try "DISCOUNT10" for 10% off</p>
                    </form>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/checkout"
                      className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center transition-colors duration-200 uppercase tracking-wider"
                    >
                      Secure Checkout
                    </Link>
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Secure SSL encrypted checkout powered by Shopify
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
