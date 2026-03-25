import { parseMarkdownToBulletList } from '@/services/pdfExportService'

describe('parseMarkdownToBulletList', () => {
  it('should parse basic text lines into array blocks of text', () => {
    const markdown = "Hello World\nThis is a test"
    
    const result = parseMarkdownToBulletList(markdown)
    
    expect(result).toEqual([
      { type: 'text', content: 'Hello World' },
      { type: 'text', content: 'This is a test' }
    ])
  })

  it('should strip HTML tags and convert markdown tables to simple text', () => {
    const markdown = `Here is some <strong>strong</strong> text.
| Header 1 | Header 2 |
|---|---|
| Col 1 | Col 2 |`

    const result = parseMarkdownToBulletList(markdown)

    expect(result).toEqual([
      { type: 'text', content: 'Here is some strong text.' },
      { type: 'text', content: 'Header 1 Header 2' },
      { type: 'text', content: 'Col 1 Col 2' }
    ])
  })
})
