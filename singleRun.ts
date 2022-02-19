import { populateCache } from "./cacheCmds.ts";

if (Deno.args[0] == "staging") {
    populateCache("./configs/stagingCache.json");
} else {
    populateCache();
}