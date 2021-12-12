//import { CacheLoader } from "./CacheLoader.ts";
import { parseToursWithDateRange, parseToursWithSpecificDates } from "./tourParser.ts";
import type { SailingSearch, TourConfig } from "./types.ts";
import { createSeawarePopulateCacheRequest, createSeawareRequestWithAllotment } from "./serializeXML.ts";

// Config
const LOCAL_HOST = "http://localhost:8085/SwBizLogic/Service.svc/ProcessRequest";
const POOL_SIZE = 15;

async function http<T>(request: RequestInfo): Promise<T | undefined> {
  try {
    const response = await fetch(request);
    const body = await response.json();
    return body;
  } catch (e) {
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

// Execute population of cache
//await populateCacheRunner(payload);
