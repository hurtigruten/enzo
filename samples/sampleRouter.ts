import { Application, Router } from "https://deno.land/x/oak/mod.ts";

import Ports from "../ports.json";

const router = new Router();

router.get("/", context => {
  context.response.body = Ports.name;
  console.log(Ports)
});

router.post("/", context => {
  context.response.body = "You have made a POST request!";
  console.log("Post request was made")
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen({ port: 5000 });

console.log("Listening on http://localhost:5000/");