import { Router } from "express";
import { administradorController } from "../controllers/administradorController";

const router = Router();

router.get("/", administradorController.listar);
router.get("/:id", administradorController.buscarPorId);
router.post("/", administradorController.criar);
router.put("/:id", administradorController.atualizar);
router.delete("/:id", administradorController.excluir);

export default router;
