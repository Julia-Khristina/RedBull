import { Router } from "express";
import { checkpointController } from "../controllers/checkpointController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.get(
  "/operational-panel",
  asyncHandler(checkpointController.renderOperationalPanel)
);

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
  "/competitions/:id/checkpoints",
  asyncHandler(checkpointController.findByCompetition)
);

router.get(
  "/competitions/:id/checkpoints/inconsistencies",
  asyncHandler(checkpointController.findInconsistenciesByCompetition)
);

export default router;
