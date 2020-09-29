import { parse } from "./deps.ts";
import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser } from "./ConfigParser.ts";
import type { CacheConfig } from "./types.ts";
import { logger } from "./logger.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./configs/fullCache.json",
    host: "local"
  },
});

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const REMOTE_HOST = "http://10.26.32.45:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;

// Parse the supplied json config file to XML bodies
const config: CacheConfig = JSON.parse(Deno.readTextFileSync(args.config)) as CacheConfig;
const configParser = new ConfigParser();
const payload: string[] = configParser.parseConfig(config);

// Setup cache loader with supplied url
const cacheLoader = new CacheLoader(url, POOL_SIZE);

logger.debug("Single cache refresh started");
await cacheLoader.load(payload);
logger.debug("Single cache refresh finished");
