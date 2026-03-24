import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ForgePage } from './ForgePage'

// Mock services
vi.mock('@/services/jdExtractionService', () => ({
  extractKeywords: vi.fn().mockResolvedValue(['React', 'Node']),
  rankSnippets: vi.fn().mockReturnValue([
    { id: '1', name: 'Frontend Skills', content: 'React setup', created_at: '' },
    { id: '2', name: 'Backend Skills', content: 'Node setup', created_at: '' }
  ])
}))

vi.mock('@/services/applicationService', () => ({
  createApplication: vi.fn()
}))

vi.mock('@/services/snippetService', () => ({
  getSnippets: vi.fn().mockReturnValue([])
}))

describe('ForgePage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      headers: { entries: () => [] },
      json: async () => ({
        candidates: [{ content: { parts: [{ text: '["React", "Node"]' }] } }]
      })
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the JD intake form correctly', () => {
    render(<ForgePage />)
    expect(screen.getByText('New Application')).toBeDefined()
    expect(screen.getByPlaceholderText(/Paste the Job Description here.../i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Analyze JD/i })).toBeDefined()
  })

  it('disables the Analyze button when the JD input is empty', () => {
    render(<ForgePage />)
    const button = screen.getByRole('button', { name: /Analyze JD/i }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('enables the Analyze button when the JD input has text', () => {
    render(<ForgePage />)
    const input = screen.getByPlaceholderText(/Paste the Job Description here.../i)
    const button = screen.getByRole('button', { name: /Analyze JD/i }) as HTMLButtonElement
    
    fireEvent.change(input, { target: { value: 'Software Engineer at Google...' } })
    expect(button.disabled).toBe(false)
  })

  // Cycle 7 & 8: Loading, Keywords, Snippets
  it('extracts keywords and shows ranked snippets on submit', async () => {
    render(<ForgePage />)
    const input = screen.getByPlaceholderText(/Paste the Job Description here.../i)
    const analyzeBtn = screen.getByRole('button', { name: /Analyze JD/i })
    
    fireEvent.change(input, { target: { value: 'Looking for React and Node' } })
    fireEvent.click(analyzeBtn)

    // Should show loading state (we'll look for 'Extracting skills...' text)
    expect(screen.getByText(/Extracting skills.../i)).toBeDefined()

    // Wait for mock resolution
    await waitFor(() => {
      // Mocked extractKeywords returns explicit keywords
      expect(screen.getByText('React')).toBeDefined()
      expect(screen.getByText('Node')).toBeDefined()
    })

    // Assert mocked snippets appear
    expect(screen.getByText('Frontend Skills')).toBeDefined()
    expect(screen.getByText('Backend Skills')).toBeDefined()
    
    // Save to Backlog button should now appear
    expect(screen.getByRole('button', { name: /Save to Backlog/i })).toBeDefined()
  })

  // Cycle 9: Persist application
  it('saves the application to backlog and flashes success', async () => {
    render(<ForgePage />)
    const input = screen.getByPlaceholderText(/Paste the Job Description here.../i)
    const analyzeBtn = screen.getByRole('button', { name: /Analyze JD/i })
    
    fireEvent.change(input, { target: { value: 'Looking for React and Node' } })
    fireEvent.click(analyzeBtn)

    await waitFor(() => {
      expect(screen.getByText('React')).toBeDefined()
    })

    const saveBtn = screen.getByRole('button', { name: /Save to Backlog/i })
    fireEvent.click(saveBtn)

    // Should show success or clear the form
    expect(screen.getByText(/Saved to Backlog/i)).toBeDefined()
  })
})
