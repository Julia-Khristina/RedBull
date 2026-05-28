import { Router } from "express";
import { checkpointController } from "../controllers/checkpointController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// RF05 — Registrar checkpoint de corredor
router.post("/checkpoints", asyncHandler(checkpointController.create));

// RF06 — Listar todos os checkpoints
router.get("/checkpoints", asyncHandler(checkpointController.list));

// RF07 — Buscar checkpoint por ID
router.get("/checkpoints/:id", asyncHandler(checkpointController.findById));

// RF08 — Atualizar checkpoint
router.put("/checkpoints/:id", asyncHandler(checkpointController.update));

// RF09 — Remover checkpoint
router.delete("/checkpoints/:id", asyncHandler(checkpointController.remove));

// RF06 — Listar checkpoints por corredor
router.get(
  "/corredores/:corredorId/checkpoints",
    asyncHandler(checkpointController.findByCorredor)
    );

    // RF06 — Listar checkpoints por competição
    router.get(
      "/competitions/:competicaoId/checkpoints",
        asyncHandler(checkpointController.findByCompeticao)
        );

        export default router;