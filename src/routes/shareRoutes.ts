import { Router } from "express";
import { asyncHandler } from "../helpers/asyncHandler";
import { shareController } from "../controllers/shareController";
import { competitionService } from "../services/competitionService";
import { teamService } from "../services/teamService";
import { shareService } from "../services/shareService";
import { AppError } from "../errors/AppError";

const router = Router();

function readRouteParam(value: string | string[], name: string): string {
  if (Array.isArray(value)) {
    throw new AppError(`Parâmetro ${name} inválido`, 400);
  }
  return value;
}

// Public route for the share page (used by the sidebar button)
// NOTE: This route was removed as part of the migration to public team URLs.


// Public route for share page via public team URL (no auth)
router.get(
  "/public/team/:uuid/share",
  asyncHandler(async (req, res) => {
    const uuid = readRouteParam(req.params.uuid, "uuid");
    const team = await teamService.findByUuid(uuid);
    if (!team) {
      throw new AppError("Equipe não encontrada", 404);
    }
    const competition = await competitionService.findById(team.id_competition);
    if (!competition) {
      throw new AppError("Competição não encontrada", 404);
    }
    const [athletes, highlights] = await Promise.all([
      shareService.getAthletes(team.id),
      shareService.getHighlights(team.id_competition),
    ]);
    res.render("share/share", {
      title: "Compartilhar Resultados",
      currentPage: "share",
      pageCSS: "share",
      competition,
      competitionId: competition.id,
      competitionName: competition.name,
      athletes,
      highlights,
      layout: "layouts/main",
      teamUuid: uuid,
      hideMenuNav: true,
    });
  })
);

// Public route for share template via public team URL (no auth)
router.get(
  "/public/team/:uuid/share/template/:type",
  asyncHandler(async (req, res) => {
    const uuid = readRouteParam(req.params.uuid, "uuid");
    const type = readRouteParam(req.params.type, "type");
    // Locate team by UUID
    const team = await teamService.findByUuid(uuid);
    if (!team) {
      throw new AppError("Equipe não encontrada", 404);
    }
    // Set competition id so renderTemplate can use parseCompetitionId()
    (req.params as any).id = team.id_competition;
    // Pass the team uuid for the back button
    (req.params as any).teamUuid = uuid;
    // Ensure type param remains for controller
    (req.params as any).type = type;
    // Delegate to existing controller logic
    await shareController.renderTemplate(req, res);
  })
);

export default router;
