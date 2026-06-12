import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/reports",
  asyncHandler(reportController.renderActiveReports)
);

router.get(
  "/view/competitions/:id/reports",
  asyncHandler(reportController.renderReports)
);

router.get(
  "/competitions/:id/reports",
  asyncHandler(reportController.generateCompetitionReport)
);

export default router;
