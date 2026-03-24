export interface Application {
  id: string
  job_description: string
  status: 'Backlog' | 'Active' | 'Archived' // Based on PRD
  keywords: string[]
  suggested_snippet_ids: string[]
  tailored_cv?: string
  tailored_cl?: string
  linkedin_msg?: string
  created_at: string
}

export interface CreateApplicationData {
  job_description: string
  keywords: string[]
  suggested_snippet_ids: string[]
  tailored_cv?: string
  tailored_cl?: string
  linkedin_msg?: string
}

const STORAGE_KEY = 'applicant_applications'

function readStore(): Application[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Application[]
  } catch {
    return []
  }
}

function writeStore(applications: Application[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
}

export function createApplication(data: CreateApplicationData): Application {
  const apps = readStore()
  const app: Application = {
    id: crypto.randomUUID(),
    job_description: data.job_description,
    keywords: data.keywords,
    suggested_snippet_ids: data.suggested_snippet_ids,
    tailored_cv: data.tailored_cv,
    tailored_cl: data.tailored_cl,
    linkedin_msg: data.linkedin_msg,
    status: 'Backlog',
    created_at: new Date().toISOString(),
  }
  apps.push(app)
  writeStore(apps)
  return app
}

export function getApplications(): Application[] {
  return readStore()
}

export function getApplication(id: string): Application | undefined {
  return readStore().find((a) => a.id === id)
}

export function updateApplication(id: string, updates: Partial<Application>): Application | undefined {
  const apps = readStore()
  const index = apps.findIndex((a) => a.id === id)
  if (index === -1) return undefined
  
  apps[index] = { ...apps[index], ...updates }
  writeStore(apps)
  return apps[index]
}
