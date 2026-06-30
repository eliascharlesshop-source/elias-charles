'use client'

import { useState } from 'react'
import { WardrobeItem } from '@/data/wardrobe-items'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'

interface ItemDetailsDrawerProps {
  item: WardrobeItem | null
  isOpen: boolean
  onClose: () => void
  onAddToBox: (size: string) => void
  isSelected: boolean
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function ItemDetailsDrawer({ 
  item, 
  isOpen, 
  onClose, 
  onAddToBox, 
  isSelected 
}: ItemDetailsDrawerProps) {
  const [selectedSize, setSelectedSize] = useState('M')

  if (!item) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-3xl">
              <h2 className="font-semibold text-lg text-gray-900">{item.name}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="w-16 h-16 rounded-lg bg-gray-100 cursor-pointer hover:ring-2 hover:ring-black transition-all">
                      <Image src={item.image} alt="View" width={64} height={64} className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Item Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                  <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {item.color}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Premium {item.category} crafted from sustainable materials. Perfect for everyday wear with versatile styling options.
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Select Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg font-medium text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-black text-white shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Color/Style Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Style Options</h3>
                <div className="flex gap-3">
                  {['Black', 'White', 'Navy'].map((color) => (
                    <button
                      key={color}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium text-sm transition-all hover:scale-105 ${
                        color === item.color
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                onClick={() => onAddToBox(selectedSize)}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected ? 'Update in Box' : 'Add to Box'}
              </motion.button>

              {/* Additional Info */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm text-blue-900">
                <p className="font-semibold">✓ Free returns within 30 days</p>
                <p>✓ Sustainably sourced materials</p>
                <p>✓ Ships within 2-3 business days</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
