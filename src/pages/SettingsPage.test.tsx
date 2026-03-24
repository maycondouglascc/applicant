import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SettingsPage } from './SettingsPage'
import { getApiKey, getPersona } from '@/services/settingsService'

// Mock geminiService at the system boundary
vi.mock('@/services/geminiService', () => ({
  testConnection: vi.fn(),
}))

import { testConnection } from '@/services/geminiService'
const mockedTestConnection = vi.mocked(testConnection)

function renderSettings() {
  return render(<SettingsPage />)
}

describe('SettingsPage', () => {
  // TDD Cycle 1: Can enter and save an API key to localStorage
  it('saves an API key to localStorage on form submit', () => {
    renderSettings()

    fireEvent.change(screen.getByLabelText(/gemini api key/i), {
      target: { value: 'test-api-key-xyz' },
    })
    fireEvent.click(screen.getByText('Save Key'))

    // Verify through settingsService interface, not raw localStorage
    expect(getApiKey()).toBe('test-api-key-xyz')
    expect(screen.getByText('Key saved!')).toBeDefined()
  })

  // TDD Cycle 2: Loads previously saved key on mount
  it('pre-fills a previously saved API key on mount', () => {
    // Set up state before render
    localStorage.setItem('applicant_gemini_api_key', 'pre-existing-key')

    renderSettings()

    const input = screen.getByLabelText(/gemini api key/i) as HTMLInputElement
    expect(input.value).toBe('pre-existing-key')
  })

  // TDD Cycle 3: Can select and persist a persona
  it('selects a persona and persists it to localStorage', () => {
    renderSettings()

    fireEvent.change(screen.getByLabelText('Persona'), {
      target: { value: 'Humble' },
    })

    expect(getPersona()).toBe('Humble')
  })

  it('shows the previously saved persona on mount', () => {
    localStorage.setItem('applicant_persona', 'Aggressive')

    renderSettings()

    const select = screen.getByLabelText('Persona') as HTMLSelectElement
    expect(select.value).toBe('Aggressive')
  })

  // TDD Cycle 4: Test Connection success (mocked Gemini)
  it('shows success badge when test connection succeeds', async () => {
    mockedTestConnection.mockResolvedValueOnce(true)

    renderSettings()

    // Need to enter a key first so the button is enabled
    fireEvent.change(screen.getByLabelText(/gemini api key/i), {
      target: { value: 'valid-key' },
    })
    fireEvent.click(screen.getByText('Test Connection'))

    await waitFor(() => {
      expect(screen.getByText(/connection successful/i)).toBeDefined()
    })

    expect(mockedTestConnection).toHaveBeenCalledWith('valid-key')
  })

  // TDD Cycle 4b: Test Connection failure (mocked Gemini)
  it('shows failure badge when test connection fails', async () => {
    mockedTestConnection.mockResolvedValueOnce(false)

    renderSettings()

    fireEvent.change(screen.getByLabelText(/gemini api key/i), {
      target: { value: 'bad-key' },
    })
    fireEvent.click(screen.getByText('Test Connection'))

    await waitFor(() => {
      expect(screen.getByText(/connection failed/i)).toBeDefined()
    })
  })

  // Edge: Test Connection button is disabled when no key is entered
  it('disables Test Connection button when no key is entered', () => {
    renderSettings()

    const button = screen.getByText('Test Connection') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })
})
