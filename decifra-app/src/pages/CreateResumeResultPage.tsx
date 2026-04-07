import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Loader2,
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
} from 'lucide-react'
import { generateAtsPdf, downloadPdf } from '../services/pdfGenerator'

interface ResumeData {
  fullName: string
  email: string
  phone: string
  city: string
  linkedin: string
  objective: string
  experiences: {
    company: string
    role: string
    startDate: string
    endDate: string
    isCurrent: boolean
    description: string
  }[]
  educations: {
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
  }[]
  certifications: {
    name: string
    institution: string
    year: string
  }[]
  languages: {
    name: string
    level: string
  }[]
  skills: string
}

type Step = { label: string; done: boolean }

function formatMonth(m: string) {
  if (!m) return ''
  const [y, mo] = m.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${months[parseInt(mo) - 1]} ${y}`
}

function buildResumeText(data: ResumeData): string {
  const lines: string[] = []

  lines.push(data.fullName.toUpperCase())
  if (data.objective) lines.push(data.objective)
  lines.push('')

  // Contact
  lines.push('CONTATO')
  const contacts: string[] = []
  if (data.email) contacts.push(`Email: ${data.email}`)
  if (data.phone) contacts.push(`Tel: ${data.phone}`)
  if (data.city) contacts.push(data.city)
  if (data.linkedin) contacts.push(`LinkedIn: ${data.linkedin}`)
  lines.push(contacts.join(' | '))
  lines.push('')

  // Experience
  if (data.experiences.length > 0) {
    lines.push('EXPERIÊNCIA PROFISSIONAL')
    lines.push('')
    for (const exp of data.experiences) {
      lines.push(`${exp.company.toUpperCase()} — ${exp.role}`)
      const start = formatMonth(exp.startDate)
      const end = exp.isCurrent ? 'Presente' : formatMonth(exp.endDate)
      if (start || end) lines.push(`${start} — ${end}`)
      if (exp.description) {
        const bullets = exp.description.split('\n').filter((l) => l.trim())
        for (const b of bullets) {
          lines.push(`• ${b.replace(/^[•\-]\s*/, '')}`)
        }
      }
      lines.push('')
    }
  }

  // Education
  if (data.educations.length > 0) {
    lines.push('FORMAÇÃO ACADÊMICA')
    for (const edu of data.educations) {
      const parts = [edu.degree, edu.field].filter(Boolean).join(' em ')
      lines.push(`${parts} — ${edu.institution}`)
      const start = formatMonth(edu.startDate)
      const end = formatMonth(edu.endDate)
      if (start || end) lines.push(`${start} — ${end}`)
    }
    lines.push('')
  }

  // Certifications
  if (data.certifications.length > 0) {
    lines.push('CERTIFICAÇÕES E CURSOS')
    for (const cert of data.certifications) {
      const parts = [cert.name, cert.institution, cert.year].filter(Boolean)
      lines.push(parts.join(' — '))
    }
    lines.push('')
  }

  // Languages
  if (data.languages.length > 0) {
    lines.push('IDIOMAS')
    for (const lang of data.languages) {
      lines.push(`${lang.name}: ${lang.level}`)
    }
    lines.push('')
  }

  // Skills
  if (data.skills) {
    lines.push('HABILIDADES TÉCNICAS')
    lines.push(data.skills)
  }

  return lines.join('\n')
}

export function CreateResumeResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resumeData } = (location.state as { resumeData: ResumeData }) || {}

  const [generating, setGenerating] = useState(true)
  const [generatedText, setGeneratedText] = useState('')
  const [optimizedText, setOptimizedText] = useState('')
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])

  useEffect(() => {
    if (!resumeData) {
      navigate('/dashboard/create')
      return
    }

    const generate = async () => {
      const baseText = buildResumeText(resumeData)
      setGeneratedText(baseText)

      const animSteps: Step[] = [
        { label: 'Organizando dados pessoais...', done: false },
        { label: 'Estruturando experiências com framework STAR...', done: false },
        { label: 'Otimizando palavras-chave para ATS...', done: false },
        { label: 'Formatando para máxima compatibilidade...', done: false },
        { label: 'Finalizando currículo...', done: false },
      ]
      setSteps([...animSteps])

      for (let i = 0; i < animSteps.length; i++) {
        await new Promise((r) => setTimeout(r, 500))
        animSteps[i].done = true
        setSteps([...animSteps])
      }

      try {
        const response = await fetch('/api/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeText: baseText,
            jobDescription: 'Gere um currículo profissional otimizado para sistemas ATS. O currículo deve seguir boas práticas de formatação, usar verbos de ação, quantificar conquistas quando possível, e ser facilmente parseável por robôs de recrutamento como Gupy, Catho e InfoJobs.',
            targetAts: 'Gupy',
          }),
        })

        if (!response.ok) {
          throw new Error('Falha ao otimizar currículo')
        }

        const result = await response.json()
        setOptimizedText(result.optimizedText || baseText)
      } catch {
        setOptimizedText(baseText)
        setError('Não foi possível otimizar com IA. Usando formatação padrão ATS.')
      }

      setGenerating(false)
    }

    generate()
  }, [resumeData, navigate])

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await generateAtsPdf(optimizedText || generatedText)
      downloadPdf(blob, `curriculo-${resumeData.fullName.toLowerCase().replace(/\s+/g, '-')}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    }
    setDownloading(false)
  }

  if (generating) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="text-center mb-8">
          <Loader2 className="w-12 h-12 animate-spin text-slate-900 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Gerando seu currículo...</h2>
          <p className="text-slate-500 text-sm">Aplicando boas práticas ATS para maximizar suas chances</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={`text-sm ${step.done ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const displayText = optimizedText || generatedText

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard/create')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Currículo Gerado</h1>
          <p className="text-sm text-slate-500">{resumeData.fullName}</p>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Preview do Currículo
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
            ATS-Compliant
          </span>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 max-h-[500px] overflow-y-auto border border-slate-100">
          <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
            {displayText}
          </pre>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all text-sm shadow-lg shadow-emerald-200 cursor-pointer"
      >
        {downloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Download className="w-5 h-5" />
            Baixar Currículo (PDF)
          </>
        )}
      </button>
    </div>
  )
}
