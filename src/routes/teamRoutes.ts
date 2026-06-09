import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post(
  "/competitions/:id/teams",
  asyncHandler(teamController.create)
);

router.get(
  "/competitions/:id/teams",
  asyncHandler(teamController.list)
);

router.get(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.findById)
);

router.put(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.update)
);

router.delete(
  "/competitions/:id/teams/:teamId",
  asyncHandler(teamController.delete)
);

export default router;
