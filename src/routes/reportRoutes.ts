import { Router } from "express";
import { reportController } from "../controllers/reportController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/competitions/:id/reports",
  asyncHandler(reportController.generateCompetitionReport)
);

export default router;
