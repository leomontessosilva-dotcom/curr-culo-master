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

  const prompt = `Você é um especialista em otimização de currículos para sistemas ATS brasileiros, especialmente ${targetAts}.

Reescreva completamente o currículo abaixo para maximizar a aprovação no ATS ${targetAts}.

REGRAS:
1. Formato texto puro, single-column
2. Framework STAR para experiências
3. Quantifique conquistas com números e métricas
4. Incorpore palavras-chave da vaga
5. Estrutura: NOME > CARGO > CONTATO > RESUMO > EXPERIÊNCIA > FORMAÇÃO > HABILIDADES
6. 3-5 bullet points por experiência com verbos de ação

Retorne APENAS um JSON válido (sem markdown, sem backticks):

{
  "newAffinityScore": <número de 0 a 10>,
  "optimizedText": "<currículo completo reescrito>"
}

DESCRIÇÃO DA VAGA:
${jobDescription}

CURRÍCULO ORIGINAL:
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

    const optimization = JSON.parse(jsonMatch[0]);
    return res.status(200).json(optimization);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Anthropic API error:', message);
    return res.status(500).json({ error: 'AI optimization failed', details: message });
  }
}
