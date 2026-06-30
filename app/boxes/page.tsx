'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Header */}
        <div className="border-b border-gray-200 py-16 px-6 sm:px-12 bg-white">
          <motion.div 
            className="max-w-7xl mx-auto text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Build Your Box
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Select items from our curated closet rack to create your perfect personalized box.
            </motion.p>
          </motion.div>
        </div>

        {/* Builder Layout */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Category Rail */}
            <motion.div 
              className="lg:col-span-1 h-fit"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CategoryRail 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </motion.div>

            {/* Center: Items Grid + Mannequin */}
            <motion.div 
              className="lg:col-span-2 space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {/* Closet Rack Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-300" />
                  <p className="text-sm text-gray-600 uppercase tracking-wider font-bold px-4 whitespace-nowrap">
                    Closet Rack
                  </p>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                <div className="inline-block text-sm font-semibold text-gray-700 mb-4">
                  <span className="text-2xl">👕 </span>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                  <span className="ml-2 text-gray-500">({categoryItems.length} items)</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {categoryItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ItemCard
                        item={item}
                        isSelected={selectedItems.some(s => s.item.id === item.id)}
                        onSelect={handleSelectItem}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Avatar Display Section */}
              <motion.div 
                className="space-y-6 pt-8 border-t-2 border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-300" />
                  <p className="text-sm text-gray-600 uppercase tracking-wider font-bold px-4 whitespace-nowrap">
                    Your Avatar
                  </p>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>
                <Mannequin selectedItems={selectedItems} />
              </motion.div>
            </motion.div>

            {/* Right: Box HUD */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
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
