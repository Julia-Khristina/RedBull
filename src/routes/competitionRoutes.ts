import { Router } from "express";
import { competitionController } from "../controllers/competitionController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post("/competitions", asyncHandler(competitionController.create));

export default router;
