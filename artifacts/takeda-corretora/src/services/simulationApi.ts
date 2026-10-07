export interface SimulationStartPayload {
  providerId: 'azos';
  channel?: string;
}

export interface SimulationAnswerPayload {
  sessionId: string;
  stepId: string;
  answer: string | number | boolean | Record<string, unknown>;
}

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  birthdate?: string;
  capital?: number;
  objective?: string;
  scenarioId?: number;
  provider: 'azos';
  createdAt?: string;
}

export interface CoveragePlan {
  id: string;
  title: string;
  badge?: string;
  monthlyPrice: number;
  minPrice: number;
  maxPrice: number;
  priceDisplay: string;
  isSpecialUnderwriting?: boolean;
  capital: number;
  coverages: {
    name: string;
    value: string;
    highlight?: boolean;
  }[];
  contractUrl: string;
}

export interface ScenarioInfo {
  id: 1 | 2 | 3 | 4;
  title: string;
  badge: string;
  tone: string;
  transparencyNote: string;
  technicalNotice?: string;
  factorsIdentified: string[];
  isSpecialUnderwriting: boolean;
}

export interface SimulationResult {
  clientName: string;
  age: number;
  gender: 'masculino' | 'feminino';
  ageGroup: string;
  ageGenderFactor: number;
  riskMultiplier: number;
  capital: number;
  scenario: ScenarioInfo;
  profileSummary: {
    ageGenderText: string;
    capitalFormatted: string;
    factorsList: string[];
  };
  plans: CoveragePlan[];
  whatsappMessage: string;
}

export interface SimulationStepResponse {
  sessionId: string;
  stepId: string;
  question: string;
  contextExplanation?: string;
  inputType: 'text' | 'date' | 'choice' | 'profession' | 'slider' | 'contact' | 'result';
  options?: { label: string; value: string; icon?: string }[];
  sliderConfig?: { min: number; max: number; step: number; defaultValue: number };
  isFinished: boolean;
  result?: SimulationResult;
}

// In-memory simulation sessions
const activeSessions = new Map<string, Record<string, unknown>>();

