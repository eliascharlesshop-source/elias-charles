'use client'

import Image from 'next/image'
import { WardrobeItem } from '@/data/wardrobe-items'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ItemCardProps {
  item: WardrobeItem
  isSelected: boolean
  onSelect: (item: WardrobeItem) => void
  onSizeSelect?: (size: string) => void
}

export function ItemCard({ item, isSelected, onSelect, onSizeSelect }: ItemCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(item)}
      className={`relative group rounded-xl overflow-hidden transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-black shadow-xl scale-105' 
          : 'hover:shadow-lg hover:scale-102'
      }`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-500 ${
            isSelected ? 'scale-110' : 'group-hover:scale-110'
          }`}
        />
        
        {/* Selection indicator */}
        {isSelected && (
          <motion.div 
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-black text-white rounded-full p-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Check className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
      </div>
      
      {/* Info card - always visible at bottom with hover animation */}
      <motion.div 
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-black/80 text-white p-4 transform transition-transform duration-300"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ y: 0 }}
      >
        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{item.name}</h3>
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 text-xs">
            <span className="font-medium">${item.price}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">{item.color}</span>
          </div>
          {isSelected && (
            <span className="text-xs font-bold bg-white text-black px-2 py-0.5 rounded-full">
              Added
            </span>
          )}
        </div>
      </motion.div>

      {/* Closet rack hanger visual - top decoration */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-8 h-3 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
      />
    </motion.button>
  )
}
