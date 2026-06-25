import { Router } from "express";
import { tvPanelController } from "../controllers/tvPanelController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// Rotas PÚBLICAS — sem autenticação — alimentam o Painel TV (US19 #519).
// Seguem o padrão de acesso público adotado em /public/team/:uuid (US12).

// SSR — renderiza a view do Painel TV.
router.get(
  "/public/competitions/:id/tv-panel",
  asyncHandler(tvPanelController.renderTvPanel)
);

// API JSON — consumida pelo polling do client a cada 10 segundos.
router.get(
  "/public/competitions/:id/tv-panel/metrics",
  asyncHandler(tvPanelController.metrics)
);

export default router;