// Motor de Cálculo e Simulação de Seguros de Vida de Precisão (Atuarial Azos / Mercado)
export function calculateAzosPlans(data: Record<string, unknown>): SimulationResult {
  const name = String(data.name || 'Cliente').trim();
  const birthdate = String(data.birthdate || '1995-01-01');
  const capital = Number(data.capital || 1000000);
  const gender = data.gender === 'feminino' ? 'feminino' : 'masculino';

  // 1. IDADE E GÊNERO BIOLÓGICO
  let age = 30;
  const parts = birthdate.includes('/') ? birthdate.split('/') : birthdate.split('-');
  if (parts.length === 3) {
    const year = Number(parts[2].length === 4 ? parts[2] : parts[0]);
    if (year > 1920 && year < 2025) {
      age = Math.max(18, Math.min(75, new Date().getFullYear() - year));
    }
  }

  let ageGenderFactor = 1.0;
  let ageGroup = 'Faixa 1 (18–29 anos)';

  if (age < 30) {
    ageGroup = 'Faixa 1 (18–29 anos)';
    ageGenderFactor = gender === 'feminino' ? 0.7 : 1.0;
  } else if (age < 40) {
    ageGroup = 'Faixa 2 (30–39 anos)';
    ageGenderFactor = gender === 'feminino' ? 0.85 : 1.25;
  } else if (age < 50) {
    ageGroup = 'Faixa 3 (40–49 anos)';
    ageGenderFactor = gender === 'feminino' ? 1.2 : 1.8;
  } else if (age < 60) {
    ageGroup = 'Faixa 4 (50–59 anos)';
    ageGenderFactor = gender === 'feminino' ? 1.9 : 2.8;
  } else {
    ageGroup = 'Faixa 5 (60+ anos)';
    ageGenderFactor = gender === 'feminino' ? 2.8 : 4.2;
  }

  // 2. FATORES DE RISCO DIVERSOS
  const isSmoker = data.smoker === 'sim';
  const isRiskProfession = data.profession === 'operacional_risco';
  const isRiskSports = data.sports === 'sim';
  const hasMedicalHistory = data.health === 'sim';

  let riskMultiplier = 1.0;
  const factorsIdentified: string[] = [];

  if (isSmoker) {
    riskMultiplier *= 1.6;
    factorsIdentified.push('F1 (Fumante / Tabagismo ativo)');
  }
  if (isRiskProfession) {
    riskMultiplier *= 1.3;
    factorsIdentified.push('F2 (Profissão de Risco Operacional)');
  }
  if (isRiskSports) {
    riskMultiplier *= 1.25;
    factorsIdentified.push('F3 (Desportos / Atividades de Risco)');
  }
  if (hasMedicalHistory) {
    factorsIdentified.push('F4 (Condições Clínicas / DPS Especial)');
  }

  // 3. MATRIZ DE CENÁRIOS
  let scenarioId: 1 | 2 | 3 | 4 = 1;
  let scenarioTitle = 'Cenário 1: Perfil Padrão';
  let scenarioBadge = 'Perfil Padrão';
  let tone = 'Apresentação Padrão e Rápida Validação';
  let transparencyNote = 'Estimativa padrão calculada com base na tabela prévia do mercado.';
  let technicalNotice: string | undefined = undefined;
  let isSpecialUnderwriting = false;

  if (hasMedicalHistory) {
    scenarioId = 4;
    scenarioTitle = 'Cenário 4: Perfil Crítico / Análise Especial';
    scenarioBadge = 'Análise Técnica Prioritária';
    tone = 'Necessidade de Consultoria Técnica Prioritária';
    transparencyNote =
      'O seu perfil requer validação técnica direta da subscrição para garantir proteção jurídica total.';
    technicalNotice =
      'Devido ao histórico informado, o seu plano passará por uma análise técnica personalizada sem custos adicionais para garantir que a cobertura não seja recusada no futuro.';
    isSpecialUnderwriting = true;
  } else if (factorsIdentified.length >= 2) {
    scenarioId = 3;
    scenarioTitle = 'Cenário 3: Perfil Agravado Cumulativo';
    scenarioBadge = 'Risco Cumulativo Agravado';
    tone = 'Projeção sob Medida para Risco Agravado';
    transparencyNote =
      'Projeção considerando múltiplos fatores de risco para evitar surpresas na apólice.';
  } else if (factorsIdentified.length === 1) {
    scenarioId = 2;
    scenarioTitle = 'Cenário 2: Perfil Agravado Moderado';
    scenarioBadge = 'Risco Agravado Moderado';
    tone = 'Estimativa Ajustada por Perfil Operacional/Estilo de Vida';
    const singularRisk = isSmoker
      ? 'condição de fumante'
      : isRiskProfession
      ? 'atividade operacional'
      : 'prática de desportos de risco';
    transparencyNote = `Valor ajustado para considerar a ${singularRisk} com cobertura integral.`;
  }

  // CÁLCULO DE VALOR (Base por cada R$ 1.000.000 de capital)
  const capitalInMillions = capital / 1000000;

  // Plano Essencial: Morte e Invalidez (R$ 90 a R$ 105 por R$ 1M base)
  const essencialMin = Math.max(35, Math.round(capitalInMillions * 90 * ageGenderFactor * riskMultiplier));
  const essencialMax = Math.max(42, Math.round(capitalInMillions * 105 * ageGenderFactor * riskMultiplier));

  // Plano Recomendado: Morte/Invalidez + Doenças Graves + Assistência Funeral (R$ 140 a R$ 170 por R$ 1M base)
  const recomendadoMin = Math.max(55, Math.round(capitalInMillions * 140 * ageGenderFactor * riskMultiplier));
  const recomendadoMax = Math.max(68, Math.round(capitalInMillions * 170 * ageGenderFactor * riskMultiplier));

  // Plano Completo: Morte/Invalidez + Doenças Graves Ampliada + DIT Renda Temporária + Telemedicina (R$ 225 a R$ 275 por R$ 1M base)
  const completoMin = Math.max(89, Math.round(capitalInMillions * 225 * ageGenderFactor * riskMultiplier));
  const completoMax = Math.max(110, Math.round(capitalInMillions * 275 * ageGenderFactor * riskMultiplier));

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const formatRange = (min: number, max: number) => {
    if (isSpecialUnderwriting) {
      return `Sob Consulta (Ref: ${formatBRL(min)} – ${formatBRL(max)}/mês)`;
    }
    return `${formatBRL(min)} – ${formatBRL(max)}/mês`;
  };

  const createWhatsAppPlanUrl = (planName: string, rangeText: string) => {
    const text =
      `Olá, Takeda Seguros! Realizei a simulação oficial no site e escolhi o seguinte plano:\n\n` +
      `• Plano: ${planName}\n` +
      `• Capital Simulado: ${formatBRL(capital)}\n` +
      `• Faixa Estimada: ${rangeText}\n` +
      `• Enquadramento: ${scenarioTitle} (${scenarioBadge})\n` +
      `• Titular: ${name} (${age} anos, ${gender})\n` +
      (factorsIdentified.length ? `• Fatores Informados: ${factorsIdentified.join(', ')}\n` : '') +
      `\nGostaria de agendar a conversa técnica e formalizar a contratação com o consultor.`;
    return `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
  };

  const plans: CoveragePlan[] = [
    {
      id: 'essencial',
      title: 'Plano Essencial Azos',
      badge: 'Proteção Básica',
      monthlyPrice: Math.round((essencialMin + essencialMax) / 2),
      minPrice: essencialMin,
      maxPrice: essencialMax,
      priceDisplay: formatRange(essencialMin, essencialMax),
      isSpecialUnderwriting,
      capital,
      coverages: [
        { name: 'Morte (Qualquer Causa)', value: formatBRL(capital), highlight: true },
        { name: 'Invalidez Permanente por Acidente (IPA)', value: formatBRL(capital) },
        { name: 'Assistência Funeral Familiar', value: 'R$ 7.000 incluído' },
        { name: 'Carência para Acidentes', value: 'Zero dias' },
      ],
      contractUrl: createWhatsAppPlanUrl('Plano Essencial Azos', formatRange(essencialMin, essencialMax)),
    },
    {
      id: 'recomendado',
      title: 'Plano Recomendado Takeda',
      badge: 'Mais Escolhido ★',
      monthlyPrice: Math.round((recomendadoMin + recomendadoMax) / 2),
      minPrice: recomendadoMin,
      maxPrice: recomendadoMax,
      priceDisplay: formatRange(recomendadoMin, recomendadoMax),
      isSpecialUnderwriting,
      capital,
      coverages: [
        { name: 'Morte (Qualquer Causa)', value: formatBRL(capital), highlight: true },
        {
          name: 'Doenças Graves em Vida (Câncer, Infarto, AVC)',
          value: formatBRL(Math.min(capital, 300000)),
          highlight: true,
        },
        { name: 'Invalidez Permanente por Acidente (IPA)', value: formatBRL(capital) },
        { name: 'Assistência Funeral Especializada', value: 'R$ 10.000 incluído' },
        { name: 'Segunda Opinião Médica Internacional', value: 'Incluído sem custo' },
      ],
      contractUrl: createWhatsAppPlanUrl('Plano Recomendado Takeda', formatRange(recomendadoMin, recomendadoMax)),
    },
    {
      id: 'total-care',
      title: 'Plano Completo 360°',
      badge: 'Proteção Máxima',
      monthlyPrice: Math.round((completoMin + completoMax) / 2),
      minPrice: completoMin,
      maxPrice: completoMax,
      priceDisplay: formatRange(completoMin, completoMax),
      isSpecialUnderwriting,
      capital,
      coverages: [
        { name: 'Morte (Qualquer Causa)', value: formatBRL(capital), highlight: true },
        {
          name: 'Doenças Graves Ampliada (Até 12 patologias)',
          value: formatBRL(Math.min(capital, 500000)),
          highlight: true,
        },
        { name: 'Invalidez Total ou Parcial por Acidente', value: formatBRL(capital) },
        { name: 'Renda por Incapacidade Temporária (DIT)', value: 'Até R$ 6.000 / mês' },
        { name: 'Telemedicina Einstein 24h Família', value: 'Incluído 24h' },
      ],
      contractUrl: createWhatsAppPlanUrl('Plano Completo 360°', formatRange(completoMin, completoMax)),
    },
  ];

  const waMainText =
    `Olá, Takeda Corretora! Acabei de realizar a simulação com cálculo atuarial no site.\n\n` +
    `• Titular: ${name} (${age} anos, ${gender})\n` +
    `• Capital Desejado: ${formatBRL(capital)}\n` +
    `• Enquadramento: ${scenarioTitle}\n` +
    (factorsIdentified.length ? `• Fatores de Risco: ${factorsIdentified.join(', ')}\n` : '') +
    `• Faixa Recomendada: ${formatRange(recomendadoMin, recomendadoMax)}\n\n` +
    `Gostaria de agendar a conversa técnica com o consultor para validar minha proposta.`;

  return {
    clientName: name,
    age,
    gender,
    ageGroup,
    ageGenderFactor,
    riskMultiplier: Number(riskMultiplier.toFixed(2)),
    capital,
    scenario: {
      id: scenarioId,
      title: scenarioTitle,
      badge: scenarioBadge,
      tone,
      transparencyNote,
      technicalNotice,
      factorsIdentified: factorsIdentified.length ? factorsIdentified : ['Perfil sem agravamentos (Padrão)'],
      isSpecialUnderwriting,
    },
    profileSummary: {
      ageGenderText: `${age} anos · ${gender === 'feminino' ? 'Feminino' : 'Masculino'} (${ageGroup})`,
      capitalFormatted: formatBRL(capital),
      factorsList: factorsIdentified.length ? factorsIdentified : ['Nenhum fator de risco agravado'],
    },
    plans,
    whatsappMessage: `https://wa.me/5511999999999?text=${encodeURIComponent(waMainText)}`,
  };
}

