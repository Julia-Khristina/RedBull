import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get("/reports", asyncHandler(reportController.redirectToAvailableReport));

// [A1][D1] Rota SSR documentada no agent.md Secao 11: GET /view/competitions/:id/reports
router.get(
  "/view/competitions/:id/reports",
  asyncHandler(reportController.renderReports)
);

router.get(
  "/competitions/:id/reports",
  asyncHandler(reportController.generateCompetitionReport)
);

export default router;
