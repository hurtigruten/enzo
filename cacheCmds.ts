import { cacheSeeder, cacheReader } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import { createSeawarePopulateCacheRequest, createSeawareReadCacheRequest} from "./serializeXML.ts";
import { CacheConfig, Sailing, SailingSearch } from "./types.ts";
import { postSlackMessage } from "./slack-bot/slackCmds.ts";
import { serve } from "./deps.ts";

// TODO: This relative path assumes the caller is in subfolder of the project
const FULL_CONFIG = "../configs/fullCache.json";

export function gitPull() {
  Deno.run({ cmd: ["git", "pull"] });
  postSlackMessage("Pulled latest code from master");
}

export async function populateCache(pathToConfig: string | URL) {
  // Parse the supplied json config file to XML bodies
  const config: CacheConfig = JSON.parse(
    Deno.readTextFileSync(pathToConfig)
  ) as CacheConfig;
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) => createSeawarePopulateCacheRequest(search)
  );

  postSlackMessage(`Starting to cache. ${payload.length} requests to run based on ${pathToConfig}`);
  // Execute requests
  await cacheSeeder(payload);
  postSlackMessage(`Cache run complete`);
}

export async function readCacheRun(market: string, fromPort:string, toPort:string) {
  // Parse the full json config file
  const config: CacheConfig = JSON.parse(Deno.readTextFileSync(FULL_CONFIG)) as CacheConfig;

  config.defaultMarkets = [market];
  config.defaultPartyMix = ["ADULT", "ADULT"];
  config.searchRange = 200;

  // Find requested sailing in config
  const filteredSailings: Sailing[] = config.sailings.filter(function (sailing) {
    return sailing.fromPort === fromPort && sailing.toPort === toPort;
  });

  // TODO: Filter sailings based on input
  if (filteredSailings.length === 0) {
    console.log("The requested port combination does not exist in fullCache.json")
  }

  // Parse the config, using only the requested sailing
  config.sailings = filteredSailings;
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) => createSeawareReadCacheRequest(search));

  // Execute requests
  await cacheReader(payload);
}

export async function cacheSingleSailing(fromPort: string, toPort: string) {
  // Parse the full json config file
  const config: CacheConfig = JSON.parse(Deno.readTextFileSync(FULL_CONFIG)) as CacheConfig;

  // Find requested sailing in config
  const filteredSailings: Sailing[] = config.sailings.filter(function (sailing) {
    return sailing.fromPort === fromPort && sailing.toPort === toPort;
  });

  if (filteredSailings.length === 0) {
    postSlackMessage(`Could not find a cache config for: From port ${fromPort} to port ${toPort}`);
    return;
  }

  // Parse the config, using only the requested sailing
  config.sailings = filteredSailings;
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) => createSeawarePopulateCacheRequest(search));

  postSlackMessage(`Starting to cache ${fromPort} to ${toPort}. ${payload.length} requests to run...`);
  // Execute cache run
  await cacheSeeder(payload);
  postSlackMessage(`${fromPort} to ${toPort} cached`);
}

export function whatIsCached() {
  const config: CacheConfig = JSON.parse(Deno.readTextFileSync(FULL_CONFIG));
  let response = "";
  config.sailings.map((obj) => {
    response += obj.fromPort + "-" + obj.toPort + ". ";
  });
  postSlackMessage(response);
}

export function greet(name: string) {
  postSlackMessage("Hello " + name);
}

export async function isAPIup() {
  let isUp = false;
  try {
    const response = await fetch("http://localhost:3000");
    if (response.status === 200) {
      isUp = true;
    }
  } catch (e) {
    //console.log(e)
  }
  if (isUp) {
    postSlackMessage("API is up");
  } else {
    postSlackMessage("API is down");
  }
}

export function startAPI() {
  serve(() => new Response("../configs/fullCache.json"), { port: 3000 });
}

export function help() {
  postSlackMessage(
    "Here are the words I'll respond to: \n-" +
      "`hi` or `hello` : If you want to say hello to me \n-" +
      "`help?` : If you want to view this help text \n-" +
      "`cached?` : If you want to see what is cached \n-" +
      "`statusAPI` : If you want to check that the cache API is running \n-" +
      "`startAPI` : If you want me to start the cache API (use with caution!)\n-" +
      "`gitPull` : If you want to pull the latest source code from git (use with caution!)\n-" +
      "`please cache USH to BGO` : If you include two three letter words in upper case, I will attempt to cache that particular port combination (using fromPort and toPort in the order you typed it)",
  );
}
