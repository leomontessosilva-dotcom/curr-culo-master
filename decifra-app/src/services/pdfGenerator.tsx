import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    color: '#444',
    marginBottom: 8,
  },
  contact: {
    fontSize: 9,
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 2,
    marginBottom: 6,
    marginTop: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1,
  },
  jobPeriod: {
    fontSize: 9,
    color: '#555',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 10,
    marginBottom: 2,
    paddingLeft: 8,
  },
  paragraph: {
    fontSize: 10,
    marginBottom: 4,
  },
})

function parseResumeToSections(text: string) {
  const lines = text.split('\n').filter((l) => l.trim())
  const sections: { title: string; content: string[] }[] = []
  let currentSection: { title: string; content: string[] } = { title: 'header', content: [] }

  const sectionKeywords = [
    'CONTATO', 'RESUMO', 'EXPERIÊNCIA', 'FORMAÇÃO', 'HABILIDADES',
    'COMPETÊNCIAS', 'EDUCAÇÃO', 'CERTIFICAÇÕES', 'IDIOMAS', 'OBJETIVO',
  ]

  for (const line of lines) {
    const upperLine = line.trim().toUpperCase()
    const isSection = sectionKeywords.some((kw) => upperLine.startsWith(kw))

    if (isSection) {
      if (currentSection.content.length > 0 || currentSection.title !== 'header') {
        sections.push(currentSection)
      }
      currentSection = { title: line.trim(), content: [] }
    } else {
      currentSection.content.push(line.trim())
    }
  }
  if (currentSection.content.length > 0) {
    sections.push(currentSection)
  }

  return sections
}

function ATSResume({ text }: { text: string }) {
  const sections = parseResumeToSections(text)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {sections.map((section, i) => (
          <View key={i}>
            {section.title === 'header' ? (
              <View style={styles.header}>
                {section.content.map((line, j) => (
                  <Text key={j} style={j === 0 ? styles.name : styles.subtitle}>
                    {line}
                  </Text>
                ))}
              </View>
            ) : (
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.content.map((line, j) => {
                  if (line.startsWith('•') || line.startsWith('-')) {
                    return (
                      <Text key={j} style={styles.bulletPoint}>
                        {line}
                      </Text>
                    )
                  }
                  const isJobTitle =
                    line.includes('—') &&
                    !line.startsWith('•') &&
                    line.length < 100 &&
                    (line.toUpperCase() === line || /^[A-ZÀ-Ú]/.test(line))
                  if (isJobTitle) {
                    return <Text key={j} style={styles.jobTitle}>{line}</Text>
                  }
                  const isDate = /\d{4}/.test(line) && line.length < 40 && !line.startsWith('•')
                  if (isDate && j > 0) {
                    return <Text key={j} style={styles.jobPeriod}>{line}</Text>
                  }
                  return <Text key={j} style={styles.paragraph}>{line}</Text>
                })}
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  )
}

export async function generateAtsPdf(resumeText: string): Promise<Blob> {
  const blob = await pdf(<ATSResume text={resumeText} />).toBlob()
  return blob
}

export function downloadPdf(blob: Blob, filename = 'curriculo-otimizado-ats.pdf') {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
