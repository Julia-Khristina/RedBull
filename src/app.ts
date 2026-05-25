import express = require("express");
import competitionRoutes from "./routes/competitionRoutes";
import teamRoutes from "./routes/teamRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(competitionRoutes);
app.use(teamRoutes);
app.use(errorHandler);

export default app;
