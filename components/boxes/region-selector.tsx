"use client"

import { Button } from "@/src/components/ui/button"
import { cn } from "@/lib/utils"

type Region = 'ie' | 'iv'

interface RegionSelectorProps {
  selectedRegion: Region
  onRegionChange: (region: Region) => void
}

export function RegionSelector({ selectedRegion, onRegionChange }: RegionSelectorProps) {
  return (
    <div className="flex items-center gap-4 justify-center py-8">
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onRegionChange('ie')}
          className={cn(
            "px-6 py-2 rounded-md text-sm font-semibold tracking-wide transition-all",
            selectedRegion === 'ie'
              ? "bg-white text-beach-darker shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Inland Empire
        </button>
        <button
          onClick={() => onRegionChange('iv')}
          className={cn(
            "px-6 py-2 rounded-md text-sm font-semibold tracking-wide transition-all",
            selectedRegion === 'iv'
              ? "bg-white text-beach-darker shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          Isla Vista
        </button>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
        <span className="text-gray-400">•</span>
        <span>Choose your collection</span>
      </div>
    </div>
  )
}
