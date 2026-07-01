'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import Image from 'next/image'
import { WardrobeItem } from '@/data/wardrobe-items'

interface SelectedItem {
  item: WardrobeItem
  size: string
}

interface Mannequin3DProps {
  selectedItems: SelectedItem[]
}

// 3D Body Model
function BodyModel() {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#e8d7c3" />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.35, 1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.35, 1.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.15, 0.2, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.15, 0.2, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

// Clothing Layer Component
function ClothingLayer({ item, position, scale, color }: { item: WardrobeItem | null; position: [number, number, number]; scale: [number, number, number]; color: string }) {
  if (!item) return null

  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 0.05]} />
      <meshStandardMaterial
        color={color}
        map={new THREE.CanvasTexture(
          (() => {
            const canvas = document.createElement('canvas')
            canvas.width = 256
            canvas.height = 256
            const ctx = canvas.getContext('2d')!
            ctx.fillStyle = color
            ctx.fillRect(0, 0, 256, 256)
            // Add pattern/texture
            ctx.globalAlpha = 0.1
            ctx.fillStyle = '#000000'
            for (let i = 0; i < 256; i += 16) {
              ctx.fillRect(i, 0, 8, 256)
              ctx.fillRect(0, i, 256, 8)
            }
            return canvas
          })()
        )}
      />
    </mesh>
  )
}

// Main 3D Scene
function Avatar3D({ selectedItems }: Mannequin3DProps) {
  const topItem = selectedItems.find(s => s.item.category === 'tops')
  const bottomItem = selectedItems.find(s => s.item.category === 'bottoms')
  const outerwearItem = selectedItems.find(s => s.item.category === 'outerwear')
  const shoeItem = selectedItems.find(s => s.item.category === 'footwear')

  return (
    <>
      <PresentationControls
        speed={1.5}
        global
        zoom={1.5}
        rotation={[0.13, 0.1, 0]}
      >
        <BodyModel />

        {/* Outerwear Layer (back) */}
        {outerwearItem && (
          <ClothingLayer
            item={outerwearItem}
            position={[0, 1.1, -0.1]}
            scale={[0.7, 0.85, 1]}
            color="#4a4a4a"
          />
        )}

        {/* Top Layer */}
        {topItem && (
          <ClothingLayer
            item={topItem}
            position={[0, 1.2, 0]}
            scale={[0.55, 0.65, 1]}
            color="#3b82f6"
          />
        )}

        {/* Bottom Layer */}
        {bottomItem && (
          <ClothingLayer
            item={bottomItem}
            position={[0, 0.5, 0]}
            scale={[0.5, 0.7, 1]}
            color="#1f2937"
          />
        )}

        {/* Shoes */}
        {shoeItem && (
          <>
            <mesh position={[-0.15, -0.55, 0.1]} scale={[0.18, 0.12, 0.25]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#2d2d2d" />
            </mesh>
            <mesh position={[0.15, -0.55, 0.1]} scale={[0.18, 0.12, 0.25]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#2d2d2d" />
            </mesh>
          </>
        )}
      </PresentationControls>

      <OrbitControls makeDefault />
      <Environment preset="studio" />
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
    </>
  )
}

export function Mannequin3D({ selectedItems }: Mannequin3DProps) {
  return (
    <motion.div
      className="w-full rounded-2xl border-2 border-gray-200 overflow-hidden bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {selectedItems.length === 0 ? (
        <div className="h-96 flex items-center justify-center flex-col gap-4">
          <svg className="w-24 h-32 text-gray-400" viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="50" cy="24" r="14" />
            <path d="M 50 40 L 50 80" />
            <path d="M 50 50 L 30 65 M 50 50 L 70 65" />
            <path d="M 50 80 L 35 110 M 50 80 L 65 110" />
          </svg>
          <p className="text-gray-600 text-sm font-medium">Your Outfit Awaits</p>
          <p className="text-gray-400 text-xs">Select items to preview in 3D</p>
        </div>
      ) : (
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <Suspense fallback={null}>
            <Avatar3D selectedItems={selectedItems} />
          </Suspense>
        </Canvas>
      )}

      {/* Summary */}
      <div className="p-4 bg-white border-t border-gray-200 space-y-2">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-600">Outfit Summary</h4>
        <div className="space-y-1">
          {selectedItems.map((selected, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-gray-700 font-medium truncate">{selected.item.name}</span>
              </div>
              <span className="text-gray-500">{selected.size}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
