import type { AnalysisResult } from '../types/analysis'

// This service will call the AI API via Supabase Edge Function or server route.
// For now, it uses mock data for UI development and visual testing.

export async function analyzeResume(
  _resumeText: string,
  _jobDescription: string,
  _targetAts: string
): Promise<AnalysisResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2500))

  // Mock response — replace with actual AI API call
  return {
    visualScore: 3,
    visualFeedback: [
      'Currículo usa layout em colunas — robôs ATS não conseguem ler corretamente',
      'Fontes decorativas detectadas — use Arial, Helvetica ou Calibri',
      'Gráficos e ícones encontrados — ATS ignora elementos visuais',
      'Foto detectada no currículo — remova para compatibilidade ATS',
    ],
    affinityScore: 5,
    affinityFeedback: [
      'Faltam palavras-chave: "Liderança", "Gestão de Projetos", "Metodologias Ágeis"',
      'Experiências não estão quantificadas — adicione métricas e resultados',
      'Objetivo profissional genérico — personalize para a vaga',
      'Habilidades técnicas compatíveis com a vaga ✓',
      'Formação acadêmica relevante ✓',
    ],
    optimizedText: `JOÃO SILVA
Engenheiro de Software Sênior

CONTATO
Email: joao.silva@email.com | Tel: (11) 99999-9999 | LinkedIn: linkedin.com/in/joaosilva

RESUMO PROFISSIONAL
Engenheiro de Software com 8+ anos de experiência em desenvolvimento full-stack, liderança técnica de equipes de até 12 pessoas e entrega de projetos com metodologias ágeis (Scrum/Kanban). Especialista em React, Node.js e arquiteturas cloud-native na AWS. Histórico comprovado de redução de custos de infraestrutura em 40% e aumento de performance de aplicações em 60%.

EXPERIÊNCIA PROFISSIONAL

Engenheiro de Software Sênior | Tech Corp
Jan 2021 — Presente
• Liderou equipe de 12 desenvolvedores na entrega de plataforma SaaS com 500k+ usuários ativos
• Implementou arquitetura de microsserviços que reduziu o tempo de deploy de 2h para 15min
• Reduziu custos de infraestrutura AWS em 40% através de otimização de recursos e auto-scaling
• Mentoreou 5 desenvolvedores júnior, resultando em 3 promoções internas

Desenvolvedor Full-Stack | StartupXYZ
Mar 2018 — Dez 2020
• Desenvolveu sistema de gestão de projetos usado por 200+ empresas
• Aumentou a performance do frontend em 60% com React e técnicas de lazy loading
• Implementou CI/CD pipeline que reduziu bugs em produção em 35%

FORMAÇÃO
Bacharelado em Ciência da Computação — USP (2017)
Certificação AWS Solutions Architect Associate (2022)

HABILIDADES TÉCNICAS
React, TypeScript, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, Git, Scrum, Kanban`,
  }
}

export async function optimizeResume(
  _resumeText: string,
  _jobDescription: string,
  _targetAts: string
): Promise<{ optimizedText: string; newAffinityScore: number }> {
  // Simulate optimization delay with progress
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return {
    newAffinityScore: 9,
    optimizedText: `JOÃO SILVA
Engenheiro de Software Sênior | Gestão de Projetos & Liderança Técnica

CONTATO
Email: joao.silva@email.com | Tel: (11) 99999-9999 | LinkedIn: linkedin.com/in/joaosilva

RESUMO PROFISSIONAL
Engenheiro de Software Sênior com 8+ anos de experiência comprovada em liderança técnica, gestão de projetos com metodologias ágeis (Scrum/Kanban) e desenvolvimento full-stack de alta performance. Especializado em React, TypeScript, Node.js e arquiteturas cloud-native AWS. Reconhecido por entregar resultados mensuráveis: redução de 40% em custos de infraestrutura, aumento de 60% em performance de aplicações e liderança de equipes de até 12 profissionais com foco em entregas de alto impacto.

EXPERIÊNCIA PROFISSIONAL

TECH CORP — Engenheiro de Software Sênior
Janeiro 2021 — Presente
• Exerceu liderança técnica de equipe multidisciplinar de 12 desenvolvedores, aplicando metodologias ágeis (Scrum) para entrega de plataforma SaaS B2B com 500k+ usuários ativos mensais
• Arquitetou migração para microsserviços que reduziu tempo de deploy de 2 horas para 15 minutos, impactando diretamente a velocidade de entrega do time
• Implementou estratégia de otimização de recursos AWS (auto-scaling, reserved instances) resultando em redução de 40% nos custos mensais de infraestrutura (economia de R$ 180k/ano)
• Estruturou programa de mentoria para 5 desenvolvedores júnior, com 3 promoções internas em 18 meses
• Conduziu gestão de projetos de migração tecnológica com stakeholders C-level, garantindo alinhamento entre áreas técnica e de negócio

STARTUPXYZ — Desenvolvedor Full-Stack Pleno
Março 2018 — Dezembro 2020
• Desenvolveu do zero sistema de gestão de projetos SaaS adotado por 200+ empresas clientes
• Otimizou performance do frontend com React e técnicas avançadas (code splitting, lazy loading, memoization), resultando em melhoria de 60% no Core Web Vitals
• Projetou e implementou pipeline CI/CD completo (GitHub Actions + Docker), reduzindo incidentes em produção em 35%
• Colaborou com equipe de UX na definição de requisitos e priorização de backlog usando framework RICE

FORMAÇÃO ACADÊMICA
Bacharelado em Ciência da Computação — Universidade de São Paulo (USP) — 2017
Certificação AWS Solutions Architect Associate — Amazon Web Services — 2022

COMPETÊNCIAS TÉCNICAS
Linguagens & Frameworks: React, TypeScript, Node.js, Python, Next.js
Banco de Dados: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS (EC2, S3, Lambda, RDS), Docker, Kubernetes, Terraform
Metodologias: Scrum, Kanban, SAFe, Gestão de Projetos Ágeis
Ferramentas: Git, Jira, Confluence, Figma, GitHub Actions`,
  }
}
