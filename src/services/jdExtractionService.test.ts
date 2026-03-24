import type { Snippet } from './snippetService'
import { extractKeywords, rankSnippets } from './jdExtractionService'

describe('jdExtractionService', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch')
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('extractKeywords', () => {
    it('returns an array of 5 keyword strings from the mocked Gemini response', async () => {
      // Mock fetch
      const mockResponse = {
        ok: true,
        headers: {
          entries: () => []
        },
        json: async () => ({
          candidates: [{ content: { parts: [{ text: '["React", "TypeScript", "Node.js", "GraphQL", "AWS"]' }] } }]
        })
      };
      (global.fetch as any).mockResolvedValue(mockResponse)

      const keywords = await extractKeywords('fake-api-key', 'Seeking a react developer with typescript skills')
      expect(keywords).toEqual(['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'])
      expect(keywords.length).toBe(5)
    })
  })

  describe('rankSnippets', () => {
    it('returns snippets sorted by relevance based on keyword match count', () => {
      const keywords = ['React', 'TypeScript', 'Node.js']
      const snippets: Snippet[] = [
        { id: '1', name: 'Backend', content: 'Node.js and Express', created_at: '' },
        { id: '2', name: 'Fullstack', content: 'React, TypeScript, and Node.js with some GraphQL', created_at: '' },
        { id: '3', name: 'Frontend', content: 'React and CSS', created_at: '' },
        { id: '4', name: 'DevOps', content: 'AWS and Docker', created_at: '' }
      ]

      const ranked = rankSnippets(keywords, snippets)

      expect(ranked[0].name).toBe('Fullstack')
      expect(ranked[3].name).toBe('DevOps')
      
      const middleNames = [ranked[1].name, ranked[2].name]
      expect(middleNames.includes('Backend')).toBe(true)
      expect(middleNames.includes('Frontend')).toBe(true)
    })
    
    it('is case insensitive when matching keywords', () => {
      const keywords = ['react', 'TYPESCRIPT']
      const snippets: Snippet[] = [
        { id: '1', name: 'Lower', content: 'we use react and typescript', created_at: '' },
        { id: '2', name: 'None', content: 'we use nothing', created_at: '' }
      ]

      const ranked = rankSnippets(keywords, snippets)
      expect(ranked[0].name).toBe('Lower')
    })
  })
})
