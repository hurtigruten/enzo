import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser } from "./ConfigParser.ts";
import { parse } from "./deps.ts";

const args = parse(Deno.args, {
  default: { 
    config: "full", 
    env: "local" 
  },
  alias: { 
    config: "cache-mode" 
  }
});

// Construct a Parser and Loader with provided config
const configParser = new ConfigParser(args.config);
const cacheLoader = new CacheLoader(args.env);

// Parse the json config to XML bodies
const payload = configParser.parseConfig();

// Execute calls to BizLogic XML API
await cacheLoader.load(payload)