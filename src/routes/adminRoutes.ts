import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

router.use(garantirAutenticacao);

router.get("/", adminController.findAll);
router.get("/:id", adminController.findById);
router.post("/", adminController.create);
router.put("/:id", adminController.update);
router.delete("/:id", adminController.delete);

export default router;
