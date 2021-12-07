import { serve } from "../deps.ts";

const CONFIG = "../configs/fullCache.json";

serve(() => new Response(Deno.readTextFileSync(CONFIG)), { addr: ":3000" });