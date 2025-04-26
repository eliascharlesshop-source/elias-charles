"use client"

import { useState } from "react"
import Layout from "../components/layout"

export default function StoreLocatorPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all")

  const stores = [
    {
      name: "EC Venice Beach",
      region: "west",
      address: "123 Ocean Avenue, Venice Beach, CA 90291",
      phone: "(310) 555-1234",
      hours: "Monday-Saturday: 10am-7pm, Sunday: 11am-5pm",
      features: ["Flagship Store", "Surfboard Rentals", "Cafe", "Events Space"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Santa Monica",
      region: "west",
      address: "456 Promenade Way, Santa Monica, CA 90401",
      phone: "(310) 555-5678",
      hours: "Monday-Saturday: 10am-9pm, Sunday: 11am-6pm",
      features: ["Full Collection", "Board Shaping Studio"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC San Diego",
      region: "west",
      address: "789 Coast Highway, San Diego, CA 92037",
      phone: "(619) 555-9012",
      hours: "Monday-Saturday: 9am-7pm, Sunday: 10am-6pm",
      features: ["Surf Lessons", "Board Rentals"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Brooklyn",
      region: "east",
      address: "321 Atlantic Avenue, Brooklyn, NY 11217",
      phone: "(718) 555-3456",
      hours: "Monday-Saturday: 11am-8pm, Sunday: 12pm-6pm",
      features: ["Full Collection", "Coffee Bar"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Miami",
      region: "east",
      address: "555 Collins Avenue, Miami Beach, FL 33139",
      phone: "(305) 555-7890",
      hours: "Monday-Sunday: 10am-9pm",
      features: ["Beachwear Collection", "Surf Rentals"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Austin",
      region: "central",
      address: "246 South Congress, Austin, TX 78704",
      phone: "(512) 555-2468",
      hours: "Monday-Saturday: 10am-8pm, Sunday: 12pm-6pm",
      features: ["Skate Shop", "Community Events"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Chicago",
      region: "central",
      address: "135 North Michigan Avenue, Chicago, IL 60601",
      phone: "(312) 555-1357",
      hours: "Monday-Saturday: 10am-8pm, Sunday: 11am-6pm",
      features: ["Full Collection", "Skate Shop"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC London",
      region: "international",
      address: "78 Carnaby Street, London W1F 9JF, UK",
      phone: "+44 20 7123 4567",
      hours: "Monday-Saturday: 10am-7pm, Sunday: 12pm-6pm",
      features: ["Full Collection", "Tea Bar"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Sydney",
      region: "international",
      address: "42 Bondi Road, Bondi Beach, Sydney NSW 2026, Australia",
      phone: "+61 2 9876 5432",
      hours: "Monday-Sunday: 9am-6pm",
      features: ["Surf Shop", "Board Rentals", "Lessons"],
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      name: "EC Tokyo",
      region: "international",
      address: "1-2-3 Shibuya, Shibuya-ku, Tokyo 150-0002, Japan",
      phone: "+81 3 1234 5678",
      hours: "Monday-Sunday: 11am-8pm",
      features: ["Apparel Collection", "Cafe"],
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const filteredStores = selectedRegion === "all" ? stores : stores.filter((store) => store.region === selectedRegion)

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1600"
            alt="EC Store exterior"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#373737] mix-blend-multiply opacity-30" />
        </div>
        <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">Find a Store</h1>
            <p className="mt-6 text-lg leading-8 text-white">
              Visit one of our retail locations to experience EC products in person.
            </p>
          </div>
        </div>
      </div>

      {/* Store Locator Content */}
      <div className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Region Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setSelectedRegion("all")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedRegion === "all" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                All Locations
              </button>
              <button
                onClick={() => setSelectedRegion("west")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedRegion === "west" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                West Coast
              </button>
              <button
                onClick={() => setSelectedRegion("east")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedRegion === "east" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                East Coast
              </button>
              <button
                onClick={() => setSelectedRegion("central")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedRegion === "central" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                Central US
              </button>
              <button
                onClick={() => setSelectedRegion("international")}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedRegion === "international" ? "bg-primary text-white" : "bg-white text-primary"
                }`}
              >
                International
              </button>
            </div>

            {/* Store Listings */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredStores.map((store) => (
                <div key={store.name} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={store.image || "/placeholder.svg"}
                      alt={`${store.name} storefront`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-light text-primary">{store.name}</h3>
                    <p className="mt-2 text-primary">{store.address}</p>
                    <p className="mt-1 text-primary">{store.phone}</p>
                    <p className="mt-1 text-sm text-gray-500">{store.hours}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {store.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-primary"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:text-gray-500 border-b border-primary pb-1 hover:border-gray-500"
                      >
                        Get Directions
                      </a>
                      <a
                        href={`tel:${store.phone.replace(/[^0-9+]/g, "")}`}
                        className="text-sm font-medium text-primary hover:text-gray-500 border-b border-primary pb-1 hover:border-gray-500"
                      >
                        Call Store
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-primary">No stores found in this region.</p>
              </div>
            )}

            {/* Wholesale Section */}
            <div className="mt-24 bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-light text-primary">Interested in Wholesale?</h2>
              <p className="mt-4 text-primary">
                If you're a retailer interested in carrying EC products, we'd love to hear from you. Our wholesale
                program offers competitive pricing, flexible minimums, and dedicated support.
              </p>
              <div className="mt-6">
                <a
                  href="/contact"
                  className="inline-flex items-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  Contact Wholesale Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
