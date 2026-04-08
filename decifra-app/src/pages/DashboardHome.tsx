import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Sparkles, Shield, Zap, FileText, PenLine } from 'lucide-react'

export function DashboardHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || ''

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Olá{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-slate-500 text-sm">
          Pronto para otimizar seu currículo e vencer os robôs ATS?
        </p>
      </div>

      {/* CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div
          onClick={() => navigate('/dashboard/analyze')}
          className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-8 text-white cursor-pointer hover:from-black hover:to-slate-900 transition-all shadow-xl shadow-slate-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <Plus className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">Nova Análise de Currículo</h2>
              <p className="text-slate-400 text-sm">
                Envie seu PDF, cole a vaga e descubra sua pontuação ATS
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/dashboard/create')}
          className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white cursor-pointer hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-xl shadow-emerald-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">Criar Currículo Otimizado</h2>
              <p className="text-emerald-200 text-sm">
                Preencha seus dados e a IA gera um currículo ATS-compliant
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/dashboard/post')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <PenLine className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">Criar Post LinkedIn</h2>
              <p className="text-blue-200 text-sm">
                Gere posts otimizados para engajamento com IA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="bg-emerald-100 rounded-xl p-2.5 w-fit mb-3">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Reescrita com IA</h3>
          <p className="text-xs text-slate-500">
            Seu currículo reescrito com framework Harvard e palavras-chave da vaga
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="bg-slate-200 rounded-xl p-2.5 w-fit mb-3">
            <Shield className="w-5 h-5 text-slate-900" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Score Duplo</h3>
          <p className="text-xs text-slate-500">
            Análise visual (parseabilidade) + afinidade com a vaga alvo
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="bg-amber-100 rounded-xl p-2.5 w-fit mb-3">
            <Zap className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 mb-1">PDF ATS-Compliant</h3>
          <p className="text-xs text-slate-500">
            Download do currículo em formato limpo e aprovado por Gupy, Catho e mais
          </p>
        </div>
      </div>
    </div>
  )
}
