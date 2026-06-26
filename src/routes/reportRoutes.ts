import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/reports",
  garantirAutenticacao,
  asyncHandler(reportController.renderActiveReports)
);

router.get(
  "/view/competitions/:id/reports",
  asyncHandler(reportController.renderReports)
);

router.get(
  "/competitions/:id/reports",
  garantirAutenticacao,
  asyncHandler(reportController.generateCompetitionReport)
);

export default router;
