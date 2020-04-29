import cacheConfigDev from "./samples/sampleCacheConfig.json";
import cacheConfig from "./cacheConfig.json";
import cacheConfigPartial from "./cacheConfigPartial.json";
import { buildXMLBody } from "./xmlSerializer.ts";

interface cacheConfig {
  defaultMarkets: string[];
  defaultDaysAhead: number;
  searchDayRange: number;
  defaultDirection: string;
  defaultPartyMix: string[];
  sailings: any[];
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

  constructor(config: string) {
    //this._config = config === "partial" ? cacheConfigPartial : cacheConfig;
    this._config = cacheConfigDev;
  }

  parseConfig(): string[] {
    const searches: JsonSearch[] = this.produceJsonSearches(this._config);
    return searches.map((search: JsonSearch) => buildXMLBody(search));
  }

  private produceJsonSearches(config: cacheConfig): JsonSearch[] {
    // Flatten out partymixes, and mixin markets
    let flatParty = config.sailings.flatMap((sailing) => {
      sailing.partyMixes = sailing.partyMixes || config.defaultPartyMix;
      return sailing.partyMixes.map((party: string) => ({
        voyageType: sailing.voyageType,
        daysAhead: sailing.daysAhead || config.defaultDaysAhead,
        voyageCode: sailing.fromPort + "-" + sailing.toPort,
        party,
        markets: sailing.marketFilter || config.defaultMarkets,
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
        pages: Array.from(
          Array(Math.ceil(sailing.daysAhead / config.searchDayRange)).keys()
        ),
      }));
    });

    // Flatten out pages and transform to date
    return flatMarket.flatMap((sailing) => {
      return sailing.pages.map((page: number) => ({
        fromDay: this.dateFromToday(page * config.searchDayRange),
        toDay: this.dateFromToday(
          Math.min(
            page * config.searchDayRange + config.searchDayRange - 1,
            sailing.daysAhead - 1
          )
        ),
        voyageType: sailing.voyageType,
        voyageCode: sailing.voyageCode,
        party: sailing.party,
        market: sailing.market,
      }));
    });
  }

  private dateFromToday(daysAhead: number) {
    let date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date.toISOString().split("T")[0];
  }
}