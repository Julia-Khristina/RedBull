import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// [A1] Rotas SSR da tela de Equipes. O acesso exige competitionId na query
// string para evitar abrir /teams sem competição determinada.
router.get("/teams", asyncHandler(teamController.renderTeams));
router.get("/teams/new", asyncHandler(teamController.renderNewTeam));
router.get("/teams/:teamId/edit", asyncHandler(teamController.renderEditTeam));
router.get("/teams/:teamId", asyncHandler(teamController.renderTeamDetail));

router.post(
  "/competitions/:id/teams",
  asyncHandler(teamController.create)
);

router.get(
  "/competitions/:id/teams",
  asyncHandler(teamController.list)
);

router.get(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.findById)
);

router.put(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.update)
);

router.patch(
  "/competitions/:id/teams/:teamId/active-runner",
  asyncHandler(teamController.setActiveRunner)
);

router.delete(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.delete)
);

export default router;
