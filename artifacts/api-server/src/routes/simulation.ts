import { Router, Request, Response } from "express";

const router = Router();

interface SimulationSession {
  sessionId: string;
  providerId: string;
  startedAt: string;
  data: Record<string, unknown>;
}

const activeSessions = new Map<string, SimulationSession>();

// Actuarial calculation for Azos plans
function calculateAzosPlans(data: Record<string, unknown>) {
  const name = String(data.name || "Cliente");
  const birthdate = String(data.birthdate || "1990-01-01");
  const capital = Number(data.capital || 300000);
  const isSmoker = data.smoker === "sim";
  const gender = data.gender === "feminino" ? "feminino" : "masculino";

  let age = 35;
  const parts = birthdate.includes("/") ? birthdate.split("/") : birthdate.split("-");
  if (parts.length === 3) {
    const year = Number(parts[2].length === 4 ? parts[2] : parts[0]);
    if (year > 1900 && year < 2020) {
      age = Math.max(18, Math.min(70, new Date().getFullYear() - year));
    }
  }

  let baseRate = 0.00018 * (1 + (age - 25) * 0.045);
  if (gender === "feminino") baseRate *= 0.82;
  if (isSmoker) baseRate *= 1.45;

  const basePrice = Math.max(29.9, Math.round((capital * baseRate) / 12));
  const recommendedPrice = Math.round(basePrice * 1.55);
  const totalCarePrice = Math.round(basePrice * 2.15);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(val);

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

  const plans = [
    {
      id: "essencial",
      title: "Plano Essencial Azos",
      badge: "Proteção Básica",
      monthlyPrice: basePrice,
      capital,
      coverages: [
        { name: "Morte (Qualquer Causa)", value: formatBRL(capital), highlight: true },
        { name: "Invalidez Permanente por Acidente (IPA)", value: formatBRL(capital) },
        { name: "Assistência Funeral Familiar", value: "R$ 7.000 incluído" },
        { name: "Carência para Acidentes", value: "Zero dias" },
      ],
      contractUrl: createWhatsAppPlanUrl("Plano Essencial Azos", basePrice),
    },
    {
      id: "recomendado",
      title: "Plano Recomendado Takeda",
      badge: "Mais Escolhido ★",
      monthlyPrice: recommendedPrice,
      capital,
      coverages: [
        { name: "Morte (Qualquer Causa)", value: formatBRL(capital), highlight: true },
        { name: "Doenças Graves em Vida (Câncer, Infarto, AVC)", value: formatBRL(Math.min(capital, 300000)), highlight: true },
        { name: "Invalidez Permanente por Acidente (IPA)", value: formatBRL(capital) },
        { name: "Assistência Funeral Especializada", value: "R$ 10.000 incluído" },
        { name: "Segunda Opinião Médica Internacional", value: "Incluído sem custo adicional" },
      ],
      contractUrl: createWhatsAppPlanUrl("Plano Recomendado Takeda", recommendedPrice),
    },
    {
      id: "total-care",
      title: "Plano Total Care 360°",
      badge: "Proteção Máxima",
      monthlyPrice: totalCarePrice,
      capital,
      coverages: [
        { name: "Morte (Qualquer Causa)", value: formatBRL(capital), highlight: true },
        { name: "Doenças Graves Ampliada (Até 12 patologias)", value: formatBRL(Math.min(capital, 500000)), highlight: true },
        { name: "Invalidez Total ou Parcial por Acidente", value: formatBRL(capital) },
        { name: "Renda por Incapacidade Temporária (DIT)", value: "Até R$ 6.000 / mês" },
        { name: "Telemedicina Einstein 24h para família", value: "Incluído" },
      ],
      contractUrl: createWhatsAppPlanUrl("Plano Total Care 360°", totalCarePrice),
    },
  ];

  const waMsg = encodeURIComponent(
    `Olá, Takeda Corretora! Acabei de simular meu seguro Azos no site para um capital de ${formatBRL(capital)} (Plano Recomendado a partir de ${formatBRL(recommendedPrice)}/mês). Meu nome é ${name}. Gostaria de tirar dúvidas com o consultor.`
  );

  return {
    clientName: name,
    age,
    capital,
    plans,
    whatsappMessage: `https://wa.me/5511999999999?text=${waMsg}`,
  };
}

// POST /api/simulation/start
router.post("/simulation/start", (req: Request, res: Response) => {
  const { providerId = "azos" } = req.body;
  const sessionId = "azos-" + Math.random().toString(36).substring(2, 9);

  activeSessions.set(sessionId, {
    sessionId,
    providerId,
    startedAt: new Date().toISOString(),
    data: {},
  });

  return res.json({
    sessionId,
    stepId: "name",
    question:
      "Olá! Sou o Consultor Digital da Takeda Corretora. 🤝\nEm parceria oficial com a Azos Seguros, preparamos uma simulação 100% digital, transparente e sem burocracia.\n\nPara começarmos com um atendimento personalizado, como posso te chamar?",
    contextExplanation: "Seu nome será utilizado para identificar sua simulação e personalizar suas coberturas.",
    inputType: "text",
    isFinished: false,
  });
});

