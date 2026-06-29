'use client'

import { useState, useEffect } from 'react'
import { WearableService, EnvironmentalSample, WearableDevice, PatternAnalysis } from '@/src/lib/wearable-service'

const wearableService = new WearableService()

export default function SamplingDashboard() {
  const [devices, setDevices] = useState<WearableDevice[]>([])
  const [samples, setSamples] = useState<EnvironmentalSample[]>([])
  const [patterns, setPatterns] = useState<PatternAnalysis[]>([])
  const [isCollecting, setIsCollecting] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string>('')

  useEffect(() => {
    // Initialize with mock devices
    const mockDevices: WearableDevice[] = [
      {
        id: 'watch_001',
        name: 'Apple Watch Ultra',
        type: 'smartwatch',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 85,
        capabilities: [
          { type: 'heart_rate', enabled: true, sampleRate: 1 },
          { type: 'gps', enabled: true, sampleRate: 0.1 },
          { type: 'accelerometer', enabled: true, sampleRate: 50 }
        ]
      },
      {
        id: 'sensor_001',
        name: 'Environmental Pod',
        type: 'environmental_sensor',
        connected: true,
        lastSync: new Date().toISOString(),
        batteryLevel: 92,
        capabilities: [
          { type: 'temperature', enabled: true, sampleRate: 0.1 },
          { type: 'humidity', enabled: true, sampleRate: 0.1 },
          { type: 'air_quality', enabled: true, sampleRate: 0.05 },
          { type: 'noise_level', enabled: true, sampleRate: 1 }
        ]
      }
    ]

    mockDevices.forEach(device => wearableService.connectDevice(device))
    setDevices(wearableService.getDevices())
    setSelectedDevice(mockDevices[0].id)
  }, [])

  const startSampling = async () => {
    if (!selectedDevice) return
    
    setIsCollecting(true)
    
    // Collect samples every 5 seconds
    const interval = setInterval(async () => {
      const sample = await wearableService.collectSample(selectedDevice)
      if (sample) {
        setSamples(prev => [...prev.slice(-49), sample]) // Keep last 50 samples
      }
    }, 5000)

    // Stop after 30 seconds for demo
    setTimeout(() => {
      clearInterval(interval)
      setIsCollecting(false)
      analyzePatterns()
    }, 30000)
  }

  const analyzePatterns = async () => {
    const currentSamples = wearableService.getSamples(20)
    const analyzedPatterns = await wearableService.analyzePatternsAsync(currentSamples)
    setPatterns(analyzedPatterns)
  }

  const DeviceCard = ({ device }: { device: WearableDevice }) => (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selectedDevice === device.id ? 'border-gray-400 hover:border-gray-300' : 'border-gray-200 hover:border-gray-300'
      }`}
      style={{ backgroundColor: selectedDevice === device.id ? '#D0E1F2' : 'transparent' }}
      onClick={() => setSelectedDevice(device.id)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{device.name}</h3>
        <div className={`w-3 h-3 rounded-full ${device.connected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
      <p className="text-sm text-gray-600 capitalize">{device.type.replace('_', ' ')}</p>
      {device.batteryLevel && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Battery</span>
            <span>{device.batteryLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${device.batteryLevel}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )

  const SampleCard = ({ sample }: { sample: EnvironmentalSample }) => (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium">Sample {sample.id.slice(-8)}</span>
        <span className="text-xs text-gray-500">
          {new Date(sample.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Environment</p>
          <p>🌡️ {sample.weather.temperature.toFixed(1)}°C</p>
          <p>💧 {sample.weather.humidity.toFixed(0)}%</p>
          <p>🏭 AQI: {(sample.weather.airQuality! * 100).toFixed(0)}</p>
        </div>
        <div>
          <p className="text-gray-600">Social</p>
          <p>👥 Crowd: {(sample.social.crowdDensity * 100).toFixed(0)}%</p>
          <p>🔊 {sample.social.noiseLevel.toFixed(0)} dB</p>
          <p>🛡️ Safety: {(sample.social.safetyScore * 100).toFixed(0)}%</p>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <span>Mood: <span className="capitalize">{sample.personal.mood}</span></span>
          <span>Energy: {(sample.personal.energyLevel * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#F5E6D3' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">World Sampling Dashboard</h1>
          <p className="text-gray-600 mt-2">Collect environmental data and build your personal catalogue</p>
        </div>

        {/* Device Selection */}
        <div className="rounded-lg shadow p-6 mb-6" style={{ backgroundColor: '#FFFEF9' }}>
          <h2 className="text-xl font-semibold mb-4">Connected Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={startSampling}
              disabled={isCollecting || !selectedDevice}
              className={`px-6 py-3 rounded-lg font-medium ${
                isCollecting || !selectedDevice
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'text-white hover:opacity-90'
              }`}
              style={{
                backgroundColor: isCollecting || !selectedDevice ? undefined : '#D0E1F2',
                color: isCollecting || !selectedDevice ? undefined : '#1a1a1a'
              }}
            >
              {isCollecting ? 'Collecting Data...' : 'Start Sampling'}
            </button>
            
            <button
              onClick={analyzePatterns}
              disabled={samples.length < 5}
              className={`px-6 py-3 rounded-lg font-medium ${
                samples.length < 5
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'text-white hover:opacity-90'
              }`}
              style={{
                backgroundColor: samples.length < 5 ? undefined : '#D0E1F2',
                color: samples.length < 5 ? undefined : '#1a1a1a'
              }}
            >
              Analyze Patterns
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Samples */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: '#FFFEF9' }}>
            <h2 className="text-xl font-semibold mb-4">Recent Samples ({samples.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {samples.slice(-10).reverse().map(sample => (
                <SampleCard key={sample.id} sample={sample} />
              ))}
              {samples.length === 0 && (
                <p className="text-gray-500 text-center py-8">No samples collected yet</p>
              )}
            </div>
          </div>

          {/* Pattern Analysis */}
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: '#FFFEF9' }}>
            <h2 className="text-xl font-semibold mb-4">Pattern Analysis</h2>
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#F5E6D3' }}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium capitalize">{pattern.type} Pattern</span>
                    <span className="text-sm text-gray-500">
                      {(pattern.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{pattern.pattern}</p>
                  <div className="text-xs text-gray-500">
                    Frequency: {(pattern.frequency * 100).toFixed(0)}% | 
                    Correlations: {pattern.correlation.join(', ')}
                  </div>
                </div>
              ))}
              {patterns.length === 0 && (
                <p className="text-gray-500 text-center py-8">Collect more samples to see patterns</p>
              )}
            </div>
          </div>
        </div>

        {/* Live Stats */}
        {samples.length > 0 && (
          <div className="mt-6 rounded-lg shadow p-6" style={{ backgroundColor: '#FFFEF9' }}>
            <h2 className="text-xl font-semibold mb-4">Live Environment Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#D0E1F2' }}>
                  {samples[samples.length - 1]?.weather.temperature.toFixed(1)}°C
                </p>
                <p className="text-sm text-gray-600">Temperature</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {(samples[samples.length - 1]?.social.safetyScore * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Safety Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {(samples[samples.length - 1]?.social.crowdDensity * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Crowd Level</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600 capitalize">
                  {samples[samples.length - 1]?.personal.mood}
                </p>
                <p className="text-sm text-gray-600">Current Mood</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
