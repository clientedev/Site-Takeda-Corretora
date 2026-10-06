import { Router, Request, Response } from "express";

const router = Router();

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthdate?: string;
  capital?: number;
  objective?: string;
  provider: string;
  createdAt: string;
}

const leadsStore: Lead[] = [];

// POST /api/leads
router.post("/leads", (req: Request, res: Response) => {
  const { name, phone, email, birthdate, capital, objective, provider = "azos" } = req.body;

  if (!name && !phone) {
    return res.status(400).json({ error: "Nome ou telefone é obrigatório." });
  }

  const newLead: Lead = {
    id: "lead-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    name: name || "Visitante",
    phone: phone || "",
    email: email || "",
    birthdate,
    capital,
    objective,
    provider,
    createdAt: new Date().toISOString(),
  };

  leadsStore.push(newLead);

  return res.status(201).json({
    success: true,
    message: "Lead salvo com sucesso no CRM local.",
    lead: newLead,
  });
});

// GET /api/leads (for admin inspection)
router.get("/leads", (_req: Request, res: Response) => {
  return res.json({
    total: leadsStore.length,
    leads: leadsStore,
  });
});

export default router;
