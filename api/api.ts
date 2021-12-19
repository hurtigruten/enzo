import { serve } from "../deps.ts";
import { readCacheRun } from "../cacheCmds.ts"

// If the user supplies "staging" as the first parameter, use staging config
const CONFIG = (Deno.args[0] == "staging")
  ? "../configs/stagingCache.json"
  : "../configs/fullCache.json";

serve((_req: Request) => handleRequest(_req), { port: 3000 });

function handleRequest(_req: Request) {
  const url = new URL(_req.url);
  if (url.pathname !== "/") {
    return new Response("")
  }
  if (url.search === "") {
    return new Response(Deno.readTextFileSync(CONFIG));
  }
  let result: string [] = ["No results in cache"];
  const market = url.searchParams.get('market');
  const fromPort = url.searchParams.get('fromPort');
  const toPort = url.searchParams.get('toPort');
  if (market && fromPort && toPort) {
    result = readCacheRun(market, fromPort, toPort)
  }
  return new Response(result.join());
}
