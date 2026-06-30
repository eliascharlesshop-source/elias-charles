'use client'

import Link from 'next/link'
import { WardrobeItem } from '@/data/wardrobe-items'
import { motion } from 'framer-motion'
import { X, Gift } from 'lucide-react'

interface SelectedItem {
  item: WardrobeItem
  size: string
}

interface BoxHUDProps {
  selectedItems: SelectedItem[]
  totalPrice: number
  onRemoveItem: (itemId: string) => void
}

export function BoxHUD({ selectedItems, totalPrice, onRemoveItem }: BoxHUDProps) {
  const itemCount = selectedItems.length
  const maxItems = 6
  const fillPercentage = (itemCount / maxItems) * 100
  const isBoxFull = itemCount >= maxItems

  return (
    <motion.div 
      className="bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-8 space-y-4 sm:space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with box badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
            <Gift className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Your Box</span>
          </h3>
          <p className="text-xs text-gray-600 mt-1">{itemCount}/{maxItems} items</p>
        </div>
        {isBoxFull && (
          <motion.span 
            className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            FULL
          </motion.span>
        )}
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-black to-gray-800"
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center">
          {itemCount} of {maxItems} items selected
        </p>
      </motion.div>

      {/* Items List */}
      <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
        {selectedItems.length === 0 ? (
          <motion.p 
            className="text-xs sm:text-sm text-gray-500 text-center py-4 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Start building by selecting items
          </motion.p>
        ) : (
          selectedItems.map((selected, idx) => (
            <motion.div 
              key={idx} 
              className="flex items-start justify-between text-xs sm:text-sm bg-white border border-gray-100 p-2 sm:p-3 rounded-lg hover:border-gray-300 transition-colors gap-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 line-clamp-1 text-xs sm:text-sm">{selected.item.name}</p>
                <p className="text-xs text-gray-500">{selected.size} • ${selected.item.price}</p>
              </div>
              <button
                onClick={() => onRemoveItem(selected.item.id)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1 transition-colors flex-shrink-0"
                aria-label="Remove item"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Divider */}
      {selectedItems.length > 0 && <div className="border-t border-gray-100" />}

      {/* Price Summary with calculation */}
      {selectedItems.length > 0 && (
        <motion.div 
          className="space-y-2 sm:space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Avg per item</span>
            <span>${(totalPrice / itemCount).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 sm:pt-3 flex justify-between text-sm sm:text-base font-bold">
            <span>Total Value</span>
            <span className="text-black">${totalPrice.toFixed(2)}</span>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Link
          href="/boxes/customize"
          className={`block w-full py-2.5 sm:py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 ${
            selectedItems.length > 0
              ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => selectedItems.length === 0 && e.preventDefault()}
        >
          Customize Box
        </Link>
        {selectedItems.length > 0 && (
          <button
            className="w-full py-2 sm:py-2.5 px-4 text-xs sm:text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Start Over
          </button>
        )}
      </div>

      {/* Benefits */}
      <div className="bg-blue-50 rounded-lg p-2.5 sm:p-3 space-y-2">
        <p className="text-xs font-semibold text-blue-900">✓ Box Perks</p>
        <ul className="text-xs text-blue-800 space-y-0.5">
          <li>• Free shipping worldwide</li>
          <li>• 30-day guarantee</li>
          <li>• Curated by stylists</li>
        </ul>
      </div>
    </motion.div>
  )
}
