'use client'

import { useState } from 'react'
import Layout from '@/src/components/layout/layout'
import { CategoryRail } from '@/components/wardrobe/category-rail'
import { ItemCard } from '@/components/wardrobe/item-card'
import { Mannequin } from '@/components/wardrobe/mannequin'
import { BoxHUD } from '@/components/wardrobe/box-hud'
import { WARDROBE_ITEMS, CATEGORIES, ItemCategory, getItemsByCategory } from '@/data/wardrobe-items'

interface SelectedItem {
  item: typeof WARDROBE_ITEMS[0]
  size: string
}

export default function WardroobeBuilderPage() {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('tops')
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [showSizeSelector, setShowSizeSelector] = useState<string | null>(null)

  const categoryItems = getItemsByCategory(selectedCategory)

  const handleSelectItem = (item: typeof WARDROBE_ITEMS[0]) => {
    // Show size selector modal
    setShowSizeSelector(item.id)
  }

  const handleConfirmSize = (itemId: string, size: string) => {
    const item = WARDROBE_ITEMS.find(i => i.id === itemId)
    if (item) {
      setSelectedItems([...selectedItems, { item, size }])
      setShowSizeSelector(null)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(s => s.item.id !== itemId))
  }

  const handleClearAll = () => {
    setSelectedItems([])
  }

  const totalPrice = selectedItems.reduce((sum, s) => sum + s.item.price, 0)

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 py-12 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Build Your Box</h1>
            <p className="text-lg text-gray-600">Curate your perfect collection. Select items from each category to build your personalized box.</p>
          </div>
        </div>

        {/* Builder Layout */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Left: Category Rail */}
            <div className="lg:col-span-1 h-fit">
              <CategoryRail 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            {/* Center: Items Grid */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 uppercase tracking-wider font-semibold">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.label} ({categoryItems.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItems.some(s => s.item.id === item.id)}
                      onSelect={handleSelectItem}
                    />
                  ))}
                </div>
              </div>

              {/* Mannequin Display */}
              <div className="mt-12">
                <p className="text-sm text-gray-600 uppercase tracking-wider font-semibold mb-4">Your Outfit</p>
                <Mannequin selectedItems={selectedItems} />
              </div>
            </div>

            {/* Right: Box HUD */}
            <div className="lg:col-span-1">
              <BoxHUD
                selectedItems={selectedItems}
                totalPrice={totalPrice}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>
        </div>

        {/* Size Selector Modal */}
        {showSizeSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Select Size</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {WARDROBE_ITEMS.find(i => i.id === showSizeSelector)?.name}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {WARDROBE_ITEMS.find(i => i.id === showSizeSelector)?.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => handleConfirmSize(showSizeSelector, size)}
                    className={`py-2 rounded font-medium text-sm transition-colors ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSizeSelector(null)}
                  className="flex-1 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirmSize(showSizeSelector, selectedSize)}
                  className="flex-1 py-2 bg-black text-white rounded font-medium hover:bg-gray-800"
                >
                  Add to Box
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-gray-50 border-t border-gray-200 py-12 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-2">How It Works</h3>
                <p className="text-sm text-gray-600">Select items from each category. Mix and match to create your perfect wardrobe. We'll assemble your personalized box.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Flexible Plans</h3>
                <p className="text-sm text-gray-600">Choose one-time, monthly, or annual subscription. Customize your box before each delivery. Cancel anytime.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Curated Quality</h3>
                <p className="text-sm text-gray-600">Every item is hand-selected by our stylists. Premium sustainable materials. Perfect for any lifestyle.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
