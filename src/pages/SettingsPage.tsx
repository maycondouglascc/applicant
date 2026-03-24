import { useState } from 'react'
import {
  getApiKey,
  saveApiKey,
  getPersona,
  savePersona,
  PERSONAS,
  type Persona,
} from '@/services/settingsService'
import { testConnection } from '@/services/geminiService'

export function SettingsPage() {
  const [apiKey, setApiKey] = useState(() => getApiKey())
  const [persona, setPersona] = useState<Persona>(() => getPersona())
  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [saved, setSaved] = useState(false)

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault()
    saveApiKey(apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPersona = e.target.value as Persona
    setPersona(newPersona)
    savePersona(newPersona)
  }

  const handleTestConnection = async () => {
    setConnectionStatus('loading')
    const success = await testConnection(apiKey)
    setConnectionStatus(success ? 'success' : 'error')
  }

  return (
    <div>
      <h1>Settings</h1>

      <section>
        <h2>API Key</h2>
        <form onSubmit={handleSaveApiKey} aria-label="API key form">
          <div>
            <label htmlFor="api-key">Gemini API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
            />
          </div>
          <button type="submit">Save Key</button>
          {saved && <span role="status">Key saved!</span>}
        </form>

        <button
          onClick={handleTestConnection}
          disabled={!apiKey || connectionStatus === 'loading'}
        >
          Test Connection
        </button>

        {connectionStatus === 'loading' && (
          <span role="status">Testing...</span>
        )}
        {connectionStatus === 'success' && (
          <span role="status" data-testid="connection-badge">
            ✓ Connection successful
          </span>
        )}
        {connectionStatus === 'error' && (
          <span role="status" data-testid="connection-badge">
            ✗ Connection failed
          </span>
        )}
      </section>

      <section>
        <h2>AI Persona</h2>
        <label htmlFor="persona-select">Persona</label>
        <select
          id="persona-select"
          value={persona}
          onChange={handlePersonaChange}
        >
          {PERSONAS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </section>
    </div>
  )
}
