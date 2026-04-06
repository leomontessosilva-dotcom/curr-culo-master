import type { AnalysisResult } from '../types/analysis'

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  targetAts: string
): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription, targetAts }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Falha na análise do currículo')
  }

  return response.json()
}

export async function optimizeResume(
  resumeText: string,
  jobDescription: string,
  targetAts: string
): Promise<{ optimizedText: string; newAffinityScore: number }> {
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, jobDescription, targetAts }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Falha na otimização do currículo')
  }

  return response.json()
}
