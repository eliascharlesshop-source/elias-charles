'use client'

import { useState, useEffect } from 'react'
import { DataSharingConsent, ThirdPartyIntegration } from '@/src/lib/wearable-service'

export default function DataSharingDashboard() {
  const [consents, setConsents] = useState<DataSharingConsent[]>([])
  const [integrations, setIntegrations] = useState<ThirdPartyIntegration[]>([])
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<ThirdPartyIntegration | null>(null)

  useEffect(() => {
    // Mock third-party integrations
    const mockIntegrations: ThirdPartyIntegration[] = [
      {
        id: 'security_001',
        name: 'Urban Safety Analytics',
        type: 'security',
        dataAccess: ['location', 'safety_scores', 'hazard_detection'],
        privacyLevel: 'anonymous',
        active: false
      },
      {
        id: 'commercial_001',
        name: 'Local Business Insights',
        type: 'commercial',
        dataAccess: ['location', 'preferences', 'mood_data'],
        privacyLevel: 'pseudonymous',
        compensation: 0.05, // per data point
        active: false
      },
      {
        id: 'research_001',
        name: 'Climate Research Institute',
        type: 'research',
        dataAccess: ['environmental_data', 'weather_patterns'],
        privacyLevel: 'anonymous',
        active: true
      },
      {
        id: 'commercial_002',
        name: 'Smart City Planning',
        type: 'government',
        dataAccess: ['crowd_density', 'traffic_patterns', 'noise_levels'],
        privacyLevel: 'anonymous',
        active: true
      }
    ]

    setIntegrations(mockIntegrations)

    // Mock existing consents
    const mockConsents: DataSharingConsent[] = [
      {
        userId: 'user_123',
        dataTypes: ['environmental_data', 'weather_patterns'],
        purposes: ['climate research', 'urban planning'],
        recipients: ['Climate Research Institute'],
        anonymization: true,
        retentionPeriod: 365,
        canWithdraw: true,
        consentDate: new Date(Date.now() - 86400000 * 30).toISOString()
      }
    ]

    setConsents(mockConsents)
  }, [])

  const handleToggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, active: !integration.active }
        : integration
    ))
  }

  const handleConsentSubmit = (integration: ThirdPartyIntegration, consentData: any) => {
    const newConsent: DataSharingConsent = {
      userId: 'user_123',
      dataTypes: integration.dataAccess,
      purposes: [integration.type],
      recipients: [integration.name],
      anonymization: integration.privacyLevel === 'anonymous',
      retentionPeriod: consentData.retentionPeriod,
      canWithdraw: true,
      consentDate: new Date().toISOString()
    }

    setConsents(prev => [...prev, newConsent])
    handleToggleIntegration(integration.id)
    setShowConsentModal(false)
    setSelectedIntegration(null)
  }

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'anonymous': return '🔒'
      case 'pseudonymous': return '🔓'
      case 'identified': return '👤'
      default: return '❓'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return '🛡️'
      case 'commercial': return '💼'
      case 'research': return '🔬'
      case 'government': return '🏛️'
      default: return '📊'
    }
  }

  const ConsentModal = () => {
    const [retentionPeriod, setRetentionPeriod] = useState(365)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    if (!selectedIntegration) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Data Sharing Consent</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{selectedIntegration.name}</h3>
            <p className="text-gray-600 mb-4">
              {getTypeIcon(selectedIntegration.type)} {selectedIntegration.type.charAt(0).toUpperCase() + selectedIntegration.type.slice(1)} Partner
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Data Access Requested:</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {selectedIntegration.dataAccess.map(data => (
                  <li key={data} className="capitalize">{data.replace('_', ' ')}</li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-2">Privacy Level:</h4>
              <p className="text-sm">
                {getPrivacyIcon(selectedIntegration.privacyLevel)} 
                <span className="ml-2 capitalize">{selectedIntegration.privacyLevel}</span>
                {selectedIntegration.privacyLevel === 'anonymous' && ' - Your identity cannot be determined'}
                {selectedIntegration.privacyLevel === 'pseudonymous' && ' - Data linked to anonymous ID'}
                {selectedIntegration.privacyLevel === 'identified' && ' - Data linked to your identity'}
              </p>
            </div>

            {selectedIntegration.compensation && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Compensation:</h4>
                <p className="text-sm">${selectedIntegration.compensation} per data point shared</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Data Retention Period (days):
            </label>
            <select 
              value={retentionPeriod} 
              onChange={(e) => setRetentionPeriod(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={365}>1 year</option>
              <option value={1095}>3 years</option>
              <option value={-1}>Indefinite</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">
                I agree to share my data under these terms and understand I can withdraw consent at any time
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button 
              onClick={() => setShowConsentModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleConsentSubmit(selectedIntegration, { retentionPeriod })}
              disabled={!agreedToTerms}
              className={`px-6 py-2 rounded-lg ${
                agreedToTerms 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Grant Consent
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
          <h1 className="text-3xl font-bold text-gray-900">Data Sharing & Third-Party Integrations</h1>
          <p className="text-gray-600 mt-2">Manage how your environmental data is shared and monetized</p>
        </div>

        {/* Active Consents */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Active Data Sharing Consents</h2>
          {consents.length > 0 ? (
            <div className="space-y-4">
              {consents.map((consent, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{consent.recipients.join(', ')}</h3>
                    <span className="text-sm text-gray-500">
                      Since {new Date(consent.consentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Data Types:</strong> {consent.dataTypes.join(', ')}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Retention:</strong> {consent.retentionPeriod === -1 ? 'Indefinite' : `${consent.retentionPeriod} days`}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm px-2 py-1 rounded ${
                      consent.anonymization ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consent.anonymization ? 'Anonymous' : 'Identified'}
                    </span>
                    {consent.canWithdraw && (
                      <button className="text-sm text-red-600 hover:text-red-800">
                        Withdraw Consent
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No active data sharing consents</p>
          )}
        </div>

        {/* Available Integrations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available Third-Party Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map(integration => (
              <div key={integration.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium flex items-center">
                      {getTypeIcon(integration.type)}
                      <span className="ml-2">{integration.name}</span>
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">{integration.type}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    integration.active ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">Data Access:</p>
                  <div className="flex flex-wrap gap-1">
                    {integration.dataAccess.map(data => (
                      <span key={data} className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                        {data.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-sm">
                    {getPrivacyIcon(integration.privacyLevel)}
                    <span className="ml-1 capitalize">{integration.privacyLevel}</span>
                  </div>
                  {integration.compensation && (
                    <span className="text-sm text-green-600 font-medium">
                      ${integration.compensation}/point
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (integration.active) {
                      handleToggleIntegration(integration.id)
                    } else {
                      setSelectedIntegration(integration)
                      setShowConsentModal(true)
                    }
                  }}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                    integration.active
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {integration.active ? 'Disconnect' : 'Connect & Share Data'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Data Revenue Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">$23.45</p>
              <p className="text-sm text-gray-600">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">1,247</p>
              <p className="text-sm text-gray-600">Data Points Shared</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">4</p>
              <p className="text-sm text-gray-600">Active Partners</p>
            </div>
          </div>
        </div>
      </div>

      {showConsentModal && <ConsentModal />}
    </div>
  )
}
