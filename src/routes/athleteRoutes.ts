import { Router } from "express";
import { runnerController } from "../controllers/runnerController";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/competitions/:id/teams/:teamId/athletes",
  garantirAutenticacao,
  asyncHandler(runnerController.create)
);

router.get(
  "/competitions/:id/teams/:teamId/athletes",
  garantirAutenticacao,
  asyncHandler(runnerController.list)
);

router.get(
  "/competitions/:id/teams/:teamId/athletes/:runnerId",
  garantirAutenticacao,
  asyncHandler(runnerController.findById)
);

router.put(
  "/competitions/:id/teams/:teamId/athletes/:runnerId",
  garantirAutenticacao,
  asyncHandler(runnerController.update)
);

router.delete(
  "/competitions/:id/teams/:teamId/athletes/:runnerId",
  garantirAutenticacao,
  asyncHandler(runnerController.delete)
);

export default router;
