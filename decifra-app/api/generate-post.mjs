import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { topic, goal, audience, tone, format, reference, keyMessage, callToAction, extraContext } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Missing topic' });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Você é um especialista em copywriting para LinkedIn, com profundo conhecimento de algoritmo, engajamento e crescimento orgânico na plataforma.

Gere um post para LinkedIn em PORTUGUÊS DO BRASIL com base nas informações abaixo.

REGRAS DE OURO PARA O POST:
1. A primeira linha DEVE ser um gancho forte que prenda atenção (hook). Use padrões como: pergunta provocativa, afirmação contraintuitiva, número impactante, ou história pessoal.
2. Use parágrafos curtos (1-2 frases por parágrafo) com linhas em branco entre eles — o LinkedIn penaliza textos em blocos.
3. Inclua quebras de padrão: emojis estratégicos (máximo 3-4 no post todo), listas, ou frases de impacto isoladas.
4. O post deve ter entre 800 e 1500 caracteres (ideal para engajamento no LinkedIn).
5. Termine com um CTA (call-to-action) que incentive comentários, não apenas curtidas.
6. NÃO use hashtags excessivas — máximo 3 hashtags relevantes no final.
7. O tom deve soar autêntico e humano, nunca robótico ou genérico.

INFORMAÇÕES DO POST:
- Tema/Assunto: ${topic}
${goal ? `- Objetivo: ${goal}` : ''}
${audience ? `- Público-alvo: ${audience}` : ''}
- Tom de voz: ${tone}
- Formato: ${format}
${reference ? `- Post de referência (usar como inspiração de estilo): ${reference}` : ''}
${keyMessage ? `- Mensagem-chave que deve ficar clara: ${keyMessage}` : ''}
${callToAction ? `- CTA desejado: ${callToAction}` : ''}
${extraContext ? `- Contexto sobre o autor: ${extraContext}` : ''}

Retorne APENAS um JSON válido (sem markdown, sem backticks):

{
  "post": "<o texto completo do post pronto para colar no LinkedIn>",
  "hook": "<a primeira linha do post separada, para referência>",
  "tips": [<lista de 2-3 strings com dicas sobre por que esse post deve funcionar bem>]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Anthropic API error:', msg);
    return res.status(500).json({ error: 'Post generation failed', details: msg });
  }
}
