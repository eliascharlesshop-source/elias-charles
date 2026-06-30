'use client'

import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/src/components/layout/layout'
import Image from 'next/image'

interface BoxItem {
  id: string
  name: string
  price: number
  image: string
}

interface Addon {
  id: string
  name: string
  price: number
  description: string
}

const ADDONS: Addon[] = [
  { id: 'gift-wrap', name: 'Premium Gift Wrap', price: 10, description: 'Luxury packaging' },
  { id: 'personal-note', name: 'Personal Stylist Note', price: 5, description: 'Custom styling tips' },
  { id: 'extra-item', name: 'Extra Item Credit', price: 25, description: '+$25 product credit' },
  { id: 'care-guide', name: 'Care Guide Bundle', price: 8, description: 'Item care instructions' },
]

export default function CustomizePage() {
  const [boxName, setBoxName] = useState('')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'annual'>('monthly')

  // Mock data - in real app, this would come from previous page state or URL params
  const mockBoxItems: BoxItem[] = [
    { id: '1', name: 'Ocean Breeze Linen Shirt', price: 89, image: '/products/men-urban-style.png' },
    { id: '2', name: 'Sustainable Denim Jeans', price: 120, image: '/products/sustainable-fashion-collage.png' },
    { id: '3', name: 'Canvas Sneakers', price: 85, image: '/products/men-casual-hoodie.png' },
  ]

  const addonTotal = selectedAddons.reduce((sum, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return sum + (addon?.price || 0)
  }, 0)

  const boxTotal = mockBoxItems.reduce((sum, item) => sum + item.price, 0)
  const total = boxTotal + addonTotal

  const handleToggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter(id => id !== addonId))
    } else {
      setSelectedAddons([...selectedAddons, addonId])
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 py-8 px-6 sm:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-semibold">1</div>
              <div className="h-1 flex-1 bg-black" />
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-semibold">2</div>
              <div className="h-1 flex-1 bg-gray-300" />
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600 text-sm font-semibold">3</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Customize Your Box</h1>
            <p className="text-gray-600 mt-2">Add the finishing touches to your curated collection</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Customization Options */}
            <div className="lg:col-span-2 space-y-12">
              {/* Box Name */}
              <div>
                <label className="block text-sm font-semibold mb-3">Give Your Box a Name</label>
                <input
                  type="text"
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  placeholder="e.g., 'Summer Getaway', 'Urban Explorer'"
                  maxLength={50}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-500 mt-2">{boxName.length}/50 characters</p>
              </div>

              {/* Subscription Frequency */}
              <div>
                <label className="block text-sm font-semibold mb-4">Delivery Frequency</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'one-time', label: 'One-Time', description: 'Single delivery' },
                    { id: 'monthly', label: 'Monthly', description: 'Every month' },
                    { id: 'annual', label: 'Annual', description: 'Every 12 months' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFrequency(option.id as any)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        frequency === option.id
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold text-sm">{option.label}</div>
                      <div className={`text-xs mt-1 ${frequency === option.id ? 'text-gray-200' : 'text-gray-600'}`}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <label className="block text-sm font-semibold mb-4">Optional Add-ons</label>
                <div className="space-y-3">
                  {ADDONS.map((addon) => (
                    <button
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                        selectedAddons.includes(addon.id)
                          ? 'border-black bg-black/5'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{addon.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{addon.description}</div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">+${addon.price}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Items */}
              <div>
                <label className="block text-sm font-semibold mb-4">Your Items ({mockBoxItems.length})</label>
                <div className="space-y-3">
                  {mockBoxItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 rounded bg-gray-200 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Selected • M</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">${item.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-8 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Order Summary</h3>
                  {boxName && <p className="text-sm text-gray-600">"{boxName}"</p>}
                </div>

                <div className="space-y-3 border-t border-gray-300 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({mockBoxItems.length})</span>
                    <span className="font-medium">${boxTotal.toFixed(2)}</span>
                  </div>
                  {addonTotal > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Add-ons ({selectedAddons.length})</span>
                      <span className="font-medium">${addonTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-base pt-3 border-t border-gray-300">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <p>
                    <span className="font-semibold">Delivery:</span> {
                      frequency === 'one-time' ? 'Ships in 5-7 business days' :
                      frequency === 'monthly' ? 'First shipment in 5-7 days, then monthly' :
                      'First shipment in 5-7 days, then annually'
                    }
                  </p>
                  <p><span className="font-semibold">Returns:</span> 30-day guarantee</p>
                </div>

                <div className="space-y-3 border-t border-gray-300 pt-6">
                  <Link
                    href="/boxes/checkout"
                    className="block w-full py-3 px-4 text-center font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/boxes"
                    className="block w-full py-3 px-4 text-center font-medium border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Build
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
