import { supabase } from '../lib/supabase'

export interface LinkedinPost {
  id: string
  topic: string
  goal: string
  audience: string
  tone: string
  format: string
  post_content: string
  tips: string[]
  created_at: string
}

export async function saveLinkedinPost(data: {
  topic: string
  goal?: string
  audience?: string
  tone?: string
  format?: string
  post_content: string
  tips?: string[]
}): Promise<{ error: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('linkedin_posts').insert({
    user_id: user.id,
    topic: data.topic,
    goal: data.goal || '',
    audience: data.audience || '',
    tone: data.tone || '',
    format: data.format || '',
    post_content: data.post_content,
    tips: data.tips || [],
  })

  return { error: error?.message || null }
}

export async function loadLinkedinPosts(): Promise<LinkedinPost[]> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('linkedin_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as LinkedinPost[]
}

export async function deleteLinkedinPost(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('linkedin_posts')
    .delete()
    .eq('id', id)

  return { error: error?.message || null }
}
