'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface FeatureStatus {
  name: string
  status: 'completed' | 'in-progress' | 'planned'
  description: string
  link: string
  icon: string
}

export default function StatusDashboard() {
  const [features, setFeatures] = useState<FeatureStatus[]>([])

  useEffect(() => {
    const featureList: FeatureStatus[] = [
      {
        name: 'Store Theme',
        status: 'completed',
        description: 'Complete e-commerce frontend with Shopify integration',
        link: '/',
        icon: '🏪'
      },
      {
        name: 'Admin Dashboard',
        status: 'completed',
        description: 'Administrative interface for managing the store',
        link: '/admin',
        icon: '⚙️'
      },
      {
        name: 'Wearable Integration',
        status: 'completed',
        description: 'Connect and manage wearable devices for data collection',
        link: '/sampling',
        icon: '⌚'
      },
      {
        name: 'Environmental Sampling',
        status: 'completed',
        description: 'Real-time data collection from the world around you',
        link: '/sampling',
        icon: '🌍'
      },
      {
        name: 'Personal Catalog',
        status: 'completed',
        description: 'Organize samples and get insights for your home',
        link: '/catalog',
        icon: '📚'
      },
      {
        name: 'Data Sharing & Privacy',
        status: 'completed',
        description: 'Control how your data is shared and monetized',
        link: '/data-sharing',
        icon: '🔐'
      },
      {
        name: 'Pattern Recognition',
        status: 'completed',
        description: 'AI-powered analysis of environmental patterns',
        link: '/catalog',
        icon: '🧠'
      },
      {
        name: 'Time Estimation',
        status: 'completed',
        description: 'Smart algorithms for travel and task time predictions',
        link: '/sampling',
        icon: '⏱️'
      },
      {
        name: 'API Connectivity',
        status: 'completed',
        description: 'Backend API services for real-time data processing',
        link: '/api/test',
        icon: '🔌'
      },
      {
        name: 'Real-time Collaboration',
        status: 'completed',
        description: 'Share insights and collaborate via data sharing platform',
        link: '/data-sharing',
        icon: '👥'
      },
      {
        name: 'AR/VR Visualization',
        status: 'completed',
        description: 'Immersive 3D visualization of environmental data',
        link: '/arvr',
        icon: '🥽'
      },
      {
        name: 'Voice Commands',
        status: 'completed',
        description: 'Voice-controlled data collection and queries',
        link: '/voice',
        icon: '🎙️'
      }
    ]

    setFeatures(featureList)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'planned': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed ✅'
      case 'in-progress': return 'In Progress 🚧'
      case 'planned': return 'Planned 📋'
      default: return 'Unknown'
    }
  }

  const completedCount = features.filter(f => f.status === 'completed').length
  const totalCount = features.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EC Store Feature Status</h1>
          <p className="text-gray-600 text-lg">
            Complete wearable-integrated e-commerce platform with environmental data collection
          </p>
          
          {/* Progress Bar */}
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium">Overall Progress</span>
              <span className="text-lg font-bold text-green-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {completedCount} of {totalCount} features completed
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            <div className="text-gray-600">Features Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {features.filter(f => f.status === 'in-progress').length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-gray-600">
              {features.filter(f => f.status === 'planned').length}
            </div>
            <div className="text-gray-600">Planned</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <h3 className="text-lg font-semibold">{feature.name}</h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(feature.status)}`} />
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{getStatusText(feature.status)}</span>
                {feature.link !== '#' && feature.status === 'completed' && (
                  <Link 
                    href={feature.link}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Architecture */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🏗️ Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Next.js 15 + React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Responsive Design</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Collection</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Wearable Device APIs</li>
                <li>• Environmental Sensors</li>
                <li>• Real-time Streaming</li>
                <li>• Pattern Recognition</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Privacy & Security</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Data Anonymization</li>
                <li>• Consent Management</li>
                <li>• Encryption</li>
                <li>• Access Controls</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Shopify Commerce</li>
                <li>• Third-party APIs</li>
                <li>• Data Marketplace</li>
                <li>• Revenue Sharing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Achievements */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎉 Key Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Platform Features</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Complete e-commerce store with Shopify integration</li>
                <li>✅ Real-time environmental data collection</li>
                <li>✅ Personal data cataloging and insights</li>
                <li>✅ Privacy-first data sharing marketplace</li>
                <li>✅ AI-powered pattern recognition</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Business Value</h3>
              <ul className="text-sm space-y-1">
                <li>💰 Revenue from product sales</li>
                <li>💰 Data monetization opportunities</li>
                <li>📊 Valuable environmental insights</li>
                <li>🤝 Third-party partnerships</li>
                <li>🚀 Scalable architecture</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
