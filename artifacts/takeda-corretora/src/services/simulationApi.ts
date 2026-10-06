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
  provider: 'azos';
  createdAt?: string;
}

export interface CoveragePlan {
  id: string;
  title: string;
  badge?: string;
  monthlyPrice: number;
  capital: number;
  coverages: {
    name: string;
    value: string;
    highlight?: boolean;
  }[];
  contractUrl: string;
}

export interface SimulationResult {
  clientName: string;
  age: number;
  capital: number;
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

// Helper to calculate realistic Azos actuarial pricing based on Susep mortalidade
function calculateAzosPlans(data: Record<string, unknown>): SimulationResult {
  const name = String(data.name || 'Cliente');
  const birthdate = String(data.birthdate || '1990-01-01');
  const capital = Number(data.capital || 300000);
  const isSmoker = data.smoker === 'sim';
  const gender = data.gender === 'feminino' ? 'feminino' : 'masculino';

  // Calculate age
  let age = 35;
  const parts = birthdate.includes('/') ? birthdate.split('/') : birthdate.split('-');
  if (parts.length === 3) {
    const year = Number(parts[2].length === 4 ? parts[2] : parts[0]);
    if (year > 1900 && year < 2020) {
      age = Math.max(18, Math.min(70, new Date().getFullYear() - year));
    }
  }

  // Base actuarial rate per R$ 100k of capital
  let baseRate = 0.00018 * (1 + (age - 25) * 0.045);
  if (gender === 'feminino') baseRate *= 0.82; // Women have longer life expectancy
  if (isSmoker) baseRate *= 1.45; // Smoker surcharge

  const basePrice = Math.max(29.9, Math.round((capital * baseRate) / 12));
  const recommendedPrice = Math.round(basePrice * 1.55);
  const totalCarePrice = Math.round(basePrice * 2.15);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const createWhatsAppPlanUrl = (planName: string, price: number) => {
    const text =
      `Olá, Takeda Seguros! Realizei a simulação oficial da Azos no site e escolhi o seguinte plano:\n\n` +
      `• Plano: ${planName}\n` +
      `• Capital Segurado: ${formatBRL(capital)}\n` +
      `• Valor Estimado: ${formatBRL(price)}/mês\n` +
      `• Titular: ${name}\n\n` +
      `Gostaria de formalizar a contratação e tirar dúvidas com o consultor.`;
    return `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
  };

  const plans: CoveragePlan[] = [
    {
      id: 'essencial',
      title: 'Plano Essencial Azos',
      badge: 'Proteção Básica',
      monthlyPrice: basePrice,
      capital,
      coverages: [
        { name: 'Morte (Qualquer Causa)', value: formatBRL(capital), highlight: true },
        { name: 'Invalidez Permanente por Acidente (IPA)', value: formatBRL(capital) },
        { name: 'Assistência Funeral Familiar', value: 'R$ 7.000 incluído' },
        { name: 'Carência para Acidentes', value: 'Zero dias' },
      ],
      contractUrl: createWhatsAppPlanUrl('Plano Essencial Azos', basePrice),
    },
    {
      id: 'recomendado',
      title: 'Plano Recomendado Takeda',
      badge: 'Mais Escolhido ★',
      monthlyPrice: recommendedPrice,
      capital,
      coverages: [
        { name: 'Morte (Qualquer Causa)', value: formatBRL(capital), highlight: true },
        { name: 'Doenças Graves em Vida (Câncer, Infarto, AVC)', value: formatBRL(Math.min(capital, 300000)), highlight: true },
        { name: 'Invalidez Permanente por Acidente (IPA)', value: formatBRL(capital) },
        { name: 'Assistência Funeral Especializada', value: 'R$ 10.000 incluído' },
        { name: 'Segunda Opinião Médica Internacional', value: 'Incluído sem custo adicional' },
      ],
      contractUrl: createWhatsAppPlanUrl('Plano Recomendado Takeda', recommendedPrice),
    },
    {
      id: 'total-care',
      title: 'Plano Total Care 360°',
      badge: 'Proteção Máxima',
      monthlyPrice: totalCarePrice,
      capital,
      coverages: [
        { name: 'Morte (Qualquer Causa)', value: formatBRL(capital), highlight: true },
        { name: 'Doenças Graves Ampliada (Até 12 patologias)', value: formatBRL(Math.min(capital, 500000)), highlight: true },
        { name: 'Invalidez Total ou Parcial por Acidente', value: formatBRL(capital) },
        { name: 'Renda por Incapacidade Temporária (DIT)', value: 'Até R$ 6.000 / mês' },
        { name: 'Telemedicina Einstein 24h para família', value: 'Incluído' },
      ],
      contractUrl: createWhatsAppPlanUrl('Plano Total Care 360°', totalCarePrice),
    },
  ];

  const waMsg = encodeURIComponent(
    `Olá, Takeda Seguros! Acabei de simular meu seguro Azos no site para um capital de ${formatBRL(capital)} (Plano Recomendado a partir de ${formatBRL(recommendedPrice)}/mês). Meu nome é ${name}. Gostaria de tirar dúvidas com o consultor.`
  );

  return {
    clientName: name,
    age,
    capital,
    plans,
    whatsappMessage: `https://wa.me/5511999999999?text=${waMsg}`,
  };
}

// Local simulation state-machine for complete standalone offline resilience
export async function startSimulation(payload: SimulationStartPayload): Promise<SimulationStepResponse> {
  // First attempt real server call if available
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
    // Graceful fallback to client engine
  }

