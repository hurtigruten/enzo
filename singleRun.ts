import { fullRun } from "./cacheCmds.ts";

// If the user supplies "staging" as the first parameter, use staging config
const CONFIG = (Deno.args[0] == "staging") ? "./configs/stagingCache.json" : "./configs/fullCache.json"

await fullRun(CONFIG);