import { AppController } from "./controllers/AppController.js";

const app = new AppController(document.querySelector("#app"));
app.init();
