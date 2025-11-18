'use client'

import { useState, useEffect } from 'react'
import { EnvironmentalSample, SampleCatalogue, HomeEnvironmentProfile } from '@/src/lib/wearable-service'

export default function PersonalCatalogPage() {
  const [catalogues, setCatalogues] = useState<SampleCatalogue[]>([])
  const [homeProfile, setHomeProfile] = useState<HomeEnvironmentProfile | null>(null)
  const [selectedCatalogue, setSelectedCatalogue] = useState<string>('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    // Mock home environment profile
    const mockProfile: HomeEnvironmentProfile = {
      preferredTemperature: 22,
      preferredHumidity: 45,
      noiseThreshold: 40,
      lightPreference: 'natural',
      airQualityThreshold: 0.8,
      safetyRequirements: ['well-lit', 'low-crime', 'good-transport']
    }

    // Mock sample catalogues
    const mockCatalogues: SampleCatalogue[] = [
      {
        id: 'cat_001',
        userId: 'user_123',
        name: 'Morning Commute',
        description: 'Daily samples from my route to work',
        tags: ['commute', 'daily', 'urban'],
        samples: [],
        patterns: [
          {
            type: 'temporal',
            pattern: 'Traffic noise peaks at 8:30 AM',
            confidence: 0.89,
            frequency: 0.85,
            correlation: ['time', 'noise_level']
          }
        ],
        insights: [
          'Your stress levels are 30% higher on rainy days',
          'The 7:45 AM departure time correlates with better mood scores',
          'Air quality is consistently better on the park route'
        ],
        homeProfile: mockProfile,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'cat_002',
        userId: 'user_123',
        name: 'Weekend Adventures',
        description: 'Environmental samples from hiking and outdoor activities',
        tags: ['outdoor', 'hiking', 'nature'],
        samples: [],
        patterns: [
          {
            type: 'environmental',
            pattern: 'Higher energy levels in forest environments',
            confidence: 0.92,
            frequency: 0.78,
            correlation: ['air_quality', 'natural_sounds', 'energy_level']
          }
        ],
        insights: [
          'Your best performance happens at 1200m elevation',
          'Forest environments boost your mood by 40%',
          'Morning hikes result in better sleep quality'
        ],
        homeProfile: mockProfile,
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]

    setHomeProfile(mockProfile)
    setCatalogues(mockCatalogues)
  }, [])

  const CreateCatalogueModal = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState('')

    const handleCreate = () => {
      const newCatalogue: SampleCatalogue = {
        id: `cat_${Date.now()}`,
        userId: 'user_123',
        name,
        description,
        tags: tags.split(',').map(t => t.trim()),
        samples: [],
        patterns: [],
        insights: [],
        homeProfile: homeProfile!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setCatalogues(prev => [...prev, newCatalogue])
      setShowCreateModal(false)
      setName('')
      setDescription('')
      setTags('')
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Create New Catalogue</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Beach Walks"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg h-20"
                placeholder="Describe what this catalogue tracks..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., outdoor, relaxation, exercise"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`px-6 py-2 rounded-lg ${
                name.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Personal Environmental Catalogue</h1>
          <p className="text-gray-600 mt-2">Organize and analyze your environmental data for your home</p>
        </div>

        {/* Home Environment Profile */}
        {homeProfile && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🏠 Home Environment Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Climate Preferences</h3>
                <div className="text-sm space-y-1">
                  <p>🌡️ Temperature: {homeProfile.preferredTemperature}°C</p>
                  <p>💧 Humidity: {homeProfile.preferredHumidity}%</p>
                  <p>☀️ Light: {homeProfile.lightPreference}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Quality Thresholds</h3>
                <div className="text-sm space-y-1">
                  <p>🔊 Max Noise: {homeProfile.noiseThreshold} dB</p>
                  <p>🏭 Min Air Quality: {(homeProfile.airQualityThreshold * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Safety Requirements</h3>
                <div className="text-sm space-y-1">
                  {homeProfile.safetyRequirements.map((req, index) => (
                    <p key={index}>✓ {req}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Catalogues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {catalogues.map(catalogue => (
            <div key={catalogue.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{catalogue.name}</h3>
                <span className="text-sm text-gray-500">
                  {catalogue.samples.length} samples
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{catalogue.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {catalogue.tags.map(tag => (
                  <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Key Insights */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">🧠 Key Insights</h4>
                <div className="space-y-1">
                  {catalogue.insights.slice(0, 2).map((insight, index) => (
                    <p key={index} className="text-xs text-gray-600">• {insight}</p>
                  ))}
                </div>
              </div>

              {/* Patterns */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">📊 Patterns Found</h4>
                <div className="space-y-1">
                  {catalogue.patterns.slice(0, 1).map((pattern, index) => (
                    <div key={index} className="text-xs">
                      <p className="text-gray-700">{pattern.pattern}</p>
                      <p className="text-gray-500">
                        {(pattern.confidence * 100).toFixed(0)}% confidence
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Created {new Date(catalogue.createdAt).toLocaleDateString()}</span>
                <span>Updated {new Date(catalogue.updatedAt).toLocaleDateString()}</span>
              </div>

              <button 
                onClick={() => setSelectedCatalogue(catalogue.id)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))}

          {/* Add New Catalogue Card */}
          <div 
            onClick={() => setShowCreateModal(true)}
            className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="text-4xl text-gray-400 mb-4">+</div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Create New Catalogue</h3>
            <p className="text-sm text-gray-500 text-center">
              Start collecting and organizing environmental samples for a specific purpose or location
            </p>
          </div>
        </div>

        {/* Enhanced Home Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Smart Home Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Environment Optimization</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">✓ Air Purifier Recommended</p>
                  <p className="text-green-600">Based on your outdoor air quality samples, an air purifier would improve your home environment by 25%</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">💡 Smart Lighting Suggestion</p>
                  <p className="text-blue-600">Your energy levels peak with natural light. Consider smart blinds for optimal timing.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Behavioral Insights</h3>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800">📅 Optimal Schedule</p>
                  <p className="text-purple-600">Your best productive hours are 10 AM - 2 PM when temperature is 20-24°C</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="font-medium text-orange-800">🏃 Exercise Timing</p>
                  <p className="text-orange-600">Morning outdoor activities show 40% better mood improvement</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && <CreateCatalogueModal />}
    </div>
  )
}
