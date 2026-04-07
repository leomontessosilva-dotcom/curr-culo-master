import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, ArrowLeft, Eye, EyeOff, User } from 'lucide-react'

type View = 'login' | 'signup' | 'verify-signup' | 'forgot' | 'verify-reset' | 'new-password'

const OTP_LENGTH = 8

export function LoginPage() {
  const [view, setView] = useState<View>('login')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signUp, signIn, verifyOtp, resetPasswordRequest, updatePassword } = useAuth()
  const navigate = useNavigate()
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const resetForm = () => {
    setError('')
    setSuccess('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setOtp(Array(OTP_LENGTH).fill(''))
    setShowPassword(false)
  }

  const goTo = (v: View) => {
    resetForm()
    setView(v)
  }

  // ── LOGIN ──
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email ou senha incorretos.')
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  // ── SIGNUP ──
  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Preencha seu nome completo.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, fullName.trim())
    if (error) {
      setError(error.message)
    } else {
      setView('verify-signup')
      setSuccess('Conta criada! Verifique seu email para o código de confirmação.')
    }
    setLoading(false)
  }

  // ── FORGOT PASSWORD ──
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPasswordRequest(email)
    if (error) {
      setError(error.message)
    } else {
      setView('verify-reset')
      setSuccess('Se o email estiver cadastrado, você receberá um código de recuperação.')
    }
    setLoading(false)
  }

  // ── VERIFY OTP (signup or reset) ──
  const handleVerifyOtp = async () => {
    const token = otp.join('')
    if (token.length !== OTP_LENGTH) return

    setError('')
    setLoading(true)
    const otpType = view === 'verify-signup' ? 'signup' : 'recovery'
    const { error } = await verifyOtp(email, token, otpType)

    if (error) {
      setError('Código inválido. Verifique e tente novamente.')
      setOtp(Array(OTP_LENGTH).fill(''))
      otpRefs.current[0]?.focus()
    } else if (view === 'verify-signup') {
      navigate('/dashboard')
    } else {
      setView('new-password')
      setSuccess('Código verificado! Defina sua nova senha.')
    }
    setLoading(false)
  }

  // ── UPDATE PASSWORD ──
  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error } = await updatePassword(password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  // ── OTP INPUT HANDLERS ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== '')) {
      setTimeout(() => {
        const token = newOtp.join('')
        const otpType = view === 'verify-signup' ? 'signup' : 'recovery'
        setError('')
        setLoading(true)
        verifyOtp(email, token, otpType).then(({ error }) => {
          if (error) {
            setError('Código inválido. Verifique e tente novamente.')
            setOtp(Array(OTP_LENGTH).fill(''))
            otpRefs.current[0]?.focus()
          } else if (view === 'verify-signup') {
            navigate('/dashboard')
          } else {
            setView('new-password')
            setSuccess('Código verificado! Defina sua nova senha.')
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

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const newOtp = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    otpRefs.current[nextIndex]?.focus()

    if (pasted.length === OTP_LENGTH) {
      setTimeout(() => {
        const otpType = view === 'verify-signup' ? 'signup' : 'recovery'
        setError('')
        setLoading(true)
        verifyOtp(email, pasted, otpType).then(({ error }) => {
          if (error) {
            setError('Código inválido. Verifique e tente novamente.')
            setOtp(Array(OTP_LENGTH).fill(''))
            otpRefs.current[0]?.focus()
          } else if (view === 'verify-signup') {
            navigate('/dashboard')
          } else {
            setView('new-password')
            setSuccess('Código verificado! Defina sua nova senha.')
          }
          setLoading(false)
        })
      }, 100)
    }
  }

  // ── SHARED UI COMPONENTS ──
  const emailInput = (disabled = false) => (
    <div className="relative mb-4">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={disabled}
        required
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm disabled:opacity-60"
      />
    </div>
  )

  const passwordInput = (placeholder: string, value: string, onChange: (v: string) => void) => (
    <div className="relative mb-4">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={6}
        className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  )

  const submitButton = (label: string, icon?: React.ReactNode) => (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm cursor-pointer"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{label}{icon}</>}
    </button>
  )

  const otpInput = () => (
    <div>
      <div className="flex gap-1.5 justify-center mb-6" onPaste={handleOtpPaste}>
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
            className="w-10 h-12 text-center text-lg font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleVerifyOtp}
        disabled={loading || otp.some((d) => !d)}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>Verificar Código <ShieldCheck className="w-4 h-4" /></>
        )}
      </button>
    </div>
  )

  // ── VIEW CONFIG ──
  const views: Record<View, { title: string; subtitle: string }> = {
    login: {
      title: 'Entrar na sua conta',
      subtitle: 'Use seu email e senha para acessar a plataforma.',
    },
    signup: {
      title: 'Criar sua conta',
      subtitle: 'Preencha seus dados. Você receberá um código de confirmação por email.',
    },
    'verify-signup': {
      title: 'Confirme seu email',
      subtitle: `Enviamos um código de 8 dígitos para ${email}`,
    },
    forgot: {
      title: 'Recuperar senha',
      subtitle: 'Informe seu email cadastrado para receber o código de recuperação.',
    },
    'verify-reset': {
      title: 'Código de recuperação',
      subtitle: `Enviamos um código de 8 dígitos para ${email}`,
    },
    'new-password': {
      title: 'Defina sua nova senha',
      subtitle: 'Escolha uma senha segura com pelo menos 6 caracteres.',
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="Contrata.AI" className="w-12 h-12" />
            <span className="text-3xl font-bold text-slate-900 tracking-tight">Contrata.AI</span>
          </div>
          <p className="text-slate-500 text-sm">Otimize seu currículo para vencer os robôs ATS</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Back button for sub-views */}
          {view !== 'login' && view !== 'signup' && (
            <button
              onClick={() => goTo(view === 'verify-signup' ? 'signup' : view === 'new-password' ? 'login' : 'login')}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          )}

          <h1 className="text-xl font-semibold text-slate-900 mb-1">{views[view].title}</h1>
          <p className="text-slate-500 text-sm mb-6">{views[view].subtitle}</p>

          {/* Success */}
          {success && (
            <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* ── LOGIN VIEW ── */}
          {view === 'login' && (
            <>
              <form onSubmit={handleLogin}>
                {emailInput()}
                {passwordInput('Sua senha', password, setPassword)}
                {submitButton('Entrar', <ArrowRight className="w-4 h-4" />)}
              </form>
              <div className="mt-4 space-y-2 text-center">
                <button
                  onClick={() => goTo('forgot')}
                  className="text-sm text-slate-900 hover:text-black cursor-pointer transition-colors"
                >
                  Esqueci minha senha
                </button>
                <p className="text-sm text-slate-500">
                  Não tem conta?{' '}
                  <button
                    onClick={() => goTo('signup')}
                    className="text-slate-900 hover:text-black font-medium cursor-pointer transition-colors"
                  >
                    Criar conta
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ── SIGNUP VIEW ── */}
          {view === 'signup' && (
            <>
              <form onSubmit={handleSignUp}>
                <div className="relative mb-4">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm"
                  />
                </div>
                {emailInput()}
                {passwordInput('Crie uma senha (mín. 6 caracteres)', password, setPassword)}
                {passwordInput('Confirme sua senha', confirmPassword, setConfirmPassword)}
                {submitButton('Criar Conta', <ArrowRight className="w-4 h-4" />)}
              </form>
              <p className="mt-4 text-sm text-slate-500 text-center">
                Já tem conta?{' '}
                <button
                  onClick={() => goTo('login')}
                  className="text-slate-900 hover:text-black font-medium cursor-pointer transition-colors"
                >
                  Entrar
                </button>
              </p>
            </>
          )}

          {/* ── VERIFY SIGNUP OTP ── */}
          {view === 'verify-signup' && otpInput()}

          {/* ── FORGOT PASSWORD ── */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword}>
              {emailInput()}
              {submitButton('Enviar código de recuperação', <Mail className="w-4 h-4" />)}
            </form>
          )}

          {/* ── VERIFY RESET OTP ── */}
          {view === 'verify-reset' && otpInput()}

          {/* ── NEW PASSWORD ── */}
          {view === 'new-password' && (
            <form onSubmit={handleUpdatePassword}>
              {passwordInput('Nova senha (mín. 6 caracteres)', password, setPassword)}
              {passwordInput('Confirme a nova senha', confirmPassword, setConfirmPassword)}
              {submitButton('Salvar nova senha', <ShieldCheck className="w-4 h-4" />)}
            </form>
          )}
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  )
}
