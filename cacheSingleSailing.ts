import { asyncPool } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import { parse } from "./deps.ts";
import { logger } from "./logger.ts";
import { createSeawareRequest } from "./serializeXML.ts";
import { CacheConfig, Sailing, SailingSearch } from "./types.ts";

/*
    This script allows the user to cache a single sailing (or port combination).
    It behaves in the same way as a full cache run, with the sailings filtered down to what the user requests.
    The use case is when we need to quickly cache a certain sailing, without running a full refresh.
*/

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
    default: {
    host: "local",
    config: "./configs/fullCache.json"
  },
});

if (!args.fromPort || !args.toPort) {
    logger.error(`fromPort and toPort needs to be supplied as arguments!`);
    Deno.exit(1);
}

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const REMOTE_HOST = "http://10.26.32.45:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;

// Parse the full json config file
const config: CacheConfig = JSON.parse(Deno.readTextFileSync(args.config)) as CacheConfig;

// Find requested sailing in config
const filteredSailings: Sailing[] = config.sailings.filter(function (sailing) {
    return sailing.fromPort === args.fromPort && sailing.toPort === args.toPort;
})

if (filteredSailings.length === 0) {
    logger.error(`Could not find a sailing in fullCache.json for: From port ${args.fromPort} to port ${args.toPort}`);
    Deno.exit(1);
}

// Parse the config, using only the requested sailing
config.sailings = filteredSailings;
const searches: SailingSearch[] = produceJsonSearches(config);
const payload: string[] = searches.map((search: SailingSearch) => createSeawareRequest(search));

logger.debug(`Caching single sailing on: ${url}`);
logger.debug(`Request pool size: ${POOL_SIZE}`);
logger.debug(`Searching for ${args.fromPort} to ${args.toPort}`);
logger.debug(`Search range setting ${config.searchRange}, giving ${payload.length} requests to run`);
await asyncPool(url, POOL_SIZE, payload);
logger.debug("Caching single sailing finished");