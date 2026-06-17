import fs from "fs/promises";
import { Request, Response } from "express";
import {
  extractMetricsFromImage,
  persistUploadedImage,
} from "../services/ocrService";
import { ValidationError } from "../errors/AppError";

export const ocrController = {
  async createExtraction(req: Request, res: Response): Promise<void> {
    const uploaded = req.file;

    if (!uploaded) {
      throw new ValidationError("Envie uma imagem no campo image.");
    }

    try {
      const persisted = await persistUploadedImage(uploaded);
      const result = await extractMetricsFromImage(
        persisted.imagePath,
        persisted.previewUrl,
        uploaded.originalname
      );
      res.status(201).json(result);
    } catch (error) {
      await fs.rm(uploaded.path, { force: true }).catch(() => undefined);
      throw error;
    }
  },
};
