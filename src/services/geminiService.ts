import { GoogleGenAI } from '@google/genai'

export async function testConnection(apiKey: string): Promise<boolean> {
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Respond with exactly: OK',
    })
    return !!response.text
  } catch {
    return false
  }
}
