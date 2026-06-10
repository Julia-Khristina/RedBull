import { Router } from "express";
import { rankingController } from "../controllers/rankingController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:id/ranking/teams",
  asyncHandler(rankingController.teamRanking)
);

router.get(
  "/competitions/:id/ranking/runners",
  asyncHandler(rankingController.runnerRanking)
);

export default router;
