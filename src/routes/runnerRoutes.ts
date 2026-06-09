import { Router } from "express";
import { runnerController } from "../controllers/runnerController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:id/teams/:teamId/runners",
  asyncHandler(runnerController.create)
);

router.get(
  "/competitions/:id/teams/:teamId/runners",
  asyncHandler(runnerController.list)
);

router.get(
  "/competitions/:id/teams/:teamId/runners/:runnerId",
  asyncHandler(runnerController.findById)
);

router.put(
  "/competitions/:id/teams/:teamId/runners/:runnerId",
  asyncHandler(runnerController.update)
);

router.delete(
  "/competitions/:id/teams/:teamId/runners/:runnerId",
  asyncHandler(runnerController.delete)
);

export default router;
