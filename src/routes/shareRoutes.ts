import { Router } from "express";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";
import { shareController } from "../controllers/shareController";

const router = Router();

// Admin routes (protected)
router.get(
  "/competitions/:id/share",
  garantirAutenticacao,
  asyncHandler(shareController.renderSharePage)
);

router.get(
  "/competitions/:id/share/template/:type",
  garantirAutenticacao,
  asyncHandler(shareController.renderTemplate)
);

// Public route for sharing templates (accessible from /public/team/:uuid)
router.get(
  "/public/competitions/:id/share/template/:type",
  asyncHandler(shareController.renderTemplate)
);

export default router;
