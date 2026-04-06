import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, X, Loader2, Search, Sparkles } from 'lucide-react'
import { extractTextFromPdf } from '../services/pdfExtractor'
import type { AtsProvider } from '../types/analysis'

const ATS_OPTIONS: { value: AtsProvider; label: string; color: string }[] = [
  { value: 'Gupy', label: 'Gupy', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'Catho', label: 'Catho', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'InfoJobs', label: 'InfoJobs', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'Indeed', label: 'Indeed', color: 'bg-sky-100 text-sky-700 border-sky-200' },
]

export function AnalyzePage() {
  const navigate = useNavigate()
  const [selectedAts, setSelectedAts] = useState<AtsProvider | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [extractError, setExtractError] = useState('')

  const handleFile = useCallback(async (f: File) => {
    if (f.type !== 'application/pdf') return
    setFile(f)
    setExtracting(true)
    setExtractError('')
    try {
      const text = await extractTextFromPdf(f)
      setResumeText(text)
      if (!text.trim()) {
        setExtractError('Não foi possível extrair texto deste PDF. Ele pode ser uma imagem escaneada.')
      }
    } catch (err) {
      setResumeText('')
      setExtractError(`Erro ao ler o PDF: ${err instanceof Error ? err.message : 'erro desconhecido'}`)
    }
    setExtracting(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const handleSubmit = async () => {
    if (!selectedAts || !jobDescription.trim() || !resumeText) return
    setLoading(true)
    // Pass data to results page via state
    navigate('/dashboard/results', {
      state: {
        resumeText,
        jobDescription,
        targetAts: selectedAts,
        fileName: file?.name,
      },
    })
  }

  const isReady = selectedAts && jobDescription.trim().length > 20 && resumeText

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Nova Análise</h1>
        <p className="text-slate-500 text-sm">
          Selecione o ATS, cole a vaga e envie seu currículo para análise completa.
        </p>
      </div>

      <div className="space-y-6">
        {/* ATS Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            <Search className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Plataforma ATS de destino
          </label>
          <div className="flex flex-wrap gap-3">
            {ATS_OPTIONS.map((ats) => (
              <button
                key={ats.value}
                onClick={() => setSelectedAts(ats.value)}
                className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                  selectedAts === ats.value
                    ? `${ats.color} ring-2 ring-offset-1 ring-indigo-400`
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {ats.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            <FileText className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Descrição da Vaga
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Cole aqui a descrição completa da vaga (requisitos, responsabilidades, qualificações)..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm resize-none"
          />
          <p className="text-xs text-slate-400 mt-2">
            {jobDescription.length > 0
              ? `${jobDescription.length} caracteres`
              : 'Quanto mais detalhada a vaga, melhor a análise'}
          </p>
        </div>

        {/* PDF Upload */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            <Upload className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Seu Currículo (PDF)
          </label>

          {file ? (
            <div>
              <div className={`flex items-center gap-3 ${extractError ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'} border rounded-xl px-4 py-3`}>
                <FileText className={`w-5 h-5 ${extractError ? 'text-rose-600' : 'text-emerald-600'} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${extractError ? 'text-rose-800' : 'text-emerald-800'} truncate`}>{file.name}</p>
                  <p className={`text-xs ${extractError ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {extracting ? 'Extraindo texto...' : extractError ? extractError : `${resumeText.length} caracteres extraídos`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null)
                    setResumeText('')
                    setExtractError('')
                  }}
                  className={`${extractError ? 'text-rose-500 hover:text-rose-700' : 'text-emerald-500 hover:text-emerald-700'} transition-colors cursor-pointer`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-300 hover:border-indigo-300 hover:bg-slate-50'
              }`}
              onClick={() => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf'
                input.onchange = (e) => {
                  const f = (e.target as HTMLInputElement).files?.[0]
                  if (f) handleFile(f)
                }
                input.click()
              }}
            >
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600 mb-1">
                Arraste seu currículo aqui ou clique para selecionar
              </p>
              <p className="text-xs text-slate-400">Apenas arquivos .PDF</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isReady || loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all text-sm shadow-lg shadow-indigo-200 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analisar Currículo com IA
            </>
          )}
        </button>
      </div>
    </div>
  )
}
