import { Router } from "express";
import { checkpointController } from "../controllers/checkpointController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post("/checkpoints", asyncHandler(checkpointController.create));

router.get("/checkpoints", asyncHandler(checkpointController.list));

router.get("/checkpoints/:id", asyncHandler(checkpointController.findById));

router.put("/checkpoints/:id", asyncHandler(checkpointController.update));

router.delete("/checkpoints/:id", asyncHandler(checkpointController.remove));

router.get(
  "/runners/:runnerId/checkpoints",
  asyncHandler(checkpointController.findByRunner)
);

router.get(
  "/competitions/:competitionId/checkpoints",
  asyncHandler(checkpointController.findByCompetition)
);

export default router;
