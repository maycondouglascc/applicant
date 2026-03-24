import { GoogleGenAI } from '@google/genai'

import { type Snippet } from './snippetService'

function parseGeminiError(err: unknown): Error {
  if (err instanceof Error) {
    // Try to extract structured error details from the message
    try {
      const match = err.message.match(/\{.*\}/s)
      if (match) {
        const parsed = JSON.parse(match[0])
        const code = parsed?.error?.code
        const status = parsed?.error?.status
        const retryInfo = parsed?.error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'))
        const retryDelay = retryInfo?.retryDelay?.replace('s', '')
        if (code === 429 || status === 'RESOURCE_EXHAUSTED') {
          const seconds = retryDelay ? ` Please retry in ${retryDelay} seconds.` : ''
          return new Error(`Gemini free-tier quota exceeded.${seconds} Check your billing at https://ai.dev/rate-limit`)
        }
      }
    } catch {
      // fall through to original message
    }
    return err
  }
  return new Error('Unknown error')
}

export async function testConnection(apiKey: string): Promise<boolean> {
  try {
    const ai = new GoogleGenAI({ apiKey })
    const response = await ai.models.generateContent({
      model: 'gemini-3.0-flash',
      contents: 'Respond with exactly: OK',
    })
    return !!response.text
  } catch {
    return false
  }
}

export interface TailoredContent {
  cv: string
  cl: string
  linkedin: string
}

export async function generateTailoredContent(
  apiKey: string,
  jd: string,
  persona: string,
  snippets: Snippet[]
): Promise<TailoredContent> {
  const ai = new GoogleGenAI({ apiKey })

  const snippetText = snippets.map((s, idx) => `Snippet ${idx + 1} (${s.name}):\n${s.content}`).join('\n\n')

  const prompt = `You are an expert career coach writing for a candidate adopting a "${persona}" persona.
You have the following Job Description:
---
${jd}
---

You also have the following Facts (Snippets) about the candidate. 
CRITICAL RULE: You MUST ONLY use the facts provided below. Do not invent any experience, metrics, or technologies not present in these snippets.
---
${snippetText}
---

Your task:
Generate three documents:
1. Tailored CV format (Markdown string). Use the candidate's exact facts but emphasize aspects relevant to the JD based on the persona.
2. Cover Letter (Markdown string). Adopt the persona's tone. Be persuasive. Again, ONLY use provided facts.
3. LinkedIn Outreach Message (plain text, under 300 characters). Short, punchy, persona-aligned message to a recruiter.

RESPOND ONLY WITH VALID JSON using the following structure, with no markdown code block formatting around the JSON:
{
  "cv": "The markdown CV...",
  "cl": "The markdown cover letter...",
  "linkedin": "The linkedin message..."
}`

  let response
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    })
  } catch (err) {
    throw parseGeminiError(err)
  }

  if (!response.text) {
    throw new Error('No response from Gemini')
  }

  try {
    const parsed = JSON.parse(response.text)
    return {
      cv: parsed.cv || '',
      cl: parsed.cl || '',
      linkedin: parsed.linkedin || ''
    }
  } catch (err) {
    throw new Error('Failed to parse tailored content JSON')
  }
}
