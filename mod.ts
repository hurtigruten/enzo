import { parse, Cron } from "./deps.ts";
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
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;

// Construct a parser and a loader
const configParser = new ConfigParser();
const cacheLoader = new CacheLoader(url, POOL_SIZE);

let cron = new Cron();
cron.start();
// Add job for Full cache refresh nightly
cron.add("5 0 * * *", async () => {
  logger.debug("Full cache refresh started");
  
  // Parse the full json config file to XML bodies
  const fullConfig: CacheConfig = JSON.parse(Deno.readTextFileSync("./configs/fullCache.json")) as CacheConfig;

  const fullPayload: string[] = configParser.parseConfig(fullConfig, CACHE_MODE);

  await cacheLoader.load(fullPayload);
});

// Add job for first Partial cache refresh
cron.add("0 11 * * *", async () => {
  logger.debug("Partial cache refresh started");
  
  // Parse the partial json config file to XML bodies
  const partialConfig: CacheConfig = JSON.parse(Deno.readTextFileSync("./configs/partialCache.json") as CacheConfig;
  const partialPayload: string[] = configParser.parseConfig(partialConfig, CACHE_MODE);

  await cacheLoader.load(partialPayload);
  logger.debug("Partial cache refresh finished");
});

// Add job for Partial cache refresh
cron.add("00 15 * * *", async () => {
  logger.debug("Partial cache refresh started");
  
  // Parse the partial json config file to XML bodies
  const partialConfig: CacheConfig = JSON.parse(Deno.readTextFileSync("./configs/partialCache.json") as CacheConfig;
  const partialPayload: string[] = configParser.parseConfig(partialConfig, CACHE_MODE);

  await cacheLoader.load(partialPayload);
  logger.debug("Partial cache refresh finished");
});