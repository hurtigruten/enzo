import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser, CacheConfig } from "./ConfigParser.ts";
import { parse } from "./deps.ts";

// Read CLI arguments. Config is used to determine a full or partial run, env determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    config: "./cacheConfig.json",
    env: "local",
  },
  alias: {
    //config: "cache-mode",
  },
});

// Construct a Parser and Loader with provided config
const configParser = new ConfigParser(readJsonSync(args.config));
const cacheLoader = new CacheLoader(args.env);

// Parse the json config to XML bodies
const payload = configParser.parseConfig();

// Execute calls to BizLogic XML API
await cacheLoader.load(payload);


// Reads a JSON file and then parses it into an object (should import from https://deno.land/std/fs/mod.ts when stable)
export function readJsonSync(filePath: string): CacheConfig {
  const decoder = new TextDecoder("utf-8");
  const content = decoder.decode(Deno.readFileSync(filePath));

  try {
    return JSON.parse(content);
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}