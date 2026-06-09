import { Router } from "express";
import { authController } from "../controllers/authController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

router.post("/auth/sessions", asyncHandler(authController.createSession));

export default router;
