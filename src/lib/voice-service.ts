// Voice Command Framework for Environmental Data Collection
import { useState, useEffect } from 'react'

export interface VoiceCommand {
  trigger: string
  action: string
  parameters?: string[]
  confidence: number
  context: 'sampling' | 'catalog' | 'admin' | 'global'
}

export interface VoiceResponse {
  text: string
  action?: () => void
  data?: any
}

export class VoiceCommandService {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private commands: Map<string, (params: string[]) => VoiceResponse> = new Map()

  constructor() {
    this.initializeSpeechRecognition()
    this.initializeSpeechSynthesis()
    this.registerDefaultCommands()
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1
        const command = event.results[last][0].transcript.toLowerCase()
        
        if (event.results[last].isFinal) {
          this.processCommand(command)
        }
      }

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
      }
    }
  }

  private initializeSpeechSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis
    }
  }

  private registerDefaultCommands() {
    // Sampling commands
    this.registerCommand('start sampling', () => ({
      text: 'Starting environmental data collection',
      action: () => this.triggerSampling()
    }))

    this.registerCommand('stop sampling', () => ({
      text: 'Stopping data collection',
      action: () => this.stopSampling()
    }))

    this.registerCommand('show current data', () => ({
      text: 'Displaying current environmental readings',
      action: () => this.showCurrentData()
    }))

    // Catalog commands
    this.registerCommand('analyze patterns', () => ({
      text: 'Analyzing environmental patterns',
      action: () => this.analyzePatterns()
    }))

    this.registerCommand('home recommendations', () => ({
      text: 'Generating home optimization recommendations',
      action: () => this.getHomeRecommendations()
    }))

    this.registerCommand('create catalog', (params) => ({
      text: `Creating new catalog: ${params.join(' ')}`,
      action: () => this.createCatalog(params.join(' '))
    }))

    // Data sharing commands
    this.registerCommand('privacy settings', () => ({
      text: 'Opening privacy and data sharing settings',
      action: () => this.openPrivacySettings()
    }))

    this.registerCommand('revenue summary', () => ({
      text: 'Displaying data revenue summary',
      action: () => this.showRevenueSummary()
    }))

    // Navigation commands
    this.registerCommand('go to admin', () => ({
      text: 'Navigating to admin dashboard',
      action: () => this.navigate('/admin')
    }))

    this.registerCommand('go to sampling', () => ({
      text: 'Navigating to sampling dashboard',
      action: () => this.navigate('/sampling')
    }))

    this.registerCommand('go to catalog', () => ({
      text: 'Navigating to personal catalog',
      action: () => this.navigate('/catalog')
    }))

    // Help commands
    this.registerCommand('help', () => ({
      text: 'Available commands: start sampling, analyze patterns, home recommendations, privacy settings, and navigation commands',
      data: this.getAvailableCommands()
    }))

    this.registerCommand('what can you do', () => ({
      text: 'I can help you control environmental sampling, analyze data patterns, manage privacy settings, and navigate the application using voice commands',
    }))
  }

  registerCommand(trigger: string, handler: (params: string[]) => VoiceResponse) {
    this.commands.set(trigger.toLowerCase(), handler)
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start()
      this.isListening = true
      this.speak('Voice commands activated. Say "help" to see available commands.')
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
      this.speak('Voice commands deactivated.')
    }
  }

  private processCommand(command: string) {
    console.log('Processing voice command:', command)

    // Find matching command
    let bestMatch = { command: '', confidence: 0, handler: null as any }

    for (const [trigger, handler] of this.commands.entries()) {
      const confidence = this.calculateSimilarity(command, trigger)
      if (confidence > bestMatch.confidence && confidence > 0.7) {
        bestMatch = { command: trigger, confidence, handler }
      }
    }

    if (bestMatch.handler) {
      const params = this.extractParameters(command, bestMatch.command)
      const response = bestMatch.handler(params)
      
      this.speak(response.text)
      if (response.action) {
        response.action()
      }
    } else {
      this.speak("I didn't understand that command. Say 'help' for available commands.")
    }
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple similarity calculation - could be improved with better algorithms
    const words1 = text1.split(' ')
    const words2 = text2.split(' ')
    
    let matches = 0
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1.includes(word2) || word2.includes(word1)) {
          matches++
          break
        }
      }
    }

    return matches / Math.max(words1.length, words2.length)
  }

  private extractParameters(command: string, trigger: string): string[] {
    const commandWords = command.split(' ')
    const triggerWords = trigger.split(' ')
    
    // Find words in command that aren't in trigger
    return commandWords.filter(word => 
      !triggerWords.some(triggerWord => 
        word.includes(triggerWord) || triggerWord.includes(word)
      )
    )
  }

  speak(text: string) {
    if (this.synthesis) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      this.synthesis.speak(utterance)
    }
  }

  // Command action implementations
  private triggerSampling() {
    // Simulate starting sampling
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-start-sampling'))
    }
  }

  private stopSampling() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-stop-sampling'))
    }
  }

  private showCurrentData() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-show-data'))
    }
  }

  private analyzePatterns() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-analyze-patterns'))
    }
  }

  private getHomeRecommendations() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-home-recommendations'))
    }
  }

  private createCatalog(name: string) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-create-catalog', { detail: { name } }))
    }
  }

  private openPrivacySettings() {
    this.navigate('/data-sharing')
  }

  private showRevenueSummary() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('voice-revenue-summary'))
    }
  }

  private navigate(path: string) {
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  private getAvailableCommands(): string[] {
    return Array.from(this.commands.keys())
  }

  isSupported(): boolean {
    return !!(this.recognition && this.synthesis)
  }

  getStatus(): { listening: boolean, supported: boolean } {
    return {
      listening: this.isListening,
      supported: this.isSupported()
    }
  }
}

// React hook for voice commands
export function useVoiceCommands() {
  const [voiceService] = useState(() => new VoiceCommandService())
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(voiceService.isSupported())

    const handleVoiceEvents = () => {
      const status = voiceService.getStatus()
      setIsListening(status.listening)
    }

    // Listen for status changes
    const interval = setInterval(handleVoiceEvents, 1000)

    return () => clearInterval(interval)
  }, [voiceService])

  const startListening = () => {
    voiceService.startListening()
    setIsListening(true)
  }

  const stopListening = () => {
    voiceService.stopListening()
    setIsListening(false)
  }

  const speak = (text: string) => {
    voiceService.speak(text)
  }

  return {
    startListening,
    stopListening,
    speak,
    isListening,
    isSupported,
    voiceService
  }
}
