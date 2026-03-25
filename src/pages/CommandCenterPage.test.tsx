import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CommandCenterPage } from './CommandCenterPage'
import type { Application } from '@/services/applicationService'

// --- Helpers ---
const makeApp = (overrides: Partial<Application> = {}): Application => ({
  id: crypto.randomUUID(),
  job_description: 'Frontend Engineer at Acme',
  status: 'Backlog',
  keywords: ['React'],
  suggested_snippet_ids: [],
  company: 'Acme Corp',
  role: 'Frontend Engineer',
  priority: 'Medium',
  private_notes: '',
  checklist: { tailor_cv: false, tailor_cl: false, sent_li: false, applied: false, response: false },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// --- Mocks ---
vi.mock('@/services/applicationService', () => ({
  getApplications: vi.fn(),
  updateApplication: vi.fn(),
  archiveStaleApplications: vi.fn(),
}))

import {
  getApplications,
  updateApplication,
  archiveStaleApplications,
} from '@/services/applicationService'

const mockGetApplications = vi.mocked(getApplications)
const mockUpdateApplication = vi.mocked(updateApplication)
const mockArchiveStaleApplications = vi.mocked(archiveStaleApplications)

describe('CommandCenterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // P1 — Tracer bullet: renders empty state when no applications exist
  it('renders the empty state when there are no applications', () => {
    mockGetApplications.mockReturnValue([])
    render(<CommandCenterPage />)
    expect(screen.getByText(/no applications/i)).toBeDefined()
    expect(mockArchiveStaleApplications).toHaveBeenCalledOnce()
  })

  // P2 — Shows non-Archived apps in the table
  it('renders a row for each non-Archived application', () => {
    const apps = [
      makeApp({ company: 'Acme Corp', role: 'Frontend Engineer', status: 'Backlog' }),
      makeApp({ company: 'Beta Inc', role: 'UX Designer', status: 'Applied' }),
    ]
    mockGetApplications.mockReturnValue(apps)
    render(<CommandCenterPage />)
    expect(screen.getByText('Acme Corp')).toBeDefined()
    expect(screen.getByText('Beta Inc')).toBeDefined()
  })

  // P3 — Archived apps don't appear in the main table
  it('excludes Archived applications from the main table', () => {
    const apps = [
      makeApp({ company: 'Acme Corp', role: 'Frontend Engineer', status: 'Backlog' }),
      makeApp({ company: 'Ghost Co', role: 'PM', status: 'Archived' }),
    ]
    mockGetApplications.mockReturnValue(apps)
    render(<CommandCenterPage />)
    expect(screen.getByText('Acme Corp')).toBeDefined()
    expect(screen.queryByText('Ghost Co')).toBeNull()
  })

  // P4 — Clicking a row opens the Sheet panel
  it('opens the detail Sheet when a row is clicked', async () => {
    const app = makeApp({ company: 'Click Corp', role: 'Dev', status: 'Backlog' })
    mockGetApplications.mockReturnValue([app])
    render(<CommandCenterPage />)
    fireEvent.click(screen.getByText('Click Corp'))
    await waitFor(() => {
      expect(screen.getByText(/private notes/i)).toBeDefined()
    })
  })

  // P5 — Sheet shows Private Notes textarea and Task Checklist
  it('displays the Private Notes textarea and checklist items in the Sheet', async () => {
    const app = makeApp({ company: 'Detail Corp', role: 'PM', status: 'Backlog' })
    mockGetApplications.mockReturnValue([app])
    render(<CommandCenterPage />)
    fireEvent.click(screen.getByText('Detail Corp'))
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /private notes/i })).toBeDefined()
      expect(screen.getByRole('checkbox', { name: /tailor cv/i })).toBeDefined()
      expect(screen.getByRole('checkbox', { name: /tailor cl/i })).toBeDefined()
      expect(screen.getByRole('checkbox', { name: /sent li/i })).toBeDefined()
      expect(screen.getByRole('checkbox', { name: /applied/i })).toBeDefined()
      expect(screen.getByRole('checkbox', { name: /response/i })).toBeDefined()
    })
  })

  // P6 — Saving notes in the Sheet calls updateApplication
  it('calls updateApplication with new private notes when Save is clicked', async () => {
    const app = makeApp({ company: 'Notes Corp', role: 'Dev', status: 'Backlog' })
    mockGetApplications.mockReturnValue([app])
    mockUpdateApplication.mockReturnValue({ ...app, private_notes: 'My notes' })
    render(<CommandCenterPage />)
    fireEvent.click(screen.getByText('Notes Corp'))
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /private notes/i })).toBeDefined()
    })
    const textarea = screen.getByRole('textbox', { name: /private notes/i })
    fireEvent.change(textarea, { target: { value: 'My notes' } })
    fireEvent.click(screen.getByRole('button', { name: /save notes/i }))
    expect(mockUpdateApplication).toHaveBeenCalledWith(
      app.id,
      expect.objectContaining({ private_notes: 'My notes' })
    )
  })

  // P7 — Status dropdown calls updateApplication with new status
  it('calls updateApplication when the status is changed via the dropdown', async () => {
    const app = makeApp({ company: 'Status Corp', role: 'Dev', status: 'Backlog' })
    mockGetApplications.mockReturnValue([app])
    mockUpdateApplication.mockReturnValue({ ...app, status: 'Applied' })
    render(<CommandCenterPage />)
    const statusBadge = screen.getByRole('button', { name: /backlog/i })
    fireEvent.click(statusBadge)
    await waitFor(() => {
      expect(screen.getByRole('menuitem', { name: /applied/i })).toBeDefined()
    })
    fireEvent.click(screen.getByRole('menuitem', { name: /applied/i }))
    expect(mockUpdateApplication).toHaveBeenCalledWith(
      app.id,
      expect.objectContaining({ status: 'Applied' })
    )
  })

  // P8 — Archived tab shows archived applications
  it('shows archived applications in the Archived tab', () => {
    const apps = [
      makeApp({ company: 'Active Co', role: 'Dev', status: 'Backlog' }),
      makeApp({ company: 'Archive Co', role: 'PM', status: 'Archived' }),
    ]
    mockGetApplications.mockReturnValue(apps)
    render(<CommandCenterPage />)
    const archivedTab = screen.getByRole('tab', { name: /archived/i })
    fireEvent.click(archivedTab)
    expect(screen.getByText('Archive Co')).toBeDefined()
    expect(screen.queryByText('Active Co')).toBeNull()
  })
})
