import { Router } from "express";
import { rankingController } from "../controllers/rankingController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/ranking",
  asyncHandler(rankingController.renderActiveRanking)
);

router.get(
  "/competitions/:id/ranking",
  asyncHandler(rankingController.renderActiveRanking)
);

router.get(
  "/competitions/:id/ranking/teams",
  asyncHandler(rankingController.teamRanking)
);

router.get(
  "/competitions/:id/ranking/runners",
  asyncHandler(rankingController.runnerRanking)
);

// [A1] Rota SSR — Seção 11 agent.md: GET /view/competitions/:id/ranking
router.get(
  "/view/competitions/:id/ranking",
  asyncHandler(rankingController.renderRanking)
);

export default router;
