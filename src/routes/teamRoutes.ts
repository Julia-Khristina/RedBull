import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:competitionId/teams",
  asyncHandler(teamController.create)
);

router.get(
  "/competitions/:competitionId/teams",
  asyncHandler(teamController.list)
);

router.get(
  "/competitions/:competitionId/teams/:teamId",
  asyncHandler(teamController.findById)
);

router.put(
  "/competitions/:competitionId/teams/:teamId",
  asyncHandler(teamController.update)
);

router.delete(
  "/competitions/:competitionId/teams/:teamId",
  asyncHandler(teamController.delete)
);

export default router;
