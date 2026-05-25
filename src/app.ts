import express = require("express");
import competitionRoutes from "./routes/competitionRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(competitionRoutes);
app.use(errorHandler);

export default app;
