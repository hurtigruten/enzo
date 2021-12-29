import { populateCache } from "./cacheCmds.ts";
import { CacheConfig } from "./types.ts";

// If the user supplies "staging" as the first parameter, use staging config
const CONFIG = (Deno.args[0] == "staging") ? "./configs/stagingCache.json" : "./configs/fullCache.json"
const config: CacheConfig = JSON.parse(Deno.readTextFileSync(CONFIG)) as CacheConfig;

populateCache(config);