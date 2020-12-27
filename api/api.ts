import { Application } from "../deps.ts";
import { getCacheConfig, getAllSailings, getTourConfig } from "./sailingController.ts";

const app = new Application();

// routes
app
  .get("/", getCacheConfig)
  .get("/sailings", getAllSailings)
  .get("/tours", getTourConfig)
  //.get("/sailings/:id", getSailing)
  //.post("/sailings/", createSailing)
  //.delete("sailings/:id", deleteSailing)

// listen to port
app.start({ port: 3000 });
