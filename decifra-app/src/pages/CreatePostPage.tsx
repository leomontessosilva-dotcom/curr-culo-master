import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  Users,
  FileText,
  MessageSquare,
  Lightbulb,
  Hash,
  Loader2,
  PenLine,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Check,
  Trash2,
} from 'lucide-react'
import { loadLinkedinPosts, deleteLinkedinPost, type LinkedinPost } from '../services/linkedinPosts'

const TONE_OPTIONS = [
  { value: 'profissional', label: 'Profissional e Formal' },
  { value: 'inspiracional', label: 'Inspiracional e Motivacional' },
  { value: 'educativo', label: 'Educativo e Didático' },
  { value: 'storytelling', label: 'Storytelling (história pessoal)' },
  { value: 'controverso', label: 'Opinião Forte / Polêmico (construtivo)' },
  { value: 'humorado', label: 'Leve e Bem-Humorado' },
]

const FORMAT_OPTIONS = [
  { value: 'texto', label: 'Texto corrido' },
  { value: 'lista', label: 'Lista com tópicos' },
  { value: 'historia', label: 'Narrativa / História' },
  { value: 'carrossel-texto', label: 'Texto para carrossel (slides)' },
]

const GOAL_OPTIONS = [
  { value: 'autoridade', label: 'Mostrar autoridade na área' },
  { value: 'engajamento', label: 'Gerar engajamento e comentários' },
  { value: 'networking', label: 'Ampliar networking' },
  { value: 'vaga', label: 'Atrair oportunidades de emprego' },
  { value: 'marca-pessoal', label: 'Fortalecer marca pessoal' },
  { value: 'ensinar', label: 'Ensinar algo ao público' },
]

type Tab = 'create' | 'history'

export function CreatePostPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('create')
  const [loading, setLoading] = useState(false)

  // Form state
  const [goal, setGoal] = useState('')
  const [audience, setAudience] = useState('')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('profissional')
  const [format, setFormat] = useState('texto')
  const [reference, setReference] = useState('')
  const [keyMessage, setKeyMessage] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [extraContext, setExtraContext] = useState('')

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({ advanced: true })
  const toggle = (s: string) => setCollapsed((p) => ({ ...p, [s]: !p[s] }))

  // History state
  const [posts, setPosts] = useState<LinkedinPost[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === 'history') {
      setLoadingHistory(true)
      loadLinkedinPosts().then((data) => {
        setPosts(data)
        setLoadingHistory(false)
      })
    }
  }, [activeTab])

  const handleSubmit = async () => {
    if (!topic.trim()) return
    setLoading(true)

    navigate('/dashboard/post-result', {
      state: {
        goal,
        audience,
        topic,
        tone,
        format,
        reference,
        keyMessage,
        callToAction,
        extraContext,
      },
    })
  }

  const handleCopy = async (post: LinkedinPost) => {
    await navigator.clipboard.writeText(post.post_content)
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    await deleteLinkedinPost(id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isReady = topic.trim().length > 5

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm'

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Criador de Post LinkedIn</h1>
        <p className="text-slate-500 text-sm">
          Crie posts otimizados para engajamento ou consulte seus posts anteriores.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-8">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <PenLine className="w-4 h-4" />
          Criar Post
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          Posts Criados
        </button>
      </div>

      {/* Create Tab */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Topic */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Lightbulb className="w-4 h-4 text-slate-600" />
              Sobre o que você quer falar? *
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Como eu consegui triplicar minha produtividade usando IA no dia a dia do trabalho..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-slate-400 mt-1">Descreva a ideia principal do post. Pode ser uma opinião, uma experiência, um aprendizado.</p>
          </div>

          {/* Goal */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Target className="w-4 h-4 text-slate-600" />
              Qual o objetivo desse post?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GOAL_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGoal(goal === g.value ? '' : g.value)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    goal === g.value
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audience */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <Users className="w-4 h-4 text-slate-600" />
              Quem é seu público-alvo?
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Ex: Recrutadores, desenvolvedores, profissionais de marketing, empreendedores..."
              className={inputClass}
            />
          </div>

          {/* Tone & Format */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <MessageSquare className="w-4 h-4 text-slate-600" />
                  Tom de voz
                </label>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className={inputClass}>
                  {TONE_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  <Hash className="w-4 h-4 text-slate-600" />
                  Formato do post
                </label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className={inputClass}>
                  {FORMAT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Reference Post */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
              <FileText className="w-4 h-4 text-slate-600" />
              Post de referência (opcional)
            </label>
            <textarea
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Cole aqui o texto de um post que você gostou, ou um link de referência. A IA vai usar como inspiração de estilo e estrutura..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
            <p className="text-xs text-slate-400 mt-1">Pode ser o texto de um post ou um link. A IA vai usar como referência de estilo.</p>
          </div>

          {/* Advanced Options */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <button
              type="button"
              onClick={() => toggle('advanced')}
              className="w-full flex items-center justify-between cursor-pointer"
            >
              <span className="text-sm font-semibold text-slate-700">Opções avançadas</span>
              {collapsed['advanced'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </button>
            {!collapsed['advanced'] && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Mensagem-chave (o que você quer que a pessoa lembre)</label>
                  <input
                    type="text"
                    value={keyMessage}
                    onChange={(e) => setKeyMessage(e.target.value)}
                    placeholder="Ex: IA não substitui pessoas, mas pessoas que usam IA substituem as que não usam"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Call-to-action (CTA) desejado</label>
                  <input
                    type="text"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    placeholder="Ex: Comenta aqui o que você acha, Me segue pra mais conteúdo, Salva esse post..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Contexto adicional sobre você</label>
                  <textarea
                    value={extraContext}
                    onChange={(e) => setExtraContext(e.target.value)}
                    placeholder="Ex: Sou desenvolvedor com 5 anos de experiência, acabei de mudar de carreira, estou buscando recolocação..."
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isReady || loading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all text-sm shadow-lg shadow-slate-300 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <PenLine className="w-5 h-5" />
                Gerar Post com IA
              </>
            )}
          </button>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-1">Nenhum post criado ainda</h3>
              <p className="text-sm text-slate-500 mb-6">Crie seu primeiro post na aba "Criar Post".</p>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm cursor-pointer"
              >
                <PenLine className="w-4 h-4" />
                Criar Post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                    className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{post.topic}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(post.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{post.post_content.length} chars</span>
                      {expandedId === post.id ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedId === post.id && (
                    <div className="px-6 pb-5 border-t border-slate-100">
                      <div className="bg-slate-50 rounded-xl p-4 mt-4 border border-slate-100">
                        <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {post.post_content}
                        </pre>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleCopy(post)}
                          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm cursor-pointer"
                        >
                          {copiedId === post.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar Post
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center justify-center gap-2 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
