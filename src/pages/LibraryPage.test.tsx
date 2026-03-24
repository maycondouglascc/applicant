import { render, screen, fireEvent } from '@testing-library/react'
import { LibraryPage } from './LibraryPage'

// Helper to render LibraryPage (no router needed — it's a standalone page)
function renderLibrary() {
  return render(<LibraryPage />)
}

describe('LibraryPage', () => {
  // TDD Cycle 1: Shows empty state
  it('shows empty message when no snippets exist', () => {
    renderLibrary()
    expect(
      screen.getByText(/no snippets yet/i)
    ).toBeDefined()
  })

  // TDD Cycle 2: Can create a snippet that appears in the list
  it('creates a snippet and shows it in the list', () => {
    renderLibrary()

    // Open the form
    fireEvent.click(screen.getByText('New Snippet'))

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'React Case Study' },
    })
    fireEvent.change(screen.getByLabelText('Content'), {
      target: { value: '## React\nBuilt dashboards.' },
    })

    // Submit
    fireEvent.click(screen.getByText('Create'))

    // Verify the snippet appears in the list
    expect(screen.getByText('React Case Study')).toBeDefined()
  })

  // TDD Cycle 3: Can edit a snippet
  it('edits a snippet and shows the updated name', () => {
    renderLibrary()

    // First, create a snippet
    fireEvent.click(screen.getByText('New Snippet'))
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Original' },
    })
    fireEvent.change(screen.getByLabelText('Content'), {
      target: { value: 'Original content' },
    })
    fireEvent.click(screen.getByText('Create'))

    // Click Edit
    fireEvent.click(screen.getByLabelText('Edit Original'))

    // Change the name
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Updated' },
    })
    fireEvent.click(screen.getByText('Update'))

    // Verify updated name in list
    expect(screen.getByText('Updated')).toBeDefined()
    expect(screen.queryByText('Original')).toBeNull()
  })

  // TDD Cycle 4: Can delete a snippet
  it('deletes a snippet and removes it from the list', () => {
    renderLibrary()

    // Create two snippets
    fireEvent.click(screen.getByText('New Snippet'))
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Keep This' },
    })
    fireEvent.click(screen.getByText('Create'))

    fireEvent.click(screen.getByText('New Snippet'))
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Delete This' },
    })
    fireEvent.click(screen.getByText('Create'))

    // Delete the second one
    fireEvent.click(screen.getByLabelText('Delete Delete This'))

    // Verify
    expect(screen.getByText('Keep This')).toBeDefined()
    expect(screen.queryByText('Delete This')).toBeNull()
  })
})
