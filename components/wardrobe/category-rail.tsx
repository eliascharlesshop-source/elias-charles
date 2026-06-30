'use client'

import { ItemCategory, CATEGORIES } from '@/data/wardrobe-items'

interface CategoryRailProps {
  selectedCategory: ItemCategory
  onSelectCategory: (category: ItemCategory) => void
}

export function CategoryRail({ selectedCategory, onSelectCategory }: CategoryRailProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-600 px-4">Categories</p>
      <div className="flex flex-col gap-1">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 text-left text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'text-black bg-gray-100 border-l-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
