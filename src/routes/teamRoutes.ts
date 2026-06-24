import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

// [A1] Rotas SSR da tela de Equipes. O acesso exige competitionId na query
// string para evitar abrir /teams sem competição determinada.
router.get("/teams", garantirAutenticacao, asyncHandler(teamController.renderTeams));
router.get("/teams/new", garantirAutenticacao, asyncHandler(teamController.renderNewTeam));
router.get("/teams/:teamId/edit", garantirAutenticacao, asyncHandler(teamController.renderEditTeam));
router.get("/teams/:teamId", garantirAutenticacao, asyncHandler(teamController.renderTeamDetail));

router.post(
  "/competitions/:id/teams",
  garantirAutenticacao,
  asyncHandler(teamController.create)
);

router.get(
  "/competitions/:id/teams",
  garantirAutenticacao,
  asyncHandler(teamController.list)
);

router.get(
  "/competitions/:id/teams/:teamId",
  garantirAutenticacao,
  asyncHandler(teamController.findById)
);

router.put(
  "/competitions/:id/teams/:teamId",
  garantirAutenticacao,
  asyncHandler(teamController.update)
);

router.patch(
  "/competitions/:id/teams/:teamId/active-runner",
  garantirAutenticacao,
  asyncHandler(teamController.setActiveRunner)
);

router.delete(
  "/competitions/:id/teams/:teamId",
  garantirAutenticacao,
  asyncHandler(teamController.delete)
);

export default router;
