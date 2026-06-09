import { Router } from "express";
import { exportController } from "../controllers/exportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:competitionId/export",
  asyncHandler(exportController.exportCompetition)
);

export default router;
