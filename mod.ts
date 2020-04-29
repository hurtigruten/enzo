import { CacheLoader } from "./CacheLoader.ts";
import { ConfigParser } from "./ConfigParser.ts";
import { parse } from "./deps.ts";

const args = parse(Deno.args, {
  default: { config: "full", env: "local" },
  alias: { config: "cache-mode" }
});

const configParser = new ConfigParser(args.config);
const payload = configParser.parseConfig();
const cacheLoader = new CacheLoader(payload, args.env);

await cacheLoader.load()