'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

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
      <div className="min-h-screen bg-cream">
        {/* Header */}
        <div className="border-b border-gray-200 py-12 px-6 sm:px-12">
          <motion.div 
            className="max-w-7xl mx-auto text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-3">Build Your Box</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select items from our curated closet rack to create your perfect personalized box.
            </p>
          </motion.div>
        </div>

        {/* 3-Panel Builder Layout */}
        <div className="relative h-full py-8 px-4 sm:px-6">
          <div className="flex gap-4 h-full">
            {/* Left Panel - Categories */}
            <AnimatePresence mode="wait">
              {leftPanelOpen && (
                <motion.div
                  key="left-panel"
                  initial={{ opacity: 0, x: -300, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: -300, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit sticky top-8">
                    <CategoryRail 
                      selectedCategory={selectedCategory}
                      onSelectCategory={setSelectedCategory}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse Left Toggle */}
            <motion.button
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className="flex-shrink-0 h-fit sticky top-8 bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {leftPanelOpen ? (
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>

            {/* Center Panel - Content */}
            <motion.div
              className="flex-1 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Closet Rack Section */}
              <div className="space-y-6 mb-12">
                <h2 className="text-sm uppercase tracking-wider font-bold text-gray-700">
                  {CATEGORIES.find(c => c.id === selectedCategory)?.label} ({categoryItems.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categoryItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
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
              <div className="space-y-6 pt-8 border-t border-gray-300">
                <h2 className="text-sm uppercase tracking-wider font-bold text-gray-700">Your Avatar</h2>
                <Mannequin selectedItems={selectedItems} />
              </div>
            </motion.div>

            {/* Collapse Right Toggle */}
            <motion.button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className="flex-shrink-0 h-fit sticky top-8 bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {rightPanelOpen ? (
                <ChevronRight className="w-5 h-5 text-gray-700" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>

            {/* Right Panel - Box HUD */}
            <AnimatePresence mode="wait">
              {rightPanelOpen && (
                <motion.div
                  key="right-panel"
                  initial={{ opacity: 0, x: 300, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: 300, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-fit sticky top-8">
                    <BoxHUD
                      selectedItems={selectedItems}
                      totalPrice={totalPrice}
                      onRemoveItem={handleRemoveItem}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
        <div className="border-t border-gray-200 py-12 px-6 sm:px-12">
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
