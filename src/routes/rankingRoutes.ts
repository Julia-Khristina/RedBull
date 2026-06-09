import { Router } from "express";
import { rankingController } from "../controllers/rankingController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:competitionId/ranking/teams",
  asyncHandler(rankingController.teamRanking)
);

router.get(
  "/competitions/:competitionId/ranking/runners",
  asyncHandler(rankingController.runnerRanking)
);

export default router;
