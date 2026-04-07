import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { resumeText, jobDescription, targetAts } = req.body;

  if (!resumeText || !jobDescription || !targetAts) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = new Anthropic({ apiKey });

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
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return res.status(200).json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Anthropic API error:', message);
    return res.status(500).json({ error: 'AI analysis failed', details: message });
  }
}
