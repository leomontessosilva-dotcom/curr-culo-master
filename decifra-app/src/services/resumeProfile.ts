import { supabase } from '../lib/supabase'

export interface ResumeProfileData {
  full_name: string
  email: string
  phone: string
  city: string
  linkedin: string
  objective: string
  experiences: {
    id: string
    company: string
    role: string
    startDate: string
    endDate: string
    isCurrent: boolean
    description: string
  }[]
  educations: {
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
  }[]
  certifications: {
    id: string
    name: string
    institution: string
    year: string
  }[]
  languages: {
    id: string
    name: string
    level: string
  }[]
  skills: string
}

export async function loadResumeProfile(): Promise<ResumeProfileData | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('resume_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return null

  return {
    full_name: data.full_name || '',
    email: data.email || '',
    phone: data.phone || '',
    city: data.city || '',
    linkedin: data.linkedin || '',
    objective: data.objective || '',
    experiences: data.experiences || [],
    educations: data.educations || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
    skills: data.skills || '',
  }
}

export async function saveResumeProfile(profile: ResumeProfileData): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const payload = {
    user_id: user.id,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    city: profile.city,
    linkedin: profile.linkedin,
    objective: profile.objective,
    experiences: profile.experiences,
    educations: profile.educations,
    certifications: profile.certifications,
    languages: profile.languages,
    skills: profile.skills,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('resume_profiles')
    .upsert(payload, { onConflict: 'user_id' })

  return { error: error?.message || null }
}
