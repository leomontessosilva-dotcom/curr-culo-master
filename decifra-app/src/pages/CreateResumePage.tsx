import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Plus,
  Trash2,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

interface Experience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
}

interface Certification {
  id: string
  name: string
  institution: string
  year: string
}

interface Language {
  id: string
  name: string
  level: string
}

const uid = () => crypto.randomUUID()

const LANGUAGE_LEVELS = ['Básico', 'Intermediário', 'Avançado', 'Fluente', 'Nativo']

export function CreateResumePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Personal Info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [objective, setObjective] = useState('')

  // Experiences
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: uid(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '' },
  ])

  // Education
  const [educations, setEducations] = useState<Education[]>([
    { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '' },
  ])

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>([])

  // Languages
  const [languages, setLanguages] = useState<Language[]>([
    { id: uid(), name: 'Português', level: 'Nativo' },
  ])

  // Skills
  const [skills, setSkills] = useState('')

  // Section collapse
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const toggle = (s: string) => setCollapsed((p) => ({ ...p, [s]: !p[s] }))

  // ── Experience handlers ──
  const addExperience = () =>
    setExperiences([...experiences, { id: uid(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, description: '' }])
  const removeExperience = (id: string) =>
    setExperiences(experiences.filter((e) => e.id !== id))
  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) =>
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  // ── Education handlers ──
  const addEducation = () =>
    setEducations([...educations, { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '' }])
  const removeEducation = (id: string) =>
    setEducations(educations.filter((e) => e.id !== id))
  const updateEducation = (id: string, field: keyof Education, value: string) =>
    setEducations(educations.map((e) => (e.id === id ? { ...e, [field]: value } : e)))

  // ── Certification handlers ──
  const addCertification = () =>
    setCertifications([...certifications, { id: uid(), name: '', institution: '', year: '' }])
  const removeCertification = (id: string) =>
    setCertifications(certifications.filter((c) => c.id !== id))
  const updateCertification = (id: string, field: keyof Certification, value: string) =>
    setCertifications(certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  // ── Language handlers ──
  const addLanguage = () =>
    setLanguages([...languages, { id: uid(), name: '', level: 'Intermediário' }])
  const removeLanguage = (id: string) =>
    setLanguages(languages.filter((l) => l.id !== id))
  const updateLanguage = (id: string, field: keyof Language, value: string) =>
    setLanguages(languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)))

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim()) return
    setLoading(true)

    const resumeData = {
      fullName,
      email,
      phone,
      city,
      linkedin,
      objective,
      experiences: experiences.filter((e) => e.company && e.role),
      educations: educations.filter((e) => e.institution && e.degree),
      certifications: certifications.filter((c) => c.name),
      languages: languages.filter((l) => l.name),
      skills,
    }

    navigate('/dashboard/create-result', { state: { resumeData } })
  }

  const isReady = fullName.trim() && email.trim() && experiences.some((e) => e.company && e.role)

  const sectionHeader = (title: string, icon: React.ReactNode, key: string) => (
    <button
      type="button"
      onClick={() => toggle(key)}
      className="w-full flex items-center justify-between cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {collapsed[key] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
    </button>
  )

  const inputClass = 'w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-sm'

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Criar Currículo Otimizado</h1>
        <p className="text-slate-500 text-sm">
          Preencha seus dados e a IA vai gerar um currículo formatado para passar nos filtros ATS.
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {sectionHeader('Dados Pessoais', <User className="w-4 h-4 text-slate-600" />, 'personal')}
          {!collapsed['personal'] && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Nome Completo *</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="João da Silva" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  <Mail className="w-3 h-3 inline mr-1" />Email *
                </label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" className={inputClass} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  <Phone className="w-3 h-3 inline mr-1" />Telefone
                </label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  <MapPin className="w-3 h-3 inline mr-1" />Cidade/Estado
                </label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="São Paulo, SP" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">LinkedIn</label>
                <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/joaosilva" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Objetivo Profissional</label>
                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Ex: Busco uma posição como Desenvolvedor Full-Stack em empresa de tecnologia..." rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}
        </div>

        {/* Experiences */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {sectionHeader('Experiência Profissional', <Briefcase className="w-4 h-4 text-slate-600" />, 'experience')}
          {!collapsed['experience'] && (
            <div className="mt-4 space-y-6">
              {experiences.map((exp, i) => (
                <div key={exp.id} className="relative bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {experiences.length > 1 && (
                    <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-xs font-medium text-slate-500 mb-3">Experiência {i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Empresa *</label>
                      <input type="text" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Nome da empresa" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Cargo *</label>
                      <input type="text" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} placeholder="Seu cargo" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Data de Início</label>
                      <input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Data de Término</label>
                      <input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.isCurrent} className={`${inputClass} disabled:opacity-50`} />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input type="checkbox" checked={exp.isCurrent} onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)} className="rounded accent-slate-900" />
                        <span className="text-xs text-slate-600">Emprego atual</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-600 mb-1">Descrição das Atividades</label>
                      <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Descreva suas principais responsabilidades e conquistas..." rows={3} className={`${inputClass} resize-none`} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addExperience} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                <Plus className="w-4 h-4" /> Adicionar outra experiência
              </button>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {sectionHeader('Formação Acadêmica', <GraduationCap className="w-4 h-4 text-slate-600" />, 'education')}
          {!collapsed['education'] && (
            <div className="mt-4 space-y-6">
              {educations.map((edu, i) => (
                <div key={edu.id} className="relative bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {educations.length > 1 && (
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-xs font-medium text-slate-500 mb-3">Formação {i + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-600 mb-1">Instituição *</label>
                      <input type="text" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="Nome da instituição" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Grau *</label>
                      <input type="text" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Ex: Bacharelado, Tecnólogo, MBA" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Área</label>
                      <input type="text" value={edu.field} onChange={(e) => updateEducation(edu.id, 'field', e.target.value)} placeholder="Ex: Ciência da Computação" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Início</label>
                      <input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Conclusão</label>
                      <input type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addEducation} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                <Plus className="w-4 h-4" /> Adicionar outra formação
              </button>
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {sectionHeader('Certificações e Cursos', <Award className="w-4 h-4 text-slate-600" />, 'certs')}
          {!collapsed['certs'] && (
            <div className="mt-4 space-y-4">
              {certifications.length === 0 && (
                <p className="text-xs text-slate-400">Nenhuma certificação adicionada.</p>
              )}
              {certifications.map((cert) => (
                <div key={cert.id} className="relative bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <button onClick={() => removeCertification(cert.id)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-600 mb-1">Nome do Certificado/Curso</label>
                      <input type="text" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} placeholder="Ex: AWS Solutions Architect" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Ano</label>
                      <input type="text" value={cert.year} onChange={(e) => updateCertification(cert.id, 'year', e.target.value)} placeholder="2024" className={inputClass} />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs text-slate-600 mb-1">Instituição</label>
                      <input type="text" value={cert.institution} onChange={(e) => updateCertification(cert.id, 'institution', e.target.value)} placeholder="Ex: Amazon Web Services" className={inputClass} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addCertification} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                <Plus className="w-4 h-4" /> Adicionar certificação
              </button>
            </div>
          )}
        </div>

        {/* Languages */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {sectionHeader('Idiomas', <Languages className="w-4 h-4 text-slate-600" />, 'languages')}
          {!collapsed['languages'] && (
            <div className="mt-4 space-y-3">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-3">
                  <input type="text" value={lang.name} onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)} placeholder="Idioma" className={`${inputClass} flex-1`} />
                  <select value={lang.level} onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)} className={`${inputClass} w-40`}>
                    {LANGUAGE_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                  {languages.length > 1 && (
                    <button onClick={() => removeLanguage(lang.id)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addLanguage} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer transition-colors">
                <Plus className="w-4 h-4" /> Adicionar idioma
              </button>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          {sectionHeader('Habilidades Técnicas', <FileText className="w-4 h-4 text-slate-600" />, 'skills')}
          {!collapsed['skills'] && (
            <div className="mt-4">
              <textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Ex: React, TypeScript, Node.js, Python, SQL, Excel, Photoshop, Gestão de Projetos..." rows={3} className={`${inputClass} resize-none`} />
              <p className="text-xs text-slate-400 mt-1">Separe por vírgula. Inclua tanto hard skills quanto soft skills.</p>
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
              <FileText className="w-5 h-5" />
              Gerar Currículo Otimizado com IA
            </>
          )}
        </button>
      </div>
    </div>
  )
}
