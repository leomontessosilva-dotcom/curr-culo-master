import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' })
  }

  const { resumeText, jobDescription, targetAts } = req.body

  if (!resumeText || !jobDescription || !targetAts) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Você é um especialista em recrutamento e sistemas ATS (Applicant Tracking Systems) do Brasil, especialmente ${targetAts}.

Analise o currículo abaixo comparando com a descrição da vaga. Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) com esta estrutura exata:

{
  "visualScore": <número de 0 a 10 - avalie se o formato do texto parece vir de um currículo com layout simples (nota alta) ou complexo com colunas/gráficos/ícones (nota baixa)>,
  "visualFeedback": [<lista de strings em português com problemas de formatação detectados, ex: "Layout em colunas detectado", "Fontes decorativas", etc. Se estiver bom, elogie>],
  "affinityScore": <número de 0 a 10 - afinidade das experiências/habilidades do candidato com os requisitos da vaga>,
  "affinityFeedback": [<lista de strings em português. Para itens positivos, termine com " ✓". Para negativos, comece com o problema. Ex: "Faltam palavras-chave: Liderança, Scrum", "Experiência com React compatível ✓">],
  "optimizedText": "<currículo completo reescrito em formato texto puro, single-column, otimizado para ATS ${targetAts}. Use framework STAR para experiências. Adicione palavras-chave da vaga. Formato: NOME\\nCARGO\\n\\nCONTATO\\n...\\n\\nRESUMO PROFISSIONAL\\n...\\n\\nEXPERIÊNCIA PROFISSIONAL\\n...\\n\\nFORMAÇÃO\\n...\\n\\nHABILIDADES>"
}

DESCRIÇÃO DA VAGA:
${jobDescription}

CURRÍCULO DO CANDIDATO (texto extraído do PDF):
${resumeText}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' })
    }

    const analysis = JSON.parse(jsonMatch[0])
    return res.status(200).json(analysis)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Gemini API error:', message)
    return res.status(500).json({ error: 'AI analysis failed', details: message })
  }
}
