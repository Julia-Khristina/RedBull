import "dotenv/config";
import path from "path";
import express = require("express");
import competitionRoutes from "./routes/competitionRoutes";
import teamRoutes from "./routes/teamRoutes";
import runnerRoutes from "./routes/runnerRoutes";
import adminRoutes from "./routes/adminRoutes";
import checkpointRoutes from "./routes/checkpointRoutes";
import rankingRoutes from "./routes/rankingRoutes";
import exportRoutes from "./routes/exportRoutes";
import authRoutes from "./routes/authRoutes";
import reportRoutes from "./routes/reportRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import ejsLayouts from 'express-ejs-layouts';


const app = express();

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(dashboardRoutes);
app.use(competitionRoutes);
app.use(teamRoutes);
app.use(runnerRoutes);
// Register auth routes before admin routes to avoid /admin/:id collisions
app.use(authRoutes);
app.use("/admin", adminRoutes);
app.use(checkpointRoutes);
app.use(rankingRoutes);
app.use(exportRoutes);
app.use(reportRoutes);
app.use(errorHandler);

export default app;
