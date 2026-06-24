import { Router } from "express";
import { exportController } from "../controllers/exportController";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/competitions/:id/export",
  garantirAutenticacao,
  asyncHandler(exportController.exportCompetition)
);

export default router;
