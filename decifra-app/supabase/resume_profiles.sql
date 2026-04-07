-- Contrata.AI - Resume Profile Persistence
-- Run this in Supabase SQL Editor to add resume data persistence

-- Resume profiles table (stores form data for reuse)
CREATE TABLE IF NOT EXISTS public.resume_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  city TEXT,
  linkedin TEXT,
  objective TEXT,
  experiences JSONB DEFAULT '[]',
  educations JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  skills TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resume_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only access their own resume profile
CREATE POLICY "Users can view own resume profile" ON public.resume_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume profile" ON public.resume_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resume profile" ON public.resume_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_resume_profiles_user_id ON public.resume_profiles(user_id);
