import { parse, readJsonSync, Cron } from "./deps.ts";
import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser, CacheConfig } from "./ConfigParser.ts";
import { logger } from "./logger.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    host: "local"
  },
});

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const REMOTE_HOST = "http://10.26.32.45:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const CACHE_MODE = "ForcePopulateCacheOnly";

// Parse the full json config file to XML bodies
const fullConfig: CacheConfig = readJsonSync("./configs/fullCache.json") as CacheConfig;
const fullConfigParser = new ConfigParser(fullConfig, CACHE_MODE);
const fullPayload: string[] = fullConfigParser.parseConfig();

// Parse the partial json config file to XML bodies
const partialConfig: CacheConfig = readJsonSync("./configs/partialCache.json") as CacheConfig;
const partialConfigParser = new ConfigParser(partialConfig, CACHE_MODE);
const partialPayload: string[] = partialConfigParser.parseConfig();

// Setup cache loader with supplied url
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;
const cacheLoader = new CacheLoader(url, POOL_SIZE);

let cron = new Cron();
cron.start();
// Full cache refresh nightly
cron.add("5 0 * * *", async () => {
  logger.debug("Full cache refresh started");
  await cacheLoader.load(fullPayload);
});

// Partial cache refresh
cron.add("0 11 * * *", async () => {
  logger.debug("Partial cache refresh started");
  await cacheLoader.load(partialPayload);
});

// Partial cache refresh
cron.add("30 15 * * *", async () => {
  logger.debug("Partial cache refresh started");
  await cacheLoader.load(partialPayload);
});
