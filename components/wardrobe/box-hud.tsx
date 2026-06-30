'use client'

import Link from 'next/link'
import { WardrobeItem } from '@/data/wardrobe-items'

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8 space-y-6">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-lg">Your Box</h3>
        <p className="text-sm text-gray-600">{itemCount} items selected</p>
      </div>

      {/* Items List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {selectedItems.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Add items to get started</p>
        ) : (
          selectedItems.map((selected, idx) => (
            <div key={idx} className="flex items-start justify-between text-sm bg-gray-50 p-3 rounded">
              <div className="flex-1">
                <p className="font-medium text-gray-900 line-clamp-1">{selected.item.name}</p>
                <p className="text-xs text-gray-600">{selected.size} • ${selected.item.price}</p>
              </div>
              <button
                onClick={() => onRemoveItem(selected.item.id)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Divider */}
      {selectedItems.length > 0 && <div className="border-t border-gray-200" />}

      {/* Price Summary */}
      {selectedItems.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href="/boxes/customize"
          className={`block w-full py-3 px-4 text-center font-medium rounded-lg transition-colors ${
            selectedItems.length > 0
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => selectedItems.length === 0 && e.preventDefault()}
        >
          Continue to Customize
        </Link>
        <button
          className="w-full py-2 px-4 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>✓ Free shipping on all boxes</p>
        <p>✓ 30-day return policy</p>
        <p>✓ Curated by EC stylists</p>
      </div>
    </div>
  )
}
