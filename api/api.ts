import { listenAndServe } from "../deps.ts";
import { CacheConfig } from "../types.ts";

const config: CacheConfig = JSON.parse(Deno.readTextFileSync("../configs/fullCache.json"));

listenAndServe(":3000", (req:Request) => new Response(requestHandler(req)));

function requestHandler(req: Request): string {
    if (req.url === "http://localhost:3000/sailings") {
      return JSON.stringify(config.sailings);
    }
    if (req.url === "http://localhost:3000/") { 
      return JSON.stringify(config);
  }
  return "Invalid request"
}