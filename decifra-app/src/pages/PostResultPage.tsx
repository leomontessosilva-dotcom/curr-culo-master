import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Loader2,
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
} from 'lucide-react'
import { saveLinkedinPost } from '../services/linkedinPosts'

type Step = { label: string; done: boolean }

interface PostInput {
  topic: string
  goal: string
  audience: string
  tone: string
  format: string
  reference: string
  keyMessage: string
  callToAction: string
  extraContext: string
}

export function PostResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const input = location.state as PostInput | undefined

  const [generating, setGenerating] = useState(true)
  const [post, setPost] = useState('')
  const [tips, setTips] = useState<string[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [saved, setSaved] = useState(false)

  const generate = async () => {
    if (!input) return
    setSaved(false)

    const animSteps: Step[] = [
      { label: 'Analisando tema e público-alvo...', done: false },
      { label: 'Criando gancho de abertura...', done: false },
      { label: 'Estruturando narrativa...', done: false },
      { label: 'Otimizando para engajamento...', done: false },
      { label: 'Finalizando post...', done: false },
    ]
    setSteps([...animSteps])

    for (let i = 0; i < animSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 400))
      animSteps[i].done = true
      setSteps([...animSteps])
    }

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error('Falha ao gerar post')
      }

      const result = await response.json()
      const postContent = result.post || ''
      const postTips = result.tips || []
      setPost(postContent)
      setTips(postTips)

      // Auto-save to Supabase
      if (postContent) {
        const { error: saveErr } = await saveLinkedinPost({
          topic: input.topic,
          goal: input.goal,
          audience: input.audience,
          tone: input.tone,
          format: input.format,
          post_content: postContent,
          tips: postTips,
        })
        if (!saveErr) setSaved(true)
      }
    } catch {
      setError('Erro ao gerar o post. Tente novamente.')
    }

    setGenerating(false)
    setRegenerating(false)
  }

  useEffect(() => {
    if (!input) {
      navigate('/dashboard/post')
      return
    }
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(post)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = () => {
    setRegenerating(true)
    setGenerating(true)
    setError('')
    setPost('')
    setTips([])
    generate()
  }

  if (generating) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <div className="text-center mb-8">
          <Loader2 className="w-12 h-12 animate-spin text-slate-900 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {regenerating ? 'Gerando nova versão...' : 'Criando seu post...'}
          </h2>
          <p className="text-slate-500 text-sm">Aplicando técnicas de copywriting para máximo engajamento</p>
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/dashboard/post')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Post Gerado</h1>
          <p className="text-sm text-slate-500">Pronto para copiar e colar no LinkedIn</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {post && (
        <>
          {/* Post Preview */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Preview do Post</h3>
              <div className="flex items-center gap-2">
                {saved && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Salvo no histórico
                  </span>
                )}
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  LinkedIn Ready
                </span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                {post}
              </pre>
            </div>
            <p className="text-xs text-slate-400 mt-2">{post.length} caracteres</p>
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Por que esse post deve funcionar
              </h3>
              <div className="space-y-2">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-amber-900">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold py-4 px-6 rounded-2xl transition-all text-sm shadow-lg shadow-slate-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Post
                </>
              )}
            </button>
            <button
              onClick={handleRegenerate}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-4 px-6 rounded-2xl transition-colors text-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Gerar outra versão
            </button>
          </div>
        </>
      )}
    </div>
  )
}
