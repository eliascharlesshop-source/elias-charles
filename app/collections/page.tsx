"use client"

import Layout from "@/components/layout/layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ShopifyCollectionService, ShopifyDataTransformer } from "@/lib/shopify-services"
import { BoxShowcase } from "@/components/boxes/box-showcase"
import { IE_BOXES } from "@/data/box-config"

interface Collection {
  id: string
  title: string
  description: string
  handle: string
  image?: string
  productCount: number
}

// Fallback function to use when Shopify service fails
async function fetchCollectionsFallback(): Promise<Collection[]> {
  try {
    // Simple fetch to our API endpoint
    const response = await fetch('/api/collections')
    if (!response.ok) {
      throw new Error('Failed to fetch collections')
    }
    const apiData = await response.json()
    
    // Transform API response to match our Collection interface
    if (apiData.success && apiData.data) {
      return apiData.data.map((collection: any) => ({
        id: collection.id,
        title: collection.title,
        description: collection.description,
        handle: collection.handle,
        image: collection.image,
        productCount: collection.products?.length || 0
      }))
    }
    throw new Error('Invalid API response')
  } catch (error) {
    console.warn('Collections API fallback failed, using static data:', error)
    // Return static collections as ultimate fallback
    return [
      {
        id: "boards",
        title: "Boards",
        description: "Surf and skate boards for every level",
        handle: "boards",
        image: "/products/longboard.png",
        productCount: 12
      },
      {
        id: "apparel",
        title: "Apparel", 
        description: "Clothing and accessories for your active lifestyle",
        handle: "apparel",
        image: "/products/men-casual-hoodie.png",
        productCount: 24
      },
      {
        id: "self-care",
        title: "Self Care",
        description: "Products to help you look and feel your best",
        handle: "self-care",
        image: "/products/linen-dress-beach.png",
        productCount: 18
      }
    ]
  }
}

async function fetchFeaturedProductsFallback(): Promise<any[]> {
  try {
    const response = await fetch('/api/products?featured=true&limit=6')
    if (!response.ok) {
      throw new Error('Failed to fetch featured products')
    }
    const apiData = await response.json()
    
    // Handle different API response formats
    if (apiData.success && apiData.data) {
      return Array.isArray(apiData.data) ? apiData.data : []
    }
    
    if (Array.isArray(apiData)) {
      return apiData
    }
    
    throw new Error('Invalid API response format')
  } catch (error) {
    console.warn('Featured products API fallback failed, using static data:', error)
    // Return static featured products as fallback
    return [
      {
        id: "1",
        title: "Classic Surf T-Shirt",
        handle: "classic-surf-tshirt",
        price: 45,
        compareAtPrice: null,
        images: ["/products/men-casual-hoodie.png"],
        vendor: "Elias Charles"
      },
      {
        id: "2", 
        title: "Relaxed Fit Hoodie",
        handle: "relaxed-fit-hoodie",
        price: 85,
        compareAtPrice: 95,
        images: ["/products/men-surf-style.png"],
        vendor: "Elias Charles"
      },
      {
        id: "3",
        title: "Longboard Skateboard", 
        handle: "longboard-skateboard",
        price: 120,
        compareAtPrice: null,
        images: ["/products/longboard.png"],
        vendor: "Elias Charles"
      }
    ]
  }
}

export default function CollectionsPage() {
  const [loading, setLoading] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(1)

  const handleSubscribe = (boxId: string) => {
    console.log('Subscribe to box:', boxId)
    // TODO: Implement subscription logic
  }

  const handleLearnMore = (boxId: string) => {
    console.log('Learn more about box:', boxId)
    // TODO: Navigate to box details
  }

  return (
    <Layout>
      <div className="bg-[#fdf4ec]">
        {/* Header Section */}
        <div className="text-center py-16 px-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Inland Empire Boxes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Curated collections around seasonal moments. Simplified decisions, elevated experience.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <span>4 Core Boxes</span>
            <span>•</span>
            <span>Seasonal Themes</span>
            <span>•</span>
            <span>Limited Editions</span>
          </div>
        </div>

        {/* Box Showcase */}
        <div className="px-6 pb-16">
          <BoxShowcase 
            boxes={IE_BOXES}
            onSubscribe={handleSubscribe}
            onLearnMore={handleLearnMore}
            currentWeek={currentWeek}
          />
        </div>
      </div>
    </Layout>
  )
}
