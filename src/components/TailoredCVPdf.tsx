import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { parseMarkdownToBulletList, type PdfNode } from '@/services/pdfExportService'

// We rely on standard Helvetica which is built into PDF viewers, so no external fonts are required
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  textRow: {
    marginBottom: 6,
    fontSize: 12,
    lineHeight: 1.5,
  }
})

export function TailoredCVPdf({ cvMarkdown }: { cvMarkdown: string }) {
  const nodes = parseMarkdownToBulletList(cvMarkdown)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {nodes.map((node: PdfNode, i: number) => (
            <Text key={i} style={styles.textRow}>
              {node.content}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  )
}
