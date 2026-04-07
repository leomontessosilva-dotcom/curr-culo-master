import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Plus, Sparkles, Shield, Zap } from 'lucide-react'

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

      {/* CTA Card */}
      <div
        onClick={() => navigate('/dashboard/analyze')}
        className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white cursor-pointer hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-xl shadow-indigo-200 mb-10"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 rounded-xl p-3">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Nova Análise de Currículo</h2>
            <p className="text-indigo-200 text-sm">
              Envie seu PDF, cole a vaga e descubra sua pontuação ATS
            </p>
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
          <div className="bg-indigo-100 rounded-xl p-2.5 w-fit mb-3">
            <Shield className="w-5 h-5 text-indigo-600" />
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
