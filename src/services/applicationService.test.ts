import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  archiveStaleApplications,
} from './applicationService'

describe('applicationService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // Cycle 1
  it('creates an application and saves it properly to Backlog status', () => {
    const app = createApplication({
      job_description: 'Looking for a skilled frontend dev...',
      keywords: ['React', 'TypeScript'],
      suggested_snippet_ids: ['123', '456'],
    })

    expect(app.id).toBeDefined()
    expect(app.status).toBe('Backlog')
    expect(app.job_description).toBe('Looking for a skilled frontend dev...')
    expect(app.keywords).toEqual(['React', 'TypeScript'])
    expect(app.suggested_snippet_ids).toEqual(['123', '456'])
    expect(app.created_at).toBeDefined()
  })

  // Cycle 2
  it('lists created applications', () => {
    const created1 = createApplication({
      job_description: 'JD 1',
      keywords: [],
      suggested_snippet_ids: [],
    })
    const created2 = createApplication({
      job_description: 'JD 2',
      keywords: [],
      suggested_snippet_ids: [],
    })

    const apps = getApplications()
    expect(apps).toHaveLength(2)
    expect(apps.map((a: { id: string }) => a.id)).toContain(created1.id)
    expect(apps.map((a: { id: string }) => a.id)).toContain(created2.id)
  })

  // Cycle 3
  it('retrieves a single application by id', () => {
    const created = createApplication({
      job_description: 'Retrieve Me',
      keywords: [],
      suggested_snippet_ids: [],
    })

    const found = getApplication(created.id)
    expect(found).toBeDefined()
    expect(found?.job_description).toBe('Retrieve Me')
  })

  it('returns undefined for non-existent application', () => {
    expect(getApplication('does-not-exist')).toBeUndefined()
  })

  // Cycle 4
  it('updates an existing application', () => {
    const app = createApplication({
      job_description: 'JD to update',
      keywords: [],
      suggested_snippet_ids: [],
    })

    const updated = updateApplication(app.id, {
      tailored_cv: 'New CV Content',
      status: 'Active',
    })

    expect(updated).toBeDefined()
    expect(updated?.tailored_cv).toBe('New CV Content')
    expect(updated?.status).toBe('Active')

    const found = getApplication(app.id)
    expect(found?.tailored_cv).toBe('New CV Content')
    expect(found?.status).toBe('Active')
  })

  // --- S1: Extended fields ---
  it('creates an application with company, role, priority, checklist, private_notes, and updated_at', () => {
    const app = createApplication({
      job_description: 'Senior Product Designer',
      keywords: [],
      suggested_snippet_ids: [],
      company: 'Acme Corp',
      role: 'Senior Product Designer',
      priority: 'High',
    })

    expect(app.company).toBe('Acme Corp')
    expect(app.role).toBe('Senior Product Designer')
    expect(app.priority).toBe('High')
    expect(app.private_notes).toBe('')
    expect(app.updated_at).toBeDefined()
    expect(app.checklist).toEqual({
      tailor_cv: false,
      tailor_cl: false,
      sent_li: false,
      applied: false,
      response: false,
    })
  })

  it('defaults priority to Medium and company/role to empty string when omitted', () => {
    const app = createApplication({
      job_description: 'Generic JD',
      keywords: [],
      suggested_snippet_ids: [],
    })

    expect(app.priority).toBe('Medium')
    expect(app.company).toBe('')
    expect(app.role).toBe('')
  })

  // --- S2: archiveStaleApplications archives Applied apps older than 30 days ---
  it('archives Applied applications whose updated_at is older than 30 days', () => {
    const staleDate = new Date()
    staleDate.setDate(staleDate.getDate() - 31)

    const app = createApplication({
      job_description: 'Old Applied JD',
      keywords: [],
      suggested_snippet_ids: [],
    })
    updateApplication(app.id, {
      status: 'Applied',
      updated_at: staleDate.toISOString(),
    })

    archiveStaleApplications()

    const found = getApplication(app.id)
    expect(found?.status).toBe('Archived')
  })

  // --- S3: archiveStaleApplications leaves fresh Applied apps untouched ---
  it('does not archive Applied applications updated within the last 30 days', () => {
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 5)

    const app = createApplication({
      job_description: 'Recent Applied JD',
      keywords: [],
      suggested_snippet_ids: [],
    })
    updateApplication(app.id, {
      status: 'Applied',
      updated_at: recentDate.toISOString(),
    })

    archiveStaleApplications()

    const found = getApplication(app.id)
    expect(found?.status).toBe('Applied')
  })
})

