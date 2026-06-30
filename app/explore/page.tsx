"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Layout from "@/components/layout/layout"
import { 
  ShoppingBag, 
  BarChart3, 
  Database, 
  Activity, 
  Percent, 
  Camera, 
  Mic,
  ChevronRight 
} from "lucide-react"
import Link from "next/link"

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    {
      id: "overview",
      name: "Overview",
      icon: BarChart3,
      description: "Explore all EC Store features and tools"
    },
    {
      id: "sampling",
      name: "Sampling",
      icon: ShoppingBag,
      href: "/sampling",
      description: "Try before you buy with our sampling program"
    },
    {
      id: "catalog",
      name: "Catalog",
      icon: BarChart3,
      href: "/catalog",
      description: "Browse our complete product catalog"
    },
    {
      id: "data-sharing",
      name: "Data Sharing",
      icon: Database,
      href: "/data-sharing",
      description: "Learn about our data practices and privacy"
    },
    {
      id: "status",
      name: "Status",
      icon: Activity,
      href: "/status",
      description: "Check system status and feature availability"
    },
    {
      id: "sale",
      name: "Sale",
      icon: Percent,
      href: "/collections/sale",
      description: "Discover deals and seasonal offers"
    },
    {
      id: "ar-vr",
      name: "AR/VR",
      icon: Camera,
      href: "/arvr",
      description: "Experience products in augmented reality"
    },
    {
      id: "voice",
      name: "Voice",
      icon: Mic,
      href: "/voice",
      description: "Voice-controlled shopping experience"
    }
  ]

  const handleTabClick = (tab) => {
    if (tab.href) {
      // Navigate to the actual page
      window.location.href = tab.href
    } else {
      setActiveTab(tab.id)
    }
  }

  return (
    <Layout>
      <div className="bg-cream min-h-screen">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 py-16 sm:py-24 px-6 sm:px-12 border-b-4 border-indigo-700">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-screen blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-screen blur-3xl animate-pulse animation-delay-2000" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-screen blur-3xl animate-pulse animation-delay-4000" />
          </div>

          <motion.div 
            className="relative max-w-7xl mx-auto text-center z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <span className="text-sm uppercase tracking-widest font-bold text-white bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40">
                Discover New Possibilities
              </span>
            </motion.div>

            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-4 text-white drop-shadow-lg tracking-tight">
              EXPLORE
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto drop-shadow">
              Discover innovative features, tools, and experiences that define the EC lifestyle
            </p>
          </motion.div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-500"}`} />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tabs.slice(1).map((tab) => {
                const Icon = tab.icon
                return (
                  <div
                    key={tab.id}
                    onClick={() => handleTabClick(tab)}
                    className="backdrop-blur-md bg-white/30 rounded-lg shadow-lg border border-white/50 p-6 hover:shadow-xl hover:bg-white/40 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tab.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {tab.description}
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Individual Tab Content for other tabs would go here */}
          {tabs.slice(1).map((tab) => (
            activeTab === tab.id && (
              <div key={tab.id} className="backdrop-blur-md bg-white/30 rounded-lg shadow-lg border border-white/50 p-8">
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <tab.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-light text-gray-900 mb-4">
                    {tab.name}
                  </h2>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    {tab.description}
                  </p>
                  <Link 
                    href={tab.href || "#"}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-dark transition-colors duration-200"
                  >
                    Visit {tab.name}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Quick Access
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Jump directly to popular features and tools
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/collections/sale"
                className="group flex flex-col items-center p-6 backdrop-blur-md bg-red-500/20 border border-red-300/50 rounded-lg hover:shadow-lg hover:bg-red-500/30 transition-all duration-200"
              >
                <Percent className="h-8 w-8 text-red-700 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">Sale Items</span>
              </Link>
              
              <Link 
                href="/arvr"
                className="group flex flex-col items-center p-6 backdrop-blur-md bg-blue-500/20 border border-blue-300/50 rounded-lg hover:shadow-lg hover:bg-blue-500/30 transition-all duration-200"
              >
                <Camera className="h-8 w-8 text-blue-700 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">AR/VR</span>
              </Link>
              
              <Link 
                href="/voice"
                className="group flex flex-col items-center p-6 backdrop-blur-md bg-green-500/20 border border-green-300/50 rounded-lg hover:shadow-lg hover:bg-green-500/30 transition-all duration-200"
              >
                <Mic className="h-8 w-8 text-green-700 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">Voice Control</span>
              </Link>
              
              <Link 
                href="/status"
                className="group flex flex-col items-center p-6 backdrop-blur-md bg-purple-500/20 border border-purple-300/50 rounded-lg hover:shadow-lg hover:bg-purple-500/30 transition-all duration-200"
              >
                <Activity className="h-8 w-8 text-purple-700 mb-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-gray-900">System Status</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
