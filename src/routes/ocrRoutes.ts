import multer from "multer";
import { Router } from "express";
import { ocrController } from "../controllers/ocrController";
import { asyncHandler } from "../helpers/asyncHandler";
import { getOcrUploadDir } from "../services/ocrService";
import { garantirAutenticacao } from "../middlewares/authMiddleware";

const router = Router();

const upload = multer({
  dest: getOcrUploadDir(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/ocr/extractions",
  garantirAutenticacao,
  upload.single("image"),
  asyncHandler(ocrController.createExtraction)
);

export default router;
