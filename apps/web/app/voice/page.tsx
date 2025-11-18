'use client'

import { useEffect, useState } from 'react'

export default function VoiceCommandsPage() {
  const [transcript, setTranscript] = useState('')
  const [listening, setListening] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let recognition: any
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      recognition = new window.webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'
      recognition.onresult = (event: any) => {
        setTranscript(event.results[0][0].transcript)
        setListening(false)
      }
      recognition.onerror = (event: any) => {
        setError(event.error)
        setListening(false)
      }
    }
    if (listening && recognition) {
      recognition.start()
    }
    return () => {
      if (recognition) recognition.stop()
    }
  }, [listening])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Voice Command Demo</h1>
        <p className="text-gray-600 mb-6">
          Use your voice to interact with the EC Store. This demo uses the browser's speech recognition API.
        </p>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <button
            onClick={() => { setTranscript(''); setError(''); setListening(true) }}
            disabled={listening}
            className={`px-6 py-3 rounded-lg font-medium mb-4 ${listening ? 'bg-gray-300 text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {listening ? 'Listening...' : 'Start Voice Command'}
          </button>
          <div className="w-full text-center">
            {transcript && (
              <div className="text-green-700 font-semibold mb-2">You said: "{transcript}"</div>
            )}
            {error && (
              <div className="text-red-600 font-semibold mb-2">Error: {error}</div>
            )}
            {!transcript && !error && !listening && (
              <div className="text-gray-500">Click the button and speak a command (e.g., "Show my catalog", "Go to admin")</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
