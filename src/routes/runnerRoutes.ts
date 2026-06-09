import { Router } from "express";
import { runnerController } from "../controllers/runnerController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:competitionId/teams/:teamId/runners",
  asyncHandler(runnerController.create)
);

router.get(
  "/competitions/:competitionId/teams/:teamId/runners",
  asyncHandler(runnerController.list)
);

router.get(
  "/competitions/:competitionId/teams/:teamId/runners/:runnerId",
  asyncHandler(runnerController.findById)
);

router.put(
  "/competitions/:competitionId/teams/:teamId/runners/:runnerId",
  asyncHandler(runnerController.update)
);

router.delete(
  "/competitions/:competitionId/teams/:teamId/runners/:runnerId",
  asyncHandler(runnerController.delete)
);

export default router;
