import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.render("dashboard/dashboard");
});

export default router;
