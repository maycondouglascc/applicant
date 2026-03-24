import {
  getSnippets,
  getSnippet,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from './snippetService'

describe('snippetService', () => {
  // TDD Cycle 1: Can list snippets (initially empty)
  it('returns an empty list when no snippets exist', () => {
    const snippets = getSnippets()
    expect(snippets).toEqual([])
  })

  // TDD Cycle 2: Can create a snippet and retrieve it
  it('creates a snippet that is retrievable by listing', () => {
    const created = createSnippet({
      name: 'React Experience',
      content: '## React\nBuilt dashboards with React.',
    })

    expect(created.id).toBeDefined()
    expect(created.name).toBe('React Experience')
    expect(created.content).toBe('## React\nBuilt dashboards with React.')
    expect(created.created_at).toBeDefined()

    const all = getSnippets()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(created.id)
  })

  // TDD Cycle 2b: Can get a single snippet by id
  it('retrieves a single snippet by id', () => {
    const created = createSnippet({
      name: 'Leadership',
      content: 'Led a team of 5.',
    })

    const found = getSnippet(created.id)
    expect(found).toBeDefined()
    expect(found!.name).toBe('Leadership')
  })

  it('returns undefined for a non-existent snippet id', () => {
    expect(getSnippet('non-existent-id')).toBeUndefined()
  })

  // TDD Cycle 3: Can edit a snippet
  it('updates a snippet name and content', () => {
    const created = createSnippet({
      name: 'Original Name',
      content: 'Original content',
    })

    const updated = updateSnippet(created.id, {
      name: 'Updated Name',
      content: 'Updated content',
    })

    expect(updated).toBeDefined()
    expect(updated!.name).toBe('Updated Name')
    expect(updated!.content).toBe('Updated content')

    // Verify through the public list interface
    const found = getSnippet(created.id)
    expect(found!.name).toBe('Updated Name')
  })

  it('returns undefined when updating a non-existent snippet', () => {
    expect(updateSnippet('fake-id', { name: 'Nope' })).toBeUndefined()
  })

  // TDD Cycle 4: Can delete a snippet
  it('deletes a snippet so it is no longer retrievable', () => {
    const s1 = createSnippet({ name: 'Keep', content: 'keep' })
    const s2 = createSnippet({ name: 'Delete Me', content: 'bye' })

    const result = deleteSnippet(s2.id)
    expect(result).toBe(true)

    const all = getSnippets()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(s1.id)
  })

  it('returns false when deleting a non-existent snippet', () => {
    expect(deleteSnippet('does-not-exist')).toBe(false)
  })
})
