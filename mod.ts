import { parse, readJsonSync } from "./deps.ts";
import { LOCAL_HOST, REMOTE_HOST, PORT, URL, POOL_SIZE, CACHE_MODE } from "./config.ts"
import { CacheLoader } from "./services/CacheLoader.ts";
import { ConfigParser } from "./services/ConfigParser.ts";
import { CacheConfig } from "./models/models.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./configs/fullCache.json",
    host: "local",
  },
});

// Parse the supplied json config file to XML bodies
const config: CacheConfig = readJsonSync(args.config) as CacheConfig;
const configParser = new ConfigParser(config, CACHE_MODE);
const payload: string[] = configParser.parseConfig();

// Execute calls to BizLogic XML API
const url = (args.host === 'remote') ? `${REMOTE_HOST}:${PORT}${URL}` : `${LOCAL_HOST}:${PORT}${URL}`
const cacheLoader = new CacheLoader(url, POOL_SIZE);
await cacheLoader.load(payload);