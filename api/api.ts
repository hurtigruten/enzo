import { serve } from "../deps.ts";

// If the user supplies "staging" as the first parameter, use staging config
const CONFIG = (Deno.args[0] == "staging") ? "../configs/stagingCache.json" : "../configs/fullCache.json"

serve(() => new Response(Deno.readTextFileSync(CONFIG)), { addr: ":3000" });