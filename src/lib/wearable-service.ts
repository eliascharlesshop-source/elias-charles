// Wearable Device Integration API
export interface WearableDevice {
  id: string
  name: string
  type: 'smartwatch' | 'fitness_tracker' | 'environmental_sensor' | 'smart_glasses'
  connected: boolean
  lastSync: string
  batteryLevel?: number
  capabilities: WearableCapability[]
}

export interface WearableCapability {
  type: 'heart_rate' | 'gps' | 'accelerometer' | 'temperature' | 'humidity' | 'air_quality' | 'noise_level' | 'light_sensor'
  enabled: boolean
  sampleRate: number // Hz
}

export interface EnvironmentalSample {
  id: string
  deviceId: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
    accuracy: number
    altitude?: number
  }
  weather: {
    temperature: number
    humidity: number
    pressure: number
    uvIndex?: number
    airQuality?: number
  }
  social: {
    crowdDensity: number // 0-1 scale
    noiseLevel: number // dB
    safetyScore: number // 0-1 scale
  }
  personal: {
    mood: 'positive' | 'neutral' | 'negative' | 'stressed' | 'excited'
    energyLevel: number // 0-1 scale
    comfort: number // 0-1 scale
  }
  hazards: HazardDetection[]
}

export interface HazardDetection {
  type: 'traffic' | 'weather' | 'air_quality' | 'crime' | 'overcrowding' | 'noise'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  confidence: number // 0-1 scale
}

export interface SampleCatalogue {
  id: string
  userId: string
  name: string
  description: string
  tags: string[]
  samples: EnvironmentalSample[]
  patterns: PatternAnalysis[]
  insights: string[]
  homeProfile: HomeEnvironmentProfile
  createdAt: string
  updatedAt: string
}

export interface HomeEnvironmentProfile {
  preferredTemperature: number
  preferredHumidity: number
  noiseThreshold: number
  lightPreference: 'bright' | 'dim' | 'natural'
  airQualityThreshold: number
  safetyRequirements: string[]
}

export interface PatternAnalysis {
  type: 'temporal' | 'spatial' | 'behavioral' | 'environmental'
  pattern: string
  confidence: number
  frequency: number
  correlation: string[]
}

// Data sharing and privacy interfaces
export interface DataSharingConsent {
  userId: string
  dataTypes: string[]
  purposes: string[]
  recipients: string[]
  anonymization: boolean
  retentionPeriod: number // days
  canWithdraw: boolean
  consentDate: string
}

export interface ThirdPartyIntegration {
  id: string
  name: string
  type: 'security' | 'commercial' | 'research' | 'government'
  dataAccess: string[]
  privacyLevel: 'anonymous' | 'pseudonymous' | 'identified'
  compensation?: number
  active: boolean
}

// API service class
export class WearableService {
  private devices: Map<string, WearableDevice> = new Map()
  private samples: EnvironmentalSample[] = []
  
  async connectDevice(device: WearableDevice): Promise<boolean> {
    // Simulate device connection
    this.devices.set(device.id, { ...device, connected: true })
    return true
  }
  
  async collectSample(deviceId: string): Promise<EnvironmentalSample | null> {
    const device = this.devices.get(deviceId)
    if (!device || !device.connected) return null
    
    // Simulate data collection
    const sample: EnvironmentalSample = {
      id: `sample_${Date.now()}`,
      deviceId,
      timestamp: new Date().toISOString(),
      location: {
        latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
        longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
        accuracy: 5
      },
      weather: {
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        pressure: 1013 + (Math.random() - 0.5) * 20,
        uvIndex: Math.floor(Math.random() * 11),
        airQuality: Math.random()
      },
      social: {
        crowdDensity: Math.random(),
        noiseLevel: 30 + Math.random() * 60,
        safetyScore: 0.5 + Math.random() * 0.5
      },
      personal: {
        mood: ['positive', 'neutral', 'negative', 'stressed', 'excited'][Math.floor(Math.random() * 5)] as any,
        energyLevel: Math.random(),
        comfort: Math.random()
      },
      hazards: []
    }
    
    this.samples.push(sample)
    return sample
  }
  
  async analyzePatternsAsync(samples: EnvironmentalSample[]): Promise<PatternAnalysis[]> {
    // Simulate pattern analysis
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return [
      {
        type: 'temporal',
        pattern: 'Higher energy levels between 10AM-2PM',
        confidence: 0.85,
        frequency: 0.7,
        correlation: ['temperature', 'light_level']
      },
      {
        type: 'spatial',
        pattern: 'Stress levels increase in crowded areas',
        confidence: 0.78,
        frequency: 0.6,
        correlation: ['crowd_density', 'noise_level']
      }
    ]
  }
  
  getDevices(): WearableDevice[] {
    return Array.from(this.devices.values())
  }
  
  getSamples(limit?: number): EnvironmentalSample[] {
    return limit ? this.samples.slice(-limit) : this.samples
  }
}

// Time estimation algorithms
export class TimeEstimationService {
  static estimateCommute(from: any, to: any, conditions: EnvironmentalSample): number {
    let baseTime = 30 // minutes
    
    // Adjust for weather
    if (conditions.weather.temperature < 5 || conditions.weather.temperature > 35) {
      baseTime *= 1.2
    }
    
    // Adjust for crowd density
    baseTime *= (1 + conditions.social.crowdDensity * 0.5)
    
    // Adjust for safety
    if (conditions.social.safetyScore < 0.5) {
      baseTime *= 1.3 // Take safer, potentially longer route
    }
    
    return Math.round(baseTime)
  }
  
  static estimateTaskDuration(taskType: string, conditions: EnvironmentalSample): number {
    const baseTimes = {
      'shopping': 45,
      'dining': 90,
      'exercise': 60,
      'work': 480
    }
    
    let baseTime = baseTimes[taskType as keyof typeof baseTimes] || 30
    
    // Adjust based on personal state
    if (conditions.personal.energyLevel < 0.3) {
      baseTime *= 1.4
    }
    if (conditions.personal.mood === 'stressed') {
      baseTime *= 1.2
    }
    
    return Math.round(baseTime)
  }
}
