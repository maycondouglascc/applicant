export type PdfNode = {
  content: string
  isHeading?: boolean
}

export function parseMarkdownToBulletList(markdown: string): PdfNode[] {
  const lines = markdown.split('\n')
  const nodes: PdfNode[] = []

  for (const line of lines) {
    // Strip HTML tags
    const stripped = line.replace(/<[^>]+>/g, '').trim()
    if (!stripped) continue

    // Skip markdown table separators (---|---) 
    if (/^\|?[\s|:-]+\|/.test(stripped)) continue

    // Convert table rows to bullet list items
    if (stripped.startsWith('|')) {
      const cells = stripped
        .split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0)
      if (cells.length > 0) {
        nodes.push({ content: '• ' + cells.join(', ') })
      }
      continue
    }

    // Detect headings
    const headingMatch = stripped.match(/^(#{1,3})\s+(.+)/)
    if (headingMatch) {
      nodes.push({ content: headingMatch[2], isHeading: true })
      continue
    }

    // Strip bold/italic markers and push as text
    const cleaned = stripped
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
    nodes.push({ content: cleaned })
  }

  return nodes
}

/**
 * Generate and download an ATS-compliant PDF using jsPDF.
 * Pure browser API — no Node.js polyfills required.
 */
export async function downloadAsPdf(cvMarkdown: string, filename = 'ATS_Tailored_CV.pdf') {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })

  const nodes = parseMarkdownToBulletList(cvMarkdown)

  const margin = 48
  const pageWidth = doc.internal.pageSize.getWidth()
  const maxWidth = pageWidth - margin * 2
  const pageHeight = doc.internal.pageSize.getHeight()

  let y = margin + 12

  for (const node of nodes) {
    if (node.isHeading) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
    }

    // splitTextToSize handles long lines wrapping
    const lines: string[] = doc.splitTextToSize(node.content, maxWidth)
    for (const line of lines) {
      if (y + 16 > pageHeight - margin) {
        doc.addPage()
        y = margin + 12
      }
      doc.text(line, margin, y)
      y += node.isHeading ? 18 : 15
    }

    // Extra spacing after headings
    if (node.isHeading) y += 4
  }

  doc.save(filename)
}
