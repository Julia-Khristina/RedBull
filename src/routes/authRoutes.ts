import { Router } from "express";
import { authController } from "../controllers/authController";
import { asyncHandler } from "../helpers/asyncHandler";

const router = Router();

// Keep existing API route
router.post("/auth/sessions", asyncHandler(authController.createSession));

// Compatibility: front-end expects POST /admin/login, keep this endpoint
router.post("/admin/login", asyncHandler(authController.createSession));

// Render login view
router.get("/admin/login", (req, res) => {
  res.render("auth/login", { title: "Login", layout: false });
});

// Logout and redirect to login page
router.get("/logout", (req, res) => {
  res.redirect("/admin/login");
});

export default router;
