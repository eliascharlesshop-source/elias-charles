// AR/VR Visualization Framework for Environmental Data
export interface ARVisualization {
  id: string
  type: 'air_quality_overlay' | 'crowd_density_heatmap' | 'safety_indicators' | 'weather_particles'
  position: {
    x: number
    y: number
    z: number
  }
  data: any
  visibility: boolean
  opacity: number
}

export interface VREnvironment {
  id: string
  name: string
  type: 'home_simulation' | 'data_dashboard' | 'environmental_history'
  assets: string[]
  interactions: VRInteraction[]
}

export interface VRInteraction {
  type: 'gesture' | 'gaze' | 'voice' | 'controller'
  action: string
  target: string
  callback: () => void
}

export class ARVRService {
  private arEnabled = false
  private vrEnabled = false
  private visualizations: ARVisualization[] = []

  async initializeAR(): Promise<boolean> {
    try {
      // Check for WebXR AR support
      if ('xr' in navigator && 'requestSession' in (navigator as any).xr) {
        const session = await (navigator as any).xr.requestSession('immersive-ar')
        this.arEnabled = true
        return true
      }
      console.warn('AR not supported on this device')
      return false
    } catch (error) {
      console.error('AR initialization failed:', error)
      return false
    }
  }

  async initializeVR(): Promise<boolean> {
    try {
      // Check for WebXR VR support
      if ('xr' in navigator && 'requestSession' in (navigator as any).xr) {
        const session = await (navigator as any).xr.requestSession('immersive-vr')
        this.vrEnabled = true
        return true
      }
      console.warn('VR not supported on this device')
      return false
    } catch (error) {
      console.error('VR initialization failed:', error)
      return false
    }
  }

  createARVisualization(sample: any): ARVisualization {
    return {
      id: `ar_${Date.now()}`,
      type: this.getVisualizationType(sample),
      position: {
        x: sample.location?.longitude || 0,
        y: sample.location?.latitude || 0,
        z: 0
      },
      data: sample,
      visibility: true,
      opacity: this.calculateOpacity(sample)
    }
  }

  private getVisualizationType(sample: any): ARVisualization['type'] {
    if (sample.weather?.airQuality !== undefined) return 'air_quality_overlay'
    if (sample.social?.crowdDensity !== undefined) return 'crowd_density_heatmap'
    if (sample.social?.safetyScore !== undefined) return 'safety_indicators'
    return 'weather_particles'
  }

  private calculateOpacity(sample: any): number {
    // Calculate opacity based on data confidence or severity
    if (sample.weather?.airQuality !== undefined) {
      return 1 - sample.weather.airQuality // Lower quality = more visible
    }
    if (sample.social?.safetyScore !== undefined) {
      return 1 - sample.social.safetyScore // Lower safety = more visible
    }
    return 0.7
  }

