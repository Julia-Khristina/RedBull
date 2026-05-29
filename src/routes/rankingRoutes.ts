import { Router } from "express";
import { rankingController } from "../controllers/rankingController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:competicaoId/ranking/teams",
  asyncHandler(rankingController.rankingEquipes)
);

router.get(
  "/competitions/:competicaoId/ranking/athletes",
  asyncHandler(rankingController.rankingCorredores)
);

export default router;
