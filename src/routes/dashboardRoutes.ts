import { Router, Request, Response } from "express";
import { competitionService } from "../services/competitionService";
import { asyncHandler } from "../helpers/asyncHandler";
import {
  getSelectedCompetitionId,
  saveSelectedCompetitionId,
} from "../helpers/selectedCompetition";

const router = Router();

// [A1] Rota SSR — GET /dashboard — confirmada em src/routes/dashboardRoutes.ts
router.get("/dashboard", asyncHandler(async (req: Request, res: Response) => {
  const competitions = await competitionService.findAll();
  const requestedCompetitionId =
    typeof req.query.competitionId === "string"
      ? Number(req.query.competitionId)
      : getSelectedCompetitionId(req) ?? NaN;
  const activeCompetition = Number.isInteger(requestedCompetitionId)
    ? competitions.find((competition) => competition.id === requestedCompetitionId) ?? null
    : null;

  if (activeCompetition) {
    saveSelectedCompetitionId(res, activeCompetition.id);
  }

  res.render("dashboard/dashboard", {
    title: "Dashboard — Red Bull 24H",
    // [A1] ?created=1 é injetado pelo redirect após POST /competitions bem-sucedido
    success: req.query.created === "1",
    competitions,
    competition: activeCompetition,
    activeCompetition,
    currentPage: "dashboard",
    pageCSS: "/css/dashboard.css"
  });
}));

export default router;