  renderAROverlay(canvas: HTMLCanvasElement, visualizations: ARVisualization[]) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    visualizations.forEach(viz => {
      if (!viz.visibility) return

      ctx.globalAlpha = viz.opacity
      
      switch (viz.type) {
        case 'air_quality_overlay':
          this.renderAirQualityOverlay(ctx, viz)
          break
        case 'crowd_density_heatmap':
          this.renderCrowdDensityHeatmap(ctx, viz)
          break
        case 'safety_indicators':
          this.renderSafetyIndicators(ctx, viz)
          break
        case 'weather_particles':
          this.renderWeatherParticles(ctx, viz)
          break
      }
    })
  }

  private renderAirQualityOverlay(ctx: CanvasRenderingContext2D, viz: ARVisualization) {
    const quality = viz.data.weather?.airQuality || 0
    const color = quality > 0.7 ? 'green' : quality > 0.4 ? 'orange' : 'red'
    
    ctx.fillStyle = color
    ctx.fillRect(viz.position.x - 25, viz.position.y - 25, 50, 50)
    
    ctx.fillStyle = 'white'
    ctx.font = '12px Arial'
    ctx.fillText(`AQ: ${(quality * 100).toFixed(0)}%`, viz.position.x - 20, viz.position.y)
  }

  private renderCrowdDensityHeatmap(ctx: CanvasRenderingContext2D, viz: ARVisualization) {
    const density = viz.data.social?.crowdDensity || 0
    const radius = 30 + density * 20
    
    const gradient = ctx.createRadialGradient(
      viz.position.x, viz.position.y, 0,
      viz.position.x, viz.position.y, radius
    )
    gradient.addColorStop(0, `rgba(255, 0, 0, ${density})`)
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(viz.position.x, viz.position.y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  private renderSafetyIndicators(ctx: CanvasRenderingContext2D, viz: ARVisualization) {
    const safety = viz.data.social?.safetyScore || 0
    const color = safety > 0.7 ? '#00ff00' : safety > 0.4 ? '#ffff00' : '#ff0000'
    
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(viz.position.x, viz.position.y, 20, 0, 2 * Math.PI)
    ctx.stroke()
    
    ctx.fillStyle = color
    ctx.font = 'bold 16px Arial'
    ctx.fillText('⚠️', viz.position.x - 8, viz.position.y + 5)
  }

  private renderWeatherParticles(ctx: CanvasRenderingContext2D, viz: ARVisualization) {
    const temp = viz.data.weather?.temperature || 20
    const humidity = viz.data.weather?.humidity || 50
    
    // Render temperature as color intensity
    const tempColor = temp > 25 ? '#ff6b6b' : temp > 15 ? '#4ecdc4' : '#45b7d1'
    
    ctx.fillStyle = tempColor
    for (let i = 0; i < humidity / 10; i++) {
      const x = viz.position.x + (Math.random() - 0.5) * 40
      const y = viz.position.y + (Math.random() - 0.5) * 40
      ctx.fillRect(x, y, 2, 2)
    }
  }

  createVREnvironment(type: VREnvironment['type'], data: any): VREnvironment {
    return {
      id: `vr_${Date.now()}`,
      name: this.getEnvironmentName(type),
      type,
      assets: this.getEnvironmentAssets(type),
      interactions: this.getEnvironmentInteractions(type)
    }
  }

  private getEnvironmentName(type: VREnvironment['type']): string {
    switch (type) {
      case 'home_simulation': return 'Virtual Home Environment'
      case 'data_dashboard': return '3D Data Dashboard'
      case 'environmental_history': return 'Environmental Timeline'
      default: return 'VR Environment'
    }
  }

  private getEnvironmentAssets(type: VREnvironment['type']): string[] {
    switch (type) {
      case 'home_simulation': return ['home_model.glb', 'furniture.glb', 'lighting.glb']
      case 'data_dashboard': return ['dashboard.glb', 'charts.glb', 'ui_elements.glb']
      case 'environmental_history': return ['timeline.glb', 'markers.glb', 'particles.glb']
      default: return []
    }
  }

  private getEnvironmentInteractions(type: VREnvironment['type']): VRInteraction[] {
    const baseInteractions: VRInteraction[] = [
      {
        type: 'gesture',
        action: 'point',
        target: 'ui_element',
        callback: () => console.log('Element selected')
      },
      {
        type: 'voice',
        action: 'show_data',
        target: 'dashboard',
        callback: () => console.log('Voice command executed')
      }
    ]

    switch (type) {
      case 'home_simulation':
        return [
          ...baseInteractions,
          {
            type: 'controller',
            action: 'move_furniture',
            target: 'furniture',
            callback: () => console.log('Furniture moved')
          }
        ]
      case 'data_dashboard':
        return [
          ...baseInteractions,
          {
            type: 'gaze',
            action: 'focus_chart',
            target: 'chart',
            callback: () => console.log('Chart focused')
          }
        ]
      default:
        return baseInteractions
    }
  }

  isARSupported(): boolean {
    return 'xr' in navigator && this.arEnabled
  }

  isVRSupported(): boolean {
    return 'xr' in navigator && this.vrEnabled
  }
}
