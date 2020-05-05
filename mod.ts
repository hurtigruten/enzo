import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser, CacheConfig } from "./ConfigParser.ts";
import { parse, readJsonSync } from "./deps.ts";

// Read CLI arguments. Config is used to determine a full or partial run, env determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./cacheConfig.json",
    host: "remote",
  },
});

const json: CacheConfig = readJsonSync(args.config) as CacheConfig;

// Construct a Parser and Loader with provided config
const configParser = new ConfigParser(json);
const cacheLoader = new CacheLoader(args.env);

// Parse the json config to XML bodies
const payload: string[] = configParser.parseConfig();

// Execute calls to BizLogic XML API
await cacheLoader.load(payload);