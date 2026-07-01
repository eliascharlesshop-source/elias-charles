'use client'

import { WardrobeItem } from '@/data/wardrobe-items'
import Image from 'next/image'
import { motion } from 'framer-motion'

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
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 rounded-2xl p-8 min-h-96 border border-gray-200">
      {selectedItems.length === 0 ? (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* SVG Avatar Silhouette */}
          <svg className="w-24 h-32 mx-auto mb-6 text-gray-400" viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="24" r="14" />
            <path d="M 50 40 L 50 80" />
            <path d="M 50 50 L 30 65 M 50 50 L 70 65" />
            <path d="M 50 80 L 35 110 M 50 80 L 65 110" />
          </svg>
          <p className="text-gray-600 text-sm font-medium">Your Outfit Awaits</p>
          <p className="text-gray-400 text-xs mt-1">Select items to preview</p>
        </motion.div>
      ) : (
        <motion.div 
          className="w-full space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 3D Avatar Display */}
          <div className="relative mx-auto w-40 h-56 bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
            {/* Body zones */}
            <svg className="absolute inset-0 w-full h-full text-gray-200" viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="50" cy="20" r="12" opacity="0.3" />
              <rect x="35" y="35" width="30" height="40" opacity="0.2" rx="4" />
              <rect x="35" y="80" width="30" height="50" opacity="0.2" rx="4" />
            </svg>

            {/* Layered items */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
              {outerwearItem && (
                <motion.div 
                  className="relative w-32 h-16 rounded bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <Image src={outerwearItem.item.image} alt={outerwearItem.item.name} fill className="object-cover" />
                  <div className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">Outer</div>
                </motion.div>
              )}
              
              {topItem && (
                <motion.div 
                  className="relative w-28 h-12 rounded bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Image src={topItem.item.image} alt={topItem.item.name} fill className="object-cover" />
                  <div className="absolute bottom-0.5 right-0.5 text-xs bg-black/70 text-white px-1 py-0.5 rounded">Top</div>
                </motion.div>
              )}
              
              {bottomItem && (
                <motion.div 
                  className="relative w-24 h-14 rounded bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <Image src={bottomItem.item.image} alt={bottomItem.item.name} fill className="object-cover" />
                  <div className="absolute bottom-0.5 right-0.5 text-xs bg-black/70 text-white px-1 py-0.5 rounded">Bot</div>
                </motion.div>
              )}
              
              {shoeItem && (
                <motion.div 
                  className="relative w-20 h-8 rounded bg-gray-50 overflow-hidden flex items-center justify-center border border-gray-100"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Image src={shoeItem.item.image} alt={shoeItem.item.name} fill className="object-cover" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Item summary - Detailed breakdown */}
          <div className="space-y-2 bg-white rounded-lg p-4 border border-gray-100">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-600 mb-3">Outfit Summary</h4>
            
            {topItem && (
              <motion.div className="flex items-center justify-between text-xs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-gray-700 font-medium">{topItem.item.name}</span>
                </div>
                <span className="text-gray-500">{topItem.size}</span>
              </motion.div>
            )}
            
            {bottomItem && (
              <motion.div className="flex items-center justify-between text-xs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-700 font-medium">{bottomItem.item.name}</span>
                </div>
                <span className="text-gray-500">{bottomItem.size}</span>
              </motion.div>
            )}
            
            {outerwearItem && (
              <motion.div className="flex items-center justify-between text-xs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-700 font-medium">{outerwearItem.item.name}</span>
                </div>
                <span className="text-gray-500">{outerwearItem.size}</span>
              </motion.div>
            )}
            
            {shoeItem && (
              <motion.div className="flex items-center justify-between text-xs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-gray-700 font-medium">{shoeItem.item.name}</span>
                </div>
                <span className="text-gray-500">{shoeItem.size}</span>
              </motion.div>
            )}
            
            {accessories.length > 0 && (
              <motion.div className="flex items-start justify-between text-xs pt-2 border-t border-gray-100" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block w-2 h-2 bg-rose-400 rounded-full" />
                  <span className="text-gray-700 font-medium">{accessories.length} accessories</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
