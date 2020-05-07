import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser } from "./ConfigParser.ts";
import { CacheConfig } from './models/models.ts';
import { parse, readJsonSync } from "./deps.ts";

// Read CLI arguments. Config is used to determine a full or partial run, env determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./cacheConfig.json",
    host: "remote",
  },
});

// Construct a Parser and Loader based on args
const config: CacheConfig = readJsonSync(args.config) as CacheConfig;
const configParser = new ConfigParser(config);
const cacheLoader = new CacheLoader(args.env);

// Parse the json config to XML bodies
const payload: string[] = configParser.parseConfig();

// Execute calls to BizLogic XML API
await cacheLoader.load(payload);