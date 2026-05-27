import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:competicaoId/teams",
  asyncHandler(teamController.create)
);

router.get(
  "/competitions/:competicaoId/teams",
  asyncHandler(teamController.list)
);

router.get(
  "/competitions/:competicaoId/teams/:teamId",
  asyncHandler(teamController.findById)
);

router.put(
  "/competitions/:competicaoId/teams/:teamId",
  asyncHandler(teamController.update)
);

router.delete(
  "/competitions/:competicaoId/teams/:teamId",
  asyncHandler(teamController.delete)
);

export default router;
