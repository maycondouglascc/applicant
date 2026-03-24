import { useState, useCallback } from 'react'
import {
  getSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  type Snippet,
} from '@/services/snippetService'
import { SnippetForm } from '@/components/SnippetForm'

export function LibraryPage() {
  const [snippets, setSnippets] = useState<Snippet[]>(() => getSnippets())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const refresh = useCallback(() => {
    setSnippets(getSnippets())
  }, [])

  const handleCreate = (data: { name: string; content: string }) => {
    createSnippet(data)
    refresh()
    setShowForm(false)
  }

  const handleUpdate = (data: { name: string; content: string }) => {
    if (editingId) {
      updateSnippet(editingId, data)
      refresh()
      setEditingId(null)
    }
  }

  const handleDelete = (id: string) => {
    deleteSnippet(id)
    refresh()
  }

  const editingSnippet = editingId
    ? snippets.find((s) => s.id === editingId)
    : null

  return (
    <div>
      <h1>Snippet Library</h1>

      {!showForm && !editingId && (
        <button onClick={() => setShowForm(true)}>New Snippet</button>
      )}

      {showForm && (
        <SnippetForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitLabel="Create"
        />
      )}

      {editingSnippet && (
        <SnippetForm
          initialName={editingSnippet.name}
          initialContent={editingSnippet.content}
          onSubmit={handleUpdate}
          onCancel={() => setEditingId(null)}
          submitLabel="Update"
        />
      )}

      {snippets.length === 0 && !showForm ? (
        <p>No snippets yet. Create your first one!</p>
      ) : (
        <ul aria-label="Snippets list">
          {snippets.map((snippet) => (
            <li key={snippet.id}>
              <span>{snippet.name}</span>
              <button
                onClick={() => setEditingId(snippet.id)}
                aria-label={`Edit ${snippet.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(snippet.id)}
                aria-label={`Delete ${snippet.name}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
