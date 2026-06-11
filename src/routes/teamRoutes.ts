import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// [A1] Rota SSR da tela de Equipes — segue o padrão sem :id no path adotado em
// dashboardRoutes, conforme menu.ejs linha 37 (`href="/teams"`).
// O ID da competição ativa é resolvido pelo controller (mock até a #328).
router.get("/teams", asyncHandler(teamController.renderTeams));

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

router.delete(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.delete)
);

export default router;