// Local simulation state-machine for complete resilience
export async function startSimulation(payload: SimulationStartPayload): Promise<SimulationStepResponse> {
  try {
    const res = await fetch('/api/simulation/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to client engine
  }

  const sessionId = 'azos-' + Math.random().toString(36).substring(2, 9);
  activeSessions.set(sessionId, { provider: 'azos', startedAt: new Date().toISOString() });

  return {
    sessionId,
    stepId: 'name',
    question:
      'Olá! Sou o Consultor Digital da Takeda Corretora. 🤝\nEm parceria com a Azos Seguros, preparamos uma simulação com motor atuarial de precisão.\n\nPara começarmos com um atendimento personalizado, como posso te chamar?',
    contextExplanation: 'Seu nome será utilizado para identificar sua simulação e personalizar suas coberturas.',
    inputType: 'text',
    isFinished: false,
  };
}

export async function answerSimulation(payload: SimulationAnswerPayload): Promise<SimulationStepResponse> {
  try {
    const res = await fetch('/api/simulation/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to client engine
  }

  const { sessionId, stepId, answer } = payload;
  const session = activeSessions.get(sessionId) || {};
  session[stepId] = answer;
  activeSessions.set(sessionId, session);

  switch (stepId) {
    case 'name':
      return {
        sessionId,
        stepId: 'birthdate',
        question: `Muito prazer, ${String(answer).trim()}! É uma honra te atender.\n\nPara calibrarmos a faixa etária atuarial, qual é a sua data de nascimento?`,
        contextExplanation: 'A idade define a faixa atuarial SUSEP e garante o valor justo sem cobranças indevidas.',
        inputType: 'date',
        isFinished: false,
      };

    case 'birthdate':
      return {
        sessionId,
        stepId: 'gender',
        question:
          'As tábuas biométricas atuariais oficiais consideram o sexo biológico atribuído no nascimento. Qual é o seu?',
        contextExplanation: 'Mulheres e homens possuem fatores atuariais distintos de longevidade e risco.',
        inputType: 'choice',
        options: [
          { label: 'Masculino', value: 'masculino' },
          { label: 'Feminino', value: 'feminino' },
        ],
        isFinished: false,
      };

    case 'gender':
      return {
        sessionId,
        stepId: 'smoker',
        question: 'Você fuma ou consumiu cigarros tradicionais, eletrônicos (vapes) ou narguilé nos últimos 24 meses?',
        contextExplanation: 'A condição de não-fumante garante tarifa base sem sobretaxa atuarial (F1).',
        inputType: 'choice',
        options: [
          { label: 'Não sou fumante', value: 'nao' },
          { label: 'Sou fumante / Vape ativo (F1)', value: 'sim' },
        ],
        isFinished: false,
      };

    case 'smoker':
      return {
        sessionId,
        stepId: 'profession',
        question: 'Qual é o seu tipo de atividade ou ocupação profissional principal?',
        contextExplanation: 'Atividades operacionais de maior exposição física possuem enquadramento específico (F2).',
        inputType: 'profession',
        options: [
          { label: 'Administrativo / Escritório / TI / Gestão', value: 'escritorio' },
          { label: 'Médico / Saúde / Advocacia / Autônomo', value: 'saude' },
          { label: 'Operacional / Construção / Segurança / Transporte (F2)', value: 'operacional_risco' },
          { label: 'Outra atividade de baixo risco físico', value: 'outra' },
        ],
        isFinished: false,
      };

    case 'profession':
      return {
        sessionId,
        stepId: 'sports',
        question: 'Você pratica regularmente desportos ou atividades radicais de alto risco?',
        contextExplanation:
          'Modalidades como paraquedismo, mergulho em profundidade ou motociclismo esportivo constituem fator F3.',
        inputType: 'choice',
        options: [
          { label: 'Não pratico esportes de risco (academia, corrida, etc.)', value: 'nao' },
          { label: 'Sim: Paraquedismo, Mergulho, Motociclismo radical (F3)', value: 'sim' },
        ],
        isFinished: false,
      };

    case 'sports':
      return {
        sessionId,
        stepId: 'health',
        question:
          'Em relação ao seu histórico de saúde (DPS), possui diagnóstico prévio relevante ou condições crônicas em tratamento?',
        contextExplanation:
          'Condições prévias declaradas ativam a análise técnica prioritária (F4) para assegurar total validade jurídica.',
        inputType: 'choice',
        options: [
          { label: 'Sem condições graves / Saúde preventiva em dia', value: 'nao' },
          { label: 'Possuo condições sob acompanhamento médico (F4)', value: 'sim' },
        ],
        isFinished: false,
      };

    case 'health':
      return {
        sessionId,
        stepId: 'capital',
        question: 'Qual valor total de Capital Segurado (indenização) você deseja simular?',
        contextExplanation:
          'Recomenda-se de R$ 500.000 a R$ 2.000.000 para proteção patrimonial robusta e reposição de renda.',
        inputType: 'slider',
        sliderConfig: {
          min: 100000,
          max: 3000000,
          step: 50000,
          defaultValue: 1000000,
        },
        isFinished: false,
      };

    case 'capital':
      return {
        sessionId,
        stepId: 'contact',
        question:
          'Quase pronto! Para gerarmos as 3 propostas detalhadas com o enquadramento do seu cenário e enviarmos o resumo para você, informe seu contato:',
        contextExplanation: 'Seus dados são 100% confidenciais. A Takeda Corretora não envia spam.',
        inputType: 'contact',
        isFinished: false,
      };

    case 'contact': {
      const result = calculateAzosPlans(session);

      saveLeadLocally({
        name: String(session.name || ''),
        phone: String((session.contact as Record<string, string>)?.phone || ''),
        email: String((session.contact as Record<string, string>)?.email || ''),
        birthdate: String(session.birthdate || ''),
        capital: Number(session.capital || 1000000),
        scenarioId: result.scenario.id,
        provider: 'azos',
        createdAt: new Date().toISOString(),
      });

      return {
        sessionId,
        stepId: 'completed',
        question: `Prontinho, ${result.clientName}! Sua cotação oficial foi processada pelo motor atuarial. 🎉\n\nConfira abaixo o resumo do seu perfil, enquadramento de cenário e as 3 opções de planos calculadas com faixas reais de mercado:`,
        contextExplanation: result.scenario.transparencyNote,
        inputType: 'result',
        isFinished: true,
        result,
      };
    }

    default:
      return {
        sessionId,
        stepId: 'completed',
        question: 'Simulação concluída.',
        inputType: 'result',
        isFinished: true,
        result: calculateAzosPlans(session),
      };
  }
}

// Save lead to local CRM / server
export async function saveLeadLocally(lead: LeadPayload): Promise<void> {
  try {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch(() => {});
  } catch {
    // Ignore
  }
}
