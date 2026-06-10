import { Router } from "express";
import { exportController } from "../controllers/exportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:id/export",
  asyncHandler(exportController.exportCompetition)
);

export default router;
