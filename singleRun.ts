import { parse, readJsonSync, Cron } from "./deps.ts";
import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser, CacheConfig } from "./ConfigParser.ts";

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
const CACHE_MODE = "ForcePopulateCacheOnly";

// Parse the supplied json config file to XML bodies
const config: CacheConfig = readJsonSync(args.config) as CacheConfig;
const configParser = new ConfigParser(config, CACHE_MODE);
const payload: string[] = configParser.parseConfig();

// Setup cache loader with supplied url
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;
const cacheLoader = new CacheLoader(url, POOL_SIZE);

await cacheLoader.load(payload);
