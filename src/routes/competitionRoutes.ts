import { Router } from "express";
import { competitionController } from "../controllers/competitionController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// [A1] Rota SSR — renderiza o formulário de criação (tela2)
router.get("/competitions/new", (_req, res) => {
  res.render("competitions/new", {
    title: "Nova Competição — Red Bull 24H",
    currentPage: "dashboard",
    pageCSS: "/css/competition-form.css"
  });
});

router.post("/competitions", asyncHandler(competitionController.create));
router.get("/competitions", asyncHandler(competitionController.findAll));
router.get("/competitions/:id", asyncHandler(competitionController.findById));
router.put("/competitions/:id", asyncHandler(competitionController.update));
router.patch("/competitions/:id", asyncHandler(competitionController.close));
router.delete("/competitions/:id", asyncHandler(competitionController.delete));

export default router;
