export interface AnalysisResult {
  visualScore: number
  visualFeedback: string[]
  affinityScore: number
  affinityFeedback: string[]
  optimizedText: string
}

export interface AnalysisRecord {
  id: string
  user_id: string
  target_ats: string
  job_description: string
  initial_visual_score: number
  initial_affinity_score: number
  final_affinity_score: number | null
  feedback_json: {
    visualFeedback: string[]
    affinityFeedback: string[]
  }
  optimized_resume_text: string | null
  created_at: string
}

export type AtsProvider = 'Gupy' | 'Catho' | 'InfoJobs' | 'Indeed'
