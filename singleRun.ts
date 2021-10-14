import { parse } from "./deps.ts";
import { asyncPool } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import type { CacheConfig, SailingSearch } from "./types.ts";
import { createSeawareRequest } from "./serializeXML.ts";
import { postSlackMessage } from "./slack-bot/postToSlack.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./configs/fullCache.json",
    host: "local",
  },
});

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const REMOTE_HOST = "http://10.26.32.45:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;

// Parse the supplied json config file to XML bodies
const config: CacheConfig = JSON.parse(Deno.readTextFileSync(args.config)) as CacheConfig;
const searches: SailingSearch[] = produceJsonSearches(config);
const payload: string[] = searches.map((search: SailingSearch) => createSeawareRequest(search));

// Timer
const startTime: Date = new Date();

// Execute population of cache
postSlackMessage(`Using the ${args.config} config that has a search range of ${config.searchRange}, giving ${payload.length} requests to run`);
await asyncPool(url, POOL_SIZE, payload);

const endTime: Date = new Date();  
const timeDiff: number = endTime.getTime() - startTime.getTime();
const minutes = Math.round(timeDiff / 1000 / 60);

postSlackMessage(`Cache run complete, using config: ${args.config}. Run time: ${minutes} minutes`);