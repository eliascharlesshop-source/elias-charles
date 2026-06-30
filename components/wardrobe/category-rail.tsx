'use client'

import { ItemCategory, CATEGORIES } from '@/data/wardrobe-items'
import { motion } from 'framer-motion'

interface CategoryRailProps {
  selectedCategory: ItemCategory
  onSelectCategory: (category: ItemCategory) => void
}

export function CategoryRail({ selectedCategory, onSelectCategory }: CategoryRailProps) {
  return (
    <motion.div 
      className="flex flex-col gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-3 px-1">Browse</p>
        <div className="space-y-1">
          {CATEGORIES.map((category, idx) => (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden group ${
                selectedCategory === category.id
                  ? 'text-white bg-black shadow-lg'
                  : 'text-gray-700 hover:text-black hover:bg-gray-100'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {/* Background gradient for selected state */}
              {selectedCategory === category.id && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 -z-10"
                  layoutId="category-bg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <span className="relative flex items-center gap-2">
                <span className="w-2 h-2 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {category.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <motion.div 
        className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1 border border-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="font-semibold text-gray-700">Closet Tips</p>
        <p>• Mix & match freely</p>
        <p>• All items curated</p>
        <p>• Free returns</p>
      </motion.div>
    </motion.div>
  )
}
