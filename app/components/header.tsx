"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { X, Menu, Search, ShoppingBag, User, ChevronDown } from "lucide-react"
import { useCart } from "./cart-provider"
import { useAuth } from "./auth-provider"
import { MiniCart } from "./mini-cart"
import Link from "next/link"

export function Header({ shop }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [activeMegaMenu, setActiveMegaMenu] = useState(null)

  // Add null checks when destructuring cart context
  const cartContext = useCart()
  const {
    cart = { lines: [], totalQuantity: 0 },
    totalQuantity = 0,
    removeFromCart = () => {},
    updateLineQuantity = () => {},
  } = cartContext || {}

  const { user, isAuthenticated, logout } = useAuth() || { isAuthenticated: false, logout: () => {} }

  // Ensure relative links work correctly
  const handleNavigate = (e, href) => {
    e.preventDefault()
    // Close any open modals
    setIsNavOpen(false)
    setIsSearchOpen(false)
    setActiveMegaMenu(null)
    // Navigate to the link
    router.push(href)
  }

  // Mock search functionality
  const handleSearch = (query) => {
    setSearchQuery(query)

    // Mock search results based on query
    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    // Simulate search results
    const mockResults = [
      { id: 1, title: "Classic Surf T-Shirt", price: "$45", image: "/placeholder.svg?height=100&width=100" },
      { id: 2, title: "Relaxed Fit Hoodie", price: "$85", image: "/placeholder.svg?height=100&width=100" },
      { id: 3, title: "Board Shorts", price: "$65", image: "/placeholder.svg?height=100&width=100" },
    ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))

    setSearchResults(mockResults)
  }

  const toggleMegaMenu = (id) => {
    if (activeMegaMenu === id) {
      setActiveMegaMenu(null)
    } else {
      setActiveMegaMenu(id)
    }
  }

  const navigation = {
    categories: [
      {
        id: "women",
        name: "WOMEN",
        links: [
          { name: "New Arrivals", href: "/collections/women" },
          { name: "Clothing", href: "/collections/apparel" },
          { name: "Accessories", href: "/collections/apparel/sunglasses" },
          { name: "Self Care", href: "/collections/self-care" },
        ],
      },
      {
        id: "men",
        name: "MEN",
        links: [
          { name: "New Arrivals", href: "/collections/men" },
          { name: "Clothing", href: "/collections/apparel" },
          { name: "Boards", href: "/collections/boards" },
          { name: "Self Care", href: "/collections/self-care" },
        ],
      },
    ],
    pages: [
      { name: "IN LIFE", href: "/in-life" },
      { name: "SALE", href: "/collections/sale" },
    ],
  }

  // Reset search when path changes
  useEffect(() => {
    setSearchQuery("")
    setSearchResults([])
    setIsNavOpen(false)
    setIsSearchOpen(false)
    setActiveMegaMenu(null)
  }, [pathname])

  return (
    <div className="bg-cream z-10 relative">
      {/* Mobile menu */}
      <Dialog as="div" className="relative z-40 lg:hidden" open={isNavOpen} onClose={setIsNavOpen}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-cream pb-12 shadow-xl">
            <div className="flex px-4 pb-2 pt-5 justify-between">
              <button
                type="button"
                className="-m-2 inline-flex items-center justify-center rounded-md p-3 text-primary"
                onClick={() => setIsNavOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
              <Link href="/" className="flex items-center">
                <img
                  className="h-20 w-auto"
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EC_Logo-bgxGEWuMynVfb5FBtDj4k0kcx59kdZ.png"
                  alt="EC"
                />
              </Link>
              <div className="w-6"></div>
            </div>

            {/* Links */}
            <div className="mt-6 px-4 py-6 space-y-6 border-t border-gray-200">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    href={page.href}
                    className="-m-2 block p-2 font-normal tracking-widest uppercase text-primary"
                    onClick={(e) => handleNavigate(e, page.href)}
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.categories.map((category) => (
                <div key={category.name} className="flow-root">
                  <span className="-m-2 block p-2 font-medium text-primary text-base tracking-widest uppercase">
                    {category.name}
                  </span>
                  <div className="mt-4 pl-4 space-y-4">
                    {category.links.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-2 text-sm text-primary"
                        onClick={(e) => handleNavigate(e, item.href)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {isAuthenticated ? (
                <>
                  <div className="flow-root">
                    <Link
                      href="/profile"
                      className="-m-2 block p-2 font-medium text-primary"
                      onClick={(e) => handleNavigate(e, "/profile")}
                    >
                      My Profile
                    </Link>
                  </div>
                  <div className="flow-root">
                    <button onClick={logout} className="-m-2 block p-2 font-medium text-primary">
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <Link
                      href="/auth/login"
                      className="-m-2 block p-2 font-medium text-primary"
                      onClick={(e) => handleNavigate(e, "/auth/login")}
                    >
                      Sign in
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      href="/auth/signup"
                      className="-m-2 block p-2 font-medium text-primary"
                      onClick={(e) => handleNavigate(e, "/auth/signup")}
                    >
                      Create account
                    </Link>
                  </div>
                </>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Search dialog */}
      <Dialog as="div" className="relative z-40" open={isSearchOpen} onClose={setIsSearchOpen}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative flex w-full flex-col overflow-y-auto bg-cream pb-12 shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-primary">Search</h2>
              <button type="button" className="-m-2 p-2 text-primary" onClick={() => setIsSearchOpen(false)}>
                <span className="sr-only">Close search</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mx-auto mt-8 w-full max-w-3xl px-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <input
                  className="block w-full rounded-md border-0 bg-white py-3 pl-10 pr-3 text-primary placeholder:text-gray-400 focus:ring-2 focus:ring-accent"
                  placeholder="Search products..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-primary mb-2">Results</h3>
                  <div className="divide-y divide-gray-200">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/products/${result.id}`}
                        className="flex items-center py-4 hover:bg-gray-50"
                        onClick={(e) => {
                          setIsSearchOpen(false)
                          handleNavigate(e, `/products/${result.id}`)
                        }}
                      >
                        <img
                          src={result.image || "/placeholder.svg"}
                          alt={result.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-primary">{result.title}</p>
                          <p className="text-sm text-gray-500">{result.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="mt-4 text-center py-8">
                  <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <header className="relative bg-cream">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-24 items-center">
              <button
                type="button"
                className="rounded-md bg-cream p-3 text-primary hover:bg-gray-100 lg:hidden"
                onClick={() => setIsNavOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">EC</span>
                  <img
                    className="h-14 w-auto sm:h-16 md:h-20"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EC_Logo-bgxGEWuMynVfb5FBtDj4k0kcx59kdZ.png"
                    alt="EC"
                  />
                </Link>
              </div>

              {/* Simple navigation menu */}
              <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-10 py-2 pl-6">
                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-primary hover:text-gray-700 transition-colors duration-200"
                      onClick={(e) => handleNavigate(e, page.href)}
                    >
                      {page.name}
                    </Link>
                  ))}
                  {navigation.categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center text-sm font-medium text-primary hover:text-gray-700 transition-colors duration-200 relative"
                    >
                      <button
                        className="flex items-center space-x-1 focus:outline-none"
                        onClick={() => toggleMegaMenu(category.id)}
                        onMouseEnter={() => setActiveMegaMenu(category.id)}
                      >
                        <span>{category.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeMegaMenu === category.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Simple dropdown menu */}
                      {activeMegaMenu === category.id && (
                        <div
                          className="absolute top-full left-0 w-48 bg-white shadow-lg z-10 transition-all duration-200 ease-in-out py-2 rounded-md"
                          onMouseLeave={() => setActiveMegaMenu(null)}
                        >
                          {category.links.map((link) => (
                            <Link
                              key={link.name}
                              href={link.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200"
                              onClick={(e) => {
                                setActiveMegaMenu(null)
                                handleNavigate(e, link.href)
                              }}
                            >
                              {link.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {isAuthenticated ? (
                    <Link
                      href="/profile"
                      className="p-2 text-primary hover:text-gray-700 transition-colors duration-200"
                      onClick={(e) => handleNavigate(e, "/profile")}
                    >
                      <span className="sr-only">Profile</span>
                      <User className="h-6 w-6" aria-hidden="true" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-sm font-medium text-primary hover:text-gray-700 transition-colors duration-200"
                        onClick={(e) => handleNavigate(e, "/auth/login")}
                      >
                        Sign in
                      </Link>
                      <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                      <Link
                        href="/auth/signup"
                        className="text-sm font-medium text-primary hover:text-gray-700 transition-colors duration-200"
                        onClick={(e) => handleNavigate(e, "/auth/signup")}
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </div>

                {/* Search */}
                <div className="flex lg:ml-6">
                  <button
                    className="p-2 text-primary hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <span className="sr-only">Search</span>
                    <Search className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6 relative">
                  <button
                    className="group -m-2 flex items-center p-3 sm:p-4"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                  >
                    <ShoppingBag
                      className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-primary group-hover:text-gray-700 transition-colors duration-200"
                      aria-hidden="true"
                    />
                    <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium text-primary group-hover:text-gray-700 transition-colors duration-200">
                      {totalQuantity || 0}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </button>

                  {/* Use the MiniCart component */}
                  <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
