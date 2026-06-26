import { Router } from "express";
import { competitionController } from "../controllers/competitionController";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

// [A1] Rota SSR — renderiza o formulário de criação (tela2)
router.get("/competitions/new", garantirAutenticacao, (_req, res) => {
  res.render("competitions/new", {
    title: "Nova Competição — Red Bull 24H",
    currentPage: "dashboard",
    pageCSS: "/css/competition-form.css"
  });
});

router.post("/competitions", garantirAutenticacao, asyncHandler(competitionController.create));
router.get("/competitions", garantirAutenticacao, asyncHandler(competitionController.findAll));
router.get("/competitions/:id", garantirAutenticacao, asyncHandler(competitionController.findById));
router.put("/competitions/:id", garantirAutenticacao, asyncHandler(competitionController.update));
router.patch("/competitions/:id", garantirAutenticacao, asyncHandler(competitionController.close));
router.patch("/competitions/:id/activate", garantirAutenticacao, asyncHandler(competitionController.activate));
router.delete("/competitions/:id", garantirAutenticacao, asyncHandler(competitionController.delete));

export default router;
