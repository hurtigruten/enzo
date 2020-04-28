import cacheConfigDev from "./samples/sampleCacheConfig.json";
import cacheConfig from "./cacheConfig.json";
import cacheConfigPartial from "./cacheConfigPartial.json";
import { buildXMLBody } from "./xmlSerializer.ts";

interface cacheConfig {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchDayRange: number;
  sailings: sailing[];
}
interface sailing {
  voyageType: string;
  direction?: string;
  daysAhead?: number;
  fromPort: string;
  toPort: string;
  partyMixes: string[];
  marketFilter?: string[];
}
export interface JsonSearch {
  fromDay: string;
  toDay: string;
  voyageType: string;
  voyageCode: string;
  party: string;
  market: string;
}

export class ConfigParser {
  private _config: cacheConfig;
  
  constructor (config: string) {
    this._config = (config === "partial") ? cacheConfigPartial : cacheConfig;
  }

  parseConfig(): string[] {
    const searches: JsonSearch[] = produceJsonSearches(this._config);
    return searches.map((search: JsonSearch) => buildXMLBody(search))
  }
}

function produceJsonSearches(config: cacheConfig): JsonSearch[] {

    // Flatten out partymixes, and mixin markets
  let flatParty = config.sailings.flatMap((sailing) => {
    return sailing.partyMixes.map((party: string) => ({
      voyageType: sailing.voyageType,
      daysAhead: sailing.daysAhead || config.defaultDaysAhead,
      voyageCode: sailing.fromPort + "-" + sailing.toPort,
      party,
      markets: sailing.marketFilter || config.defaultMarkets
    }));
  });

  // Flatten out markets and mixin pages
  let flatMarket = flatParty.flatMap((sailing) => {
    return sailing.markets.map((market: string) => ({
      voyageType: sailing.voyageType,
      daysAhead: sailing.daysAhead,
      voyageCode: sailing.voyageCode,
      market,
      party: sailing.party,
      pages : Array.from(Array(Math.ceil(sailing.daysAhead / config.searchDayRange)).keys()),
     }));
  });

  // Flatten out pages and transform to date
  return flatMarket.flatMap((sailing) => {
    return sailing.pages.map((page: number) => ({
      fromDay: dateFromToday(page * config.searchDayRange),
      toDay: dateFromToday(Math.min(page * config.searchDayRange + config.searchDayRange - 1, sailing.daysAhead - 1)),
      voyageType: sailing.voyageType,
      voyageCode: sailing.voyageCode,
      party: sailing.party,
      market: sailing.market,
    }));
  });
}

function dateFromToday(daysAhead: number) {
  let date = new Date();
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString().split("T")[0];
}