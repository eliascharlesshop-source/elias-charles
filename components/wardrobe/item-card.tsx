'use client'

import Image from 'next/image'
import { WardrobeItem } from '@/data/wardrobe-items'

interface ItemCardProps {
  item: WardrobeItem
  isSelected: boolean
  onSelect: (item: WardrobeItem) => void
  onSizeSelect?: (size: string) => void
}

export function ItemCard({ item, isSelected, onSelect, onSizeSelect }: ItemCardProps) {
  return (
    <button
      onClick={() => onSelect(item)}
      className={`relative group rounded-lg overflow-hidden transition-all duration-300 ${
        isSelected ? 'ring-2 ring-black shadow-lg' : 'hover:shadow-md'
      }`}
    >
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      
      <div className="absolute inset-x-0 bottom-0 bg-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-medium text-sm text-black line-clamp-1">{item.name}</h3>
        <p className="text-xs text-gray-600">${item.price}</p>
        <p className="text-xs text-gray-500">{item.color}</p>
      </div>
    </button>
  )
}
