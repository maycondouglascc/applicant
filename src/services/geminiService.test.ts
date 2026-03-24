import { describe, it, expect, vi } from 'vitest'
import { generateTailoredContent } from './geminiService'

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: vi.fn().mockImplementation(async (params: any) => {
          // ensure JSON output format
          return {
            text: JSON.stringify({
              cv: 'Mocked CV output',
              cl: 'Mocked CL output',
              linkedin: 'Mocked LinkedIn output'
            })
          }
        })
      }
    }))
  }
})

describe('geminiService', () => {
  it('generateTailoredContent calls gemini with structured prompt and parses JSON correctly', async () => {
    const jd = 'React Developer role...'
    const persona = 'Professional'
    const snippets = [{ id: '1', name: 'Exp1', content: 'Built UI components', created_at: '2023-01-01' }]

    const result = await generateTailoredContent('fake-key', jd, persona, snippets)

    expect(result.cv).toBe('Mocked CV output')
    expect(result.cl).toBe('Mocked CL output')
    expect(result.linkedin).toBe('Mocked LinkedIn output')
  })
})
