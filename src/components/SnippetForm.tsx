import { useState } from 'react'

interface SnippetFormProps {
  initialName?: string
  initialContent?: string
  onSubmit: (data: { name: string; content: string }) => void
  onCancel?: () => void
  submitLabel?: string
}

export function SnippetForm({
  initialName = '',
  initialContent = '',
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}: SnippetFormProps) {
  const [name, setName] = useState(initialName)
  const [content, setContent] = useState(initialContent)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), content })
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Snippet form">
      <div>
        <label htmlFor="snippet-name">Name</label>
        <input
          id="snippet-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React Case Study"
          required
        />
      </div>
      <div>
        <label htmlFor="snippet-content">Content</label>
        <textarea
          id="snippet-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your Markdown content here..."
          rows={8}
        />
      </div>
      <div>
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
