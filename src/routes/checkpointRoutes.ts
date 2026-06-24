import { Router } from "express";
import { checkpointController } from "../controllers/checkpointController";
import { asyncHandler } from "../helpers/asyncHandler";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

router.get(
  "/operational-panel",
  garantirAutenticacao,
  asyncHandler(checkpointController.renderOperationalPanel)
);

router.get(
  "/operational-panel/:runnerId",
  garantirAutenticacao,
  asyncHandler(checkpointController.renderOperationalPanel)
);

router.get(
  "/view/competitions/:id/teams/:teamId/checkpoints/saved",
  asyncHandler(checkpointController.renderSavedByTeam)
);

router.post("/checkpoints", garantirAutenticacao, asyncHandler(checkpointController.create));

router.post(
  "/runners/:runnerId/checkpoints",
  garantirAutenticacao,
  asyncHandler(checkpointController.createForRunner)
);

router.get("/checkpoints", garantirAutenticacao, asyncHandler(checkpointController.list));

router.get("/checkpoints/:id", garantirAutenticacao, asyncHandler(checkpointController.findById));

router.put("/checkpoints/:id", garantirAutenticacao, asyncHandler(checkpointController.update));

router.delete("/checkpoints/:id", garantirAutenticacao, asyncHandler(checkpointController.remove));

router.get(
  "/runners/:runnerId/checkpoints",
  garantirAutenticacao,
  asyncHandler(checkpointController.findByRunner)
);

router.get(
  "/competitions/:id/checkpoints/inconsistencies",
  garantirAutenticacao,
  asyncHandler(checkpointController.findInconsistenciesByCompetition)
);

router.get(
  "/competitions/:id/checkpoints",
  garantirAutenticacao,
  asyncHandler(checkpointController.findByCompetition)
);

export default router;
