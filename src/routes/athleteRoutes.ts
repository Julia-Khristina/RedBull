import { Router } from "express";
import { athleteController } from "../controllers/athleteController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:competicaoId/teams/:teamId/athletes",
  asyncHandler(athleteController.create)
);

router.get(
  "/competitions/:competicaoId/teams/:teamId/athletes",
  asyncHandler(athleteController.list)
);

router.get(
  "/competitions/:competicaoId/teams/:teamId/athletes/:athleteId",
  asyncHandler(athleteController.findById)
);

router.put(
  "/competitions/:competicaoId/teams/:teamId/athletes/:athleteId",
  asyncHandler(athleteController.update)
);

router.delete(
  "/competitions/:competicaoId/teams/:teamId/athletes/:athleteId",
  asyncHandler(athleteController.delete)
);

export default router;