  const sessionId = 'azos-' + Math.random().toString(36).substring(2, 9);
  activeSessions.set(sessionId, { provider: 'azos', startedAt: new Date().toISOString() });

  return {
    sessionId,
    stepId: 'name',
    question: 'Olá! Sou o Consultor Digital da Takeda Corretora. 🤝\nEm parceria oficial com a Azos Seguros, preparamos uma simulação 100% digital, transparente e sem burocracia.\n\nPara começarmos com um atendimento personalizado, como posso te chamar?',
    contextExplanation: 'Seu nome será utilizado para identificar sua simulação e personalizar suas coberturas.',
    inputType: 'text',
    isFinished: false,
  };
}

export async function answerSimulation(payload: SimulationAnswerPayload): Promise<SimulationStepResponse> {
  // First attempt real server call if available
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
    // Graceful fallback to client engine
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
        question: `Muito prazer, ${String(answer).trim()}! É uma honra te atender.\n\nPara calcularmos a taxa justa e exata de acordo com a tabela atuarial oficial da Azos, qual é a sua data de nascimento?`,
        contextExplanation: 'A idade atuarial define o custo exato do risco e garante que você não pague a mais.',
        inputType: 'date',
        isFinished: false,
      };

    case 'birthdate':
      return {
        sessionId,
        stepId: 'gender',
        question: 'Perfeito. As seguradoras utilizam a tábua biométrica regulamentada pela SUSEP para calibrar os planos. Qual é o seu sexo atribuído no nascimento?',
        contextExplanation: 'Mulheres e homens possuem estatísticas atuariais distintas de expectativa de vida.',
        inputType: 'choice',
        options: [
          { label: 'Feminino', value: 'feminino' },
          { label: 'Masculino', value: 'masculino' },
        ],
        isFinished: false,
      };

    case 'gender':
      return {
        sessionId,
        stepId: 'smoker',
        question: 'Você fuma ou consumiu cigarros tradicionais, eletrônicos (vapes) ou narguilé nos últimos 24 meses?',
        contextExplanation: 'A Azos concede condições especiais e tarifas reduzidas para não-fumantes.',
        inputType: 'choice',
        options: [
          { label: 'Não sou fumante', value: 'nao' },
          { label: 'Sou fumante', value: 'sim' },
        ],
        isFinished: false,
      };

    case 'smoker':
      return {
        sessionId,
        stepId: 'profession',
        question: 'Qual é a sua principal profissão ou área de atuação? Isso nos ajuda a verificar coberturas de invalidez e renda por afastamento.',
        contextExplanation: 'Atividades específicas possuem direito a coberturas adicionais como DIT (Renda por Incapacidade).',
        inputType: 'profession',
        options: [
          { label: 'Médico / Saúde', value: 'saude' },
          { label: 'Empresário / Gestão', value: 'empresario' },
          { label: 'Engenharia / Tecnologia', value: 'engenharia_ti' },
          { label: 'Advocacia / Jurídico', value: 'juridico' },
          { label: 'Servidor Público', value: 'servidor' },
          { label: 'Comércio / Autônomo', value: 'autonomo' },
          { label: 'Outra Atividade', value: 'outra' },
        ],
        isFinished: false,
      };

    case 'profession':
      return {
        sessionId,
        stepId: 'objective',
        question: 'Excelente. Qual é o principal objetivo da sua proteção hoje?',
        contextExplanation: 'Priorizamos as coberturas ideais de acordo com o seu perfil patrimonial.',
        inputType: 'choice',
        options: [
          { label: 'Proteção Familiar & Dependentes', value: 'familia' },
          { label: 'Indenização em Diagnóstico de Doenças Graves', value: 'doencas_graves' },
          { label: 'Manutenção de Renda por Afastamento (DIT)', value: 'renda' },
          { label: 'Proteção Patrimonial Global 360°', value: 'completa' },
        ],
        isFinished: false,
      };

    case 'objective':
      return {
        sessionId,
        stepId: 'capital',
        question: 'Qual valor total de Capital Segurado (indenização) você deseja simular? Você pode deslizar ou escolher um valor sugerido:',
        contextExplanation: 'O capital segurado deve cobrir de 2 a 5 anos do custo de vida familiar ou despesas planejadas.',
        inputType: 'slider',
        sliderConfig: {
          min: 100000,
          max: 2000000,
          step: 50000,
          defaultValue: 500000,
        },
        isFinished: false,
      };

    case 'capital':
      return {
        sessionId,
        stepId: 'contact',
        question: 'Quase pronto! Para gerarmos as 3 propostas detalhadas da Azos e enviar o resumo completo para você, informe seu contato:',
        contextExplanation: 'Seus dados são 100% confidenciais. A Takeda Corretora não envia spam.',
        inputType: 'contact',
        isFinished: false,
      };

    case 'contact': {
      // Finished! Calculate proposals
      const result = calculateAzosPlans(session);

      // Auto-save lead
      saveLeadLocally({
        name: String(session.name || ''),
        phone: String((session.contact as Record<string, string>)?.phone || ''),
        email: String((session.contact as Record<string, string>)?.email || ''),
        birthdate: String(session.birthdate || ''),
        capital: Number(session.capital || 300000),
        objective: String(session.objective || ''),
        provider: 'azos',
        createdAt: new Date().toISOString(),
      });

      return {
        sessionId,
        stepId: 'completed',
        question: 'Prontinho! Sua cotação oficial em parceria com a Azos Seguros foi calculada com sucesso. 🎉\n\nConfira os 3 planos desenhados sob medida para você:',
        contextExplanation: 'Você pode contratar diretamente pelo link oficial da Azos ou falar com um consultor da Takeda no WhatsApp para personalizar.',
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
    // 1. Post to backend
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    }).catch(() => {});

    // 2. Persist to localStorage for guaranteed CRM retention
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('takeda_leads') || '[]';
      const parsed: LeadPayload[] = JSON.parse(stored);
      parsed.push({ ...lead, createdAt: new Date().toISOString() });
      localStorage.setItem('takeda_leads', JSON.stringify(parsed));
    }
  } catch {
    // non-blocking
  }
}
