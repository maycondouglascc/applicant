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

vi.mock('@/services/geminiService', () => ({
  generateTailoredContent: vi.fn().mockResolvedValue({
    cv: 'Mocked CV text',
    cl: 'Mocked CL text',
    linkedin: 'Mocked LI text'
  })
}))

describe('ForgePage', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('applicant_gemini_api_key', 'test-key')
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

  it('extracts keywords and shows ranked snippets on submit', async () => {
    render(<ForgePage />)
    const input = screen.getByPlaceholderText(/Paste the Job Description here.../i)
    const analyzeBtn = screen.getByRole('button', { name: /Analyze JD/i })
    
    fireEvent.change(input, { target: { value: 'Looking for React and Node' } })
    fireEvent.click(analyzeBtn)

    expect(screen.getByText(/Extracting skills.../i)).toBeDefined()

    await waitFor(() => {
      expect(screen.getByText('React')).toBeDefined()
      expect(screen.getByText('Node')).toBeDefined()
    })

    expect(screen.getByText('Frontend Skills')).toBeDefined()
    expect(screen.getByText('Backend Skills')).toBeDefined()
    
    expect(screen.getByRole('button', { name: /Generate Content/i })).toBeDefined()
  })

  it('generates tailored content and displays the Diff View', async () => {
    render(<ForgePage />)
    const input = screen.getByPlaceholderText(/Paste the Job Description here.../i)
    const analyzeBtn = screen.getByRole('button', { name: /Analyze JD/i })
    
    fireEvent.change(input, { target: { value: 'JD' } })
    fireEvent.click(analyzeBtn)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Content/i })).toBeDefined()
    })

    const generateBtn = screen.getByRole('button', { name: /Generate Content/i })
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(screen.getByText('Review & Edit')).toBeDefined()
    })

    expect(screen.getByText('Source Snippets')).toBeDefined()
    
    // Check tabs
    expect(screen.getByText('Tailored CV')).toBeDefined()
    expect(screen.getByText('Cover Letter')).toBeDefined()
    expect(screen.getByText('LinkedIn Message')).toBeDefined()

    // Assert textareas render with mocked value
    expect(screen.getAllByDisplayValue(/Mocked CV text|Mocked CL text|Mocked LI text/i).length).toBeGreaterThan(0)
  })

  it('saves the application from the diff view and flashes success', async () => {
    render(<ForgePage />)
    const input = screen.getByPlaceholderText(/Paste the Job Description here.../i)
    
    fireEvent.change(input, { target: { value: 'JD' } })
    fireEvent.click(screen.getByRole('button', { name: /Analyze JD/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Generate Content/i })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /Generate Content/i }))

    await waitFor(() => {
      expect(screen.getByText('Review & Edit')).toBeDefined()
    })

    const saveBtn = screen.getByRole('button', { name: /Save Application/i })
    fireEvent.click(saveBtn)

    expect(screen.getByText(/Saved Application to Backlog/i)).toBeDefined()
  })
})
