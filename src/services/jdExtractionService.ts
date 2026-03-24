import { GoogleGenAI } from '@google/genai'
import type { Snippet } from './snippetService'

export async function extractKeywords(apiKey: string, jobDescription: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey })
  
  const prompt = `Extract exactly 5 key skills/keywords from the following job description. Return them as a JSON array of strings, with no markdown formatting or extra text.
  
Job Description:
${jobDescription}`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  try {
    const text = response.text || '[]'
    // Trim backticks if Gemini includes them
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim()
    return JSON.parse(cleanText)
  } catch (err) {
    return []
  }
}

export function rankSnippets(keywords: string[], snippets: Snippet[]): Snippet[] {
  const normalizedKeywords = keywords.map(k => k.toLowerCase())
  
  const scored = snippets.map(snippet => {
    const contentLower = snippet.content.toLowerCase()
    const nameLower = snippet.name.toLowerCase()
    const fullText = `${nameLower} ${contentLower}`
    
    let score = 0
    normalizedKeywords.forEach(keyword => {
      if (fullText.includes(keyword)) {
        score++
      }
    })
    
    return { snippet, score }
  })
  
  scored.sort((a, b) => b.score - a.score)
  
  return scored.map(s => s.snippet)
}
