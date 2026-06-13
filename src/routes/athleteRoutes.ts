import { Router } from "express";
import { runnerController } from "../controllers/runnerController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:id/teams/:teamId/athletes",
  asyncHandler(runnerController.create)
);

router.get(
  "/competitions/:id/teams/:teamId/athletes",
  asyncHandler(runnerController.list)
);

router.get(
  "/competitions/:id/teams/:teamId/athletes/:runnerId",
  asyncHandler(runnerController.findById)
);

router.put(
  "/competitions/:id/teams/:teamId/athletes/:runnerId",
  asyncHandler(runnerController.update)
);

router.delete(
  "/competitions/:id/teams/:teamId/athletes/:runnerId",
  asyncHandler(runnerController.delete)
);

export default router;
