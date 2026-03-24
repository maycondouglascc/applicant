import {
  getApiKey,
  saveApiKey,
  getPersona,
  savePersona,
} from './settingsService'

describe('settingsService', () => {
  // TDD Cycle 1: API key save and load
  it('returns empty string when no API key is saved', () => {
    expect(getApiKey()).toBe('')
  })

  it('saves and retrieves an API key', () => {
    saveApiKey('AIzaSy-test-key-123')
    expect(getApiKey()).toBe('AIzaSy-test-key-123')
  })

  it('overwrites a previously saved API key', () => {
    saveApiKey('old-key')
    saveApiKey('new-key')
    expect(getApiKey()).toBe('new-key')
  })

  // TDD Cycle 2: Persona save and load
  it('defaults to Professional when no persona is saved', () => {
    expect(getPersona()).toBe('Professional')
  })

  it('saves and retrieves a persona', () => {
    savePersona('Humble')
    expect(getPersona()).toBe('Humble')
  })

  it('falls back to Professional for invalid stored persona', () => {
    localStorage.setItem('applicant_persona', 'InvalidValue')
    expect(getPersona()).toBe('Professional')
  })
})
