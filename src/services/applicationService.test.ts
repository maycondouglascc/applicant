import {
  createApplication,
  getApplications,
  getApplication,
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
})
