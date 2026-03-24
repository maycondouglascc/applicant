export interface Snippet {
  id: string
  name: string
  content: string
  created_at: string
}

export interface CreateSnippetData {
  name: string
  content: string
}

export type UpdateSnippetData = Partial<CreateSnippetData>

const STORAGE_KEY = 'applicant_snippets'

function readStore(): Snippet[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Snippet[]
  } catch {
    return []
  }
}

function writeStore(snippets: Snippet[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets))
}

export function getSnippets(): Snippet[] {
  return readStore()
}

export function getSnippet(id: string): Snippet | undefined {
  return readStore().find((s) => s.id === id)
}

export function createSnippet(data: CreateSnippetData): Snippet {
  const snippets = readStore()
  const snippet: Snippet = {
    id: crypto.randomUUID(),
    name: data.name,
    content: data.content,
    created_at: new Date().toISOString(),
  }
  snippets.push(snippet)
  writeStore(snippets)
  return snippet
}

export function updateSnippet(
  id: string,
  data: UpdateSnippetData
): Snippet | undefined {
  const snippets = readStore()
  const index = snippets.findIndex((s) => s.id === id)
  if (index === -1) return undefined
  snippets[index] = { ...snippets[index], ...data }
  writeStore(snippets)
  return snippets[index]
}

export function deleteSnippet(id: string): boolean {
  const snippets = readStore()
  const filtered = snippets.filter((s) => s.id !== id)
  if (filtered.length === snippets.length) return false
  writeStore(filtered)
  return true
}
