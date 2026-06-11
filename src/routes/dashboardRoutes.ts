import { Router, Request, Response } from "express";

const router = Router();

// [A1] Rota SSR — GET /dashboard — confirmada em src/routes/dashboardRoutes.ts
router.get("/dashboard", (req: Request, res: Response) => {
  res.render("dashboard/dashboard", {
    title: "Dashboard — Red Bull 24H",
    // [A1] ?created=1 é injetado pelo redirect após POST /competitions bem-sucedido
    success: req.query.created === "1",
    currentPage: "dashboard",
    pageCSS: "/css/dashboard.css"
  });
});

export default router;
