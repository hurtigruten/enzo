import { parse } from "./deps.ts";
//import { CacheLoader } from "./CacheLoader.ts";
import { parseToursWithDateRange, parseToursWithSpecificDates } from "./tourParser.ts";
import type { CacheConfig, SailingSearch, TourConfig } from "./types.ts";
import { logger } from "./logger.ts";

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
  }
}

const tourConfig = await http<TourConfig>(
  "http://localhost:3000/tours"
) as TourConfig;

//const payload: string[] = tourConfigParser.produceJsonSearches(tourConfig);
const searches: SailingSearch[] = parseToursWithSpecificDates(tourConfig).concat(parseToursWithDateRange(tourConfig));
console.log(searches)
