import { asyncPool } from "./seawareLoader.ts";
import { produceJsonSearches } from "./sailingsParser.ts";
import { createSeawareRequest } from "./serializeXML.ts";
import { CacheConfig, Sailing, SailingSearch } from "./types.ts";
import { postSlackMessage } from "./slack-bot/slackCmds.ts";
import { serve } from "./deps.ts";

// Config
const LOCAL_HOST =
  "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const FULL_CONFIG = "../configs/fullCache.json";

export async function fullRun(pathToConfig: string | URL) {
  // Parse the supplied json config file to XML bodies
  const config: CacheConfig = JSON.parse(
    Deno.readTextFileSync(pathToConfig),
  ) as CacheConfig;
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) =>
    createSeawareRequest(search)
  );

  postSlackMessage(`Starting to cache. ${payload.length} requests to run.`);

  // Execute population of cache
  await asyncPool(LOCAL_HOST, POOL_SIZE, payload);
}

export async function cacheSingleSailing(fromPort: string, toPort: string) {
  // Parse the full json config file
  const config: CacheConfig = JSON.parse(
    Deno.readTextFileSync(FULL_CONFIG),
  ) as CacheConfig;

  // Find requested sailing in config
  const filteredSailings: Sailing[] = config.sailings.filter(function (
    sailing,
  ) {
    return sailing.fromPort === fromPort && sailing.toPort === toPort;
  });

  if (filteredSailings.length === 0) {
    postSlackMessage(
      `Could not find a cache config for: From port ${fromPort} to port ${toPort}`,
    );
    return;
  }

  // Parse the config, using only the requested sailing
  config.sailings = filteredSailings;
  const searches: SailingSearch[] = produceJsonSearches(config);
  const payload: string[] = searches.map((search: SailingSearch) =>
    createSeawareRequest(search)
  );

  postSlackMessage(
    `Searching for ${fromPort} to ${toPort}. ${payload.length} requests to run`,
  );

  // Execute cache run
  await asyncPool(LOCAL_HOST, POOL_SIZE, payload);

  postSlackMessage(`Cache run complete`);
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
  serve((_req) => new Response("../configs/fullCache.json"), { addr: ":3000" });
}

export function help() {
  postSlackMessage(
    "Here are the words I'll respond to: \n-" +
      "`hi` or `hello` : If you want to say hello to me \n-" +
      "`help?` : If you want to view this help text \n-" +
      "`cached?` : If you want to see what is cached \n-" +
      "`statusAPI` : If you want to check that the cache API is running \n-" +
      "`startAPI` : If you want me to start the cache API\n-" +
      "`please cache USH to BGO` : If you include two three letter words in upper case, I will attempt to cache that particular port combination (using fromPort and toPort in the order you typed it)",
  );
}
