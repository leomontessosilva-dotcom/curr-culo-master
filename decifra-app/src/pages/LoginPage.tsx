import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signInWithOtp, verifyOtp } = useAuth()
  const navigate = useNavigate()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signInWithOtp(email)
    if (error) {
      setError(error.message)
    } else {
      setOtpSent(true)
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    const token = otp.join('')
    if (token.length !== 6) return

    setError('')
    setLoading(true)
    const { error } = await verifyOtp(email, token)
    if (error) {
      setError('Código inválido. Tente novamente.')
      setOtp(Array(6).fill(''))
      otpRefs.current[0]?.focus()
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== '') && newOtp.join('').length === 6) {
      setTimeout(() => {
        const token = newOtp.join('')
        setError('')
        setLoading(true)
        verifyOtp(email, token).then(({ error }) => {
          if (error) {
            setError('Código inválido. Tente novamente.')
            setOtp(Array(6).fill(''))
            otpRefs.current[0]?.focus()
          } else {
            navigate('/dashboard')
          }
          setLoading(false)
        })
      }, 100)
    }
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck className="w-10 h-10 text-indigo-600" />
            <span className="text-3xl font-bold text-slate-900 tracking-tight">Decifra.ia</span>
          </div>
          <p className="text-slate-500 text-sm">Otimize seu currículo para vencer os robôs ATS</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-xl font-semibold text-slate-900 mb-1">
            {otpSent ? 'Verifique seu email' : 'Entre ou crie sua conta'}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {otpSent
              ? `Enviamos um código de 6 dígitos para ${email}`
              : 'Use seu email para entrar. Sem senha, sem complicação.'}
          </p>

          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Continuar com Email
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div>
              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.some((d) => !d)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verificar Código
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setOtpSent(false)
                  setOtp(Array(6).fill(''))
                  setError('')
                }}
                className="w-full mt-3 text-slate-500 hover:text-slate-700 text-sm transition-colors cursor-pointer"
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  )
}
