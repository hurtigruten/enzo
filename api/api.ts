import { Application } from "https://deno.land/x/abc@v1.1.0/mod.ts";
import { getCacheConfig, getAllSailings, getSailing, createSailing, deleteSailing } from "./sailingController.ts";

const app = new Application();

// routes
app
  .get("/", getCacheConfig)
  .get("/sailings", getAllSailings)
  .get("/sailings/:id", getSailing)
  .post("/sailings/", createSailing)
  .delete("sailings/:id", deleteSailing)

// listen to port
app.start({ port: 3000 });
