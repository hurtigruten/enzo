import { listenAndServe } from "../deps.ts";

listenAndServe(":3000", () => new Response(Deno.readTextFileSync("../configs/fullCache.json")));