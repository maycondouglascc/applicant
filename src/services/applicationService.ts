export type ApplicationStatus = 'Backlog' | 'Applied' | 'Active' | 'Archived'
export type ApplicationPriority = 'High' | 'Medium' | 'Low'

export interface ApplicationChecklist {
  tailor_cv: boolean
  tailor_cl: boolean
  sent_li: boolean
  applied: boolean
  response: boolean
}

export interface Application {
  id: string
  job_description: string
  status: ApplicationStatus
  keywords: string[]
  suggested_snippet_ids: string[]
  tailored_cv?: string
  tailored_cl?: string
  linkedin_msg?: string
  company: string
  role: string
  priority: ApplicationPriority
  private_notes: string
  checklist: ApplicationChecklist
  created_at: string
  updated_at: string
}

export interface CreateApplicationData {
  job_description: string
  keywords: string[]
  suggested_snippet_ids: string[]
  tailored_cv?: string
  tailored_cl?: string
  linkedin_msg?: string
  company?: string
  role?: string
  priority?: ApplicationPriority
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
  const now = new Date().toISOString()
  const app: Application = {
    id: crypto.randomUUID(),
    job_description: data.job_description,
    keywords: data.keywords,
    suggested_snippet_ids: data.suggested_snippet_ids,
    tailored_cv: data.tailored_cv,
    tailored_cl: data.tailored_cl,
    linkedin_msg: data.linkedin_msg,
    status: 'Backlog',
    company: data.company ?? '',
    role: data.role ?? '',
    priority: data.priority ?? 'Medium',
    private_notes: '',
    checklist: {
      tailor_cv: false,
      tailor_cl: false,
      sent_li: false,
      applied: false,
      response: false,
    },
    created_at: now,
    updated_at: now,
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

export function updateApplication(
  id: string,
  updates: Partial<Application>
): Application | undefined {
  const apps = readStore()
  const index = apps.findIndex((a) => a.id === id)
  if (index === -1) return undefined

  apps[index] = {
    ...apps[index],
    ...updates,
    updated_at: updates.updated_at ?? new Date().toISOString(),
  }
  writeStore(apps)
  return apps[index]
}

/**
 * Archives any 'Applied' application whose updated_at is older than 30 days.
 * Should be called on mount of the Command Center page.
 */
export function archiveStaleApplications(): void {
  const apps = readStore()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const updated = apps.map((app) => {
    if (app.status === 'Applied' && new Date(app.updated_at) < thirtyDaysAgo) {
      return { ...app, status: 'Archived' as ApplicationStatus }
    }
    return app
  })

  writeStore(updated)
}
