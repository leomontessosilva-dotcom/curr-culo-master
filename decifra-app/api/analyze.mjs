import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { resumeText, jobDescription, targetAts } = req.body;

  if (!resumeText || !jobDescription || !targetAts) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `Você é um especialista em recrutamento e sistemas ATS (Applicant Tracking Systems) do Brasil, especialmente ${targetAts}.

Analise o currículo abaixo comparando com a descrição da vaga. Retorne APENAS um JSON válido (sem markdown, sem backticks) com esta estrutura exata:

{
  "visualScore": <número de 0 a 10>,
  "visualFeedback": [<lista de strings em português com problemas de formatação>],
  "affinityScore": <número de 0 a 10>,
  "affinityFeedback": [<lista de strings em português. Positivos terminam com " ✓". Negativos descrevem o problema>],
  "optimizedText": "<currículo completo reescrito em texto puro, single-column, otimizado para ATS ${targetAts}>"
}

DESCRIÇÃO DA VAGA:
${jobDescription}

CURRÍCULO DO CANDIDATO (texto extraído do PDF):
${resumeText}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return res.status(200).json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API error:', message);
    return res.status(500).json({ error: 'AI analysis failed', details: message });
  }
}
