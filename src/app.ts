import "dotenv/config";
import express = require("express");
import competitionRoutes from "./routes/competitionRoutes";
import teamRoutes from "./routes/teamRoutes";
import runnerRoutes from "./routes/runnerRoutes";
import adminRoutes from "./routes/adminRoutes";
import checkpointRoutes from "./routes/checkpointRoutes";
import rankingRoutes from "./routes/rankingRoutes";
import exportRoutes from "./routes/exportRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(competitionRoutes);
app.use(teamRoutes);
app.use(runnerRoutes);
app.use("/admin", adminRoutes);
app.use(checkpointRoutes);
app.use(rankingRoutes);
app.use(exportRoutes);
app.use(errorHandler);

export default app;
