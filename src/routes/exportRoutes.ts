import { Router } from "express";
import { exportController } from "../controllers/exportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:competicaoId/export",
  asyncHandler(exportController.exportCompetition)
);

export default router;
