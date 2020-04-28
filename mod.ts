import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser } from "./ConfigParser.ts";
import { parse } from "./deps.ts";

const args = parse(Deno.args, {
  default: { config: "full" },
  alias: { config: "cache-mode" }
});

const configParser = new ConfigParser(args.config);
const payload = configParser.parseConfig();

console.log("Number of searches: " + payload.length);

const cacheLoader = new CacheLoader(payload, true);

//await cacheLoader.load()



