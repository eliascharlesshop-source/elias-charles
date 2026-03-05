'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

// Dynamically import three.js to avoid SSR issues
const ThreeCanvas = dynamic(() => import('@/components/visualization/ThreeCanvas'), { ssr: false })

export default function ARVRVisualizationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AR/VR Environmental Visualization</h1>
        <p className="text-gray-600 mb-6">
          Explore your environmental data in 3D. This demo uses Three.js for interactive visualization. Future versions will support AR overlays and VR headsets.
        </p>
        <div className="rounded-lg shadow bg-white p-4">
          <ThreeCanvas />
        </div>
      </div>
    </div>
  )
}
