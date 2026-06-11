import { Router } from "express";
import { adminController } from "../controllers/adminController";

const router = Router();

router.get("/", adminController.findAll);
router.get("/:id", adminController.findById);
router.post("/", adminController.create);
router.put("/:id", adminController.update);
router.delete("/:id", adminController.delete);

export default router;
