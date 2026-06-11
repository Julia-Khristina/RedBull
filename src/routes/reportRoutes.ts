import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:id/reports",
  asyncHandler(reportController.generateCompetitionReport)
);

router.get(
  "/view/competitions/:id/reports",
  asyncHandler(reportController.renderReports)
);

export default router;