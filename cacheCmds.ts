import { requestRunner } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import { createSeawarePopulateCacheRequest, createSeawareReadCacheRequest} from "./serializeXML.ts";
import { CacheConfig, CachedSail, Sailing, SailingSearch } from "./types.ts";
import { postSlackMessage } from "./slack-bot/slackCmds.ts";
import { serve } from "./deps.ts";

// TODO: This relative path assumes the caller is in subfolder of the project
const FULL_CONFIG = "../configs/fullCache.json";

export function gitPull() {
  Deno.run({ cmd: ["git", "pull"] });
  postSlackMessage("Pulled latest code from master");
}

export async function populateCache(config: CacheConfig) {
  // Transform the supplied config to Seaware XML requests
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) => createSeawarePopulateCacheRequest(search)
  );

  postSlackMessage(`Starting to cache. ${payload.length} requests to run`);
  // Execute requests
  await requestRunner(payload, 15);
  postSlackMessage(`Cache run complete`);
}

export async function readCache(market: string, fromPort:string, toPort:string) {
  const config: CacheConfig = {
    defaultMarkets: ["UK"],
    defaultDaysAhead: 500,
    searchRange: 20,
    defaultDirection: "North",
    defaultPartyMix: ["ADULT,ADULT"],
    sailings: [{
      "fromPort": fromPort,
      "toPort": toPort,
      "voyageType": "EXPLORER"
    }]
  }
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) => createSeawareReadCacheRequest(search));
  const result = await requestRunner(payload, 5);
  return prettyPrintGetAvailability(result);
}

function prettyPrintGetAvailability(xmlArray: (string | undefined)[]): string {
  const filteredXmls: string[] = xmlArray.filter(xml => xml !== undefined && xml.includes("<Sail>")) as string[];
  const result = filteredXmls.map((xml) => {
      const sail = xml.split("</Sail>")[0].split("<Sail>")[1];
      const ship = sail.split("</Ship>")[0].split("<Ship>")[1];
      const from = sail.split("</From>")[0].split("<From>")[1];
      const to = sail.split("</To>")[0].split("<To>")[1];
      const fromPort = from.split("</Port>")[0].split("<Port>")[1];
      const toPort = to.split("</Port>")[0].split("<Port>")[1];
      const fromDate = from.split("</DateTime>")[0].split("<DateTime>")[1].split("T")[0];
      const toDate = to.split("</DateTime>")[0].split("<DateTime>")[1].split("T")[0];
      const cachedSailing: CachedSail = {
        ship: ship,
        fromPort: fromPort,
        toPort: toPort,
        fromDate: fromDate,
        toDate: toDate,
      }
      return cachedSailing
    });
  return JSON.stringify(result);
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
  await requestRunner(payload, 5);
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
