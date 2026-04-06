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

  const prompt = `Você é um especialista em otimização de currículos para sistemas ATS brasileiros, especialmente ${targetAts}.

Reescreva completamente o currículo abaixo para maximizar a aprovação no ATS ${targetAts}.

REGRAS OBRIGATÓRIAS:
1. Use formato texto puro, single-column, sem tabelas ou colunas
2. Use o framework STAR (Situação, Tarefa, Ação, Resultado) para descrever experiências
3. Quantifique TODAS as conquistas com números, percentuais e métricas
4. Incorpore TODAS as palavras-chave relevantes da descrição da vaga
5. Use fonte padrão compatível (o texto será renderizado em Helvetica)
6. Estrutura: NOME > CARGO > CONTATO > RESUMO > EXPERIÊNCIA > FORMAÇÃO > HABILIDADES
7. Cada experiência deve ter 3-5 bullet points começando com verbos de ação
8. O resumo profissional deve ter 3-4 linhas e mencionar anos de experiência

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`):

{
  "newAffinityScore": <número de 0 a 10 - nova pontuação estimada após otimização>,
  "optimizedText": "<currículo completo reescrito>"
}

DESCRIÇÃO DA VAGA:
${jobDescription}

CURRÍCULO ORIGINAL:
${resumeText}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' })
    }

    const optimization = JSON.parse(jsonMatch[0])
    return res.status(200).json(optimization)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Gemini API error:', message)
    return res.status(500).json({ error: 'AI optimization failed', details: message })
  }
}
