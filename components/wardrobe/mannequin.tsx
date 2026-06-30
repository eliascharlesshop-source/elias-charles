'use client'

import { WardrobeItem } from '@/data/wardrobe-items'
import Image from 'next/image'

interface SelectedItem {
  item: WardrobeItem
  size: string
}

interface MannequinProps {
  selectedItems: SelectedItem[]
}

export function Mannequin({ selectedItems }: MannequinProps) {
  // Group items by category for visual layering
  const topItem = selectedItems.find(s => s.item.category === 'tops')
  const bottomItem = selectedItems.find(s => s.item.category === 'bottoms')
  const outerwearItem = selectedItems.find(s => s.item.category === 'outerwear')
  const shoeItem = selectedItems.find(s => s.item.category === 'footwear')
  const accessories = selectedItems.filter(s => s.item.category === 'accessories')

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 min-h-96">
      {selectedItems.length === 0 ? (
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-gray-600 text-sm">Select items to build your outfit</p>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="aspect-square relative bg-white rounded-lg overflow-hidden flex items-center justify-center">
            {/* Simplified outfit display showing selected items as a grid */}
            <div className="grid grid-cols-3 gap-2 w-full h-full p-4">
              {selectedItems.map((selected, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded bg-gray-100 overflow-hidden group"
                >
                  <Image
                    src={selected.item.image}
                    alt={selected.item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="w-full bg-black/80 text-white p-2 text-xs">
                      {selected.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Item summary */}
          <div className="space-y-2">
            {topItem && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Top</span>
                <span className="text-gray-700">{topItem.item.name}</span>
                <span className="text-gray-500 text-xs">({topItem.size})</span>
              </div>
            )}
            {bottomItem && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Bottom</span>
                <span className="text-gray-700">{bottomItem.item.name}</span>
                <span className="text-gray-500 text-xs">({bottomItem.size})</span>
              </div>
            )}
            {outerwearItem && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Layer</span>
                <span className="text-gray-700">{outerwearItem.item.name}</span>
                <span className="text-gray-500 text-xs">({outerwearItem.size})</span>
              </div>
            )}
            {shoeItem && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Shoes</span>
                <span className="text-gray-700">{shoeItem.item.name}</span>
                <span className="text-gray-500 text-xs">({shoeItem.size})</span>
              </div>
            )}
            {accessories.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Acc</span>
                <span className="text-gray-700">{accessories.map(a => a.item.name).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