// POST /api/simulation/answer
router.post("/simulation/answer", (req: Request, res: Response) => {
  const { sessionId, stepId, answer } = req.body;

  let session = activeSessions.get(sessionId);
  if (!session) {
    session = {
      sessionId: sessionId || "azos-" + Math.random().toString(36).substring(2, 9),
      providerId: "azos",
      startedAt: new Date().toISOString(),
      data: {},
    };
    activeSessions.set(session.sessionId, session);
  }

  session.data[stepId] = answer;

  switch (stepId) {
    case "name":
      return res.json({
        sessionId,
        stepId: "birthdate",
        question: `Muito prazer, ${String(answer).trim()}! É uma honra te atender.\n\nPara calcularmos a taxa justa e exata de acordo com a tabela atuarial oficial da Azos, qual é a sua data de nascimento?`,
        contextExplanation: "A idade atuarial define o custo exato do risco e garante que você não pague a mais.",
        inputType: "date",
        isFinished: false,
      });

    case "birthdate":
      return res.json({
        sessionId,
        stepId: "gender",
        question:
          "Perfeito! As seguradoras utilizam a tábua biométrica regulamentada pela SUSEP para calibrar os planos. Qual é o seu sexo atribuído no nascimento?",
        contextExplanation: "Mulheres e homens possuem estatísticas atuariais distintas de expectativa de vida.",
        inputType: "choice",
        options: [
          { label: "Feminino", value: "feminino", icon: "👩" },
          { label: "Masculino", value: "masculino", icon: "👨" },
        ],
        isFinished: false,
      });

    case "gender":
      return res.json({
        sessionId,
        stepId: "smoker",
        question: "Você fuma ou consumiu cigarros tradicionais, eletrônicos (vapes) ou narguilé nos últimos 24 meses?",
        contextExplanation: "A Azos concede condições especiais e descontos atrativos para não-fumantes.",
        inputType: "choice",
        options: [
          { label: "Não fumo (Hábitos saudáveis)", value: "nao", icon: "🌿" },
          { label: "Sim, sou fumante", value: "sim", icon: "🚬" },
        ],
        isFinished: false,
      });

    case "smoker":
      return res.json({
        sessionId,
        stepId: "profession",
        question:
          "Qual é a sua principal profissão ou área de atuação? Isso nos ajuda a verificar coberturas de invalidez e renda por afastamento.",
        contextExplanation: "Determinadas atividades profissionais têm direito a coberturas adicionais como DIT.",
        inputType: "profession",
        options: [
          { label: "Médico / Área da Saúde", value: "saude" },
          { label: "Empresário / Administrador", value: "empresario" },
          { label: "Engenheiro / Tecnologia (TI)", value: "engenharia_ti" },
          { label: "Advogado / Área Jurídica", value: "juridico" },
          { label: "Servidor Público", value: "servidor" },
          { label: "Comércio / Vendas / Autônomo", value: "autonomo" },
          { label: "Outra Profissão", value: "outra" },
        ],
        isFinished: false,
      });

    case "profession":
      return res.json({
        sessionId,
        stepId: "objective",
        question: "Excelente! Qual é o principal objetivo da sua proteção hoje?",
        contextExplanation: "Vamos priorizar as garantias que mais fazem sentido para o seu momento de vida.",
        inputType: "choice",
        options: [
          { label: "Proteger Família & Filhos", value: "familia", icon: "👨‍👩‍👧‍👦" },
          { label: "Indenização em Doenças Graves", value: "doencas_graves", icon: "🩺" },
          { label: "Segurança de Renda se eu parar de trabalhar", value: "renda", icon: "💼" },
          { label: "Proteção Completa 360°", value: "completa", icon: "🛡️" },
        ],
        isFinished: false,
      });

    case "objective":
      return res.json({
        sessionId,
        stepId: "capital",
        question: "Qual valor total de Capital Segurado (indenização) você deseja simular? Você pode deslizar ou escolher um valor sugerido:",
        contextExplanation: "O capital segurado deve cobrir de 2 a 5 anos do custo de vida familiar ou despesas planejadas.",
        inputType: "slider",
        sliderConfig: {
          min: 100000,
          max: 2000000,
          step: 50000,
          defaultValue: 500000,
        },
        isFinished: false,
      });

    case "capital":
      return res.json({
        sessionId,
        stepId: "contact",
        question: "Quase pronto! Para gerarmos as 3 propostas detalhadas da Azos e enviar o resumo completo para você, informe seu contato:",
        contextExplanation: "Seus dados são 100% confidenciais. A Takeda Corretora não envia spam.",
        inputType: "contact",
        isFinished: false,
      });

    case "contact": {
      const result = calculateAzosPlans(session.data);
      return res.json({
        sessionId,
        stepId: "completed",
        question: "Prontinho! Sua cotação oficial em parceria com a Azos Seguros foi calculada com sucesso. 🎉\n\nConfira os 3 planos desenhados sob medida para você:",
        contextExplanation: "Você pode contratar diretamente pelo link oficial da Azos ou falar com um consultor da Takeda no WhatsApp para personalizar.",
        inputType: "result",
        isFinished: true,
        result,
      });
    }

    default:
      return res.json({
        sessionId,
        stepId: "completed",
        question: "Simulação concluída com sucesso.",
        inputType: "result",
        isFinished: true,
        result: calculateAzosPlans(session.data),
      });
  }
});

export default router;
