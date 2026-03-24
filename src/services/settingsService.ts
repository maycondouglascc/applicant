const API_KEY_STORAGE_KEY = 'applicant_gemini_api_key'
const PERSONA_STORAGE_KEY = 'applicant_persona'

export type Persona = 'Professional' | 'Humble' | 'Aggressive'

export const PERSONAS: Persona[] = ['Professional', 'Humble', 'Aggressive']

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE_KEY) ?? ''
}

export function saveApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key)
}

export function getPersona(): Persona {
  const stored = localStorage.getItem(PERSONA_STORAGE_KEY)
  if (stored && PERSONAS.includes(stored as Persona)) {
    return stored as Persona
  }
  return 'Professional'
}

export function savePersona(persona: Persona): void {
  localStorage.setItem(PERSONA_STORAGE_KEY, persona)
}
