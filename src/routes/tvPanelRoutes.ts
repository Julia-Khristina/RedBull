import { Router } from "express";
import { tvPanelController } from "../controllers/tvPanelController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// Rota PÚBLICA — sem autenticação — alimenta o Painel TV (US19 #519).
// Segue o padrão de acesso público adotado em /public/team/:uuid (US12).
router.get(
  "/public/competitions/:id/tv-panel/metrics",
  asyncHandler(tvPanelController.metrics)
);

export default router;
