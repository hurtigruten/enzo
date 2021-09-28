import { parse } from "./deps.ts";
//import { CacheLoader } from "./CacheLoader.ts";
import { parseToursWithDateRange, parseToursWithSpecificDates } from "./tourParser.ts";
import type { SailingSearch, TourConfig } from "./types.ts";
import { logger } from "./logger.ts";
import { createSeawareRequest, createSeawareRequestWithAllotment } from "./serializeXML.ts";

// Read arguments. Config is used to determine a full or partial run, host determines if the script is locally or remote
const args = parse(Deno.args, {
  default: {
    host: "local"
  },
});

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const REMOTE_HOST = "http://10.26.32.45:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;
const url = args.host === "remote" ? REMOTE_HOST : LOCAL_HOST;

async function http<T>(request: RequestInfo): Promise<T | undefined> {
  try {
    const response = await fetch(request);
    const body = await response.json();
    return body;
  } catch (e) {
    logger.error(`Fetch Error: ${e}`);
    Deno.exit(1);
  }
}

// Retrieve config
const tourConfig = await http<TourConfig>(
  "http://localhost:3000/tours"
) as TourConfig;

// Parse the supplied json config file to XML bodies
const searches: SailingSearch[] = parseToursWithSpecificDates(tourConfig).concat(parseToursWithDateRange(tourConfig));
console.log(searches)

// TODO: Review xml request, merge to 1 method. Handle if we cannot send empty allotmentid
const payload: string[] = searches.map((search: SailingSearch) => createSeawareRequestWithAllotment(search));

// TODO: Slack integration for logging, also for triggering single cache run?

// Setup cache loader with supplied url
//logger.debug(`Starting cache run towards ${url} with a request pool size of ${POOL_SIZE}`);
//logger.debug(`Using the ${args.config} config that has a search range of ${config.searchRange}, giving ${payload.length} requests to run`);

// Execute population of cache
//await asyncPool(url, POOL_SIZE, payload);

//logger.debug("Tour cache refresh finished");
// TODO: Slack message