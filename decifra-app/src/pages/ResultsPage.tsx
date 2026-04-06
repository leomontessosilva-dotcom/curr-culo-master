import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Loader2,
  ArrowLeft,
  Eye,
  Target,
  FileText,
} from 'lucide-react'
import { analyzeResume, optimizeResume } from '../services/aiAnalysis'
import { generateAtsPdf, downloadPdf } from '../services/pdfGenerator'
import type { AnalysisResult } from '../types/analysis'

type OptimizationStep = {
  label: string
  done: boolean
}

export function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { resumeText, jobDescription, targetAts, fileName } = (location.state as {
    resumeText: string
    jobDescription: string
    targetAts: string
    fileName: string
  }) || {}

  const [analyzing, setAnalyzing] = useState(true)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [optimizing, setOptimizing] = useState(false)
  const [optimized, setOptimized] = useState(false)
  const [optimizedText, setOptimizedText] = useState('')
  const [finalAffinityScore, setFinalAffinityScore] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [optimizationSteps, setOptimizationSteps] = useState<OptimizationStep[]>([])

  useEffect(() => {
    if (!resumeText) {
      navigate('/dashboard')
      return
    }

    analyzeResume(resumeText, jobDescription, targetAts).then((result) => {
      setAnalysis(result)
      setAnalyzing(false)
    })
  }, [resumeText, jobDescription, targetAts, navigate])

  const handleOptimize = async () => {
    if (!analysis) return
    setOptimizing(true)

    const steps: OptimizationStep[] = [
      { label: 'Analisando palavras-chave da vaga...', done: false },
      { label: 'Reescrevendo experiências profissionais...', done: false },
      { label: 'Aplicando framework Harvard/STAR...', done: false },
      { label: 'Otimizando para formato ATS...', done: false },
      { label: 'Calculando nova pontuação...', done: false },
    ]
    setOptimizationSteps([...steps])

    // Animate steps
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 600))
      steps[i].done = true
      setOptimizationSteps([...steps])
    }

    const result = await optimizeResume(resumeText, jobDescription, targetAts)
    setOptimizedText(result.optimizedText)
    setFinalAffinityScore(result.newAffinityScore)
    setOptimizing(false)
    setOptimized(true)
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const blob = await generateAtsPdf(optimizedText)
      downloadPdf(blob)
    } catch (err) {
      console.error('PDF generation error:', err)
    }
    setDownloading(false)
  }

  if (analyzing) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Analisando seu currículo...</h2>
        <p className="text-slate-500 text-sm">
          Verificando compatibilidade visual e afinidade com a vaga no {targetAts}
        </p>
      </div>
    )
  }

  if (!analysis) return null

  const scoreColor = (score: number) => {
    if (score >= 7) return '#10B981'
    if (score >= 4) return '#F59E0B'
    return '#F43F5E'
  }

  const displayAffinityScore = optimized ? finalAffinityScore : analysis.affinityScore

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Nova análise
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Resultado da Análise</h1>
          <p className="text-sm text-slate-500">
            {fileName} • {targetAts}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar — Scores */}
        <div className="lg:col-span-4 space-y-6">
          {/* Visual Score */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700">Leitura Visual ATS</h3>
            </div>
            <div className="w-32 h-32 mx-auto mb-4">
              <CircularProgressbar
                value={analysis.visualScore * 10}
                text={`${analysis.visualScore}/10`}
                styles={buildStyles({
                  textSize: '22px',
                  textColor: scoreColor(analysis.visualScore),
                  pathColor: scoreColor(analysis.visualScore),
                  trailColor: '#E2E8F0',
                  pathTransitionDuration: 1,
                })}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              {analysis.visualScore >= 7
                ? 'Boa compatibilidade visual'
                : 'Formato difícil para robôs ATS'}
            </p>
          </div>

          {/* Affinity Score */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-700">Afinidade com a Vaga</h3>
            </div>
            <div className="w-32 h-32 mx-auto mb-4">
              <CircularProgressbar
                value={displayAffinityScore * 10}
                text={`${displayAffinityScore}/10`}
                styles={buildStyles({
                  textSize: '22px',
                  textColor: scoreColor(displayAffinityScore),
                  pathColor: scoreColor(displayAffinityScore),
                  trailColor: '#E2E8F0',
                  pathTransitionDuration: 1,
                })}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              {displayAffinityScore >= 7
                ? 'Excelente alinhamento com a vaga!'
                : 'Há oportunidades de melhoria'}
            </p>
            {optimized && (
              <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
                <p className="text-xs font-medium text-emerald-700">
                  ↑ Melhorou de {analysis.affinityScore} para {finalAffinityScore}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Insights */}
          {!optimized && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">
                Diagnóstico Detalhado
              </h3>

              {/* Visual Feedback */}
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Formatação Visual
                </p>
                <div className="space-y-2">
                  {analysis.visualFeedback.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affinity Feedback */}
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Afinidade com a Vaga
                </p>
                <div className="space-y-2">
                  {analysis.affinityFeedback.map((item, i) => {
                    const isPositive = item.includes('✓')
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        {isPositive ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                        )}
                        <span className="text-sm text-slate-700">{item.replace(' ✓', '')}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Optimization Progress */}
          {optimizing && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                Otimizando currículo...
              </h3>
              <div className="space-y-3">
                {optimizationSteps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${step.done ? 'text-slate-700' : 'text-slate-400'}`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimized Resume Preview */}
          {optimized && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Currículo Otimizado
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                  ATS-Compliant
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-5 max-h-[500px] overflow-y-auto border border-slate-100">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {optimizedText}
                </pre>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!optimized && !optimizing && (
              <button
                onClick={handleOptimize}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all text-sm shadow-lg shadow-indigo-200 cursor-pointer animate-pulse hover:animate-none"
              >
                <Sparkles className="w-5 h-5" />
                Melhorar Currículo com IA
              </button>
            )}

            {optimized && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-2xl transition-all text-sm shadow-lg shadow-emerald-200 cursor-pointer"
              >
                {downloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Baixar Currículo Otimizado (PDF)
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
