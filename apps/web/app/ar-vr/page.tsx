'use client'

import { useState, useEffect, useRef } from 'react'

// Only import and use these on client side
let ARVRService: any = null
let useVoiceCommands: any = null

if (typeof window !== 'undefined') {
  ARVRService = require('@/src/lib/ar-vr-service').ARVRService
  useVoiceCommands = require('@/src/lib/voice-service').useVoiceCommands
}

export default function ARVRVisualizationPage() {
  const [arvrService, setArvrService] = useState<any>(null)
  const [arSupported, setArSupported] = useState(false)
  const [vrSupported, setVrSupported] = useState(false)
  const [arActive, setArActive] = useState(false)
  const [vrActive, setVrActive] = useState(false)
  const [visualizations, setVisualizations] = useState<any[]>([])
  const [vrEnvironments, setVrEnvironments] = useState<any[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Voice commands - only initialize on client side
  const voiceHook = useVoiceCommands ? useVoiceCommands() : {
    startListening: () => {},
    stopListening: () => {},
    speak: () => {},
    isListening: false,
    isSupported: false
  }
  const { startListening, stopListening, speak, isListening, isSupported: voiceSupported } = voiceHook

  useEffect(() => {
    // Initialize service only on client side
    if (typeof window !== 'undefined' && ARVRService && !arvrService) {
      const service = new ARVRService()
      setArvrService(service)
      
      // Check AR/VR support
      setArSupported(service.isARSupported())
      setVrSupported(service.isVRSupported())
    }
  }, [arvrService])

  useEffect(() => {
    if (!arvrService) return
    
    // Check AR/VR support
    setArSupported(arvrService.isARSupported())
    setVrSupported(arvrService.isVRSupported())

    // Create mock environmental data for visualization
    const mockSamples = [
      {
        id: 'sample_1',
        location: { latitude: 40.7128, longitude: -74.0060 },
        weather: { temperature: 22, humidity: 65, airQuality: 0.3 },
        social: { crowdDensity: 0.8, safetyScore: 0.4, noiseLevel: 75 }
      },
      {
        id: 'sample_2',
        location: { latitude: 40.7589, longitude: -73.9851 },
        weather: { temperature: 24, humidity: 55, airQuality: 0.7 },
        social: { crowdDensity: 0.3, safetyScore: 0.9, noiseLevel: 45 }
      },
      {
        id: 'sample_3',
        location: { latitude: 40.7505, longitude: -73.9934 },
        weather: { temperature: 20, humidity: 70, airQuality: 0.5 },
        social: { crowdDensity: 0.6, safetyScore: 0.6, noiseLevel: 60 }
      }
    ]

    // Create AR visualizations
    const arVizs = mockSamples.map((sample, index) => ({
      ...arvrService.createARVisualization(sample),
      position: {
        x: 100 + index * 150,
        y: 100 + Math.random() * 100,
        z: 0
      }
    }))

    setVisualizations(arVizs)

    // Create VR environments
    const vrEnvs = [
      arvrService.createVREnvironment('home_simulation', {}),
      arvrService.createVREnvironment('data_dashboard', {}),
      arvrService.createVREnvironment('environmental_history', {})
    ]

    setVrEnvironments(vrEnvs)
  }, [arvrService])

  useEffect(() => {
    // Render AR visualizations on canvas
    if (canvasRef.current && visualizations.length > 0) {
      arvrService.renderAROverlay(canvasRef.current, visualizations)
    }
  }, [visualizations, arvrService])

  const initializeAR = async () => {
    try {
      const success = await arvrService.initializeAR()
      setArActive(success)
      if (success) {
        speak('Augmented Reality initialized successfully')
      } else {
        speak('AR not supported on this device')
      }
    } catch (error) {
      console.error('AR initialization failed:', error)
      speak('AR initialization failed')
    }
  }

  const initializeVR = async () => {
    try {
      const success = await arvrService.initializeVR()
      setVrActive(success)
      if (success) {
        speak('Virtual Reality initialized successfully')
      } else {
        speak('VR not supported on this device')
      }
    } catch (error) {
      console.error('VR initialization failed:', error)
      speak('VR initialization failed')
    }
  }

  const toggleVisualization = (id: string) => {
    setVisualizations(prev => prev.map(viz => 
      viz.id === id ? { ...viz, visibility: !viz.visibility } : viz
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AR/VR Environmental Visualization</h1>
          <p className="text-gray-600 mt-2">Immersive visualization of environmental data and patterns</p>
        </div>

        {/* Voice Commands Status */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-medium mr-3">🎙️ Voice Commands</span>
              <span className={`px-2 py-1 rounded text-sm ${
                voiceSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {voiceSupported ? 'Supported' : 'Not Supported'}
              </span>
            </div>
            {voiceSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-4 py-2 rounded-lg ${
                  isListening 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isListening ? 'Stop Listening' : 'Start Voice Control'}
              </button>
            )}
          </div>
          {isListening && (
            <p className="text-sm text-gray-600 mt-2">
              Try saying: "show air quality", "hide crowd data", "switch to VR mode"
            </p>
          )}
        </div>

        {/* AR/VR Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🥽 Augmented Reality</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Device Support:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  arSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {arSupported ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  arActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {arActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                onClick={initializeAR}
                disabled={!arSupported}
                className={`w-full py-2 px-4 rounded-lg ${
                  arSupported 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {arActive ? 'Restart AR' : 'Initialize AR'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🌐 Virtual Reality</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Device Support:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  vrSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {vrSupported ? 'Supported' : 'Not Supported'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  vrActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {vrActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                onClick={initializeVR}
                disabled={!vrSupported}
                className={`w-full py-2 px-4 rounded-lg ${
                  vrSupported 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {vrActive ? 'Restart VR' : 'Initialize VR'}
              </button>
            </div>
          </div>
        </div>

        {/* AR Visualization Canvas */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📱 AR Environmental Overlay</h2>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="border border-gray-200 rounded-lg w-full max-w-4xl"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            />
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
              AR Environmental Data Overlay
            </div>
          </div>
          
          {/* Visualization Controls */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {visualizations.map(viz => (
              <button
                key={viz.id}
                onClick={() => toggleVisualization(viz.id)}
                className={`p-3 rounded-lg text-sm ${
                  viz.visibility 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {viz.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* VR Environments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🌐 VR Environments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vrEnvironments.map(env => (
              <div key={env.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">{env.name}</h3>
                <p className="text-sm text-gray-600 mb-3 capitalize">
                  {env.type.replace('_', ' ')}
                </p>
                
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Assets:</p>
                  <div className="flex flex-wrap gap-1">
                    {env.assets.map((asset, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {asset}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Interactions:</p>
                  <div className="space-y-1">
                    {env.interactions.slice(0, 2).map((interaction, index) => (
                      <p key={index} className="text-xs text-gray-600">
                        {interaction.type}: {interaction.action}
                      </p>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => speak(`Loading ${env.name} VR environment`)}
                  disabled={!vrActive}
                  className={`w-full py-2 px-3 rounded text-sm ${
                    vrActive 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Enter VR
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Information */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">🚀 AR/VR Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Augmented Reality</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Real-time environmental data overlay</li>
                <li>• Air quality visualization</li>
                <li>• Crowd density heatmaps</li>
                <li>• Safety indicator overlays</li>
                <li>• Weather particle effects</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Virtual Reality</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Immersive home environment simulation</li>
                <li>• 3D data dashboard exploration</li>
                <li>• Environmental timeline visualization</li>
                <li>• Voice and gesture controls</li>
                <li>• Multi-device synchronization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
